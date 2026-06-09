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

`handleSaveCommandVariables` accepts `{ local, global }` payload format — saves local and global variable scopes independently to their respective files without one overwriting the other.

| Export                                                       | Message Type                | Description                                                                                                     |
| ------------------------------------------------------------ | --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `handleSaveData(panel, payload, postState)`                  | `saveData`                  | Normalizes and saves commands; posts `saveResult`                                                               |
| `handleSaveCommandVariables(panel, payload)`                 | `saveCommandVariables`      | Saves local/global variables independently; posts `saveVariablesResult`                                         |
| `handlePerformAction(panel, payload, postState)`             | `performAction`             | Runs copy/run/use action; updates stats; posts `actionResult`                                                   |
| `handleOpenExternalUrl(payload)`                             | `openExternalUrl`           | Opens URL via `vscode.env.openExternal`                                                                         |
| `openGlobalCommandsFile()`                                   | `openCommandsFile`          | Ensures + opens `commands.json` in VS Code editor                                                               |
| `openGlobalVariablesFile()`                                  | `openGlobalVariablesFile`   | Opens global variables file (prompts to create if missing)                                                      |
| `openLocalVariablesFile()`                                   | `openLocalVariablesFile`    | Opens workspace variables file (prompts to create if missing)                                                   |
| `handleAiGetSettings(panel, context)`                        | `aiGetSettings`             | Reads AI secrets + provider config; posts `aiSettingsResult`                                                    |
| `handleAiSaveSettings(panel, context, payload)`              | `aiSaveSettings`            | Saves API key to `SecretStorage`; posts `aiSaveSettingsResult`                                                  |
| `handleAiGenerate(panel, context, payload, aiOutputChannel)` | `aiGenerate`                | Reads `shellName` from payload; passes it to `generateWithAI` to inject shell context; posts `aiGenerateResult` |
| `handleAiInsert(panel, payload, postState)`                  | `aiInsert`                  | Merges AI-generated commands; posts `aiInsertResult`                                                            |
| `handleSaveAutoVariablesSettings(panel, payload, postState)` | `saveAutoVariablesSettings` | Saves auto-variables settings; posts result                                                                     |
| `handleSaveFavorites(panel, payload)`                        | `saveFavorites`             | Saves global/workspace favorites; posts `saveFavoritesResult`                                                   |

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

