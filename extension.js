// Terminal Recipes — VS Code Extension
// Copyright (c) 2026 Abdulla Aldosari
// Licensed under the MIT License. See LICENSE in the project root for details.

const vscode = require("vscode");
const crypto = require("crypto");
const {
  readGlobalCommandsData,
  readWorkspaceVariables,
  readGlobalVariables,
  readAutoVariablesSettings,
  readGlobalFavorites,
  readWorkspaceFavorites,
  getFirstWorkspaceFolderPath,
  GLOBAL_COMMANDS_FILE,
} = require("./lib/storage");
const { getTerminalProfiles } = require("./lib/terminal");
const { buildAutoVariablesPayload } = require("./lib/auto-variables");
const H = require("./lib/handlers");

/**
 * Called by VS Code when the extension is activated.
 * Registers the 'terminalRecipes.openPanel' command and creates the webview panel
 * along with all message handlers for communication between the extension and the UI.
 * @param {import('vscode').ExtensionContext} context
 */
function activate(context) {
  let panel = null;
  const aiOutputChannel = vscode.window.createOutputChannel(
    "Terminal Recipes",
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
            await H.handleSaveData(panel, message.payload, postState);
            return;
          }
          if (message.type === "saveCommandVariables") {
            await H.handleSaveCommandVariables(panel, message.payload);
            return;
          }
          if (message.type === "performAction") {
            await H.handlePerformAction(panel, message.payload, postState);
            return;
          }
          if (message.type === "openCommandsFile") {
            await H.openGlobalCommandsFile();
            return;
          }
          if (message.type === "openGlobalVariablesFile") {
            await H.openGlobalVariablesFile();
            return;
          }
          if (message.type === "openLocalVariablesFile") {
            await H.openLocalVariablesFile();
            return;
          }
          if (message.type === "openExternalUrl") {
            await H.handleOpenExternalUrl(message.payload);
            return;
          }
          if (message.type === "aiGetSettings") {
            await H.handleAiGetSettings(panel, context);
            return;
          }
          if (message.type === "aiSaveSettings") {
            await H.handleAiSaveSettings(panel, context, message.payload);
            return;
          }
          if (message.type === "aiGenerate") {
            await H.handleAiGenerate(
              panel,
              context,
              message.payload,
              aiOutputChannel,
            );
            return;
          }
          if (message.type === "aiInsert") {
            await H.handleAiInsert(panel, message.payload, postState);
            return;
          }
          if (message.type === "saveAutoVariablesSettings") {
            await H.handleSaveAutoVariablesSettings(
              panel,
              message.payload,
              postState,
            );
            return;
          }
          if (message.type === "saveFavorites") {
            await H.handleSaveFavorites(panel, message.payload);
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
 * Generates the full HTML content for the extension's webview panel.
 * Injects a CSP nonce for script security and loads all media scripts in dependency order.
 * @param {import('vscode').Webview} webview
 * @param {import('vscode').Uri} extensionUri
 * @returns {string} The HTML string to set on webview.html
 */
function getWebviewHtml(webview, extensionUri) {
  const styleUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "styles.css"),
  );

  // 1. Foundation
  const stateUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "state.js"),
  );
  const iconsUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "icons.js"),
  );
  const utilsUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "utils.js"),
  );

  // 2. Modals
  const modalsRunConfirmUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "modals", "run-confirm.js"),
  );
  const modalsEditCommandUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "modals", "edit-command.js"),
  );
  const modalsNewCommandUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "modals", "new-command.js"),
  );
  const modalsAiSettingsUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "modals", "ai-settings.js"),
  );
  const modalsAiGenerateUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "modals", "ai-generate.js"),
  );

  // 3. Tabs
  const tabsRecentUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "tabs", "recent.js"),
  );
  const tabsCommandsUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "tabs", "commands.js"),
  );
  const tabsFavoritesUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "tabs", "favorites.js"),
  );
  const tabsVariablesUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "tabs", "variables.js"),
  );
  const tabsAiUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "tabs", "ai.js"),
  );

  // 4. Render orchestrator
  const renderUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "render.js"),
  );

  // 5. Message handler
  const messagesUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "messages.js"),
  );

  // 6. Entry point
  const mainUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "main.js"),
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

  <!-- 1. Foundation: state must be first, icons and utils follow -->
  <script nonce="${nonce}" src="${stateUri}"></script>
  <script nonce="${nonce}" src="${iconsUri}"></script>
  <script nonce="${nonce}" src="${utilsUri}"></script>

  <!-- 2. Modals (must exist before tab renderers that reference renderCommandCard, etc.) -->
  <script nonce="${nonce}" src="${modalsRunConfirmUri}"></script>
  <script nonce="${nonce}" src="${modalsEditCommandUri}"></script>
  <script nonce="${nonce}" src="${modalsNewCommandUri}"></script>
  <script nonce="${nonce}" src="${modalsAiSettingsUri}"></script>
  <script nonce="${nonce}" src="${modalsAiGenerateUri}"></script>

  <!-- 3. Tabs -->
  <script nonce="${nonce}" src="${tabsRecentUri}"></script>
  <script nonce="${nonce}" src="${tabsCommandsUri}"></script>
  <script nonce="${nonce}" src="${tabsFavoritesUri}"></script>
  <script nonce="${nonce}" src="${tabsVariablesUri}"></script>
  <script nonce="${nonce}" src="${tabsAiUri}"></script>

  <!-- 4. Render orchestrator (calls tab/modal renderers — must come after them) -->
  <script nonce="${nonce}" src="${renderUri}"></script>

  <!-- 5. Message handler (calls render() — must come after render.js) -->
  <script nonce="${nonce}" src="${messagesUri}"></script>

  <!-- 6. Entry point: DOMContentLoaded + postMessage senders + tooltip IIFE -->
  <script nonce="${nonce}" src="${mainUri}"></script>
</body>
</html>`;
}

module.exports = {
  activate,
  deactivate,
};
