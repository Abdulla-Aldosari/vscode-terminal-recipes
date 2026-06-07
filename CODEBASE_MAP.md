# CODEBASE_MAP.md — Project Architecture Reference

## Project Overview

**Terminal Recipes** is a VS Code extension that provides a webview panel for managing and running terminal commands with support for variables, favorites, and AI-generated commands.

Two separate execution contexts:

| Context                      | Location                | Module System                                        |
| ---------------------------- | ----------------------- | ---------------------------------------------------- |
| **Extension Host (Node.js)** | `extension.js` + `lib/` | CommonJS (`require` / `module.exports`)              |
| **Webview (Browser)**        | `media/`                | Plain `<script>` tags — shared `window` global scope |

---

## Extension Side — File Map

### `extension.js`

**Entry point.** Panel creation, status bar item, `onDidReceiveMessage` routing dispatch table, `postState()`, `getWebviewHtml()`.  
Does **not** contain any business logic — delegates everything to `lib/`.

### `lib/normalize.js`

**Pure data normalization.** No file I/O, no VS Code API, no side effects.

| Export                             | Description                                                 |
| ---------------------------------- | ----------------------------------------------------------- |
| `sanitizeId(value)`                | Trims and lowercases a string; returns `""` for non-strings |
| `sanitizeTitle(value)`             | Trims whitespace from display title                         |
| `getDefaultCommandsData()`         | Returns `{ version:1, categories:[], commands:[] }`         |
| `normalizeCommandsData(input)`     | Validates/normalizes raw commands JSON; deduplicates IDs    |
| `normalizeCommandVariables(input)` | Normalizes variables to `{ version:2, commands:{} }`        |
| `normalizeGroups(input)`           | Normalizes groups array (string and object items)           |
| `normalizeVariableMeta(input)`     | Validates and normalizes `variableMeta` for enum variables  |

**Dependencies:** None.

---

### `lib/storage.js`

**All file I/O and path constants.** Single source of truth for data persistence.

| Export                                 | Type  | Description                                              |
| -------------------------------------- | ----- | -------------------------------------------------------- |
| `GLOBAL_DIR`                           | const | `~/.vscode-terminal-recipes/`                            |
| `GLOBAL_COMMANDS_FILE`                 | const | Path to `commands.json`                                  |
| `GLOBAL_VARIABLES_FILE`                | const | Path to `variables.json`                                 |
| `GLOBAL_AUTO_VARIABLES_SETTINGS_FILE`  | const | Path to `auto-variables-settings.json`                   |
| `GLOBAL_FAVORITES_FILE`                | const | Path to `favorites.json`                                 |
| `fileExists(filePath)`                 | fn    | Promise-based file existence check                       |
| `getWorkspaceVariablesFilePath()`      | fn    | Returns `.vscode/terminal-recipes.variables.json` path   |
| `ensureGlobalCommandsFile()`           | fn    | Creates global dir + default commands file if missing    |
| `readGlobalCommandsData()`             | fn    | Reads + parses `commands.json`; falls back to default    |
| `writeGlobalCommandsData(data)`        | fn    | Serializes commands data to global file                  |
| `readWorkspaceVariables()`             | fn    | Reads workspace-local variables file                     |
| `writeWorkspaceVariables(data)`        | fn    | Writes normalized variables to workspace file            |
| `readGlobalVariables()`                | fn    | Reads global variables file                              |
| `writeGlobalVariables(input)`          | fn    | Normalizes + writes global variables file                |
| `readAutoVariablesSettings()`          | fn    | Reads auto-variables settings; returns defaults on error |
| `writeAutoVariablesSettings(settings)` | fn    | Writes auto-variables settings to disk                   |
| `readGlobalFavorites()`                | fn    | Reads global favorites; returns `[]` on error            |
| `readWorkspaceFavorites()`             | fn    | Reads workspace favorites; returns `[]` on error         |
| `writeGlobalFavorites(data)`           | fn    | Writes global favorites array to disk                    |
| `writeWorkspaceFavorites(data)`        | fn    | Writes workspace favorites array to disk                 |

**Dependencies:** `fs/promises`, `os`, `path`, `vscode`, `lib/normalize.js`.

---

### `lib/terminal.js`

