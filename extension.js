const vscode = require('vscode');
const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const GLOBAL_DIR = path.join(os.homedir(), '.vscode-terminal-recipes');
const GLOBAL_COMMANDS_FILE = path.join(GLOBAL_DIR, 'commands.json');
const GLOBAL_VARIABLES_FILE = path.join(GLOBAL_DIR, 'variables.json');

function activate(context) {
  let panel = null;

  const openPanelCommand = vscode.commands.registerCommand('terminalRecipes.openPanel', async function () {
    if (panel) {
      panel.reveal(vscode.ViewColumn.One);
      await postState(panel);
      return;
    }

    panel = vscode.window.createWebviewPanel(
      'terminalRecipesPanel',
      'Terminal Recipes',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    panel.iconPath = vscode.Uri.joinPath(context.extensionUri, 'media', 'icon.png');

    panel.webview.html = getWebviewHtml(panel.webview, context.extensionUri);

    panel.webview.onDidReceiveMessage(
      async function (message) {
        if (!message || typeof message.type !== 'string') {
          return;
        }

        if (message.type === 'ready' || message.type === 'requestState') {
          await postState(panel);
          return;
        }

        if (message.type === 'saveData') {
          await handleSaveData(panel, message.payload);
          return;
        }

        if (message.type === 'saveCommandVariables') {
          await handleSaveCommandVariables(panel, message.payload);
          return;
        }

        if (message.type === 'performAction') {
          await handlePerformAction(panel, message.payload);
          return;
        }

        if (message.type === 'openCommandsFile') {
          await openGlobalCommandsFile();
          return;
        }

        if (message.type === 'openGlobalVariablesFile') {
          await openGlobalVariablesFile();
          return;
        }

        if (message.type === 'openLocalVariablesFile') {
          await openLocalVariablesFile();
          return;
        }
      },
      null,
      context.subscriptions
    );

    panel.onDidDispose(function () {
      panel = null;
    });

    await postState(panel);
  });

  context.subscriptions.push(openPanelCommand);
}

function deactivate() { }

async function postState(panel) {
  const data = await readGlobalCommandsData();
  const workspaceFolder = getFirstWorkspaceFolderPath();
  const commandVariables = await readWorkspaceVariables();
  const globalCommandVariables = await readGlobalVariables();

  await panel.webview.postMessage({
    type: 'state',
    payload: {
      data,
      globalCommandsFile: GLOBAL_COMMANDS_FILE,
      workspaceFolder,
      commandVariables,
      globalCommandVariables,
    },
  });
}

async function handleSaveData(panel, payload) {
  try {
    const normalizedData = normalizeCommandsData(payload);
    await writeGlobalCommandsData(normalizedData);
    await panel.webview.postMessage({
      type: 'saveResult',
      payload: {success: true},
    });
    await postState(panel);
  } catch (error) {
    await panel.webview.postMessage({
      type: 'saveResult',
      payload: {success: false, message: error instanceof Error ? error.message : 'Unknown error'},
    });
  }
}

async function handleSaveCommandVariables(panel, payload) {
  try {
    // Support new {local, global} format as well as legacy format
    const localPayload = payload && payload.local ? payload.local : payload;
    const globalPayload = payload && payload.global ? payload.global : null;

    const normalizedLocal = normalizeCommandVariables(localPayload);
    await writeWorkspaceVariables(normalizedLocal);

    if (globalPayload) {
      const normalizedGlobal = normalizeCommandVariables(globalPayload);
      await writeGlobalVariables(normalizedGlobal);
    }

    const globalCommandVariables = await readGlobalVariables();

    await panel.webview.postMessage({
      type: 'saveVariablesResult',
      payload: {
        success: true,
        commandVariables: normalizedLocal,
        globalCommandVariables,
      },
    });
  } catch (error) {
    await panel.webview.postMessage({
      type: 'saveVariablesResult',
      payload: {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
}

async function handlePerformAction(panel, payload) {
  try {
    const action = payload && typeof payload.action === 'string' ? payload.action : '';
    const commandId = payload && typeof payload.commandId === 'string' ? payload.commandId : null;
    const resolvedCommand = payload && typeof payload.resolvedCommand === 'string' ? payload.resolvedCommand : '';
    const commandVariables = payload && typeof payload.commandVariables === 'object' ? payload.commandVariables : {};

    if (!action || !resolvedCommand) {
      throw new Error('Action and resolved command are required.');
    }

    // Support new {local, global} format as well as legacy format
    let localVars, globalVars;
    if (commandVariables.local || commandVariables.global) {
      localVars = normalizeCommandVariables(commandVariables.local || {});
      globalVars = normalizeCommandVariables(commandVariables.global || {});
    } else {
      localVars = normalizeCommandVariables(commandVariables);
      globalVars = {version: 2, commands: {}};
    }

    await writeWorkspaceVariables(localVars);
    await writeGlobalVariables(globalVars);

    if (action === 'copy') {
      await vscode.env.clipboard.writeText(resolvedCommand);
    }

    if (action === 'run' || action === 'use') {
      const terminal = getOrCreateTerminal();
      terminal.show(false);
      terminal.sendText(resolvedCommand, action === 'run');
    }

    // Update lastRunAt and runCount for run/use actions
    if ((action === 'run' || action === 'use') && commandId) {
      const data = await readGlobalCommandsData();
      const cmd = (data.commands || []).find(function (c) {
        return c.id === commandId;
      });
      if (cmd) {
        cmd.lastRunAt = new Date().toISOString();
        cmd.runCount = (cmd.runCount || 0) + 1;
        await writeGlobalCommandsData(data);
      }
    }

    const globalCommandVariables = await readGlobalVariables();

    await panel.webview.postMessage({
      type: 'actionResult',
      payload: {
        success: true,
        action,
        commandVariables: localVars,
        globalCommandVariables,
      },
    });

    // Send fresh state so Recent Commands tab reflects updated lastRunAt/runCount
    if (action === 'run' || action === 'use') {
      await postState(panel);
    }
  } catch (error) {
    await panel.webview.postMessage({
      type: 'actionResult',
      payload: {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
}

function normalizeCommandVariables(input) {
  const output = {
    version: 2,
    commands: {},
  };

  if (!input || typeof input !== 'object') {
    return output;
  }

  const rawCommands = input.commands && typeof input.commands === 'object' ? input.commands : {};

  for (const [commandId, variables] of Object.entries(rawCommands)) {
    if (typeof commandId !== 'string' || !variables || typeof variables !== 'object') {
      continue;
    }

    const normalizedVariables = {};

    for (const [key, value] of Object.entries(variables)) {
      if (typeof key === 'string' && typeof value === 'string') {
        normalizedVariables[key] = value;
      }
    }

    if (Object.keys(normalizedVariables).length > 0) {
      output.commands[commandId] = normalizedVariables;
    }
  }

  return output;
}

function getOrCreateTerminal() {
  if (vscode.window.activeTerminal) {
    return vscode.window.activeTerminal;
  }

  // Resolve the user's default terminal profile shell path
  const platform = process.platform; // 'win32', 'darwin', 'linux'
  const profileKey =
    platform === 'win32' ? 'windows' :
    platform === 'darwin' ? 'osx' : 'linux';

  const defaultProfile = vscode.workspace
    .getConfiguration('terminal.integrated.defaultProfile')
    .get(profileKey);

  const profiles = vscode.workspace
    .getConfiguration('terminal.integrated.profiles')
    .get(profileKey) || {};

  let shellPath;
  if (defaultProfile && profiles[defaultProfile] && profiles[defaultProfile].path) {
    const profilePath = profiles[defaultProfile].path;
    shellPath = Array.isArray(profilePath) ? profilePath[0] : profilePath;
  }

  return vscode.window.createTerminal({
    name: 'Terminal Recipes',
    ...(shellPath ? {shellPath} : {}),
  });
}

async function openGlobalCommandsFile() {
  await ensureGlobalCommandsFile();
  const document = await vscode.workspace.openTextDocument(GLOBAL_COMMANDS_FILE);
  await vscode.window.showTextDocument(document, {preview: false});
}

async function openGlobalVariablesFile() {
  await fs.mkdir(GLOBAL_DIR, {recursive: true});

  const exists = await fileExists(GLOBAL_VARIABLES_FILE);

  if (!exists) {
    const choice = await vscode.window.showInformationMessage(
      'No global variables file found.',
      {detail: 'This file is created when you save global variables for any command.', modal: false},
      'Create File'
    );

    if (choice !== 'Create File') {
      return;
    }

    await fs.writeFile(GLOBAL_VARIABLES_FILE, JSON.stringify({version: 2, commands: {}}, null, 2), 'utf8');
  }

  const document = await vscode.workspace.openTextDocument(GLOBAL_VARIABLES_FILE);
  await vscode.window.showTextDocument(document, {preview: false});
}

async function openLocalVariablesFile() {
  const workspaceVariablesPath = getWorkspaceVariablesFilePath();

  if (!workspaceVariablesPath) {
    vscode.window.showWarningMessage('No workspace folder is open.');
    return;
  }

  const exists = await fileExists(workspaceVariablesPath);

  if (!exists) {
    const choice = await vscode.window.showInformationMessage(
      'No local variables file found for this workspace.',
      {detail: 'This file is created when you save local variables for a command in the current workspace.', modal: false},
      'Create File'
    );

    if (choice !== 'Create File') {
      return;
    }

    await fs.mkdir(path.dirname(workspaceVariablesPath), {recursive: true});
    await fs.writeFile(workspaceVariablesPath, JSON.stringify({version: 2, commands: {}}, null, 2), 'utf8');
  }

  const document = await vscode.workspace.openTextDocument(workspaceVariablesPath);
  await vscode.window.showTextDocument(document, {preview: false});
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function getFirstWorkspaceFolderPath() {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders || workspaceFolders.length === 0) {
    return null;
  }

  return workspaceFolders[0].uri.fsPath;
}

async function ensureGlobalCommandsFile() {
  await fs.mkdir(GLOBAL_DIR, {recursive: true});

  try {
    await fs.access(GLOBAL_COMMANDS_FILE);
  } catch {
    await fs.writeFile(GLOBAL_COMMANDS_FILE, JSON.stringify(getDefaultCommandsData(), null, 2), 'utf8');
  }
}

async function readGlobalCommandsData() {
  await ensureGlobalCommandsFile();

  const raw = await fs.readFile(GLOBAL_COMMANDS_FILE, 'utf8');

  try {
    const parsed = JSON.parse(raw);
    return normalizeCommandsData(parsed);
  } catch {
    const fallback = getDefaultCommandsData();
    await writeGlobalCommandsData(fallback);
    return fallback;
  }
}

async function writeGlobalCommandsData(data) {
  await fs.mkdir(GLOBAL_DIR, {recursive: true});
  await fs.writeFile(GLOBAL_COMMANDS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function getDefaultCommandsData() {
  return {
    version: 1,
    categories: [
      {
        id: 'general',
        title: 'General Commands',
        groups: [
          {id: 'setup', title: 'Setup'},
          {id: 'build', title: 'Build'},
          {id: 'test', title: 'Test'},
          {id: 'deploy', title: 'Deploy'},
        ],
      },
      {
        id: 'spark',
        title: 'Spark Commands',
        groups: [
          {id: 'setup', title: 'Setup'},
          {id: 'build', title: 'Build'},
          {id: 'test', title: 'Test'},
          {id: 'deploy', title: 'Deploy'},
          {id: 'migrate', title: 'Migrate'},
          {id: 'cache', title: 'Cache'},
          {id: 'seed', title: 'Seed'},
          {id: 'make', title: 'Make'},
        ],
      },
      {
        id: 'mysql',
        title: 'MySQL Commands',
        groups: [
          {id: 'setup', title: 'Setup'},
          {id: 'migrate', title: 'Migrate'},
          {id: 'seed', title: 'Seed'},
        ],
      },
      {
        id: 'other',
        title: 'Other Commands',
        groups: [],
      },
    ],
    commands: [],
  };
}

function normalizeCommandsData(input) {
  const source = input && typeof input === 'object' ? input : {};
  const rawCategories = Array.isArray(source.categories) ? source.categories : [];
  const rawCommands = Array.isArray(source.commands) ? source.commands : [];

  const categories = [];
  const categoryIds = new Set();

  for (const rawCategory of rawCategories) {
    if (!rawCategory || typeof rawCategory !== 'object') {
      continue;
    }

    const id = sanitizeId(rawCategory.id);
    const title = sanitizeTitle(rawCategory.title);

    if (!id || !title || categoryIds.has(id)) {
      continue;
    }

    const groups = normalizeGroups(rawCategory.groups);

    categories.push({id, title, groups});
    categoryIds.add(id);
  }

  const commands = [];
  const commandIds = new Set();

  for (const rawCommand of rawCommands) {
    if (!rawCommand || typeof rawCommand !== 'object') {
      continue;
    }

    const id = sanitizeId(rawCommand.id);
    const title = sanitizeTitle(rawCommand.title);
    const description = typeof rawCommand.description === 'string' ? rawCommand.description.trim() : '';
    const command = typeof rawCommand.command === 'string' ? rawCommand.command.trim() : '';
    const categoryId = sanitizeId(rawCommand.categoryId);

    if (!id || !title || !command || !categoryId || commandIds.has(id) || !categoryIds.has(categoryId)) {
      continue;
    }

    const category = categories.find(function (item) {
      return item.id === categoryId;
    });

    const allowedGroups = new Set((category && category.groups ? category.groups : []).map(function (group) {
      return group.id;
    }));

    const groupIds = Array.isArray(rawCommand.groupIds)
      ? rawCommand.groupIds
        .map(function (groupId) {
          return sanitizeId(groupId);
        })
        .filter(function (groupId, index, values) {
          return Boolean(groupId) && allowedGroups.has(groupId) && values.indexOf(groupId) === index;
        })
      : [];

    const lastRunAt = typeof rawCommand.lastRunAt === 'string' ? rawCommand.lastRunAt : null;
    const runCount = typeof rawCommand.runCount === 'number' && rawCommand.runCount > 0 ? rawCommand.runCount : 0;

    commands.push({
      id,
      title,
      description,
      command,
      categoryId,
      groupIds,
      ...(lastRunAt ? {lastRunAt} : {}),
      ...(runCount ? {runCount} : {}),
    });

    commandIds.add(id);
  }

  return {
    version: 1,
    categories,
    commands,
  };
}

function normalizeGroups(input) {
  const groups = [];
  const seen = new Set();
  const source = Array.isArray(input) ? input : [];

  for (const item of source) {
    let id = '';
    let title = '';

    if (typeof item === 'string') {
      id = sanitizeId(item);
      title = sanitizeTitle(item);
    }

    if (item && typeof item === 'object') {
      id = sanitizeId(item.id);
      title = sanitizeTitle(item.title);
    }

    if (!id || !title || seen.has(id) || id === 'all') {
      continue;
    }

    groups.push({id, title});
    seen.add(id);
  }

  return groups;
}

function sanitizeId(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().toLowerCase();
}

function sanitizeTitle(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function getWorkspaceVariablesFilePath() {
  const workspaceFolder = getFirstWorkspaceFolderPath();

  if (!workspaceFolder) {
    return null;
  }

  return path.join(workspaceFolder, '.vscode', 'terminal-recipes.variables.json');
}

async function readWorkspaceVariables() {
  const workspaceVariablesPath = getWorkspaceVariablesFilePath();

  if (!workspaceVariablesPath) {
    return {
      version: 2,
      commands: {},
    };
  }

  try {
    const raw = await fs.readFile(workspaceVariablesPath, 'utf8');
    const parsed = JSON.parse(raw);
    return normalizeCommandVariables(parsed);
  } catch {
    return {
      version: 2,
      commands: {},
    };
  }
}

async function readGlobalVariables() {
  try {
    const raw = await fs.readFile(GLOBAL_VARIABLES_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return normalizeCommandVariables(parsed);
  } catch {
    return {
      version: 2,
      commands: {},
    };
  }
}

async function writeGlobalVariables(input) {
  await fs.mkdir(GLOBAL_DIR, {recursive: true});
  const normalized = normalizeCommandVariables(input);
  await fs.writeFile(GLOBAL_VARIABLES_FILE, JSON.stringify(normalized, null, 2), 'utf8');
}

async function writeWorkspaceVariables(input) {
  const workspaceVariablesPath = getWorkspaceVariablesFilePath();

  if (!workspaceVariablesPath) {
    return;
  }

  const normalized = normalizeCommandVariables(input);

  await fs.mkdir(path.dirname(workspaceVariablesPath), {recursive: true});
  await fs.writeFile(workspaceVariablesPath, JSON.stringify(normalized, null, 2), 'utf8');
}

function getWebviewHtml(webview, extensionUri) {
  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'main.js'));
  const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'styles.css'));
  const nonce = crypto.randomBytes(16).toString('base64');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
  <link rel="stylesheet" href="${styleUri}">
  <title>Terminal Recipes</title>
</head>
<body>
  <div id="app"></div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}

module.exports = {
  activate,
  deactivate,
};
