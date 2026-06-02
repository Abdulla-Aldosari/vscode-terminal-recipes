// Terminal Recipes — VS Code Extension
// Copyright (c) 2026 Abdulla Aldosari
// Licensed under the MIT License. See LICENSE in the project root for details.

const vscode = require("vscode");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { generateWithAI } = require("./lib/ai/factory");
const { AI_PROVIDERS } = require("./lib/ai/providers-config");
const {
  resolveAutoVariables,
  buildAutoVariablesPayload,
} = require("./lib/auto-variables");

const GLOBAL_DIR = path.join(os.homedir(), ".vscode-terminal-recipes");
const GLOBAL_COMMANDS_FILE = path.join(GLOBAL_DIR, "commands.json");
const GLOBAL_VARIABLES_FILE = path.join(GLOBAL_DIR, "variables.json");
const GLOBAL_AUTO_VARIABLES_SETTINGS_FILE = path.join(
  GLOBAL_DIR,
  "auto-variables-settings.json",
);
const GLOBAL_FAVORITES_FILE = path.join(GLOBAL_DIR, "favorites.json");

/**
 * Called by VS Code when the extension is activated.
 * Registers the 'terminalRecipes.openPanel' command and creates the webview panel
 * along with all message handlers for communication between the extension and the UI.
 * @param {import('vscode').ExtensionContext} context
 */
function activate(context) {
  let panel = null;
  const aiOutputChannel = vscode.window.createOutputChannel(
    "Terminal Recipes AI",
    "json",
  );
  context.subscriptions.push(aiOutputChannel);

  const openPanelCommand = vscode.commands.registerCommand(
    "terminalRecipes.openPanel",
    async function () {
      if (panel) {
        panel.reveal(vscode.ViewColumn.One);
        await postState(panel);
        return;
      }

      panel = vscode.window.createWebviewPanel(
        "terminalRecipesPanel",
        "Terminal Recipes",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        },
      );

      panel.iconPath = vscode.Uri.joinPath(
        context.extensionUri,
        "media",
        "icon.png",
      );

      panel.webview.html = getWebviewHtml(panel.webview, context.extensionUri);

      panel.webview.onDidReceiveMessage(
        async function (message) {
          if (!message || typeof message.type !== "string") {
            return;
          }

          if (message.type === "ready" || message.type === "requestState") {
            await postState(panel);
            return;
          }

          if (message.type === "saveData") {
            await handleSaveData(panel, message.payload);
            return;
          }

          if (message.type === "saveCommandVariables") {
            await handleSaveCommandVariables(panel, message.payload);
            return;
          }

          if (message.type === "performAction") {
            await handlePerformAction(panel, message.payload);
            return;
          }

          if (message.type === "openCommandsFile") {
            await openGlobalCommandsFile();
            return;
          }

          if (message.type === "openGlobalVariablesFile") {
            await openGlobalVariablesFile();
            return;
          }

          if (message.type === "openLocalVariablesFile") {
            await openLocalVariablesFile();
            return;
          }

          if (message.type === "openExternalUrl") {
            await handleOpenExternalUrl(message.payload);
            return;
          }

          if (message.type === "aiGetSettings") {
            await handleAiGetSettings(panel, context);
            return;
          }

          if (message.type === "aiSaveSettings") {
            await handleAiSaveSettings(panel, context, message.payload);
            return;
          }

          if (message.type === "aiGenerate") {
            await handleAiGenerate(
              panel,
              context,
              message.payload,
              aiOutputChannel,
            );
            return;
          }

          if (message.type === "aiInsert") {
            await handleAiInsert(panel, message.payload);
            return;
          }

          if (message.type === "saveAutoVariablesSettings") {
            await handleSaveAutoVariablesSettings(panel, message.payload);
            return;
          }

          if (message.type === "saveFavorites") {
            await handleSaveFavorites(panel, message.payload);
            return;
          }
        },
        null,
        context.subscriptions,
      );

      panel.onDidDispose(function () {
        panel = null;
      });

      await postState(panel);
    },
  );

  context.subscriptions.push(openPanelCommand);

  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100,
  );
  statusBarItem.text = "$(terminal) Recipes";
  statusBarItem.tooltip = "Open Terminal Recipes";
  statusBarItem.command = "terminalRecipes.openPanel";
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);
}

/**
 * Called by VS Code when the extension is deactivated.
 * No cleanup is required since VS Code handles subscription disposal automatically.
 */
function deactivate() {}

/**
 * Collects all application state (commands, variables, terminal profiles, favorites, etc.)
 * and sends it to the webview as a 'state' message.
 * @param {import('vscode').WebviewPanel} panel
 */
async function postState(panel) {
  const data = await readGlobalCommandsData();
  const workspaceFolder = getFirstWorkspaceFolderPath();
  const commandVariables = await readWorkspaceVariables();
  const globalCommandVariables = await readGlobalVariables();
  const terminalProfiles = getTerminalProfiles();
  const autoVariablesSettings = await readAutoVariablesSettings();
  const autoVariables = buildAutoVariablesPayload(
    { workspaceFolder },
    autoVariablesSettings,
  );
  const globalFavorites = await readGlobalFavorites();
  const localFavorites = await readWorkspaceFavorites();

  await panel.webview.postMessage({
    type: "state",
    payload: {
      data,
      globalCommandsFile: GLOBAL_COMMANDS_FILE,
      workspaceFolder,
      commandVariables,
      globalCommandVariables,
      terminalProfiles,
      autoVariables,
      autoVariablesSettings,
      globalFavorites,
      localFavorites,
    },
  });
}