**Terminal shell resolution and lifecycle management.**

| Export                                      | Description                                            |
| ------------------------------------------- | ------------------------------------------------------ |
| `fixShellPath(rawPath)`                     | Replaces `\Sysnative\` with `\System32\` on Windows    |
| `resolveSourceProfilePath(source)`          | Resolves shell path from a VS Code profile source name |
| `getTerminalProfiles()`                     | Reads terminal profiles from VS Code settings          |
| `getOrCreateTerminal(shellPath, shellName)` | Returns active terminal or creates a new one           |

**Dependencies:** `vscode`, `fs` (sync `accessSync` only).

---

### `lib/handlers.js`

**All webview message handler functions.** Each handler receives `panel` + `payload` (+ `postState` when a re-render is needed after saving).

| Export                                                       | Message Type                | Description                                                    |
| ------------------------------------------------------------ | --------------------------- | -------------------------------------------------------------- |
| `handleSaveData(panel, payload, postState)`                  | `saveData`                  | Normalizes and saves commands; posts `saveResult`              |
| `handleSaveCommandVariables(panel, payload)`                 | `saveCommandVariables`      | Saves local/global variables; posts `saveVariablesResult`      |
| `handlePerformAction(panel, payload, postState)`             | `performAction`             | Runs copy/run/use action; updates stats; posts `actionResult`  |
| `handleOpenExternalUrl(payload)`                             | `openExternalUrl`           | Opens URL via `vscode.env.openExternal`                        |
| `openGlobalCommandsFile()`                                   | `openCommandsFile`          | Ensures + opens `commands.json` in VS Code editor              |
| `openGlobalVariablesFile()`                                  | `openGlobalVariablesFile`   | Opens global variables file (prompts to create if missing)     |
| `openLocalVariablesFile()`                                   | `openLocalVariablesFile`    | Opens workspace variables file (prompts to create if missing)  |
| `handleAiGetSettings(panel, context)`                        | `aiGetSettings`             | Reads AI secrets + provider config; posts `aiSettingsResult`   |
| `handleAiSaveSettings(panel, context, payload)`              | `aiSaveSettings`            | Saves API key to `SecretStorage`; posts `aiSaveSettingsResult` |
| `handleAiGenerate(panel, context, payload, aiOutputChannel)` | `aiGenerate`                | Runs AI generation; streams progress; posts `aiGenerateResult` |
| `handleAiInsert(panel, payload, postState)`                  | `aiInsert`                  | Merges AI-generated commands; posts `aiInsertResult`           |
| `handleSaveAutoVariablesSettings(panel, payload, postState)` | `saveAutoVariablesSettings` | Saves auto-variables settings; posts result                    |
| `handleSaveFavorites(panel, payload)`                        | `saveFavorites`             | Saves global/workspace favorites; posts `saveFavoritesResult`  |

**Dependencies:** `lib/storage.js`, `lib/normalize.js`, `lib/terminal.js`, `lib/auto-variables.js`, `lib/ai/factory.js`, `lib/ai/providers-config.js`, `vscode`.

---

### `lib/auto-variables.js`

**Auto-variable resolution** (`$date`, `$user`, `$workspaceFolder`, etc.).

| Export                                         | Description                                               |
| ---------------------------------------------- | --------------------------------------------------------- |
| `resolveAutoVariables(settings, context)`      | Resolves all auto-variable values for the current context |
| `buildAutoVariablesPayload(settings, context)` | Builds the payload sent to the webview                    |

---

## AI Subsystem — `lib/ai/`

| File                            | Purpose                                                                                                                                 |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/ai/providers-config.js`    | **SINGLE SOURCE OF TRUTH** — metadata for all AI providers (name, model, URL, setup steps). Edit this first when adding a new provider. |
| `lib/ai/factory.js`             | `createProvider(name, key)` — instantiates the correct provider class. Edit to register new providers.                                  |
| `lib/ai/schemas.js`             | JSON schema for the expected AI response structure                                                                                      |
| `lib/ai/systemInstruction.js`   | System prompt / instruction sent to the AI model                                                                                        |
| `lib/ai/debugLogger.js`         | Debug logging utility for AI requests/responses                                                                                         |
| `lib/ai/providers/gemini.js`    | Google Gemini implementation                                                                                                            |
| `lib/ai/providers/openai.js`    | OpenAI ChatGPT implementation                                                                                                           |
| `lib/ai/providers/anthropic.js` | Anthropic Claude implementation                                                                                                         |