| File                            | Purpose                                                                                                                                                                                                                                                                     |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/ai/providers-config.js`    | **SINGLE SOURCE OF TRUTH** — metadata for all AI providers (name, model, URL, setup steps). Edit this first when adding a new provider.                                                                                                                                     |
| `lib/ai/factory.js`             | `generateWithAI(options)` — main entry point; accepts `shellName?` to inject a shell-context section into the system instruction via `buildShellContext(shellName)`. `createProvider(name, key)` — instantiates the correct provider class. Edit to register new providers. |
| `lib/ai/schemas.js`             | JSON schema for the expected AI response structure                                                                                                                                                                                                                          |
| `lib/ai/systemInstruction.js`   | System prompt / instruction sent to the AI model                                                                                                                                                                                                                            |
| `lib/ai/debugLogger.js`         | Debug logging utility for AI requests/responses                                                                                                                                                                                                                             |
| `lib/ai/providers/gemini.js`    | Google Gemini implementation                                                                                                                                                                                                                                                |
| `lib/ai/providers/openai.js`    | OpenAI ChatGPT implementation                                                                                                                                                                                                                                               |
| `lib/ai/providers/anthropic.js` | Anthropic Claude implementation                                                                                                                                                                                                                                             |

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

| Load Order | File                           | Purpose                                                                                       | Key Globals Declared                                                                                                                                                                                                                                                                                                    |
| ---------- | ------------------------------ | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1          | `media/state.js`               | All mutable UI state + app data received from extension                                       | `vscode`, `RECIPES_EMPTY_VALUE`, `uiState`, `state`, `variableInputState`, `runConfirmState`                                                                                                                                                                                                                            |
| 2          | `media/icons.js`               | All inline SVG icon strings                                                                   | `icons`                                                                                                                                                                                                                                                                                                                 |
| 3          | `media/utils.js`               | Pure utilities + custom select component system + scope draft helpers + actions cell renderer + row selection | `escapeHtml`, `escapeAttr`, `collectVariables`, `resolveCommandTemplate`, `getCommandLocalDraft`, `getCommandGlobalDraft`, `getCommandSessionDraft`, `getCommandDraft`, `getCommandRemember`, `buildCommandVariablesPayload`, `updateScopeIndicatorDots`, `renderActionsCell`, `renderCustomSelect`, `bindCustomSelect`, `selectCommandRow` |
| 4          | `media/modals/run-confirm.js`  | Run Confirmation modal + Variable Input modal + Delete Confirm modal                          | `renderToggleSwitch3`, `renderRunConfirmModal`, `renderVariableInputModal`, `renderDeleteConfirmModal`                                                                                                                                                                                                                  |
| 5          | `media/modals/edit-command.js` | Edit Command form (rendered as full tab when editing)                                         | `renderEditTab`, `bindEditTabEvents`, `syncEditCommandDraftFromDom`, `syncEditCommandDraftFromCommand`                                                                                                                                                                                                                  |
| 6          | `media/modals/new-command.js`  | Add Command form (rendered as "add" tab)                                                      | `renderAddCommandTab`, `bindAddCommandTabEvents`                                                                                                                                                                                                                                                                        |
| 7          | `media/modals/ai-settings.js`  | AI Settings modal (provider + API key)                                                        | `renderAiSettingsModal`, `bindAiSettingsModal`                                                                                                                                                                                                                                                                          |
| 8          | `media/modals/ai-generate.js`  | AI Generate results modal                                                                     | `renderAiGenerateModal`, `bindAiGenerateModal`                                                                                                                                                                                                                                                                          |
| 9          | `media/tabs/recent.js`         | "Recent" tab                                                                                  | `renderRecentCommandsTab`, `bindRecentTabEvents`                                                                                                                                                                                                                                                                        |
| 10         | `media/tabs/commands.js`       | "Commands" tab (largest — filtering, table, sort, all action buttons + modals binding)        | `renderCommandsTab`, `renderCommandsTable`, `bindCommandsTabEvents`, `bindCommandActionButtons`, `performCommandAction`, `dispatchCommandAction`                                                                                                                                                                        |
| 11         | `media/tabs/favorites.js`      | "Favorites" tab                                                                               | `renderFavoritesTab`, `bindFavoritesTabEvents`                                                                                                                                                                                                                                                                          |
| 12         | `media/tabs/variables.js`      | "Variables" tab                                                                               | `renderVariablesTab`, `bindVariablesTabEvents`                                                                                                                                                                                                                                                                          |
| 13         | `media/tabs/ai.js`             | "AI Generate" tab                                                                             | `renderAiTab`, `bindAiTab`                                                                                                                                                                                                                                                                                              |
| 14         | `media/render.js`              | Master `render()` orchestrator + state hydration + event binding entry points                 | `render`, `hydrateState`, `ensureSelectionDefaults`, `bindEvents`, `bindTopActions`, `bindTabs`, `bindModalDismiss`, `bindRowSelectionEvents`                                                                                                                                                                             |
| 15         | `media/messages.js`            | `window.addEventListener("message")` handler — processes all messages from the extension host | `handleState`, `handleSaveResult`, `handleActionResult`, `handleSaveVariablesResult`, ...                                                                                                                                                                                                                               |
| 16         | `media/main.js`                | Entry point: `DOMContentLoaded` init + all `postMessage` senders + tooltip IIFE               | `postReady`, `postSaveData`, `postSaveCommandVariables`, `postPerformAction`, `postAiGenerate`, ...                                                                                                                                                                                                                     |

---

## Variable Scope System

Variables support three storage scopes. The `[Local | Off | Global]` toggle on each variable row controls the **active preference** — not where the value is exclusively saved. Each scope stores its value independently.

| Scope      | Storage                                               | Behavior                                                              |
| ---------- | ----------------------------------------------------- | --------------------------------------------------------------------- |
| **Local**  | `.vscode/terminal-recipes.variables.json` (workspace) | Value saved per-workspace; shown when that workspace is open          |
| **Global** | `~/.vscode-terminal-recipes/variables.json`           | Value shared across all workspaces                                    |
| **Off**    | In-memory only (never written to disk)                | Value available for current session only; cleared on extension reload |

### Key Design Rules

- Saving Local does **not** delete Global, and vice versa.
- The toggle is a **preference** (which scope to display/use), not an exclusive assignment.
- `getCommandDraft(commandId)` returns the **resolved value** based on the current preference (read-only computed).
- To read/write scope values directly, use the scope-specific draft getters.

### Scope Draft Functions (in `media/utils.js`)

| Function                                   | Description                                                                     |
| ------------------------------------------ | ------------------------------------------------------------------------------- | -------- | ----------------------------------- |
| `getCommandLocalDraft(commandId)`          | Returns mutable `{ [varName]: value }` for the workspace-local scope            |
| `getCommandGlobalDraft(commandId)`         | Returns mutable `{ [varName]: value }` for the global scope                     |
| `getCommandSessionDraft(commandId)`        | Returns mutable `{ [varName]: value }` for the session-only scope (Off)         |
| `getCommandDraft(commandId)`               | **Read-only computed** — resolved value per variable based on `commandRemember` |
| `getCommandRemember(commandId)`            | Returns `{ [varName]: "local"                                                   | "global" | "off" }` — the scope preference map |
| `buildCommandVariablesPayload()`           | Returns `{ local, global }` — full payload for persistence (session excluded)   |
| `updateScopeIndicatorDots(container, ...)` | Toggles `.has-value` class on scope buttons to show/hide blue indicator dot     |

### `uiState` Scope-Related Fields

```js
uiState = {
  // Primary scope stores — each scope is independent
  commandLocalDrafts: {}, // { [commandId]: { [varName]: value } }
  commandGlobalDrafts: {}, // { [commandId]: { [varName]: value } }
  commandSessionDrafts: {}, // { [commandId]: { [varName]: value } } — never persisted

  // Scope preference per variable
  commandRemember: {}, // { [commandId]: { [varName]: "local"|"global"|"off" } }

  // Edit-safe snapshot — taken when edit form opens; restored on Cancel or on tab navigation away
  editCommandScopeSnapshot: null, // { commandId, local:{}, global:{}, session:{}, commandRemember:{} } | null
};
```

### `variableInputState` Buffer Fields

The variable input modal uses **in-memory buffers** so that Cancel never writes to disk:

```js
variableInputState = {
  localScopeBuffer: {}, // Temp buffer for "local" scope edits — written to scope draft only on Confirm
  globalScopeBuffer: {}, // Temp buffer for "global" scope edits
  sessionScopeBuffer: {}, // Temp buffer for "off" scope edits
};
```

### Scope Indicator Dot (`.scope-value-dot`)

Each `[Local | Off | Global]` toggle button contains a `<span class="scope-value-dot">` that is **always visible**:

- Default state (dim): that scope has no stored value
- `.has-value` class (bright blue): that scope has a stored value

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

**`saveCommandVariables` payload format:** `{ local: { version:2, commands:{} }, global: { version:2, commands:{} } }` — both scopes sent together; each written independently to its file.

### Extension → Webview (`panel.webview.postMessage`)

| `message.type`                    | Handled by (in `media/messages.js`)     | Effect                                       |
| --------------------------------- | --------------------------------------- | -------------------------------------------- |
| `state`                           | `handleState`                           | Updates `state` + calls `render()`           |
| `saveResult`                      | `handleSaveResult`                      | Shows success/error notice                   |
| `saveVariablesResult`             | `handleSaveVariablesResult`             | Shows result + updates local/global vars     |
| `actionResult`                    | `handleActionResult`                    | Shows notice for copy/run/use                |
| `aiSettingsResult`                | `handleAiSettingsResult`                | Populates `aiState` + re-renders             |
| `aiSaveSettingsResult`            | `handleAiSaveSettingsResult`            | Shows save confirmation                      |
| `aiGenerateResult`                | `handleAiGenerateResult`                | Updates `aiState.results` + calls `render()` |
| `aiInsertResult`                  | `handleAiInsertResult`                  | Shows insert confirmation notice             |
| `saveFavoritesResult`             | `handleSaveFavoritesResult`             | Shows favorites save result                  |
| `saveAutoVariablesSettingsResult` | `handleSaveAutoVariablesSettingsResult` | Shows auto-vars save result                  |

---

## Custom Dropdown IDs Reference

All dropdowns use `renderCustomSelect()` + `bindCustomSelect()` from `media/utils.js`.

| Location                         | `wrapperId`                 | File                                                                                                                |
| -------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Commands Tab — category          | `custom-category-select`    | `media/tabs/commands.js`                                                                                            |
| Commands Tab — column toggle     | `col-toggle-wrap`           | `media/tabs/commands.js`                                                                                            |
| Run Confirm Modal — shell        | `shell-selector-wrap`       | `media/modals/run-confirm.js`                                                                                       |
| Edit Command Modal — category    | `edit-category-select-wrap` | `media/modals/edit-command.js`                                                                                      |
| AI Settings Modal — provider     | `ai-provider-select-wrap`   | `media/modals/ai-settings.js`                                                                                       |
| AI Generate Modal — target shell | `ai-shell-select-wrap`      | `media/modals/ai-generate.js`                                                                                       |
| Variable inputs — enum type      | `enum-var-wrap-{varName}`   | `media/modals/run-confirm.js` (variable input modal), `media/modals/edit-command.js`, `media/modals/new-command.js` |

---

## Styling

- **All styles** live in `media/styles.css` — single stylesheet, never inline.
- **Dynamic values only:** `el.style.setProperty("--custom-prop", value)` is allowed for runtime-computed values (e.g., textarea heights).
- VS Code CSS variables (e.g., `--vscode-button-background`) are used throughout for theme compatibility.

---

## Button Reference

### Part 1 — Unique ID Buttons

Buttons with a unique `id` attribute. Located via `document.getElementById(id)`.

#### Header Actions — `media/render.js`

| Button ID                        | Purpose                                                    |
| -------------------------------- | ---------------------------------------------------------- |
| `btn-open-local-variables-file`  | Open workspace-local variables JSON file in VS Code editor |
| `btn-open-global-variables-file` | Open global variables JSON file in VS Code editor          |
| `btn-open-commands-file`         | Open global `commands.json` file in VS Code editor         |
| `btn-ai-settings`                | Open the AI Settings modal                                 |

#### Commands Tab — `media/tabs/commands.js`

| Button ID         | Purpose                                                 |
| ----------------- | ------------------------------------------------------- |
| `btn-toggle-sort` | Toggle drag-to-reorder sort mode on/off                 |
| `btn-add-with-ai` | Open the AI Generate modal scoped to the selected group |

#### Recent Tab — `media/tabs/recent.js`

| Button ID          | Purpose                          |
| ------------------ | -------------------------------- |
| `btn-clear-recent` | Clear all recent command history |

#### Favorites Tab — `media/tabs/favorites.js`

| Button ID                   | Purpose                                                                       |
| --------------------------- | ----------------------------------------------------------------------------- |
| `btn-restore-unfav-confirm` | Re-enable the removal confirmation dialog (shown when skip-confirm is active) |
| `btn-fav-unfavorite-all`    | Remove command from all favorites scopes immediately                          |
| `btn-fav-save`              | Confirm and save the selected favorite tag                                    |
| `btn-fav-cancel`            | Cancel the favorite tag selection                                             |
| `btn-unfav-confirm-remove`  | Confirm removal from favorites                                                |
| `btn-unfav-confirm-cancel`  | Cancel the unfavorite confirmation                                            |

#### AI Tab (Manage Panel) — `media/tabs/ai.js`

| Button ID                     | Purpose                                                                     |
| ----------------------------- | --------------------------------------------------------------------------- |
| `btn-create-with-ai`          | Open the AI Generate modal from the manage panel                            |
| `btn-open-add-category-modal` | Open the inline modal to add a new category                                 |
| `btn-open-add-group-modal`    | Open the inline modal to add a new group (disabled if no category selected) |
| `btn-manage-modal-confirm`    | Confirm the add/rename category or group action                             |
| `btn-manage-modal-cancel`     | Cancel the add/rename modal                                                 |

#### Enum Variable Manager — `media/tabs/ai.js`

| Button ID                 | Purpose                                        |
| ------------------------- | ---------------------------------------------- |
| `btn-enum-add-confirm`    | Add or update an enum option value             |
| `btn-enum-edit-cancel`    | Cancel editing an existing enum option         |
| `btn-enum-manager-save`   | Save the full enum options list to the command |
| `btn-enum-manager-cancel` | Close the enum manager without saving          |

#### Run Confirm Modal — `media/modals/run-confirm.js`

| Button ID                    | Purpose                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| `btn-confirm-run-variables`  | Open the variable input modal before running (shown only when command has variables) |
| `btn-confirm-run-yes`        | Confirm and run the command in the terminal                                          |
| `btn-confirm-run-no`         | Cancel the run confirmation                                                          |
| `btn-variable-input-confirm` | Confirm variable values and proceed                                                  |
| `btn-variable-input-cancel`  | Cancel variable input and discard buffer                                             |
| `btn-confirm-delete-yes`     | Confirm command deletion                                                             |
| `btn-confirm-delete-no`      | Cancel command deletion                                                              |

#### AI Generate Modal — `media/modals/ai-generate.js`

| Button ID               | Purpose                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------ |
| `btn-ai-generate`       | Send the prompt to the AI provider and generate commands                             |
| `btn-ai-prompt-cancel`  | Close the AI prompt input without generating                                         |
| `btn-ai-insert`         | Insert selected AI-generated commands into the data (disabled when nothing selected) |
| `btn-ai-results-cancel` | Close the AI results view without inserting                                          |

#### AI Settings Modal — `media/modals/ai-settings.js`

| Button ID                | Purpose                                               |
| ------------------------ | ----------------------------------------------------- |
| `btn-ai-get-api-key`     | Open the AI provider's API key page in the browser    |
| `btn-ai-show-setup-help` | Open the step-by-step setup help view                 |
| `btn-ai-settings-save`   | Save the API key to VS Code `SecretStorage`           |
| `btn-ai-settings-cancel` | Close the AI settings modal                           |
| `btn-ai-setup-open-url`  | Open the provider URL from inside the setup help view |
| `btn-ai-setup-close`     | Close the setup help view                             |

#### Edit Command Modal — `media/modals/edit-command.js`

| Button ID / Class         | Purpose                                                                                                            | Availability                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| `btn-save-edit-command`   | Submit the edit form and save changes to the command                                                               | Always                          |
| `btn-cancel-edit-command` | Cancel editing and restore the pre-edit scope snapshot                                                             | Always                          |
| `.btn-open-enum-manager`  | Open the Enum values manager for a specific variable (`data-var-name` + `data-command-id`)                         | Only when command has variables |
| `.toggle-option-3`        | Switch scope preference (`Local` / `Off` / `Global`) for a variable, within a `variable-remember-toggle` container | Only when command has variables |

#### New Command Modal — `media/modals/new-command.js`

| Button ID / Class        | Purpose                                                                                                            | Availability                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| `btn-submit-add-command` | Submit the add form and create the new command                                                                     | Always                          |
| `btn-cancel-add-command` | Cancel the add command form and return to the previous tab                                                         | Always                          |
| `.btn-open-enum-manager` | Open the Enum values manager for a specific variable (`data-var-name`, `data-command-id=""`)                       | Only when command has variables |
| `.toggle-option-3`       | Switch scope preference (`Local` / `Off` / `Global`) for a variable, within a `variable-remember-toggle` container | Only when command has variables |

---

### Part 2 — Row Action Buttons (`actions-cell`)

Buttons rendered per command row by `renderActionsCell()` in `media/utils.js`. They carry no `id` — identified by CSS class + `data-command-id` attribute. Bound in `bindCommandActionButtons()` in `media/tabs/commands.js`.

| CSS Class           | Purpose                                                                                           | Availability                                         |
| ------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `.btn-run`          | Open the run confirmation modal for the command                                                   | All tabs                                             |
| `.btn-copy`         | Copy the command text to clipboard                                                                | All tabs                                             |
| `.btn-use`          | Paste the command into the active terminal input (disabled for multi-line commands)               | All tabs                                             |
| `.btn-edit`           | Open the edit command form                                                                        | Commands tab only (`showEdit: true`)                 |
| `.btn-delete-command` | Open the delete confirmation modal for the command                                                | Commands tab only (`showDelete: true`)               |
| `.btn-add-favorite`   | Add command to favorites; left-click = quick add to current scope, CTRL+click = open manage panel | Commands + Recent tabs (`favoriteStyle: "favorite"`) |
| `.btn-unfavorite`   | Remove command from favorites; left-click = confirmation modal, CTRL+click = open manage panel    | Favorites tab (`favoriteStyle: "unfavorite"`)        |
| `.btn-goto-command` | Navigate to the command in the Commands tab and highlight its row                                 | Recent + Favorites tabs (`showGoto: true`)           |

> **Binding location:** `.btn-goto-command` is bound in `bindCommandsTabEvents()`. `.btn-add-favorite` is bound in `bindCommandActionButtons()`. `.btn-unfavorite` is bound in `bindFavoritesTabEvents()` in `media/tabs/favorites.js`. All other row action buttons are bound in `bindCommandActionButtons()` in `media/tabs/commands.js`.

---

### Notable CSS Classes Added

| Class                        | Description                                                                             |
| ---------------------------- | --------------------------------------------------------------------------------------- |
| `.scope-value-dot`           | Always-visible dot on each `[Local/Off/Global]` button; dim by default                  |
| `.scope-value-dot.has-value` | Bright blue — applied when that scope has a stored value (toggled via JS, no re-render) |
| `.selected-command-row`      | Dashed outline highlight applied to the currently selected command row (`<tr>`)         |