/**
 * Handles the 'saveData' message from the webview.
 * Normalizes and persists the commands data to the global JSON file,
 * then sends back a success/failure result and refreshes the state.
 * @param {import('vscode').WebviewPanel} panel
 * @param {object} payload - Raw commands data received from the webview
 */
async function handleSaveData(panel, payload) {
  try {
    const normalizedData = normalizeCommandsData(payload);
    await writeGlobalCommandsData(normalizedData);
    await panel.webview.postMessage({
      type: "saveResult",
      payload: { success: true },
    });
    await postState(panel);
  } catch (error) {
    await panel.webview.postMessage({
      type: "saveResult",
      payload: {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}

/**
 * Handles the 'saveCommandVariables' message from the webview.
 * Saves local (workspace) and/or global command variables to their respective files.
 * @param {import('vscode').WebviewPanel} panel
 * @param {{ local?: object, global?: object } | object} payload - Variables payload
 */
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
      type: "saveVariablesResult",
      payload: {
        success: true,
        commandVariables: normalizedLocal,
        globalCommandVariables,
      },
    });
  } catch (error) {
    await panel.webview.postMessage({
      type: "saveVariablesResult",
      payload: {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}

/**
 * Handles the 'performAction' message from the webview.
 * Supports three actions: 'copy' (copies to clipboard), 'run' (sends to terminal with newline),
 * and 'use' (sends to terminal without newline). Also updates lastRunAt and runCount.
 * @param {import('vscode').WebviewPanel} panel
 * @param {{ action: string, commandId?: string, resolvedCommand: string, commandVariables: object, shellPath?: string, shellName?: string }} payload
 */
async function handlePerformAction(panel, payload) {
  try {
    const action =
      payload && typeof payload.action === "string" ? payload.action : "";
    const commandId =
      payload && typeof payload.commandId === "string"
        ? payload.commandId
        : null;
    const resolvedCommand =
      payload && typeof payload.resolvedCommand === "string"
        ? payload.resolvedCommand
        : "";
    const commandVariables =
      payload && typeof payload.commandVariables === "object"
        ? payload.commandVariables
        : {};
    const shellPath =
      payload && typeof payload.shellPath === "string"
        ? payload.shellPath
        : null;
    const shellName =
      payload && typeof payload.shellName === "string"
        ? payload.shellName
        : null;

    if (!action || !resolvedCommand) {
      throw new Error("Action and resolved command are required.");
    }

    // Support new {local, global} format as well as legacy format
    let localVars, globalVars;
    if (commandVariables.local || commandVariables.global) {
      localVars = normalizeCommandVariables(commandVariables.local || {});
      globalVars = normalizeCommandVariables(commandVariables.global || {});
    } else {
      localVars = normalizeCommandVariables(commandVariables);
      globalVars = { version: 2, commands: {} };
    }

    await writeWorkspaceVariables(localVars);
    await writeGlobalVariables(globalVars);

    if (action === "copy") {
      await vscode.env.clipboard.writeText(resolvedCommand);
    }

    if (action === "run" || action === "use") {
      // Apply auto variables to the command
      const autoVarsSettings = await readAutoVariablesSettings();
      const workspaceFolder = getFirstWorkspaceFolderPath();
      const finalCommand = resolveAutoVariables(
        resolvedCommand,
        { workspaceFolder },
        autoVarsSettings,
      );
      const terminal = getOrCreateTerminal(
        shellPath || undefined,
        shellName || undefined,
      );
      terminal.show(false);
      terminal.sendText(finalCommand, action === "run");
    }

    // Update lastRunAt and runCount for run/use actions
    if ((action === "run" || action === "use") && commandId) {
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
      type: "actionResult",
      payload: {
        success: true,
        action,
        commandVariables: localVars,
        globalCommandVariables,
      },
    });

    // Send fresh state so Recent Commands tab reflects updated lastRunAt/runCount
    if (action === "run" || action === "use") {
      await postState(panel);
    }
  } catch (error) {
    await panel.webview.postMessage({
      type: "actionResult",
      payload: {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}

/**
 * Normalizes a command variables object to the standard v2 format.
 * Strips any non-string keys or values and returns a clean { version, commands } object.
 * @param {*} input
 * @returns {{ version: number, commands: object }}
 */
function normalizeCommandVariables(input) {
  const output = {
    version: 2,
    commands: {},
  };

  if (!input || typeof input !== "object") {
    return output;
  }

  const rawCommands =
    input.commands && typeof input.commands === "object" ? input.commands : {};

  for (const [commandId, variables] of Object.entries(rawCommands)) {
    if (
      typeof commandId !== "string" ||
      !variables ||
      typeof variables !== "object"
    ) {
      continue;
    }

    const normalizedVariables = {};

    for (const [key, value] of Object.entries(variables)) {
      if (typeof key === "string" && typeof value === "string") {
        normalizedVariables[key] = value;
      }
    }

    if (Object.keys(normalizedVariables).length > 0) {
      output.commands[commandId] = normalizedVariables;
    }
  }

  return output;
}

/**
 * Fixes a shell executable path on Windows by replacing the 32-bit Sysnative alias
 * with the actual 64-bit System32 path to avoid process resolution issues.
 * @param {string} rawPath
 * @returns {string}
 */
function fixShellPath(rawPath) {
  if (typeof rawPath !== "string") {
    return rawPath;
  }
  // Replace Sysnative (32-bit alias) with System32 (actual 64-bit path)
  return rawPath.replace(/\\Sysnative\\/i, "\\System32\\");
}

/**
 * Resolves the shell executable path for a named VS Code terminal profile source
 * (e.g. 'PowerShell', 'Git Bash', 'WSL') on Windows.
 * Returns null if the source is unrecognized or the platform is not Windows.
 * @param {string} source - The profile source name from VS Code settings
 * @returns {string|null}
 */
function resolveSourceProfilePath(source) {
  const platform = process.platform;

  if (platform === "win32") {
    const fsSync = require("fs");

    if (source === "PowerShell") {
      const pwsh7 = "C:\\Program Files\\PowerShell\\7\\pwsh.exe";
      try {
        fsSync.accessSync(pwsh7);
        return pwsh7;
      } catch {}
      return "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";
    }

    if (source === "Command Prompt") {
      return "C:\\Windows\\System32\\cmd.exe";
    }

    if (source === "Git Bash") {
      const fsSync2 = require("fs");
      const candidates = [
        "C:\\Program Files\\Git\\bin\\bash.exe",
        "C:\\Program Files (x86)\\Git\\bin\\bash.exe",
      ];
      for (const p of candidates) {
        try {
          fsSync2.accessSync(p);
          return p;
        } catch {}
      }
      return null;
    }

    if (source === "WSL" || source === "WSL Bash") {
      return "C:\\Windows\\System32\\wsl.exe";
    }
  }

  return null;
}

/**
 * Reads the terminal profiles configured in VS Code settings for the current platform.
 * Returns a list of profiles with their resolved shell paths, and the default profile name.
 * @returns {{ defaultProfile: string, profiles: Array<{name: string, shellPath: string}> }}
 */
function getTerminalProfiles() {
  const platform = process.platform;
  const profileKey =
    platform === "win32" ? "windows" : platform === "darwin" ? "osx" : "linux";

  const defaultProfileName =
    vscode.workspace
      .getConfiguration("terminal.integrated.defaultProfile")
      .get(profileKey) || "";

  const rawProfiles =
    vscode.workspace
      .getConfiguration("terminal.integrated.profiles")
      .get(profileKey) || {};

  const profiles = [];

  for (const [name, config] of Object.entries(rawProfiles)) {
    if (!config || typeof config !== "object") {
      continue;
    }

    let shellPath = null;

    // Prefer explicit path
    if (config.path) {
      const rawPath = Array.isArray(config.path) ? config.path[0] : config.path;
      if (typeof rawPath === "string" && rawPath) {
        shellPath = fixShellPath(rawPath);
      }
    }

    // Fall back to resolving from source
    if (!shellPath && config.source) {
      shellPath = resolveSourceProfilePath(config.source);
    }

    if (!shellPath) {
      continue;
    }

    profiles.push({ name, shellPath });
  }

  return {
    defaultProfile: defaultProfileName,
    profiles,
  };
}

/**
 * Returns an existing active terminal or creates a new one with the given shell.
 * If no shellPath is provided, falls back to the user's default terminal profile.
 * @param {string|undefined} shellPath - Path to the shell executable
 * @param {string|undefined} shellName - Display name for the terminal tab
 * @returns {import('vscode').Terminal}
 */
function getOrCreateTerminal(shellPath, shellName) {
  if (!shellPath && vscode.window.activeTerminal) {
    return vscode.window.activeTerminal;
  }

  const terminalName = shellName
    ? `Terminal Recipes (${shellName})`
    : "Terminal Recipes";

  if (shellPath) {
    return vscode.window.createTerminal({
      name: terminalName,
      shellPath,
    });
  }

  // No shellPath provided — resolve user's default profile
  const { defaultProfile: defaultProfileName, profiles } =
    getTerminalProfiles();
  const defaultEntry = profiles.find(function (p) {
    return p.name === defaultProfileName;
  });
  const resolvedShellPath = defaultEntry ? defaultEntry.shellPath : undefined;
  const resolvedName = defaultEntry
    ? `Terminal Recipes (${defaultEntry.name})`
    : "Terminal Recipes";

  return vscode.window.createTerminal({
    name: resolvedName,
    ...(resolvedShellPath ? { shellPath: resolvedShellPath } : {}),
  });
}

/**
 * Opens the global commands JSON file in the VS Code editor.
 * Creates the file first if it does not exist.
 */
async function openGlobalCommandsFile() {
  await ensureGlobalCommandsFile();
  const document =
    await vscode.workspace.openTextDocument(GLOBAL_COMMANDS_FILE);
  await vscode.window.showTextDocument(document, { preview: false });
}

/**
 * Opens the global variables JSON file in the VS Code editor.
 * If the file does not exist, prompts the user to create it first.
 */
async function openGlobalVariablesFile() {
  await fs.mkdir(GLOBAL_DIR, { recursive: true });

  const exists = await fileExists(GLOBAL_VARIABLES_FILE);

  if (!exists) {
    const choice = await vscode.window.showInformationMessage(
      "No global variables file found.",
      {
        detail:
          "This file is created when you save global variables for any command.",
        modal: false,
      },
      "Create File",
    );

    if (choice !== "Create File") {
      return;
    }

    await fs.writeFile(
      GLOBAL_VARIABLES_FILE,
      JSON.stringify({ version: 2, commands: {} }, null, 2),
      "utf8",
    );
  }

  const document = await vscode.workspace.openTextDocument(
    GLOBAL_VARIABLES_FILE,
  );
  await vscode.window.showTextDocument(document, { preview: false });
}

/**
 * Opens the workspace-local variables JSON file in the VS Code editor.
 * If no workspace is open, shows a warning. If the file doesn't exist,
 * prompts the user to create it.
 */
async function openLocalVariablesFile() {
  const workspaceVariablesPath = getWorkspaceVariablesFilePath();

  if (!workspaceVariablesPath) {
    vscode.window.showWarningMessage("No workspace folder is open.");
    return;
  }

  const exists = await fileExists(workspaceVariablesPath);

  if (!exists) {
    const choice = await vscode.window.showInformationMessage(
      "No local variables file found for this workspace.",
      {
        detail:
          "This file is created when you save local variables for a command in the current workspace.",
        modal: false,
      },
      "Create File",
    );

    if (choice !== "Create File") {
      return;
    }

    await fs.mkdir(path.dirname(workspaceVariablesPath), { recursive: true });
    await fs.writeFile(
      workspaceVariablesPath,
      JSON.stringify({ version: 2, commands: {} }, null, 2),
      "utf8",
    );
  }

  const document = await vscode.workspace.openTextDocument(
    workspaceVariablesPath,
  );
  await vscode.window.showTextDocument(document, { preview: false });
}

/**
 * Checks whether a file exists at the given path.
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns the file system path of the first open workspace folder,
 * or null if no workspace is currently open.
 * @returns {string|null}
 */
function getFirstWorkspaceFolderPath() {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders || workspaceFolders.length === 0) {
    return null;
  }

  return workspaceFolders[0].uri.fsPath;
}

/**
 * Ensures the global commands JSON file exists.
 * Creates the parent directory and a default file if they do not exist.
 */
async function ensureGlobalCommandsFile() {
  await fs.mkdir(GLOBAL_DIR, { recursive: true });

  try {
    await fs.access(GLOBAL_COMMANDS_FILE);
  } catch {
    await fs.writeFile(
      GLOBAL_COMMANDS_FILE,
      JSON.stringify(getDefaultCommandsData(), null, 2),
      "utf8",
    );
  }
}

/**
 * Reads and parses the global commands data from disk.
 * Falls back to the default data structure if the file is missing or malformed.
 * @returns {Promise<object>}
 */
async function readGlobalCommandsData() {
  await ensureGlobalCommandsFile();

  const raw = await fs.readFile(GLOBAL_COMMANDS_FILE, "utf8");

  try {
    const parsed = JSON.parse(raw);
    return normalizeCommandsData(parsed);
  } catch {
    const fallback = getDefaultCommandsData();
    await writeGlobalCommandsData(fallback);
    return fallback;
  }
}

/**
 * Serializes and writes the commands data object to the global commands JSON file.
 * @param {object} data - The normalized commands data to persist
 */
async function writeGlobalCommandsData(data) {
  await fs.mkdir(GLOBAL_DIR, { recursive: true });
  await fs.writeFile(
    GLOBAL_COMMANDS_FILE,
    JSON.stringify(data, null, 2),
    "utf8",
  );
}

/**
 * Returns the default commands data structure used when no file exists yet.
 * Starts with an empty slate so users can build their own categories and commands.
 * @returns {{ version: number, categories: object[], commands: object[] }}
 */
function getDefaultCommandsData() {
  return {
    version: 1,
    categories: [],
    commands: [],
  };
}

/**
 * Validates and normalizes the raw commands data object from the JSON file.
 * Filters out invalid categories and commands, deduplicates IDs,
 * and resolves groupId from both the new and legacy formats.
 * @param {*} input
 * @returns {{ version: number, categories: object[], commands: object[] }}
 */
function normalizeCommandsData(input) {
  const source = input && typeof input === "object" ? input : {};
  const rawCategories = Array.isArray(source.categories)
    ? source.categories
    : [];
  const rawCommands = Array.isArray(source.commands) ? source.commands : [];

  const categories = [];
  const categoryIds = new Set();

  for (const rawCategory of rawCategories) {
    if (!rawCategory || typeof rawCategory !== "object") {
      continue;
    }

    const id = sanitizeId(rawCategory.id);
    const title = sanitizeTitle(rawCategory.title);

    if (!id || !title || categoryIds.has(id)) {
      continue;
    }

    const groups = normalizeGroups(rawCategory.groups);

    categories.push({ id, title, groups });
    categoryIds.add(id);
  }

  const commands = [];
  const commandIds = new Set();

  for (const rawCommand of rawCommands) {
    if (!rawCommand || typeof rawCommand !== "object") {
      continue;
    }

    const id = sanitizeId(rawCommand.id);
    const title = sanitizeTitle(rawCommand.title);
    const description =
      typeof rawCommand.description === "string"
        ? rawCommand.description.trim()
        : "";
    const command =
      typeof rawCommand.command === "string" ? rawCommand.command.trim() : "";
    const categoryId = sanitizeId(rawCommand.categoryId);

    if (
      !id ||
      !title ||
      !command ||
      !categoryId ||
      commandIds.has(id) ||
      !categoryIds.has(categoryId)
    ) {
      continue;
    }

    const category = categories.find(function (item) {
      return item.id === categoryId;
    });

    const allowedGroups = new Set(
      (category && category.groups ? category.groups : []).map(
        function (group) {
          return group.id;
        },
      ),
    );

    // Support groupId (new) and groupIds[] (legacy migration — take first valid)
    let groupId = "";
    if (typeof rawCommand.groupId === "string") {
      const s = sanitizeId(rawCommand.groupId);
      groupId = allowedGroups.has(s) ? s : "";
    } else if (
      Array.isArray(rawCommand.groupIds) &&
      rawCommand.groupIds.length > 0
    ) {
      const s = sanitizeId(rawCommand.groupIds[0]);
      groupId = allowedGroups.has(s) ? s : "";
    }

    const lastRunAt =
      typeof rawCommand.lastRunAt === "string" ? rawCommand.lastRunAt : null;
    const runCount =
      typeof rawCommand.runCount === "number" && rawCommand.runCount > 0
        ? rawCommand.runCount
        : 0;
    const helpUrl =
      typeof rawCommand.helpUrl === "string" ? rawCommand.helpUrl.trim() : "";
    const variableMeta = normalizeVariableMeta(rawCommand.variableMeta);

    commands.push({
      id,
      title,
      description,
      command,
      categoryId,
      groupId,
      ...(lastRunAt ? { lastRunAt } : {}),
      ...(runCount ? { runCount } : {}),
      ...(helpUrl ? { helpUrl } : {}),
      ...(Object.keys(variableMeta).length > 0 ? { variableMeta } : {}),
    });

    commandIds.add(id);
  }

  return {
    version: 1,
    categories,
    commands,
  };
}

/**
 * Normalizes and validates variableMeta for a command.
 * Returns a clean object with only valid enum entries.
 * @param {*} input
 * @returns {object}
 */
function normalizeVariableMeta(input) {
  const output = {};

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return output;
  }

  for (const [varName, meta] of Object.entries(input)) {
    if (typeof varName !== "string" || !meta || typeof meta !== "object") {
      continue;
    }

    if (meta.type !== "enum") {
      continue;
    }

    if (!Array.isArray(meta.enumValues) || meta.enumValues.length === 0) {
      continue;
    }

    const validEnumValues = meta.enumValues
      .filter(function (item) {
        return (
          item &&
          typeof item === "object" &&
          typeof item.title === "string" &&
          item.title.trim() &&
          typeof item.value === "string" &&
          item.value.trim() &&
          typeof item.description === "string"
        );
      })
      .map(function (item) {
        return {
          title: item.title.trim(),
          value: item.value.trim(),
          description: item.description.trim(),
        };
      });

    if (validEnumValues.length > 0) {
      output[varName] = {
        type: "enum",
        enumValues: validEnumValues,
      };
    }
  }

  return output;
}

/**
 * Opens an external URL using VS Code's built-in browser.
 * @param {{ url: string }} payload
 */
async function handleOpenExternalUrl(payload) {
  try {
    const url =
      payload && typeof payload.url === "string" ? payload.url.trim() : "";
    if (!url) {
      return;
    }
    await vscode.env.openExternal(vscode.Uri.parse(url));
  } catch {
    // Silently ignore — URL open failures are not critical
  }
}

/**
 * Normalizes a groups array for a category.
 * Accepts both string items and {id, title} objects, deduplicates by ID,
 * and removes the reserved 'all' group.
 * @param {*} input
 * @returns {Array<{id: string, title: string}>}
 */
function normalizeGroups(input) {
  const groups = [];
  const seen = new Set();
  const source = Array.isArray(input) ? input : [];

  for (const item of source) {
    let id = "";
    let title = "";

    if (typeof item === "string") {
      id = sanitizeId(item);
      title = sanitizeTitle(item);
    }

    if (item && typeof item === "object") {
      id = sanitizeId(item.id);
      title = sanitizeTitle(item.title);
    }

    if (!id || !title || seen.has(id) || id === "all") {
      continue;
    }

    groups.push({ id, title });
    seen.add(id);
  }

  return groups;
}

/**
 * Sanitizes a string value to be used as an ID: trims whitespace and lowercases it.
 * Returns an empty string if the value is not a string.
 * @param {*} value
 * @returns {string}
 */
function sanitizeId(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
}

/**
 * Sanitizes a string value to be used as a display title: trims surrounding whitespace.
 * Returns an empty string if the value is not a string.
 * @param {*} value
 * @returns {string}
 */
function sanitizeTitle(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

/**
 * Returns the absolute path to the workspace-local variables file
 * located at `.vscode/terminal-recipes.variables.json` inside the workspace folder.
 * Returns null if no workspace is open.
 * @returns {string|null}
 */
function getWorkspaceVariablesFilePath() {
  const workspaceFolder = getFirstWorkspaceFolderPath();

  if (!workspaceFolder) {
    return null;
  }

  return path.join(
    workspaceFolder,
    ".vscode",
    "terminal-recipes.variables.json",
  );
}

/**
 * Reads and parses the workspace-local command variables from disk.
 * Returns an empty structure if the file doesn't exist or cannot be parsed.
 * @returns {Promise<{ version: number, commands: object }>}
 */
async function readWorkspaceVariables() {
  const workspaceVariablesPath = getWorkspaceVariablesFilePath();

  if (!workspaceVariablesPath) {
    return {
      version: 2,
      commands: {},
    };
  }

  try {
    const raw = await fs.readFile(workspaceVariablesPath, "utf8");
    const parsed = JSON.parse(raw);
    return normalizeCommandVariables(parsed);
  } catch {
    return {
      version: 2,
      commands: {},
    };
  }
}

/**
 * Reads and parses the global command variables from disk.
 * Returns an empty structure if the file doesn't exist or cannot be parsed.
 * @returns {Promise<{ version: number, commands: object }>}
 */
async function readGlobalVariables() {
  try {
    const raw = await fs.readFile(GLOBAL_VARIABLES_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return normalizeCommandVariables(parsed);
  } catch {
    return {
      version: 2,
      commands: {},
    };
  }
}

/**
 * Normalizes and writes the global command variables to the global variables file.
 * @param {object} input - Raw variables data to persist
 */
async function writeGlobalVariables(input) {
  await fs.mkdir(GLOBAL_DIR, { recursive: true });
  const normalized = normalizeCommandVariables(input);
  await fs.writeFile(
    GLOBAL_VARIABLES_FILE,
    JSON.stringify(normalized, null, 2),
    "utf8",
  );
}

/**
 * Reads Auto Variables settings from the file.
 * @returns {Promise<object>} - { varName: { enabled: boolean, config: object } }
 */
async function readAutoVariablesSettings() {
  try {
    const raw = await fs.readFile(GLOBAL_AUTO_VARIABLES_SETTINGS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
    return {};
  } catch {
    return {};
  }
}

/**
 * Writes Auto Variables settings to the file.
 * @param {object} settings - { varName: { enabled: boolean, config: object } }
 */
async function writeAutoVariablesSettings(settings) {
  await fs.mkdir(GLOBAL_DIR, { recursive: true });
  await fs.writeFile(
    GLOBAL_AUTO_VARIABLES_SETTINGS_FILE,
    JSON.stringify(settings, null, 2),
    "utf8",
  );
}

/**
 * Normalizes and writes the workspace-local command variables to the local variables file.
 * Does nothing if no workspace folder is currently open.
 * @param {object} input - Raw variables data to persist
 */
async function writeWorkspaceVariables(input) {
  const workspaceVariablesPath = getWorkspaceVariablesFilePath();

  if (!workspaceVariablesPath) {
    return;
  }

  const normalized = normalizeCommandVariables(input);

  await fs.mkdir(path.dirname(workspaceVariablesPath), { recursive: true });
  await fs.writeFile(
    workspaceVariablesPath,
    JSON.stringify(normalized, null, 2),
    "utf8",
  );
}

/**
 * Generates the full HTML content for the extension's webview panel.
 * Injects a CSP nonce for script security and links the compiled JS and CSS assets.
 * @param {import('vscode').Webview} webview
 * @param {import('vscode').Uri} extensionUri
 * @returns {string} The HTML string to set on webview.html
 */
function getWebviewHtml(webview, extensionUri) {
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "main.js"),
  );
  const styleUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "styles.css"),
  );
  const nonce = crypto.randomBytes(16).toString("base64");

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

// ─── AI Handlers ─────────────────────────────────────────────────────────────

/**
 * Returns current AI provider name, key status, and provider setup info.
 * Sends aiProviderSetup (from providers-config.js) to the webview so the UI
 * can render provider links and help steps dynamically without hardcoding.
 */
async function handleAiGetSettings(panel, context) {
  const providerName =
    vscode.workspace.getConfiguration("terminalRecipes").get("aiProvider") ||
    "gemini";

  const keyStatus = {};
  for (const p of Object.keys(AI_PROVIDERS)) {
    const key = await context.secrets.get(`${p}_key`);
    keyStatus[p] = Boolean(key && key.trim());
  }

  // Build a lean aiProviderSetup object to send to the webview
  // (only the fields needed by the UI — no internal Node.js references)
  const aiProviderSetup = {};
  for (const [key, cfg] of Object.entries(AI_PROVIDERS)) {
    aiProviderSetup[key] = {
      name: cfg.name,
      serviceName: cfg.serviceName,
      providerName: cfg.providerName,
      modelLabel: cfg.modelLabel,
      displayLabel: cfg.displayLabel,
      apiKeyUrl: cfg.apiKeyUrl,
      apiKeyUrlLabel: cfg.apiKeyUrlLabel,
      steps: cfg.steps,
    };
  }

  await panel.webview.postMessage({
    type: "aiSettingsResult",
    payload: { providerName, keyStatus, aiProviderSetup },
  });
}

/**
 * Saves AI provider selection and API key to VS Code secrets.
 * @param {{ providerName: string, apiKey: string }} payload
 */
async function handleAiSaveSettings(panel, context, payload) {
  try {
    const providerName =
      payload && typeof payload.providerName === "string"
        ? payload.providerName
        : "";
    const apiKey =
      payload && typeof payload.apiKey === "string"
        ? payload.apiKey.trim()
        : "";

    if (!providerName) {
      throw new Error("Provider name is required.");
    }

    await vscode.workspace
      .getConfiguration("terminalRecipes")
      .update("aiProvider", providerName, vscode.ConfigurationTarget.Global);

    if (apiKey) {
      await context.secrets.store(`${providerName}_key`, apiKey);
    }

    await panel.webview.postMessage({
      type: "aiSaveSettingsResult",
      payload: { success: true },
    });
  } catch (error) {
    await panel.webview.postMessage({
      type: "aiSaveSettingsResult",
      payload: {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}

/**
 * Runs AI generation and returns results back to the webview.
 * @param {{ mode: 'full'|'single', prompt: string, categoryId?: string, groupId?: string }} payload
 * @param {import('vscode').OutputChannel} outputChannel
 */
async function handleAiGenerate(panel, context, payload, outputChannel) {
  try {
    const mode = payload && payload.mode === "single" ? "single" : "full";
    const prompt =
      payload && typeof payload.prompt === "string"
        ? payload.prompt.trim()
        : "";
    const categoryId =
      payload && typeof payload.categoryId === "string"
        ? payload.categoryId
        : "";
    const groupId =
      payload && typeof payload.groupId === "string" ? payload.groupId : "";

    if (!prompt) {
      throw new Error("Prompt is required.");
    }

    const providerName =
      vscode.workspace.getConfiguration("terminalRecipes").get("aiProvider") ||
      "gemini";

    const apiKey = await context.secrets.get(`${providerName}_key`);
    if (!apiKey || !apiKey.trim()) {
      throw new Error(
        `No API key found for provider "${providerName}". Please configure it in AI Settings.`,
      );
    }

    const customSystemInstruction =
      vscode.workspace
        .getConfiguration("terminalRecipes")
        .get("customSystemInstructions") || "";

    const debugEnabled =
      vscode.workspace
        .getConfiguration("terminalRecipes")
        .get("aiDebugOutput") === true;

    const result = await generateWithAI({
      providerName,
      apiKey: apiKey.trim(),
      prompt,
      mode,
      customSystemInstruction: customSystemInstruction.trim() || undefined,
      categoryId,
      groupId,
      logger: debugEnabled ? outputChannel : null,
    });

    await panel.webview.postMessage({
      type: "aiGenerateResult",
      payload: { success: true, mode, result },
    });
  } catch (error) {
    await panel.webview.postMessage({
      type: "aiGenerateResult",
      payload: { success: false, message: classifyAiError(error) },
    });
  }
}

/**
 * Inserts selected AI-generated commands (and optionally a new category) into the data file.
 * @param {{ mode: 'full'|'single', category?: object, commands: object[] }} payload
 */
async function handleAiInsert(panel, payload) {
  try {
    const mode = payload && payload.mode === "single" ? "single" : "full";
    const selectedCommands = Array.isArray(payload && payload.commands)
      ? payload.commands
      : [];

    if (!selectedCommands.length) {
      throw new Error("No commands selected for insertion.");
    }

    const data = await readGlobalCommandsData();

    if (mode === "full" && payload.category) {
      // Add new category (only if it doesn't exist yet)
      const existingCategory = data.categories.find(function (c) {
        return c.id === payload.category.id;
      });

      if (!existingCategory) {
        data.categories.push({
          id: payload.category.id,
          title: payload.category.title,
          groups: payload.category.groups || [],
        });
      } else {
        // Merge new groups into existing category
        const existingGroupIds = new Set(
          existingCategory.groups.map(function (g) {
            return g.id;
          }),
        );
        for (const group of payload.category.groups || []) {
          if (!existingGroupIds.has(group.id)) {
            existingCategory.groups.push(group);
          }
        }
      }
    }

    // Add selected commands (skip duplicates by ID)
    const existingCommandIds = new Set(
      data.commands.map(function (c) {
        return c.id;
      }),
    );
    for (const cmd of selectedCommands) {
      if (!existingCommandIds.has(cmd.id)) {
        data.commands.push(cmd);
        existingCommandIds.add(cmd.id);
      }
    }

    const normalizedData = normalizeCommandsData(data);
    await writeGlobalCommandsData(normalizedData);

    await panel.webview.postMessage({
      type: "aiInsertResult",
      payload: { success: true, count: selectedCommands.length },
    });

    await postState(panel);
  } catch (error) {
    await panel.webview.postMessage({
      type: "aiInsertResult",
      payload: {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}

/**
 * Saves Auto Variables settings and sends an updated state to the webview.
 * @param {{ [varName]: { enabled: boolean, config?: object } }} payload
 */
async function handleSaveAutoVariablesSettings(panel, payload) {
  try {
    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid payload.");
    }
    await writeAutoVariablesSettings(payload);
    await postState(panel);
    await panel.webview.postMessage({
      type: "saveAutoVariablesSettingsResult",
      payload: { success: true },
    });
  } catch (error) {
    await panel.webview.postMessage({
      type: "saveAutoVariablesSettingsResult",
      payload: {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}

/**
 * Extracts the actual error message from an AI provider error.
 *
 * Each SDK stores the error differently — based on their source code:
 *
 * Anthropic SDK (core/error.js):
 *   - err.error = full response body: { type, error: { type, message }, request_id }
 *   - Real message → err.error.error.message
 *
 * OpenAI SDK (core/error.js):
 *   - Extracts the inner error: const error = errorResponse?.['error']
 *   - err.error = inner error object: { message, type, code, param }
 *   - Real message → err.error.message
 *
 * Gemini SDK (GoogleGenerativeAIFetchError):
 *   - No err.error property
 *   - err.message = "[GoogleGenerativeAI Error]: <real message>"
 *   - Real message → strip the "[GoogleGenerativeAI Error]: " prefix
 *
 * @param {Error} error
 * @returns {string} The original provider error message
 */
function classifyAiError(error) {
  // Anthropic: err.error is the full response body → err.error.error.message
  const anthropicMessage =
    error &&
    error.error &&
    error.error.error &&
    typeof error.error.error.message === "string"
      ? error.error.error.message.trim()
      : "";

  if (anthropicMessage) {
    return anthropicMessage;
  }

  // OpenAI: err.error is the inner error object → err.error.message
  const openaiMessage =
    error && error.error && typeof error.error.message === "string"
      ? error.error.message.trim()
      : "";

  if (openaiMessage) {
    return openaiMessage;
  }

  // Gemini: err.message prefixed with "[GoogleGenerativeAI Error]: "
  const rawMessage = error && error.message ? error.message : "";
  const geminiMessage = rawMessage
    .replace(/^\[GoogleGenerativeAI Error\]:\s*/i, "")
    .replace(/Error fetching from https?:\/\/[^\s]+:\s*/i, "")
    .trim();

  return geminiMessage || "An unexpected error occurred. Please try again.";
}

// ─── Favorites Handlers ───────────────────────────────────────────────────────

/**
 * Reads the global favorites file.
 * @returns {Promise<string[]>} Array of command IDs
 */
async function readGlobalFavorites() {
  try {
    const raw = await fs.readFile(GLOBAL_FAVORITES_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.commandIds)) {
      return parsed.commandIds.filter(function (id) {
        return typeof id === "string";
      });
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Writes the global favorites file.
 * @param {string[]} commandIds
 */
async function writeGlobalFavorites(commandIds) {
  await fs.mkdir(GLOBAL_DIR, { recursive: true });
  await fs.writeFile(
    GLOBAL_FAVORITES_FILE,
    JSON.stringify({ version: 1, commandIds }, null, 2),
    "utf8",
  );
}

/**
 * Returns the path to the workspace favorites file.
 * @returns {string|null}
 */
function getWorkspaceFavoritesFilePath() {
  const workspaceFolder = getFirstWorkspaceFolderPath();
  if (!workspaceFolder) {
    return null;
  }
  return path.join(
    workspaceFolder,
    ".vscode",
    "terminal-recipes.favorites.json",
  );
}

/**
 * Reads the workspace-local favorites file.
 * @returns {Promise<string[]>} Array of command IDs
 */
async function readWorkspaceFavorites() {
  const filePath = getWorkspaceFavoritesFilePath();
  if (!filePath) {
    return [];
  }
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.commandIds)) {
      return parsed.commandIds.filter(function (id) {
        return typeof id === "string";
      });
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Writes the workspace-local favorites file.
 * @param {string[]} commandIds
 */
async function writeWorkspaceFavorites(commandIds) {
  const filePath = getWorkspaceFavoritesFilePath();
  if (!filePath) {
    return;
  }
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(
    filePath,
    JSON.stringify({ version: 1, commandIds }, null, 2),
    "utf8",
  );
}

/**
 * Saves favorites (global and/or local) and posts back the updated lists.
 * @param {{ global?: string[], local?: string[] }} payload
 */
async function handleSaveFavorites(panel, payload) {
  try {
    if (payload && Array.isArray(payload.global)) {
      await writeGlobalFavorites(payload.global);
    }
    if (payload && Array.isArray(payload.local)) {
      await writeWorkspaceFavorites(payload.local);
    }
    const globalFavorites = await readGlobalFavorites();
    const localFavorites = await readWorkspaceFavorites();
    await panel.webview.postMessage({
      type: "saveFavoritesResult",
      payload: { success: true, globalFavorites, localFavorites },
    });
  } catch (error) {
    await panel.webview.postMessage({
      type: "saveFavoritesResult",
      payload: {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}

module.exports = {
  activate,
  deactivate,
};