---

## Extension Side — Dependency Graph

```
extension.js
  └── lib/handlers.js
        ├── lib/storage.js
        │     └── lib/normalize.js
        ├── lib/terminal.js
        ├── lib/auto-variables.js
        └── lib/ai/factory.js
              └── lib/ai/providers-config.js
                    └── lib/ai/providers/*.js
```

---

## Webview Side — File Map

All files share the **same `window` global scope** — loaded as ordered `<script>` tags. A function declared in an earlier file is available to all later files.

| Load Order | File                           | Purpose                                                                                       | Key Globals Declared                                                                                                                                                         |
| ---------- | ------------------------------ | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1          | `media/state.js`               | All mutable UI state + app data received from extension                                       | `vscode`, `RECIPES_EMPTY_VALUE`, `uiState`, `appData`                                                                                                                        |
| 2          | `media/icons.js`               | All inline SVG icon strings                                                                   | `icons`                                                                                                                                                                      |
| 3          | `media/utils.js`               | Pure utilities + custom select component system                                               | `escHtml`, `formatRelativeTime`, `extractVariables`, `resolveCommand`, `generateId`, `getSelectedCategoryId`, `getSelectedGroupId`, `renderCustomSelect`, `bindCustomSelect` |
| 4          | `media/modals/run-confirm.js`  | Run Confirmation modal (pick shell before running)                                            | `renderRunConfirmModal`, `bindRunConfirmModal`                                                                                                                               |
| 5          | `media/modals/edit-command.js` | Edit Command modal (all fields + variable metadata)                                           | `renderEditCommandModal`, `bindEditCommandModal`                                                                                                                             |
| 6          | `media/modals/new-command.js`  | New Command modal                                                                             | `renderNewCommandModal`, `bindNewCommandModal`                                                                                                                               |
| 7          | `media/modals/ai-settings.js`  | AI Settings modal (provider + API key)                                                        | `renderAiSettingsModal`, `bindAiSettingsModal`                                                                                                                               |
| 8          | `media/modals/ai-generate.js`  | AI Generate results modal                                                                     | `renderAiGenerateModal`, `bindAiGenerateModal`                                                                                                                               |
| 9          | `media/tabs/recent.js`         | "Recent" tab                                                                                  | `renderRecentTab`, `bindRecentTab`                                                                                                                                           |
| 10         | `media/tabs/commands.js`       | "Commands" tab (largest — filtering, cards, sort)                                             | `renderCommandsTab`, `renderCommandCard`, `renderVariableInputs`, `bindCommandsTab`, `bindCommandCard`                                                                       |
| 11         | `media/tabs/favorites.js`      | "Favorites" tab                                                                               | `renderFavoritesTab`, `bindFavoritesTab`                                                                                                                                     |
| 12         | `media/tabs/variables.js`      | "Variables" tab                                                                               | `renderVariablesTab`, `bindVariablesTab`                                                                                                                                     |
| 13         | `media/tabs/ai.js`             | "AI Generate" tab                                                                             | `renderAiTab`, `bindAiTab`                                                                                                                                                   |
| 14         | `media/render.js`              | Master `render()` orchestrator + tab bar + notice bar                                         | `render`, `renderTabBar`, `renderNotice`, `bindTabBar`, `bindNotice`                                                                                                         |
| 15         | `media/messages.js`            | `window.addEventListener("message")` handler — processes all messages from the extension host | `handleState`, `handleSaveResult`, `handleActionResult`, `handleAiGenerateResult`, ...                                                                                       |
| 16         | `media/main.js`                | Entry point: `DOMContentLoaded` init + all `postMessage` senders + tooltip IIFE               | `postReady`, `postSaveData`, `postPerformAction`, `postAiGenerate`, ...                                                                                                      |

---

## Message Flow — Webview ↔ Extension

### Webview → Extension (`vscode.postMessage`)

| Sender (in `media/main.js`)              | `message.type`              | Handler (in `lib/handlers.js`)       |
| ---------------------------------------- | --------------------------- | ------------------------------------ |
| `postReady()` / `postRequestState()`     | `ready` / `requestState`    | `postState(panel)` in `extension.js` |
| `postSaveData(data)`                     | `saveData`                  | `handleSaveData`                     |
| `postSaveCommandVariables(vars)`         | `saveCommandVariables`      | `handleSaveCommandVariables`         |
| `postPerformAction(payload)`             | `performAction`             | `handlePerformAction`                |
| `postOpenCommandsFile()`                 | `openCommandsFile`          | `openGlobalCommandsFile`             |
| `postOpenGlobalVariablesFile()`          | `openGlobalVariablesFile`   | `openGlobalVariablesFile`            |
| `postOpenLocalVariablesFile()`           | `openLocalVariablesFile`    | `openLocalVariablesFile`             |
| `postOpenExternalUrl(url)`               | `openExternalUrl`           | `handleOpenExternalUrl`              |
| `postAiGetSettings()`                    | `aiGetSettings`             | `handleAiGetSettings`                |
| `postAiSaveSettings(payload)`            | `aiSaveSettings`            | `handleAiSaveSettings`               |
| `postAiGenerate(payload)`                | `aiGenerate`                | `handleAiGenerate`                   |
| `postAiInsert(payload)`                  | `aiInsert`                  | `handleAiInsert`                     |
| `postSaveAutoVariablesSettings(payload)` | `saveAutoVariablesSettings` | `handleSaveAutoVariablesSettings`    |
| `postSaveFavorites(payload)`             | `saveFavorites`             | `handleSaveFavorites`                |

### Extension → Webview (`panel.webview.postMessage`)

| `message.type`                    | Handled by (in `media/messages.js`)     | Effect                                         |
| --------------------------------- | --------------------------------------- | ---------------------------------------------- |
| `state`                           | `handleState`                           | Updates `appData` + calls `render()`           |
| `saveResult`                      | `handleSaveResult`                      | Shows success/error notice                     |
| `saveVariablesResult`             | `handleSaveVariablesResult`             | Shows result + updates local vars in `appData` |
| `actionResult`                    | `handleActionResult`                    | Shows notice for copy/run/use                  |
| `aiSettingsResult`                | `handleAiSettingsResult`                | Populates `aiSettingsState` + re-renders       |
| `aiSaveSettingsResult`            | `handleAiSaveSettingsResult`            | Shows save confirmation                        |
| `aiGenerateResult`                | `handleAiGenerateResult`                | Updates `aiState.results` + calls `render()`   |
| `aiInsertResult`                  | `handleAiInsertResult`                  | Shows insert confirmation notice               |
| `saveFavoritesResult`             | `handleSaveFavoritesResult`             | Shows favorites save result                    |
| `saveAutoVariablesSettingsResult` | `handleSaveAutoVariablesSettingsResult` | Shows auto-vars save result                    |

---

## Custom Dropdown IDs Reference

All dropdowns use `renderCustomSelect()` + `bindCustomSelect()` from `media/utils.js`.

| Location                      | `wrapperId`                 | File                                                                        |
| ----------------------------- | --------------------------- | --------------------------------------------------------------------------- |
| Commands Tab — category       | `custom-category-select`    | `media/tabs/commands.js`                                                    |
| Commands Tab — column toggle  | `col-toggle-wrap`           | `media/tabs/commands.js`                                                    |
| Run Confirm Modal — shell     | `shell-selector-wrap`       | `media/modals/run-confirm.js`                                               |
| Edit Command Modal — category | `edit-category-select-wrap` | `media/modals/edit-command.js`                                              |
| AI Settings Modal — provider  | `ai-provider-select-wrap`   | `media/modals/ai-settings.js`                                               |
| Variable inputs — enum type   | `enum-var-wrap-{varName}`   | `media/tabs/commands.js`, `media/tabs/recent.js`, `media/tabs/favorites.js` |

---

## Styling

- **All styles** live in `media/styles.css` — single stylesheet, never inline.
- **Dynamic values only:** `el.style.setProperty("--custom-prop", value)` is allowed for runtime-computed values (e.g., textarea heights).
- VS Code CSS variables (e.g., `--vscode-button-background`) are used throughout for theme compatibility.
