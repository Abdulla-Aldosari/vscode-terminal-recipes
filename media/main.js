const vscode = acquireVsCodeApi();

// ===== SVG Icon Helpers =====
function iconRun() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M20.409 9.353a2.998 2.998 0 0 1 0 5.294L7.597 21.614C5.534 22.737 3 21.277 3 18.968V5.033c0-2.31 2.534-3.769 4.597-2.648z"/></svg>`;
}
function iconUse() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M3 15c0 2.828 0 4.243.879 5.121C4.757 21 6.172 21 9 21h6c2.828 0 4.243 0 5.121-.879C21 19.243 21 17.828 21 15" opacity=".5"/><path d="M12 3v13m0 0l4-4.375M12 16l-4-4.375"/></g></svg>`;
}
function iconCopy() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 11c0-2.828 0-4.243.879-5.121C7.757 5 9.172 5 12 5h3c2.828 0 4.243 0 5.121.879C21 6.757 21 8.172 21 11v5c0 2.828 0 4.243-.879 5.121C19.243 22 17.828 22 15 22h-3c-2.828 0-4.243 0-5.121-.879C6 20.243 6 18.828 6 16z"/><path d="M6 19a3 3 0 0 1-3-3v-6c0-3.771 0-5.657 1.172-6.828S7.229 2 11 2h4a3 3 0 0 1 3 3"/></g></svg>`;
}
function iconEdit() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.5" d="m14.36 4.079l.927-.927a3.932 3.932 0 0 1 5.561 5.561l-.927.927m-5.56-5.561s.115 1.97 1.853 3.707C17.952 9.524 19.92 9.64 19.92 9.64m-5.56-5.561l-8.522 8.52c-.577.578-.866.867-1.114 1.185a6.6 6.6 0 0 0-.749 1.211c-.173.364-.302.752-.56 1.526l-1.094 3.281m17.6-10.162L11.4 18.16c-.577.577-.866.866-1.184 1.114a6.6 6.6 0 0 1-1.211.749c-.364.173-.751.302-1.526.56l-3.281 1.094m0 0l-.802.268a1.06 1.06 0 0 1-1.342-1.342l.268-.802m1.876 1.876l-1.876-1.876"/></svg>`;
}
function iconDelete() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M9.17 4a3.001 3.001 0 0 1 5.66 0m5.67 2h-17m15.333 2.5l-.46 6.9c-.177 2.654-.265 3.981-1.13 4.79s-2.196.81-4.856.81h-.774c-2.66 0-3.991 0-4.856-.81c-.865-.809-.954-2.136-1.13-4.79l-.46-6.9M9.5 11l.5 5m4.5-5l-.5 5"/></svg>`;
}
function iconSparkles() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-sparkles">
	<path stroke="none" d="M0 0h24v24H0z" fill="none" />
	<path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2m0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2m-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6" />
</svg>`;
}
function iconAISettings() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-settings-spark">
	<path stroke="none" d="M0 0h24v24H0z" fill="none" />
	<path d="M11.992 21c-.728 -.003 -1.455 -.442 -1.667 -1.317a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c.882 .214 1.32 .95 1.317 1.684" />
	<path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
	<path d="M19 22.5a4.75 4.75 0 0 1 3.5 -3.5a4.75 4.75 0 0 1 -3.5 -3.5a4.75 4.75 0 0 1 -3.5 3.5a4.75 4.75 0 0 1 3.5 3.5" />
</svg>`;
}
function iconSettings() {
  return ``;
}

function iconAdjustmentsSettings() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-adjustments-horizontal">
	<path stroke="none" d="M0 0h24v24H0z" fill="none" />
	<path d="M12 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
	<path d="M4 6l8 0" />
	<path d="M16 6l4 0" />
	<path d="M6 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
	<path d="M4 12l2 0" />
	<path d="M10 12l10 0" />
	<path d="M15 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
	<path d="M4 18l11 0" />
	<path d="M19 18l1 0" />
</svg>`;
}







const uiState = {
  activeTab: 'recent',
  noticeMessage: '',
  selectedCategoryId: (function () {
    try {
      return localStorage.getItem('selectedCategoryId') || '';
    } catch {return '';}
  }()),
  selectedGroupId: 'all',
  editingCommandId: null,
  editSourceTab: null,
  pendingScrollCommandId: null,
  commandDrafts: {},
  commandRemember: {},
  editCommandDraft: {
    title: '',
    template: '',
    description: '',
    groupId: '',
    helpUrl: '',
    variableMeta: {},
    targetCategoryId: '',
  },
  newCommandDraft: {
    visible: false,
    title: '',
    template: '',
    description: '',
    groupId: '',
    helpUrl: '',
    variableMeta: {},
  },
  columnVisibility: (function () {
    try {
      const saved = localStorage.getItem('columnVisibility');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          description: parsed.description !== undefined ? parsed.description : true,
          groups: parsed.groups !== undefined ? parsed.groups : true,
        };
      }
    } catch { }
    return {description: true, groups: true};
  }()),
};

let noticeTimer = null;
let noticeIsError = false;
let runConfirmState = {
  commandId: null,
  resolvedCommand: '',
  selectedShellPath: null,
  selectedShellName: null,
};

let variableInputState = {
  commandId: null,
  action: null,
  missingVariables: [],
  inputValues: {},
  rememberFlags: {},
  returnToRunConfirm: false,
};

let deleteConfirmState = {
  type: null,
  id: null,
  title: '',
  template: '',
};

let manageModalState = {
  visible: false,
  mode: null, // 'add-category' | 'rename-category' | 'add-group' | 'rename-group'
  value: '',
};

// Enum Manager Modal state
let enumManagerState = {
  visible: false,
  commandId: null,     // null = new command context, string = editing existing command
  varName: '',
  enumValues: [],      // working copy array of {title, value, description}
  editIndex: null,     // index of item being edited inline, or null
  editTitle: '',
  editValue: '',
  editDescription: '',
};

// AI feature state
let aiState = {
  view: null,          // null | 'settings' | 'prompt' | 'loading' | 'results'
  mode: null,          // 'full' | 'single'
  prompt: '',
  result: null,        // AI result object from extension
  categoryId: '',      // for single mode: pre-selected category
  groupId: '',         // for single mode: pre-selected group
  checkedIds: {},      // { [commandId]: boolean }
  filterGroupId: 'all',
  providerName: 'gemini',
  keyStatus: {gemini: false, openai: false, anthropic: false},
  settingsProviderName: 'gemini',
  apiKeyInput: '',
  error: '',
};

const state = {
  data: {
    version: 1,
    categories: [],
    commands: [],
  },
  globalCommandsFile: '',
  workspaceFolder: null,
  commandVariables: {
    version: 2,
    commands: {},
  },
  globalCommandVariables: {
    version: 2,
    commands: {},
  },
  terminalProfiles: {
    defaultProfile: '',
    profiles: [],
  },
};

window.addEventListener('message', function (event) {
  const message = event.data;

  if (!message || typeof message.type !== 'string') {
    return;
  }

  if (message.type === 'state') {
    hydrateState(message.payload);
    ensureSelectionDefaults();
    render();
    return;
  }

  if (message.type === 'saveResult') {
    if (message.payload && message.payload.success) {
      showNotice('Saved successfully.');
    } else {
      showNotice(`Save failed: ${message.payload && message.payload.message ? message.payload.message : 'Unknown error'}`);
    }

    render();
    return;
  }

  if (message.type === 'actionResult') {
    if (message.payload && message.payload.success) {
      showNotice(`Action "${message.payload.action}" completed.`);

      if (message.payload.commandVariables && typeof message.payload.commandVariables === 'object') {
        state.commandVariables = message.payload.commandVariables;
      }

      if (message.payload.globalCommandVariables && typeof message.payload.globalCommandVariables === 'object') {
        state.globalCommandVariables = message.payload.globalCommandVariables;
      }
    } else {
      showNotice(`Action failed: ${message.payload && message.payload.message ? message.payload.message : 'Unknown error'}`);
    }

    render();
    return;
  }

  if (message.type === 'saveVariablesResult') {
    if (message.payload && message.payload.success) {
      if (message.payload.commandVariables) {
        state.commandVariables = message.payload.commandVariables;
      }

      if (message.payload.globalCommandVariables) {
        state.globalCommandVariables = message.payload.globalCommandVariables;
      }
    }
    // No render() here to avoid focus loss while editing
  }

  if (message.type === 'aiSettingsResult') {
    if (message.payload) {
      aiState.providerName = message.payload.providerName || 'gemini';
      aiState.settingsProviderName = message.payload.providerName || 'gemini';
      aiState.keyStatus = message.payload.keyStatus || {gemini: false, openai: false, anthropic: false};
    }
    render();
    return;
  }

  if (message.type === 'aiSaveSettingsResult') {
    if (message.payload && message.payload.success) {
      // Re-fetch settings to refresh keyStatus
      vscode.postMessage({type: 'aiGetSettings'});
      showNotice('AI settings saved.');
    } else {
      showNotice(`Failed to save settings: ${message.payload && message.payload.message ? message.payload.message : 'Unknown error'}`);
      render();
    }
    return;
  }

  if (message.type === 'aiGenerateResult') {
    if (message.payload && message.payload.success) {
      aiState.result = message.payload.result;
      aiState.mode = message.payload.mode;
      // Initialize all commands as checked
      const cmds = message.payload.mode === 'full'
        ? (message.payload.result.commands || [])
        : [message.payload.result];
      const checked = {};
      cmds.forEach(function (cmd) {checked[cmd.id] = true;});
      aiState.checkedIds = checked;
      aiState.filterGroupId = 'all';
      aiState.error = '';
      aiState.view = 'results';
    } else {
      aiState.error = message.payload && message.payload.message ? message.payload.message : 'Unknown error';
      aiState.view = 'prompt';
    }
    render();
    return;
  }

  if (message.type === 'aiInsertResult') {
    if (message.payload && message.payload.success) {
      aiState.view = null;
      aiState.result = null;
      aiState.prompt = '';
      aiState.error = '';
      showNotice(`✅ Inserted ${message.payload.count} command(s) successfully.`);
    } else {
      aiState.error = message.payload && message.payload.message ? message.payload.message : 'Unknown error';
      aiState.view = 'results';
    }
    render();
    return;
  }
});

function hydrateState(payload) {
  state.data = payload && payload.data ? payload.data : state.data;
  state.globalCommandsFile = payload && payload.globalCommandsFile ? payload.globalCommandsFile : '';
  state.workspaceFolder = payload ? payload.workspaceFolder : null;
  state.commandVariables = payload && payload.commandVariables ? payload.commandVariables : {version: 2, commands: {}};
  state.globalCommandVariables = payload && payload.globalCommandVariables ? payload.globalCommandVariables : {version: 2, commands: {}};
  state.terminalProfiles = payload && payload.terminalProfiles ? payload.terminalProfiles : {defaultProfile: '', profiles: []};

  // Initialize selected shell from default profile if not already set
  if (runConfirmState.selectedShellName === null) {
    const profiles = state.terminalProfiles.profiles || [];
    const defaultName = state.terminalProfiles.defaultProfile || '';
    const defaultProfileEntry = profiles.find(function (p) {return p.name === defaultName;}) || profiles[0] || null;
    runConfirmState.selectedShellName = defaultProfileEntry ? defaultProfileEntry.name : null;
    runConfirmState.selectedShellPath = defaultProfileEntry ? defaultProfileEntry.shellPath : null;
  }

  const localCmds = state.commandVariables.commands || {};
  const globalCmds = state.globalCommandVariables.commands || {};
  const allCommandIds = new Set([...Object.keys(localCmds), ...Object.keys(globalCmds)]);

  allCommandIds.forEach(function (commandId) {
    if (!uiState.commandDrafts[commandId]) {
      const globalVars = globalCmds[commandId] || {};
      const localVars = localCmds[commandId] || {};
      uiState.commandDrafts[commandId] = {...globalVars, ...localVars};
    }

    if (!uiState.commandRemember[commandId]) {
      const remembered = {};
      const globalVars = globalCmds[commandId] || {};
      const localVars = localCmds[commandId] || {};
      Object.keys(globalVars).forEach(function (key) {
        remembered[key] = 'global';
      });
      Object.keys(localVars).forEach(function (key) {
        remembered[key] = 'local';
      });
      uiState.commandRemember[commandId] = remembered;
    }
  });
}

function ensureSelectionDefaults() {
  const categories = state.data.categories || [];

  if (!categories.length) {
    uiState.selectedCategoryId = '';
    uiState.selectedGroupId = 'all';
    return;
  }

  if (!categories.some(function (category) {
    return category.id === uiState.selectedCategoryId;
  })) {
    uiState.selectedCategoryId = categories[0].id;
  }

  const groups = getSelectedCategoryGroups();

  if (uiState.selectedGroupId !== 'all' && !groups.some(function (group) {
    return group.id === uiState.selectedGroupId;
  })) {
    uiState.selectedGroupId = 'all';
  }
}

function setSelectedCategory(categoryId) {
  uiState.selectedCategoryId = categoryId;
  try {
    localStorage.setItem('selectedCategoryId', categoryId);
  } catch { }
}

function getSelectedCategory() {
  return (state.data.categories || []).find(function (category) {
    return category.id === uiState.selectedCategoryId;
  }) || null;
}

function getSelectedCategoryGroups() {
  const category = getSelectedCategory();
  return category ? category.groups || [] : [];
}

function getVisibleCommands() {
  return (state.data.commands || []).filter(function (command) {
    if (command.categoryId !== uiState.selectedCategoryId) {
      return false;
    }

    if (uiState.selectedGroupId === 'all') {
      return true;
    }

    return command.groupId === uiState.selectedGroupId;
  });
}

function getEditingCommand() {
  if (!uiState.editingCommandId) {
    return null;
  }

  return (state.data.commands || []).find(function (command) {
    return command.id === uiState.editingCommandId;
  }) || null;
}

function render() {
  ensureSelectionDefaults();

  const app = document.getElementById('app');
  const selectedCategory = getSelectedCategory();

  app.innerHTML = `
    <div class="layout">
      <header class="header">
        <h1>Terminal Recipes</h1>
        <div class="header-actions">
          <button id="btn-open-local-variables-file" class="btn small secondary" ${state.workspaceFolder ? '' : 'disabled'} title="${state.workspaceFolder ? '' : 'No workspace open'}">Open Local Variables JSON</button>
          <button id="btn-open-global-variables-file" class="btn small secondary">Open Global Variables JSON</button>
          <button id="btn-open-commands-file" class="btn small secondary">Open Global JSON</button>
          <button id="btn-ai-settings" class="btn small secondary ai-settings-btn" title="AI Settings">${iconAISettings()} AI Settings</button>
        </div>
      </header>
      <p class="meta">Workspace: <code>${escapeHtml(state.workspaceFolder || 'No workspace open')}</code></p>
      ${uiState.noticeMessage ? `<div class="notice${noticeIsError ? ' notice-error' : ''}">${escapeHtml(uiState.noticeMessage)}</div>` : ''}

      <section class="card tabs-section">
        <div class="tabs">
          <button class="tab ${!uiState.editingCommandId && uiState.activeTab === 'recent' ? 'active' : ''}" data-tab="recent">Recent Commands</button>
          <button class="tab ${!uiState.editingCommandId && uiState.activeTab === 'manage' ? 'active' : ''}" data-tab="manage">Categories & Groups</button>
          <button class="tab ${!uiState.editingCommandId && uiState.activeTab === 'commands' ? 'active' : ''}" data-tab="commands">Commands</button>
          <button class="tab tab-push-right ${!uiState.editingCommandId && uiState.activeTab === 'add' ? 'active' : ''}" data-tab="add" ${selectedCategory ? '' : 'disabled'}>Add New Command</button>
        </div>
      </section>

      ${uiState.editingCommandId ? renderEditTab() : (
      uiState.activeTab === 'recent' ? renderRecentCommandsTab() :
        uiState.activeTab === 'manage' ? renderManageTab() :
          uiState.activeTab === 'commands' ? renderCommandsTab(selectedCategory) :
            uiState.activeTab === 'add' ? renderAddCommandTab(selectedCategory) : ''
    )}
      ${renderVariableInputModal()}
      ${renderRunConfirmModal()}
      ${renderDeleteConfirmModal()}
      ${aiState.view === 'settings' ? renderAiSettingsModal() : ''}
      ${aiState.view === 'prompt' ? renderAiPromptModal() : ''}
      ${aiState.view === 'loading' ? renderAiLoadingOverlay() : ''}
      ${aiState.view === 'results' ? renderAiResultsModal() : ''}
      ${enumManagerState.visible ? renderEnumManagerModal() : ''}
    </div>
  `;

  bindEvents();
  bindAiEvents();
  bindCmdTitleLinks();
  if (enumManagerState.visible) {
    bindEnumManagerEvents();
  }

  // Scroll & highlight a pending row (set before render() was called)
  if (uiState.pendingScrollCommandId) {
    var _pendingId = uiState.pendingScrollCommandId;
    uiState.pendingScrollCommandId = null;
    setTimeout(function () {scrollToAndHighlight(_pendingId);}, 30);
  }
}

function renderManageTab() {
  const categories = state.data.categories || [];
  const selectedCategory = getSelectedCategory();
  const selectedGroups = getSelectedCategoryGroups();

  return `
    <section class="card manage-card">
      <div class="manage-layout">

        <!-- Categories Panel -->
        <div class="manage-panel">
          <div class="manage-panel-header">
            <h2 class="manage-panel-title">Categories</h2>
            <div class="row" style="gap:6px">
              <button class="btn small secondary ai-create-btn" id="btn-create-with-ai" title="Generate a full category with groups and commands using AI">${iconSparkles()} Create with AI</button>
              <button class="btn primary small" id="btn-open-add-category-modal">+ Add New Category</button>
            </div>
          </div>
          <div class="manage-list">
            ${categories.length === 0 ? `<p class="muted manage-empty">No categories yet.</p>` : ''}
            ${categories.map(function (category) {
    const isActive = category.id === uiState.selectedCategoryId;
    return `
              <div class="manage-item ${isActive ? 'active' : ''}" data-category-id="${escapeAttr(category.id)}">
                <div class="manage-item-info">
                  <span class="manage-item-label">${escapeHtml(category.title)}</span>
                  <code class="manage-item-count">${(state.data.commands || []).filter(function (c) {return c.categoryId === category.id;}).length}</code>
                </div>
                <div class="manage-item-actions">
                  <button class="btn small secondary btn-rename-category" data-category-id="${escapeAttr(category.id)}" data-category-title="${escapeAttr(category.title)}" title="Rename">Rename</button>
                  <button class="btn small danger btn-delete-category" data-category-id="${escapeAttr(category.id)}" data-category-title="${escapeAttr(category.title)}" title="Delete">Delete</button>
                </div>
              </div>
            `;
  }).join('')}
          </div>
        </div>

        <!-- Groups Panel -->
        <div class="manage-panel">
          <div class="manage-panel-header">
            <h2 class="manage-panel-title">Groups</h2>
            <button class="btn small primary" id="btn-open-add-group-modal" ${selectedCategory ? '' : 'disabled'}>+ Add New Group</button>
          </div>
          <div class="manage-list">
            ${!selectedCategory ? `<p class="muted manage-empty">Select a category first.</p>` : ''}
            ${selectedCategory && selectedGroups.length === 0 ? `<p class="muted manage-empty">No groups yet.</p>` : ''}
            ${selectedGroups.map(function (group) {
    const isActive = group.id === uiState.selectedGroupId;
    return `
              <div class="manage-item ${isActive ? 'active' : ''}" data-group-id="${escapeAttr(group.id)}">
                <div class="manage-item-info">
                  <span class="manage-item-label">${escapeHtml(group.title)}</span>
                  <code class="manage-item-count">${(state.data.commands || []).filter(function (c) {return c.categoryId === uiState.selectedCategoryId && c.groupId === group.id;}).length}</code>
                </div>
                <div class="manage-item-actions">
                  <button class="btn small secondary btn-rename-group" data-group-id="${escapeAttr(group.id)}" data-group-title="${escapeAttr(group.title)}" title="Rename">Rename</button>
                  <button class="btn small danger btn-delete-group" data-group-id="${escapeAttr(group.id)}" data-group-title="${escapeAttr(group.title)}" title="Delete">Delete</button>
                </div>
              </div>
            `;
  }).join('')}
          </div>
        </div>

      </div>
    </section>
    ${renderManageModal()}
  `;
}

function renderManageModal() {
  if (!manageModalState.visible) {
    return '';
  }

  const mode = manageModalState.mode;
  let title = '';
  let placeholder = '';
  let btnLabel = '';

  if (mode === 'add-category') {
    title = 'Add New Category';
    placeholder = 'Category name...';
    btnLabel = 'Add';
  } else if (mode === 'rename-category') {
    title = 'Rename Category';
    placeholder = 'New name...';
    btnLabel = 'Rename';
  } else if (mode === 'add-group') {
    title = 'Add New Group';
    placeholder = 'Group name...';
    btnLabel = 'Add';
  } else if (mode === 'rename-group') {
    title = 'Rename Group';
    placeholder = 'New name...';
    btnLabel = 'Rename';
  }

  return `
    <div class="modal-overlay" id="manage-modal-overlay">
      <div class="modal-box">
        <h3>${escapeHtml(title)}</h3>
        <input id="manage-modal-input" class="input" placeholder="${escapeAttr(placeholder)}" value="${escapeAttr(manageModalState.value)}" autocomplete="off" />
        <div class="row justify-content-flex-end">
          <button class="btn primary min-w65" id="btn-manage-modal-confirm">${escapeHtml(btnLabel)}</button>
          <button class="btn secondary action min-w65" id="btn-manage-modal-cancel">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

function renderCommandsTab(selectedCategory) {
  // Show edit form inline when editing
  if (uiState.editingCommandId) {
    return renderEditTab();
  }

  const groups = getSelectedCategoryGroups();
  const commands = getVisibleCommands();

  if (!selectedCategory) {
    return `
      <section class="card">
        <p>Add a category first in Categories &amp; Groups tab.</p>
      </section>
    `;
  }

  return `
    <section class="card">
      
      <div class="row align-items-center commands-toolbar">
        <h2 class="pb-5">Commands Browser</h2>
        ${renderCustomCategorySelect()}
        ${renderColumnToggleDropdown()}
        <button class="btn small secondary ai-create-btn" id="btn-add-with-ai" title="${uiState.selectedGroupId === 'all' ? 'Select a real group first' : 'Generate a command using AI'}" ${uiState.selectedGroupId === 'all' ? 'disabled' : ''}>${iconSparkles()} Add with AI</button>
      </div>
      <div class="group-tags-row">
        <span class="groups-label">Groups:</span>
        <button class="tag group-filter-tag ${uiState.selectedGroupId === 'all' ? 'active' : ''}" data-group-id="all">All</button>
        ${groups.map(function (group) {
    return `<button class="tag group-filter-tag ${uiState.selectedGroupId === group.id ? 'active' : ''}" data-group-id="${escapeAttr(group.id)}">${escapeHtml(group.title)}</button>`;
  }).join('')}
      </div>
      <div class="table-panel">
        ${renderCommandsTable(commands, groups)}
      </div>
    </section>
  `;
}

function renderAddCommandTab(selectedCategory) {
  if (!selectedCategory) {
    return `
      <section class="card">
        <p>Add a category first in Categories &amp; Groups tab.</p>
      </section>
    `;
  }

  const groups = getSelectedCategoryGroups();
  const draft = uiState.newCommandDraft;
  const detectedVars = draft.template ? collectVariables([draft.template]).filter(function (n) {return n !== 'workspaceFolder';}) : [];
  const newCommandDraft = getCommandDraft('__new__');
  const newCommandRemember = getCommandRemember('__new__');

  return `
    <section class="card">
      <h2>Add Command to ( ${escapeHtml(selectedCategory.title)} )</h2>
      <form id="form-new-command" class="form-grid add-command-grid">
        <label class="add-command-title">Command Title<input id="new-command-title" class="input" required value="${escapeAttr(draft.title)}" /></label>
        <label class="add-command-template">Command Template (Variables supported)<input id="new-command-template" class="input" required placeholder="npm install \${package_name}" value="${escapeAttr(draft.template)}" /></label>
        <label class="full-width">Description<textarea id="new-command-description" class="input" rows="2">${escapeAttr(draft.description)}</textarea></label>
        <div class="full-width grouped-tags-wrap">
          <span class="groups-label">Groups:</span>
          <div class="inline-tags" id="new-command-groups-tags">
            ${groups.map(function (group) {
    return `<button type="button" class="tag new-command-group-tag ${draft.groupId === group.id ? 'active' : ''}" data-group-id="${escapeAttr(group.id)}">${escapeHtml(group.title)}</button>`;
  }).join('')}
          </div>
        </div>
        <label class="full-width">Help URL (optional)<input id="new-command-help-url" class="input" placeholder="https://docs.example.com/command" value="${escapeAttr(draft.helpUrl || '')}" /></label>
        ${detectedVars.length ? `
        <div class="full-width mt-5">
          <h3>Command Variables:</h3>
          <div class="variables-list">
            <div class="variable-row vars-store-row">
              <span></span>
              <span></span>
              <span class="muted vars-store-location">Variables store location</span>
            </div>
            ${detectedVars.map(function (name) {
    const value = newCommandDraft[name] || '';
    const rememberValue = newCommandRemember[name] || 'off';
    const meta = draft.variableMeta && draft.variableMeta[name];
    const isEnum = meta && meta.type === 'enum';
    const enumCount = isEnum ? meta.enumValues.length : 0;
    return `
              <div class="variable-row">
                <label class="variable-name">\${${escapeHtml(name)}}</label>
                <input class="input variable-input" data-command-id="__new__" data-variable-name="${escapeAttr(name)}" value="${escapeAttr(value)}" />
                ${renderToggleSwitch3('__new__', name, rememberValue, 'variable-remember-toggle')}
                <button type="button" class="btn small ${isEnum ? 'primary' : 'secondary'} btn-open-enum-manager" data-var-name="${escapeAttr(name)}" data-command-id="" title="Manage Enum values for this variable">
                  ${iconAdjustmentsSettings()} ${isEnum ? `Enum (${enumCount})` : 'Set Enum'}
                </button>
              </div>
            `;
  }).join('')}
          </div>
        </div>
        ` : ''}
        <div class="row full-width justify-content-flex-end mt-20">
          <button type="submit" class="btn medium primary">Add Command</button>
          <button type="button" id="btn-cancel-add-command" class="btn medium secondary action">Cancel</button>
        </div>
      </form>
    </section>
  `;
}

function renderCommandsTable(commands, groups) {
  if (!commands.length) {
    return '<p>No commands found for this filter.</p>';
  }

  const tableClasses = [
    'cmds-table commands-table main-table',
    !uiState.columnVisibility.description ? 'hide-description' : '',
    !uiState.columnVisibility.groups ? 'hide-groups' : '',
  ].filter(Boolean).join(' ');

  return `
    <div class="table-wrap">
      <table class="${tableClasses}">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Template</th>
            <th>Groups</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${commands.map(function (command) {
    const titleHtml = command.helpUrl
      ? `<a class="cmd-title-link" data-url="${escapeAttr(command.helpUrl)}" title="Open documentation">${escapeHtml(command.title)}</a>`
      : `<strong>${escapeHtml(command.title)}</strong>`;
    return `
              <tr>
                <td>${titleHtml}<br><span class="muted">${escapeHtml(command.id)}</span></td>
                <td>${escapeHtml(command.description || '-')}</td>
                <td><pre class="template-cell">${escapeHtml(command.command)}</pre></td>
                <td>${escapeHtml(resolveGroupTitle(command.groupId || '', groups))}</td>
                <td>
                <div class="actions-cell">
                  <button class="btn icon-btn success btn-run" data-command-id="${escapeAttr(command.id)}" title="Run command">${iconRun()}</button>
                  <button class="btn icon-btn secondary btn-use action" data-command-id="${escapeAttr(command.id)}" title="Use in terminal">${iconUse()}</button>
                  <button class="btn icon-btn secondary btn-copy action" data-command-id="${escapeAttr(command.id)}" title="Copy to clipboard">${iconCopy()}</button>
                  <button class="btn icon-btn secondary btn-edit action" data-command-id="${escapeAttr(command.id)}" title="Edit command">${iconEdit()}</button>
                  <button class="btn icon-btn danger btn-delete-command" data-command-id="${escapeAttr(command.id)}" title="Delete command">${iconDelete()}</button>
                </div>
                </td>
              </tr>
            `;
  }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderNewCommandForm(groups, draft) {
  return `
    <form id="form-new-command" class="form-grid add-command-grid">
      <label class="add-command-title">Command Title<input id="new-command-title" class="input" required value="${escapeAttr(draft.title)}" /></label>
      
      <label class="add-command-template">Command Template (Variables supported)<input id="new-command-template" class="input" required placeholder="npm install \${package_name}" value="${escapeAttr(draft.template)}" /></label>
      
      
      <label class="full-width">Description<textarea id="new-command-description" class="input" rows="2">${escapeAttr(draft.description)}</textarea></label>
      <div class="full-width grouped-tags-wrap">
        <span class="groups-label">Groups:</span>
        <div class="inline-tags" id="new-command-groups-tags">
          ${groups.map(function (group) {
    return `<button type="button" class="tag new-command-group-tag ${draft.groupId === group.id ? 'active' : ''}" data-group-id="${escapeAttr(group.id)}">${escapeHtml(group.title)}</button>`;
  }).join('')}
        </div>
      </div>
      <div class="row full-width justify-content-flex-end mt-20">
        <button type="submit" class="btn primary">Add Command</button>
        <button type="button" id="btn-cancel-add-command" class="btn secondary action">Cancel</button>
      </div>
    </form>
  `;
}

function renderEditTab() {
  const command = getEditingCommand();

  if (!command) {
    return `
      <section class="card">
        <p>Select command edit from Commands tab.</p>
      </section>
    `;
  }

  syncEditCommandDraftFromCommand(command);
  const editDraft = uiState.editCommandDraft;
  const targetCategoryId = editDraft.targetCategoryId || command.categoryId;
  const allCategories = state.data.categories || [];
  const targetCategory = allCategories.find(function (cat) {
    return cat.id === targetCategoryId;
  });
  const groups = targetCategory ? (targetCategory.groups || []) : [];
  const variables = collectVariables([editDraft.template || command.command]);
  const commandDraft = getCommandDraft(command.id);
  const commandRemember = getCommandRemember(command.id);
  const isMoved = targetCategoryId !== command.categoryId;

  return `
    <section class="card">
      <h2>Edit Command</h2>
      <form id="form-edit-command" class="form-grid add-command-grid">
        <label class="add-command-title">Command Title<input id="edit-command-title" class="input" required value="${escapeAttr(editDraft.title)}" /></label>
        <label class="add-command-template">Command Template<input id="edit-command-template" class="input" required value="${escapeAttr(editDraft.template)}" /></label>
        <label class="full-width">Description<textarea id="edit-command-description" class="input" rows="2">${escapeHtml(editDraft.description)}</textarea></label>
        <div class="full-width grouped-tags-wrap">
          <span class="groups-label">Category:</span>
          ${renderCustomSelect(
    'edit-category-select-wrap',
    'edit-category-select-btn',
    'edit-category-select-menu',
    allCategories.map(function (cat) {return {value: cat.id, label: cat.title};}),
    targetCategoryId,
    'cs-btn-sm cs-btn-category',  // btnExtraClass
    false, // menuUp
    'cs-wrap-full' // `wrapExtraClass`
  )}
          ${isMoved ? `<span class="muted move-category-warning">⚠️ Moving to new category — (Please select a group from the list below)</span>` : ''}
        </div>
        <div class="full-width grouped-tags-wrap">
          <span class="groups-label">Groups:</span>
          <div class="inline-tags" id="edit-command-groups-tags">
            ${groups.length === 0 ? `<span class="muted" style="font-size:0.82rem">No groups in this category.</span>` : ''}
            ${groups.map(function (group) {
    return `<button type="button" class="tag edit-command-group-tag ${editDraft.groupId === group.id ? 'active' : ''}" data-group-id="${escapeAttr(group.id)}">${escapeHtml(group.title)}</button>`;
  }).join('')}
          </div>
        </div>
        <label class="full-width">Help URL (optional)<input id="edit-command-help-url" class="input" placeholder="https://docs.example.com/command" value="${escapeAttr(editDraft.helpUrl || '')}" /></label>
        ${variables.length ? `
        <div class="full-width mt-5">
          <h3>Command Variables:</h3>
          <div class="variables-list">
            <div class="variable-row vars-store-row">
              <span></span>
              <span></span>
              <span class="muted vars-store-location">Variables store location</span>
            </div>
            ${variables.map(function (name) {
    const value = name === 'workspaceFolder' ? (state.workspaceFolder || '') : (commandDraft[name] || '');
    const rememberValue = name === 'workspaceFolder' ? null : (commandRemember[name] || 'off');
    const meta = editDraft.variableMeta && editDraft.variableMeta[name];
    const isEnum = meta && meta.type === 'enum';
    const enumCount = isEnum ? meta.enumValues.length : 0;
    return `
              <div class="variable-row">
                <label class="variable-name">\${${escapeHtml(name)}}</label>
                <input class="input variable-input" data-command-id="${escapeAttr(command.id)}" data-variable-name="${escapeAttr(name)}" value="${escapeAttr(value)}" ${name === 'workspaceFolder' ? 'readonly' : ''} />
                ${name === 'workspaceFolder' ? '<span></span>' : renderToggleSwitch3(command.id, name, rememberValue, 'variable-remember-toggle')}
                ${name === 'workspaceFolder' ? '' : `<button type="button" class="btn small ${isEnum ? 'primary' : 'secondary'} btn-open-enum-manager" data-var-name="${escapeAttr(name)}" data-command-id="${escapeAttr(command.id)}" title="Manage Enum values">${iconAdjustmentsSettings()} ${isEnum ? `Enum (${enumCount})` : 'Set Enum'}</button>`}
              </div>
            `;
  }).join('')}
          </div>
        </div>
        ` : ''}
        ${command.lastRunAt ? `
        <div class="full-width mt-5">
          <span class="muted" style="font-size:0.82rem">Last Run: <strong title="${escapeAttr(formatDateTime(command.lastRunAt))}">${escapeHtml(timeAgo(command.lastRunAt))}</strong> &nbsp;·&nbsp; ×${command.runCount || 0} runs</span>
        </div>
        ` : ''}
        <div class="row full-width justify-content-flex-end mt-20">
          <button type="submit" class="btn medium primary">Save Changes</button>
          <button type="button" id="btn-cancel-edit-command" class="btn medium secondary action">Cancel</button>
        </div>
      </form>
    </section>
  `;
}

function renderToggleSwitch3(commandId, varName, currentValue, extraClass) {
  const noWorkspace = !state.workspaceFolder;
  const opts = [
    {value: 'local', label: 'Local', disabled: noWorkspace},
    {value: 'off', label: 'Off', disabled: false},
    {value: 'global', label: 'Global', disabled: false},
  ];

  return `
    <div class="toggle-switch-3 ${escapeAttr(extraClass)}" data-command-id="${escapeAttr(commandId)}" data-variable-name="${escapeAttr(varName)}">
      ${opts.map(function (opt) {
    return `<button type="button" class="toggle-option-3 ${currentValue === opt.value ? 'active' : ''}" data-value="${opt.value}" ${opt.disabled ? 'disabled' : ''}>${opt.label}</button>`;
  }).join('')}
    </div>
  `;
}

function renderShellSelector() {
  const profiles = (state.terminalProfiles && state.terminalProfiles.profiles) || [];
  if (!profiles.length) {
    return '';
  }

  // Use profile name as unique identifier (avoids double-tick when two profiles share same path)
  const selectedShellName = runConfirmState.selectedShellName;
  const selectedLabel = selectedShellName || (state.terminalProfiles.defaultProfile || 'Default');

  const chevronSvg = `<svg viewBox="0 0 24 24" width="12" height="12" class="cs-chevron" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9l6 6l6-6"></path></svg>`;
  const checkSvg = `<svg viewBox="0 0 24 24" width="12" height="12" class="cs-check" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6L9 17l-5-5"></path></svg>`;

  const items = profiles.map(function (profile) {
    const isSelected = profile.name === selectedShellName;
    return `
      <div class="cs-item" role="menuitem" tabindex="-1" data-shell-name="${escapeAttr(profile.name)}" data-shell-path="${escapeAttr(profile.shellPath)}">
        <span class="cs-item-label">${escapeHtml(profile.name)}</span>
        ${isSelected ? checkSvg : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="cs-wrap" id="shell-selector-wrap">
      <button class="cs-btn cs-btn-sm" type="button" aria-haspopup="menu" aria-expanded="false" id="shell-selector-btn">
        <span class="cs-btn-label">${escapeHtml(selectedLabel)}</span>
        ${chevronSvg}
      </button>
      <div class="cs-menu cs-menu-up" role="menu" id="shell-selector-menu" hidden>
        ${items}
      </div>
    </div>
  `;
}

function renderRunConfirmModal() {
  // Hide run confirm modal while variable input modal is open (returning to run confirm)
  if (!runConfirmState.commandId || (variableInputState.commandId && variableInputState.returnToRunConfirm)) {
    return '';
  }

  const command = (state.data.commands || []).find(function (item) {
    return item.id === runConfirmState.commandId;
  });

  const hasVariables = command ? collectVariables([command.command]).some(function (name) {
    return name !== 'workspaceFolder';
  }) : false;

  return `
    <div class="modal-overlay" id="run-confirm-overlay">
      <div class="modal-box">
        <h3>Do you want to run this command?</h3>
        <pre class="modal-command-preview">${escapeHtml(runConfirmState.resolvedCommand)}</pre>
        <p class="muted">⚠️ This command will be executed immediately</p>
        <div class="row justify-content-flex-end">
        ${hasVariables ? `<button class="btn small secondary min-w65" id="btn-confirm-run-variables">Edit Variables</button>` : ''}
          ${renderShellSelector()}
          <button class="btn small primary min-w65" id="btn-confirm-run-yes">Run</button>
          <button class="btn small secondary action min-w65" id="btn-confirm-run-no">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

function renderVariableInputModal() {
  if (!variableInputState.commandId) {
    return '';
  }

  const vars = variableInputState.missingVariables;
  // Get the command to check variableMeta
  const cmdForMeta = (state.data.commands || []).find(function (c) {return c.id === variableInputState.commandId;});

  return `
    <div class="modal-overlay" id="variable-input-overlay">
      <div class="modal-box">
        <h3>Enter Variable Values</h3>
        <div class="variables-list">
          <div class="variable-row vars-store-row">
            <span></span>
            <span></span>
            <span class="muted vars-store-location">Variables store location</span>
          </div>
          ${vars.map(function (name) {
    const currentValue = variableInputState.inputValues[name] !== undefined
      ? variableInputState.inputValues[name]
      : (getCommandDraft(variableInputState.commandId)[name] || '');
    const rememberValue = variableInputState.rememberFlags[name] !== undefined
      ? variableInputState.rememberFlags[name]
      : (getCommandRemember(variableInputState.commandId)[name] || 'off');
    // Check if this variable has Enum metadata
    const enumMeta = cmdForMeta && cmdForMeta.variableMeta && cmdForMeta.variableMeta[name];
    const isEnum = enumMeta && enumMeta.type === 'enum' && enumMeta.enumValues && enumMeta.enumValues.length > 0;
    // Check if current value is one of the enum values
    const isCustomValue = isEnum && !enumMeta.enumValues.some(function (ev) {return ev.value === currentValue;});

    if (isEnum) {
      const enumOptions = enumMeta.enumValues.map(function (ev) {
        return {value: ev.value, label: ev.title + ' — ' + ev.value};
      }).concat([{value: '__custom__', label: '✏️ Custom value...'}]);
      const enumSelectedVal = isCustomValue ? '__custom__' : currentValue;
      return `
              <div class="variable-row variable-row-enum">
                <label class="variable-name">\${${escapeHtml(name)}}</label>
                <div class="enum-input-wrap" data-variable-name="${escapeAttr(name)}">
                  ${renderCustomSelect(
        'enum-var-wrap-' + escapeAttr(name),
        'enum-var-btn-' + escapeAttr(name),
        'enum-var-menu-' + escapeAttr(name),
        enumOptions,
        enumSelectedVal,
        'cs-btn-sm cs-btn-enum-var', // btnExtraClass
        false, // menuUp
        'cs-wrap-full'  // 
      )}
                  <input
                    class="input variable-modal-input variable-modal-custom-input${isCustomValue ? '' : ' hidden'}"
                    data-variable-name="${escapeAttr(name)}"
                    value="${escapeAttr(currentValue)}"
                    placeholder="Enter custom value..."
                  />
                </div>
                ${renderToggleSwitch3(variableInputState.commandId, name, rememberValue, 'variable-modal-remember-toggle')}
              </div>
            `;
    }

    return `
              <div class="variable-row">
                <label class="variable-name">\${${escapeHtml(name)}}</label>
                <input
                  class="input variable-modal-input"
                  data-variable-name="${escapeAttr(name)}"
                  value="${escapeAttr(currentValue)}"
                  placeholder="Enter value..."
                />
                ${renderToggleSwitch3(variableInputState.commandId, name, rememberValue, 'variable-modal-remember-toggle')}
              </div>
            `;
  }).join('')}
        </div>
        <div class="row justify-content-flex-end mt-20">
          <button class="btn small primary min-w65" id="btn-variable-input-confirm">Confirm</button>
          <button class="btn small secondary action min-w65" id="btn-variable-input-cancel">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

function renderDeleteConfirmModal() {
  if (!deleteConfirmState.type) {
    return '';
  }

  var heading = '';
  var detailHtml = '';
  var confirmLabel = 'Delete';
  var confirmClass = 'btn small danger min-w65';

  if (deleteConfirmState.type === 'clearRecent') {
    heading = 'Clear Recent History?';
    confirmLabel = 'Clear';
    detailHtml = `<p class="modal-description">${escapeHtml(deleteConfirmState.title || 'This action cannot be undone.')}</p>`;
  } else if (deleteConfirmState.type === 'command') {
    heading = `Do you want to delete this command?`;
    detailHtml = `
      <p class="delete-confirm-command-name">${escapeHtml(deleteConfirmState.title)}</p>
      <pre class="modal-command-preview">${escapeHtml(deleteConfirmState.template)}</pre>
    `;
  } else {
    heading = `Do you want to delete this ${escapeHtml(deleteConfirmState.type)}?`;
    detailHtml = `<p class="modal-description">${escapeHtml(deleteConfirmState.title || 'This action cannot be undone.')}</p>`;
  }

  return `
    <div class="modal-overlay" id="delete-confirm-overlay">
      <div class="modal-box">
        <h3>${heading}</h3>
        ${detailHtml}
        <div class="row justify-content-flex-end">
          <button class="${confirmClass}" id="btn-confirm-delete-yes">${confirmLabel}</button>
          <button class="btn small secondary action min-w65" id="btn-confirm-delete-no">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

function renderRecentCommandsTab() {
  const recentCommands = (state.data.commands || [])
    .filter(function (cmd) {return cmd.lastRunAt;})
    .slice()
    .sort(function (a, b) {return new Date(b.lastRunAt) - new Date(a.lastRunAt);});

  const totalRuns = recentCommands.reduce(function (sum, cmd) {return sum + (cmd.runCount || 0);}, 0);

  if (!recentCommands.length) {
    return `
      <section class="card">
        <div class="row between">
          <h2>Recent Commands</h2>
        </div>
        <p class="muted">No recent commands yet. Run or Use a command to see it here.</p>
      </section>
    `;
  }

  return `
    <section class="card">
      <div class="row between">
        <h2>Recent Commands</h2>
        <div class="row">
          <span class="muted total-runs">Total runs: <strong>${totalRuns}</strong></span>
          <button id="btn-clear-recent" class="btn danger small">Clear Recent</button>
        </div>
      </div>
      <div class="table-wrap recent-commands">
        <table class="cmds-table recent-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Template</th>
              <th>Last Run</th>
              <th>×Runs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${recentCommands.map(function (command) {
    const titleHtml = command.helpUrl
      ? `<a class="cmd-title-link" data-url="${escapeAttr(command.helpUrl)}" title="Open documentation">${escapeHtml(command.title)}</a>`
      : `<strong>${escapeHtml(command.title)}</strong>`;
    return `
                <tr>
                  <td>${titleHtml}</td>
                  <td><pre class="template-cell">${escapeHtml(command.command)}</pre></td>
                  <td title="${escapeAttr(formatDateTime(command.lastRunAt))}">${escapeHtml(timeAgo(command.lastRunAt))}</td>
                  <td><strong>×${command.runCount || 0}</strong></td>
                  <td>
                    <div class="actions-cell">
                      <button class="btn icon-btn success btn-run" data-command-id="${escapeAttr(command.id)}" title="Run command">${iconRun()}</button>
                      <button class="btn icon-btn secondary btn-use action" data-command-id="${escapeAttr(command.id)}" title="Use in terminal">${iconUse()}</button>
                      <button class="btn icon-btn secondary btn-copy action" data-command-id="${escapeAttr(command.id)}" title="Copy to clipboard">${iconCopy()}</button>
                      <button class="btn icon-btn secondary btn-edit action" data-command-id="${escapeAttr(command.id)}" title="Edit command">${iconEdit()}</button>
                    </div>
                  </td>
                </tr>
              `;
  }).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function timeAgo(isoString) {
  if (!isoString) {return '–';}
  const diff = Date.now() - new Date(isoString).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) {return 'just now';}
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;}
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {return `${hours} hour${hours !== 1 ? 's' : ''} ago`;}
  const days = Math.floor(hours / 24);
  if (days < 30) {return `${days} day${days !== 1 ? 's' : ''} ago`;}
  const months = Math.floor(days / 30);
  if (months < 12) {return `${months} month${months !== 1 ? 's' : ''} ago`;}
  return `${Math.floor(months / 12)} year${Math.floor(months / 12) !== 1 ? 's' : ''} ago`;
}

function formatDateTime(isoString) {
  if (!isoString) {return '';}
  try {
    return new Date(isoString).toLocaleString();
  } catch {
    return isoString;
  }
}

function bindEvents() {
  bindTopActions();
  bindTabs();

  // If currently editing, only bind edit tab events (regardless of activeTab)
  if (uiState.editingCommandId) {
    bindEditTabEvents();
    bindCommandActionButtons();
    return;
  }

  if (uiState.activeTab === 'recent') {
    bindRecentTabEvents();
  }

  if (uiState.activeTab === 'manage') {
    bindManageTabEvents();
  }

  if (uiState.activeTab === 'commands') {
    bindCommandsTabEvents();
  }

  if (uiState.activeTab === 'add') {
    bindAddCommandTabEvents();
  }

  bindCommandActionButtons();
}

function bindRecentTabEvents() {
  const clearRecentButton = document.getElementById('btn-clear-recent');

  if (clearRecentButton) {
    clearRecentButton.addEventListener('click', function () {
      deleteConfirmState = {
        type: 'clearRecent',
        id: null,
        title: 'All recent history will be cleared.',
        template: '',
      };
      render();
    });
  }
}

function bindTopActions() {
  const openCommandsFileButton = document.getElementById('btn-open-commands-file');
  const openGlobalVariablesFileButton = document.getElementById('btn-open-global-variables-file');
  const openLocalVariablesFileButton = document.getElementById('btn-open-local-variables-file');

  if (openCommandsFileButton) {
    openCommandsFileButton.addEventListener('click', function () {
      vscode.postMessage({type: 'openCommandsFile'});
    });
  }

  if (openGlobalVariablesFileButton) {
    openGlobalVariablesFileButton.addEventListener('click', function () {
      vscode.postMessage({type: 'openGlobalVariablesFile'});
    });
  }

  if (openLocalVariablesFileButton) {
    openLocalVariablesFileButton.addEventListener('click', function () {
      vscode.postMessage({type: 'openLocalVariablesFile'});
    });
  }
}

function bindTabs() {
  document.querySelectorAll('.tab').forEach(function (tabButton) {
    tabButton.addEventListener('click', function () {
      const nextTab = tabButton.dataset.tab;

      // Switching tabs while editing → discard editing state
      if (uiState.editingCommandId && nextTab !== uiState.activeTab) {
        uiState.editingCommandId = null;
        uiState.editCommandDraft = {title: '', template: '', description: '', groupId: ''};
      }

      uiState.activeTab = nextTab;
      render();
    });
  });
}

function bindManageTabEvents() {
  // --- Category item click (select category) ---
  document.querySelectorAll('.manage-item[data-category-id]').forEach(function (item) {
    item.addEventListener('click', function (e) {
      // Don't trigger selection if a button inside was clicked
      if (e.target.closest('button')) {
        return;
      }

      setSelectedCategory(item.dataset.categoryId);
      uiState.selectedGroupId = 'all';
      render();
    });
  });

  // --- Group item click (select group) ---
  document.querySelectorAll('.manage-item[data-group-id]').forEach(function (item) {
    item.addEventListener('click', function (e) {
      if (e.target.closest('button')) {
        return;
      }

      uiState.selectedGroupId = item.dataset.groupId;
      render();
    });
  });

  // --- Open Add Category Modal ---
  const addCategoryBtn = document.getElementById('btn-open-add-category-modal');
  if (addCategoryBtn) {
    addCategoryBtn.addEventListener('click', function () {
      manageModalState = {visible: true, mode: 'add-category', value: ''};
      render();
      const input = document.getElementById('manage-modal-input');
      if (input) {
        input.focus();
      }
    });
  }

  // --- Open Add Group Modal ---
  const addGroupBtn = document.getElementById('btn-open-add-group-modal');
  if (addGroupBtn) {
    addGroupBtn.addEventListener('click', function () {
      manageModalState = {visible: true, mode: 'add-group', value: ''};
      render();
      const input = document.getElementById('manage-modal-input');
      if (input) {
        input.focus();
      }
    });
  }

  // --- Rename Category buttons ---
  document.querySelectorAll('.btn-rename-category').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const categoryId = btn.dataset.categoryId;
      const categoryTitle = btn.dataset.categoryTitle;
      setSelectedCategory(categoryId);
      manageModalState = {visible: true, mode: 'rename-category', value: categoryTitle};
      render();
      const input = document.getElementById('manage-modal-input');
      if (input) {
        input.focus();
        input.select();
      }
    });
  });

  // --- Delete Category buttons ---
  document.querySelectorAll('.btn-delete-category').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const categoryId = btn.dataset.categoryId;
      const categoryTitle = btn.dataset.categoryTitle;
      setSelectedCategory(categoryId);
      deleteConfirmState = {
        type: 'category',
        id: categoryId,
        title: categoryTitle,
      };
      render();
    });
  });

  // --- Rename Group buttons ---
  document.querySelectorAll('.btn-rename-group').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const groupId = btn.dataset.groupId;
      const groupTitle = btn.dataset.groupTitle;
      uiState.selectedGroupId = groupId;
      manageModalState = {visible: true, mode: 'rename-group', value: groupTitle};
      render();
      const input = document.getElementById('manage-modal-input');
      if (input) {
        input.focus();
        input.select();
      }
    });
  });

  // --- Delete Group buttons ---
  document.querySelectorAll('.btn-delete-group').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const groupId = btn.dataset.groupId;
      const groupTitle = btn.dataset.groupTitle;
      uiState.selectedGroupId = groupId;
      deleteConfirmState = {
        type: 'group',
        id: groupId,
        title: groupTitle,
      };
      render();
    });
  });

  // --- Modal Confirm ---
  const modalConfirmBtn = document.getElementById('btn-manage-modal-confirm');
  if (modalConfirmBtn) {
    modalConfirmBtn.addEventListener('click', function () {
      executeManageModalConfirm();
    });
  }

  // --- Modal Cancel ---
  const modalCancelBtn = document.getElementById('btn-manage-modal-cancel');
  if (modalCancelBtn) {
    modalCancelBtn.addEventListener('click', function () {
      manageModalState = {visible: false, mode: null, value: ''};
      render();
    });
  }

  // --- Modal Input: confirm on Enter ---
  const modalInput = document.getElementById('manage-modal-input');
  if (modalInput) {
    modalInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeManageModalConfirm();
      }
      if (e.key === 'Escape') {
        manageModalState = {visible: false, mode: null, value: ''};
        render();
      }
    });
  }

  // --- Click outside modal overlay to close ---
  const modalOverlay = document.getElementById('manage-modal-overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) {
        manageModalState = {visible: false, mode: null, value: ''};
        render();
      }
    });
  }
}

function executeManageModalConfirm() {
  const input = document.getElementById('manage-modal-input');
  const value = input ? input.value.trim() : '';
  const mode = manageModalState.mode;

  if (!value) {
    showNotice('Name is required.');
    if (input) {
      input.focus();
    }
    return;
  }

  if (mode === 'add-category') {
    const newCategory = {
      id: generateEntityId('cat'),
      title: value,
      groups: [],
    };
    state.data.categories.push(newCategory);
    setSelectedCategory(newCategory.id);
    uiState.selectedGroupId = 'all';
    manageModalState = {visible: false, mode: null, value: ''};
    persistDataThenRender('Category added and saved.');
    return;
  }

  if (mode === 'rename-category') {
    const category = getSelectedCategory();
    if (category) {
      category.title = value;
    }
    manageModalState = {visible: false, mode: null, value: ''};
    persistDataThenRender('Category renamed and saved.');
    return;
  }

  if (mode === 'add-group') {
    const selectedCategory = getSelectedCategory();
    if (!selectedCategory) {
      showNotice('Select a category first.');
      return;
    }
    const newGroup = {
      id: generateEntityId('grp'),
      title: value,
    };
    selectedCategory.groups = selectedCategory.groups || [];
    selectedCategory.groups.push(newGroup);
    uiState.selectedGroupId = newGroup.id;
    manageModalState = {visible: false, mode: null, value: ''};
    persistDataThenRender('Group added and saved.');
    return;
  }

  if (mode === 'rename-group') {
    const selectedCategory = getSelectedCategory();
    if (!selectedCategory) {
      return;
    }
    const group = (selectedCategory.groups || []).find(function (g) {
      return g.id === uiState.selectedGroupId;
    });
    if (group) {
      group.title = value;
    }
    manageModalState = {visible: false, mode: null, value: ''};
    persistDataThenRender('Group renamed and saved.');
    return;
  }
}

/**
 * Generic custom dropdown renderer.
 * @param {string} wrapperId      - id for the .cs-wrap element
 * @param {string} btnId          - id for the toggle button
 * @param {string} menuId         - id for the .cs-menu element
 * @param {Array<{value:string, label:string}>} options - list of items
 * @param {string} selectedValue  - currently selected value
 * @param {string} [btnExtraClass]  - extra CSS class(es) for the button
 * @param {boolean} [menuUp]        - open the menu upward (cs-menu-up)
 * @param {string} [wrapExtraClass] - extra CSS class(es) for the .cs-wrap wrapper
 *   Use 'cs-wrap-full' to make the dropdown stretch to 100% width.
 * @returns {string} HTML string
 */
function renderCustomSelect(wrapperId, btnId, menuId, options, selectedValue, btnExtraClass, menuUp, wrapExtraClass) {
  const chevronSvg = `<svg viewBox="0 0 21 21" width="14" height="14" class="cs-chevron" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m6 9l6 6l6-6"></path></svg>`;
  const checkSvg = `<svg viewBox="0 0 24 24" width="12" height="12" class="cs-check" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6L9 17l-5-5"></path></svg>`;

  const selectedOption = options.find(function (o) {return o.value === selectedValue;});
  const selectedLabel = selectedOption ? selectedOption.label : (options.length ? options[0].label : '—');

  const items = options.map(function (opt) {
    const isSelected = opt.value === selectedValue;
    return `
      <div class="cs-item" role="menuitem" tabindex="-1" data-value="${escapeAttr(opt.value)}">
        <span class="cs-item-label">${escapeHtml(opt.label)}</span>
        ${isSelected ? checkSvg : ''}
      </div>
    `;
  }).join('');

  const menuClass = `cs-menu${menuUp ? ' cs-menu-up' : ''}`;
  const wrapClass = `cs-wrap${wrapExtraClass ? ' ' + wrapExtraClass : ''}`;

  return `
    <div class="${wrapClass}" id="${escapeAttr(wrapperId)}">
      <button class="cs-btn${btnExtraClass ? ' ' + btnExtraClass : ''}" type="button" aria-haspopup="menu" aria-expanded="false" id="${escapeAttr(btnId)}">
        <span class="cs-btn-label">${escapeHtml(selectedLabel)}</span>
        ${chevronSvg}
      </button>
      <div class="${menuClass}" role="menu" id="${escapeAttr(menuId)}" hidden>
        ${items}
      </div>
    </div>
  `;
}

/**
 * Generic custom dropdown event binder.
 * @param {string} wrapperId - id of the .cs-wrap element
 * @param {string} btnId     - id of the toggle button
 * @param {string} menuId    - id of the .cs-menu element
 * @param {function(string):void} onChange - callback receiving the selected value
 */
function bindCustomSelect(wrapperId, btnId, menuId, onChange) {
  const wrap = document.getElementById(wrapperId);
  const btn = document.getElementById(btnId);
  const menu = document.getElementById(menuId);

  if (!btn || !menu) {return;}

  function closeMenu() {
    if (!menu.hidden) {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }
    document.removeEventListener('pointerdown', onPointerDown, true);
    window.removeEventListener('blur', onWindowBlur);
  }

  function onPointerDown(e) {
    if (wrap && !wrap.contains(e.target)) {closeMenu();}
  }

  function onWindowBlur() {closeMenu();}

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (!menu.hidden) {
      closeMenu();
    } else {
      menu.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      document.addEventListener('pointerdown', onPointerDown, true);
      window.addEventListener('blur', onWindowBlur);
    }
  });

  var checkSvgHtml = '<svg viewBox="0 0 24 24" width="12" height="12" class="cs-check" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6L9 17l-5-5"></path></svg>';

  menu.querySelectorAll('.cs-item').forEach(function (item) {
    item.addEventListener('click', function () {
      // Update button label to reflect the newly selected item
      var labelEl = btn.querySelector('.cs-btn-label');
      var itemLabelEl = item.querySelector('.cs-item-label');
      if (labelEl && itemLabelEl) {
        labelEl.textContent = itemLabelEl.textContent;
      }
      // Move the checkmark to the newly selected item
      menu.querySelectorAll('.cs-check').forEach(function (el) {el.remove();});
      item.insertAdjacentHTML('beforeend', checkSvgHtml);
      onChange(item.dataset.value);
      closeMenu();
    });
    item.addEventListener('mouseenter', function () {item.setAttribute('data-highlighted', '');});
    item.addEventListener('mouseleave', function () {item.removeAttribute('data-highlighted');});
  });
}

function renderCustomCategorySelect() {
  const categories = state.data.categories || [];
  const selected = getSelectedCategory();
  const selectedTitle = selected ? selected.title : 'Select category';

  // SVG: chevron down (from button.html)
  const chevronSvg = `<svg viewBox="0 0 21 21" width="17" height="17" class="cs-chevron" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m6 9l6 6l6-6"></path></svg>`;

  // SVG: checkmark (from popup-floating-menu.html)
  const checkSvg = `<svg viewBox="0 0 24 24" width="17" height="17" class="cs-check" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6L9 17l-5-5"></path></svg>`;

  const items = categories.map(function (category) {
    const isSelected = category.id === uiState.selectedCategoryId;
    return `
      <div class="cs-item" role="menuitem" tabindex="-1" data-value="${escapeAttr(category.id)}">
        <span class="cs-item-label">${escapeHtml(category.title)}</span>
        ${isSelected ? checkSvg : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="cs-wrap" id="custom-category-select">
      <button class="cs-btn" type="button" aria-haspopup="menu" aria-expanded="false" id="cs-btn-toggle">
        <span class="cs-btn-label">${escapeHtml(selectedTitle)}</span>
        ${chevronSvg}
      </button>
      <div class="cs-menu" role="menu" id="cs-menu" hidden>
        ${items}
      </div>
    </div>
  `;
}

function renderColumnToggleDropdown() {
  const columnSvg = `<svg viewBox="0 0 24 24" width="14" height="14" class="col-toggle-icon" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="18" rx="1"/></svg>`;
  const chevronSvg = `<svg viewBox="0 0 21 21" width="14" height="14" class="cs-chevron" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m6 9l6 6l6-6"></path></svg>`;

  const columns = [
    {key: 'description', label: 'Description'},
    {key: 'groups', label: 'Groups'},
  ];

  const items = columns.map(function (col) {
    const checked = uiState.columnVisibility[col.key];
    return `
      <label class="col-toggle-item" data-col-key="${escapeAttr(col.key)}">
        <input type="checkbox" class="col-toggle-checkbox" data-col-key="${escapeAttr(col.key)}" ${checked ? 'checked' : ''} />
        <span class="col-toggle-label">${escapeHtml(col.label)}</span>
      </label>
    `;
  }).join('');

  return `
    <div class="cs-wrap col-toggle-wrap" id="col-toggle-wrap">
      <button class="cs-btn cs-btn-col-toggle" type="button" aria-haspopup="menu" aria-expanded="false" id="col-toggle-btn" title="Show/Hide Columns">
        ${columnSvg}
        <span class="cs-btn-label col-toggle-btn-label">Columns</span>
        ${chevronSvg}
      </button>
      <div class="cs-menu col-toggle-menu" id="col-toggle-menu" hidden>
        <div class="col-toggle-header">Show/Hide Columns</div>
        ${items}
      </div>
    </div>
  `;
}

function bindCommandsTabEvents() {
  // --- Custom category select ---
  const csWrap = document.getElementById('custom-category-select');
  const csBtn = document.getElementById('cs-btn-toggle');
  const csMenu = document.getElementById('cs-menu');

  if (csBtn && csMenu) {
    // Helper: close the menu and remove listeners
    function closeMenu() {
      if (!csMenu.hidden) {
        csMenu.hidden = true;
        csBtn.setAttribute('aria-expanded', 'false');
      }
      document.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('blur', onWindowBlur);
    }

    // Pointer down anywhere outside the wrap → close
    function onPointerDown(e) {
      if (csWrap && !csWrap.contains(e.target)) {
        closeMenu();
      }
    }

    // Window loses focus (user clicks outside VS Code / webview) → close
    function onWindowBlur() {
      closeMenu();
    }

    // Toggle open/close
    csBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = !csMenu.hidden;

      if (isOpen) {
        closeMenu();
      } else {
        csMenu.hidden = false;
        csBtn.setAttribute('aria-expanded', 'true');
        // Register outside-click and blur listeners
        document.addEventListener('pointerdown', onPointerDown, true);
        window.addEventListener('blur', onWindowBlur);
      }
    });

    // Item click → select + close
    csMenu.querySelectorAll('.cs-item').forEach(function (item) {
      item.addEventListener('click', function () {
        setSelectedCategory(item.dataset.value);
        uiState.selectedGroupId = 'all';
        closeMenu();
        render();
      });

      // Hover: add/remove data-highlighted
      item.addEventListener('mouseenter', function () {
        item.setAttribute('data-highlighted', '');
      });
      item.addEventListener('mouseleave', function () {
        item.removeAttribute('data-highlighted');
      });
    });
  }

  document.querySelectorAll('.group-filter-tag').forEach(function (tagButton) {
    tagButton.addEventListener('click', function () {
      uiState.selectedGroupId = tagButton.dataset.groupId;
      render();
    });
  });

  // --- Column Toggle Dropdown ---
  const colToggleWrap = document.getElementById('col-toggle-wrap');
  const colToggleBtn = document.getElementById('col-toggle-btn');
  const colToggleMenu = document.getElementById('col-toggle-menu');

  if (colToggleBtn && colToggleMenu) {
    function closeColMenu() {
      if (!colToggleMenu.hidden) {
        colToggleMenu.hidden = true;
        colToggleBtn.setAttribute('aria-expanded', 'false');
      }
      document.removeEventListener('pointerdown', onColPointerDown, true);
    }

    function onColPointerDown(e) {
      if (colToggleWrap && !colToggleWrap.contains(e.target)) {
        closeColMenu();
      }
    }

    colToggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = !colToggleMenu.hidden;
      if (isOpen) {
        closeColMenu();
      } else {
        colToggleMenu.hidden = false;
        colToggleBtn.setAttribute('aria-expanded', 'true');
        document.addEventListener('pointerdown', onColPointerDown, true);
      }
    });

    // Checkbox change → update state + re-render table only (keep menu open)
    colToggleMenu.querySelectorAll('.col-toggle-checkbox').forEach(function (checkbox) {
      checkbox.addEventListener('change', function (e) {
        // Stop propagation so the pointerdown outside-click doesn't fire and close the menu
        e.stopPropagation();
        const colKey = checkbox.dataset.colKey;
        if (colKey && Object.prototype.hasOwnProperty.call(uiState.columnVisibility, colKey)) {
          uiState.columnVisibility[colKey] = checkbox.checked;
          // Persist to localStorage
          try {
            localStorage.setItem('columnVisibility', JSON.stringify(uiState.columnVisibility));
          } catch { }
          // Re-render just the table panel without closing the menu
          const tablePanel = document.querySelector('.table-panel');
          if (tablePanel) {
            const groups = getSelectedCategoryGroups();
            const commands = getVisibleCommands();
            tablePanel.innerHTML = renderCommandsTable(commands, groups);
            bindCommandActionButtons();
          }
        }
      });
    });
  }
}

function bindAddCommandTabEvents() {
  const newCommandForm = document.getElementById('form-new-command');
  const cancelButton = document.getElementById('btn-cancel-add-command');

  const newCommandTitleInput = document.getElementById('new-command-title');
  const newCommandTemplateInput = document.getElementById('new-command-template');
  const newCommandDescriptionInput = document.getElementById('new-command-description');
  const newCommandHelpUrlInput = document.getElementById('new-command-help-url');

  if (newCommandTitleInput) {
    newCommandTitleInput.addEventListener('input', function () {
      uiState.newCommandDraft.title = newCommandTitleInput.value;
    });
  }

  if (newCommandTemplateInput) {
    newCommandTemplateInput.addEventListener('input', function () {
      uiState.newCommandDraft.template = newCommandTemplateInput.value;
      // Preserve cursor position before re-render
      const cursorStart = newCommandTemplateInput.selectionStart;
      const cursorEnd = newCommandTemplateInput.selectionEnd;
      render();
      // Restore focus and cursor after re-render
      const restored = document.getElementById('new-command-template');
      if (restored) {
        restored.focus();
        restored.setSelectionRange(cursorStart, cursorEnd);
      }
    });
  }

  if (newCommandDescriptionInput) {
    newCommandDescriptionInput.addEventListener('input', function () {
      uiState.newCommandDraft.description = newCommandDescriptionInput.value;
    });
  }

  if (newCommandHelpUrlInput) {
    newCommandHelpUrlInput.addEventListener('input', function () {
      uiState.newCommandDraft.helpUrl = newCommandHelpUrlInput.value;
    });
  }

  // --- Enum Manager buttons (in Add Command tab) ---
  document.querySelectorAll('.btn-open-enum-manager').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const varName = btn.dataset.varName;
      const commandId = btn.dataset.commandId || null;

      // Get current enum values for this variable from the appropriate source
      let currentEnumValues = [];
      if (commandId === null || commandId === '') {
        // New command context
        const meta = uiState.newCommandDraft.variableMeta && uiState.newCommandDraft.variableMeta[varName];
        currentEnumValues = (meta && meta.type === 'enum' && meta.enumValues) ? meta.enumValues.map(function (e) {return Object.assign({}, e);}) : [];
      } else {
        // Edit command context
        const meta = uiState.editCommandDraft.variableMeta && uiState.editCommandDraft.variableMeta[varName];
        currentEnumValues = (meta && meta.type === 'enum' && meta.enumValues) ? meta.enumValues.map(function (e) {return Object.assign({}, e);}) : [];
      }

      enumManagerState = {
        visible: true,
        commandId: commandId === '' ? null : commandId,
        varName,
        enumValues: currentEnumValues,
        editIndex: null,
        editTitle: '',
        editValue: '',
        editDescription: '',
      };
      render();
    });
  });

  // --- Variable inputs in Add Command tab ---
  document.querySelectorAll('.variable-input[data-command-id="__new__"]').forEach(function (input) {
    input.addEventListener('input', function () {
      const variableName = input.dataset.variableName;
      const draft = getCommandDraft('__new__');
      draft[variableName] = input.value;
      uiState.commandDrafts['__new__'] = draft;
    });
  });

  // --- Toggle switches in Add Command tab ---
  document.querySelectorAll('.variable-remember-toggle[data-command-id="__new__"]').forEach(function (container) {
    container.querySelectorAll('.toggle-option-3').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.disabled) {return;}
        container.querySelectorAll('.toggle-option-3').forEach(function (b) {b.classList.remove('active');});
        btn.classList.add('active');
        const variableName = container.dataset.variableName;
        const value = btn.dataset.value;
        const rememberMap = getCommandRemember('__new__');
        rememberMap[variableName] = value;
        uiState.commandRemember['__new__'] = rememberMap;
      });
    });
  });

  document.querySelectorAll('.new-command-group-tag').forEach(function (tagButton) {
    tagButton.addEventListener('click', function () {
      const groupId = tagButton.dataset.groupId;
      uiState.newCommandDraft.groupId = uiState.newCommandDraft.groupId === groupId ? '' : groupId;
      render();
    });
  });

  if (cancelButton) {
    cancelButton.addEventListener('click', function () {
      uiState.newCommandDraft = {visible: false, title: '', template: '', description: '', groupId: '', helpUrl: '', variableMeta: {}};
      delete uiState.commandDrafts['__new__'];
      delete uiState.commandRemember['__new__'];
      uiState.activeTab = 'commands';
      render();
    });
  }

  if (newCommandForm) {
    newCommandForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const selectedCategory = getSelectedCategory();

      if (!selectedCategory) {
        showNotice('Select category first.');
        render();
        return;
      }

      const titleInput = document.getElementById('new-command-title');
      const descriptionInput = document.getElementById('new-command-description');
      const templateInput = document.getElementById('new-command-template');
      const helpUrlInputEl = document.getElementById('new-command-help-url');

      const title = titleInput ? titleInput.value.trim() : '';
      const description = descriptionInput ? descriptionInput.value.trim() : '';
      const commandTemplate = templateInput ? templateInput.value.trim() : '';
      const helpUrl = helpUrlInputEl ? helpUrlInputEl.value.trim() : '';
      const groupId = uiState.newCommandDraft.groupId;
      const variableMeta = uiState.newCommandDraft.variableMeta || {};

      if (title.length < 3) {
        showError('Command Title must be at least 3 characters.');
        render();
        return;
      }

      if (!commandTemplate) {
        showError('Command Template is required.');
        render();
        return;
      }

      if (!groupId) {
        showError('⚠️ Please select at least one group from the list below.');
        render();
        return;
      }

      const newCommand = {
        id: generateEntityId('cmd'),
        title,
        description,
        command: commandTemplate,
        categoryId: selectedCategory.id,
        groupId,
        ...(helpUrl ? {helpUrl} : {}),
        ...(Object.keys(variableMeta).length > 0 ? {variableMeta} : {}),
      };

      const newCommandId = newCommand.id;
      state.data.commands.push(newCommand);

      // Read latest variable values from DOM before state is cleared
      document.querySelectorAll('.variable-input[data-command-id="__new__"]').forEach(function (varInput) {
        const vname = varInput.dataset.variableName;
        if (vname) {
          const d = getCommandDraft('__new__');
          d[vname] = varInput.value;
        }
      });

      // Read latest toggle states from DOM
      document.querySelectorAll('.variable-remember-toggle[data-command-id="__new__"]').forEach(function (container) {
        const vname = container.dataset.variableName;
        const activeBtn = container.querySelector('.toggle-option-3.active');
        if (vname && activeBtn) {
          const rm = getCommandRemember('__new__');
          rm[vname] = activeBtn.dataset.value;
        }
      });

      // Transfer variable data from '__new__' to the real newCommandId
      if (uiState.commandDrafts['__new__']) {
        uiState.commandDrafts[newCommandId] = uiState.commandDrafts['__new__'];
        delete uiState.commandDrafts['__new__'];
      }
      if (uiState.commandRemember['__new__']) {
        uiState.commandRemember[newCommandId] = uiState.commandRemember['__new__'];
        delete uiState.commandRemember['__new__'];
      }

      uiState.newCommandDraft = {visible: false, title: '', template: '', description: '', groupId: '', helpUrl: '', variableMeta: {}};
      uiState.activeTab = 'commands';
      uiState.pendingScrollCommandId = newCommandId;
      persistDataThenRender('Command added and saved.');
      persistCommandVariables();
    });
  }
}

function bindEditTabEvents() {
  const command = getEditingCommand();
  const form = document.getElementById('form-edit-command');

  if (!command || !form) {
    return;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    syncEditCommandDraftFromDom();
    const draft = uiState.editCommandDraft;

    const titleTrimmed = draft.title ? draft.title.trim() : '';
    const templateTrimmed = draft.template ? draft.template.trim() : '';

    if (titleTrimmed.length < 3) {
      showError('Command Title must be at least 3 characters.');
      render();
      return;
    }

    if (!templateTrimmed) {
      showError('Command Template is required.');
      render();
      return;
    }

    // Apply trimmed values
    draft.title = titleTrimmed;
    draft.template = templateTrimmed;

    if (!draft.groupId) {
      showError('⚠️ Please select at least one group from the list below.');
      render();
      return;
    }

    command.title = draft.title;
    command.description = draft.description;
    command.command = draft.template;
    command.groupId = draft.groupId;

    // Apply category move if changed
    if (draft.targetCategoryId && draft.targetCategoryId !== command.categoryId) {
      command.categoryId = draft.targetCategoryId;
    }

    // Save helpUrl
    if (draft.helpUrl) {
      command.helpUrl = draft.helpUrl;
    } else {
      delete command.helpUrl;
    }

    // Read variable values from DOM before re-render
    document.querySelectorAll('.variable-input').forEach(function (varInput) {
      const cid = varInput.dataset.commandId;
      const vname = varInput.dataset.variableName;
      if (cid && vname) {
        const d = getCommandDraft(cid);
        d[vname] = varInput.value;
        uiState.commandDrafts[cid] = d;
      }
    });

    // Read toggle states from DOM before re-render
    document.querySelectorAll('.variable-remember-toggle').forEach(function (container) {
      const cid = container.dataset.commandId;
      const vname = container.dataset.variableName;
      const activeBtn = container.querySelector('.toggle-option-3.active');
      if (cid && vname && activeBtn) {
        const rm = getCommandRemember(cid);
        rm[vname] = activeBtn.dataset.value;
        uiState.commandRemember[cid] = rm;
      }
    });

    const savedCommandId = command.id;
    const returnTab = uiState.editSourceTab || 'commands';
    uiState.editingCommandId = null;
    uiState.editCommandDraft = {title: '', template: '', description: '', groupId: ''};
    uiState.editSourceTab = null;
    uiState.activeTab = returnTab;
    uiState.pendingScrollCommandId = savedCommandId;
    persistDataThenRender('Command updated and saved.');
    persistCommandVariables();
  });

  const cancelEditButton = document.getElementById('btn-cancel-edit-command');
  if (cancelEditButton) {
    cancelEditButton.addEventListener('click', function () {
      const savedCommandId = command.id;
      const returnTab = uiState.editSourceTab || 'commands';
      uiState.editingCommandId = null;
      uiState.editCommandDraft = {title: '', template: '', description: '', groupId: ''};
      uiState.editSourceTab = null;
      uiState.activeTab = returnTab;
      uiState.pendingScrollCommandId = savedCommandId;
      render();
    });
  }

  const editCommandTitleInput = document.getElementById('edit-command-title');
  const editCommandTemplateInput = document.getElementById('edit-command-template');
  const editCommandDescriptionInput = document.getElementById('edit-command-description');

  if (editCommandTitleInput) {
    editCommandTitleInput.addEventListener('input', function () {
      uiState.editCommandDraft.title = editCommandTitleInput.value;
    });
  }

  if (editCommandTemplateInput) {
    editCommandTemplateInput.addEventListener('input', function () {
      uiState.editCommandDraft.template = editCommandTemplateInput.value;
      // Preserve cursor position before re-render (to update variables section)
      const cursorStart = editCommandTemplateInput.selectionStart;
      const cursorEnd = editCommandTemplateInput.selectionEnd;
      render();
      // Restore focus and cursor after re-render
      const restored = document.getElementById('edit-command-template');
      if (restored) {
        restored.focus();
        restored.setSelectionRange(cursorStart, cursorEnd);
      }
    });
  }

  if (editCommandDescriptionInput) {
    editCommandDescriptionInput.addEventListener('input', function () {
      uiState.editCommandDraft.description = editCommandDescriptionInput.value;
    });
  }

  document.querySelectorAll('.edit-command-group-tag').forEach(function (tabButton) {
    tabButton.addEventListener('click', function () {
      const groupId = tabButton.dataset.groupId;
      uiState.editCommandDraft.groupId = uiState.editCommandDraft.groupId === groupId ? '' : groupId;
      render();
    });
  });

  document.querySelectorAll('.variable-input').forEach(function (input) {
    input.addEventListener('input', function () {
      const commandId = input.dataset.commandId;
      const variableName = input.dataset.variableName;
      const draft = getCommandDraft(commandId);
      draft[variableName] = input.value;
      uiState.commandDrafts[commandId] = draft;
      // No auto-save here — save happens on form submit
    });
  });

  // Bind category selector in edit tab (custom select)
  bindCustomSelect(
    'edit-category-select-wrap',
    'edit-category-select-btn',
    'edit-category-select-menu',
    function (newCategoryId) {
      uiState.editCommandDraft.targetCategoryId = newCategoryId;
      // If the user reverts to the original category, restore the original groupId
      if (newCategoryId === command.categoryId) {
        uiState.editCommandDraft.groupId = command.groupId || '';
      } else {
        uiState.editCommandDraft.groupId = ''; // reset group — it belongs to the new category
      }
      render();
    }
  );

  // Bind helpUrl input in edit tab
  const editHelpUrlInput = document.getElementById('edit-command-help-url');
  if (editHelpUrlInput) {
    editHelpUrlInput.addEventListener('input', function () {
      uiState.editCommandDraft.helpUrl = editHelpUrlInput.value;
    });
  }

  // Bind Enum Manager buttons in edit tab
  document.querySelectorAll('.btn-open-enum-manager').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const varName = btn.dataset.varName;
      const commandId = btn.dataset.commandId || null;

      let currentEnumValues = [];
      if (commandId === null || commandId === '') {
        const meta = uiState.newCommandDraft.variableMeta && uiState.newCommandDraft.variableMeta[varName];
        currentEnumValues = (meta && meta.type === 'enum' && meta.enumValues) ? meta.enumValues.map(function (e) {return Object.assign({}, e);}) : [];
      } else {
        const meta = uiState.editCommandDraft.variableMeta && uiState.editCommandDraft.variableMeta[varName];
        currentEnumValues = (meta && meta.type === 'enum' && meta.enumValues) ? meta.enumValues.map(function (e) {return Object.assign({}, e);}) : [];
      }

      enumManagerState = {
        visible: true,
        commandId: commandId === '' ? null : commandId,
        varName,
        enumValues: currentEnumValues,
        editIndex: null,
        editTitle: '',
        editValue: '',
        editDescription: '',
      };
      render();
    });
  });

  // Bind toggle switches in edit tab — update state only, no auto-save
  document.querySelectorAll('.variable-remember-toggle').forEach(function (container) {
    container.querySelectorAll('.toggle-option-3').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.disabled) {
          return;
        }

        container.querySelectorAll('.toggle-option-3').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        const commandId = container.dataset.commandId;
        const variableName = container.dataset.variableName;
        const value = btn.dataset.value;

        const rememberMap = getCommandRemember(commandId);
        rememberMap[variableName] = value;
        uiState.commandRemember[commandId] = rememberMap;
        // No auto-save here — save happens on form submit
      });
    });
  });
}

function syncNewCommandDraftFromDom() {
  const titleInput = document.getElementById('new-command-title');
  const templateInput = document.getElementById('new-command-template');
  const descriptionInput = document.getElementById('new-command-description');

  if (titleInput) {
    uiState.newCommandDraft.title = titleInput.value;
  }

  if (templateInput) {
    uiState.newCommandDraft.template = templateInput.value;
  }

  if (descriptionInput) {
    uiState.newCommandDraft.description = descriptionInput.value;
  }
}

function bindCommandActionButtons() {
  document.querySelectorAll('.btn-run').forEach(function (button) {
    button.addEventListener('click', function () {
      syncEditCommandDraftFromDom();
      const commandId = button.dataset.commandId;
      const command = (state.data.commands || []).find(function (item) {
        return item.id === commandId;
      });

      if (!command) {
        return;
      }

      const missing = getMissingVariables(command);

      if (missing.length > 0) {
        const allVars = collectVariables([command.command]).filter(function (name) {
          return name !== 'workspaceFolder';
        });
        const draft = getCommandDraft(commandId);
        const rememberMap = getCommandRemember(commandId);
        const inputValues = {};
        const rememberFlags = {};
        allVars.forEach(function (name) {
          inputValues[name] = draft[name] || '';
          rememberFlags[name] = rememberMap[name] || 'off';
        });
        variableInputState = {
          commandId,
          action: 'run',
          missingVariables: allVars,
          inputValues,
          rememberFlags,
          returnToRunConfirm: false,
        };
        render();
        return;
      }

      runConfirmState = {
        commandId,
        resolvedCommand: resolveCommandTemplate(command),
        selectedShellPath: runConfirmState.selectedShellPath,
        selectedShellName: runConfirmState.selectedShellName,
      };

      render();
    });
  });

  document.querySelectorAll('.btn-use').forEach(function (button) {
    button.addEventListener('click', function () {
      syncEditCommandDraftFromDom();
      performCommandAction(button.dataset.commandId, 'use');
    });
  });

  document.querySelectorAll('.btn-copy').forEach(function (button) {
    button.addEventListener('click', function () {
      syncEditCommandDraftFromDom();
      performCommandAction(button.dataset.commandId, 'copy');
    });
  });

  document.querySelectorAll('.btn-edit').forEach(function (button) {
    button.addEventListener('click', function () {
      const commandId = button.dataset.commandId;
      const command = (state.data.commands || []).find(function (item) {
        return item.id === commandId;
      });

      // Save the tab we came from so we can return to it
      uiState.editSourceTab = uiState.activeTab;
      uiState.editingCommandId = commandId;

      if (command) {
        uiState.editCommandDraft = {
          title: command.title || '',
          template: command.command || '',
          description: command.description || '',
          groupId: command.groupId || '',
          helpUrl: command.helpUrl || '',
          variableMeta: command.variableMeta ? JSON.parse(JSON.stringify(command.variableMeta)) : {},
          targetCategoryId: command.categoryId || '',
        };
      }

      // Do NOT change activeTab — keep it as-is, tabs will show no active selection
      render();
    });
  });

  document.querySelectorAll('.btn-delete-command').forEach(function (button) {
    button.addEventListener('click', function () {
      const commandId = button.dataset.commandId;
      const command = (state.data.commands || []).find(function (item) {
        return item.id === commandId;
      });

      deleteConfirmState = {
        type: 'command',
        id: commandId,
        title: command ? command.title : commandId,
        template: command ? command.command : '',
      };
      render();
    });
  });

  const confirmRunYesButton = document.getElementById('btn-confirm-run-yes');
  const confirmRunNoButton = document.getElementById('btn-confirm-run-no');
  const confirmRunVariablesButton = document.getElementById('btn-confirm-run-variables');

  // --- Shell selector dropdown ---
  const shellSelectorWrap = document.getElementById('shell-selector-wrap');
  const shellSelectorBtn = document.getElementById('shell-selector-btn');
  const shellSelectorMenu = document.getElementById('shell-selector-menu');

  if (shellSelectorBtn && shellSelectorMenu) {
    function closeShellMenu() {
      if (!shellSelectorMenu.hidden) {
        shellSelectorMenu.hidden = true;
        shellSelectorBtn.setAttribute('aria-expanded', 'false');
      }
      document.removeEventListener('pointerdown', onShellPointerDown, true);
    }

    function onShellPointerDown(e) {
      if (shellSelectorWrap && !shellSelectorWrap.contains(e.target)) {
        closeShellMenu();
      }
    }

    shellSelectorBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = !shellSelectorMenu.hidden;
      if (isOpen) {
        closeShellMenu();
      } else {
        shellSelectorMenu.hidden = false;
        shellSelectorBtn.setAttribute('aria-expanded', 'true');
        document.addEventListener('pointerdown', onShellPointerDown, true);
      }
    });

    shellSelectorMenu.querySelectorAll('.cs-item').forEach(function (item) {
      item.addEventListener('click', function () {
        runConfirmState.selectedShellName = item.dataset.shellName || null;
        runConfirmState.selectedShellPath = item.dataset.shellPath || null;
        closeShellMenu();
        render();
      });

      item.addEventListener('mouseenter', function () {
        item.setAttribute('data-highlighted', '');
      });
      item.addEventListener('mouseleave', function () {
        item.removeAttribute('data-highlighted');
      });
    });
  }

  if (confirmRunYesButton) {
    confirmRunYesButton.addEventListener('click', function () {
      const commandId = runConfirmState.commandId;
      const shellPath = runConfirmState.selectedShellPath || null;
      const shellName = runConfirmState.selectedShellName || null;
      runConfirmState = {commandId: null, resolvedCommand: '', selectedShellPath: shellPath, selectedShellName: shellName};
      render();

      if (!commandId) {
        return;
      }

      dispatchCommandAction(commandId, 'run', shellPath, shellName);
    });
  }

  if (confirmRunNoButton) {
    confirmRunNoButton.addEventListener('click', function () {
      runConfirmState = {commandId: null, resolvedCommand: ''};
      render();
    });
  }

  if (confirmRunVariablesButton) {
    confirmRunVariablesButton.addEventListener('click', function () {
      const commandId = runConfirmState.commandId;

      if (!commandId) {
        return;
      }

      const command = (state.data.commands || []).find(function (item) {
        return item.id === commandId;
      });

      if (!command) {
        return;
      }

      const allVars = collectVariables([command.command]).filter(function (name) {
        return name !== 'workspaceFolder';
      });

      const draft = getCommandDraft(commandId);
      const rememberMap = getCommandRemember(commandId);
      const inputValues = {};
      const rememberFlags = {};

      allVars.forEach(function (name) {
        inputValues[name] = draft[name] || '';
        rememberFlags[name] = rememberMap[name] || 'off';
      });

      variableInputState = {
        commandId,
        action: 'run',
        missingVariables: allVars,
        inputValues,
        rememberFlags,
        returnToRunConfirm: true,
      };

      render();
    });
  }

  // Bind custom selects for enum variables in variable input modal
  document.querySelectorAll('.enum-input-wrap[data-variable-name]').forEach(function (wrapEl) {
    const varName = wrapEl.dataset.variableName;
    if (!varName) {return;}
    bindCustomSelect(
      'enum-var-wrap-' + varName,
      'enum-var-btn-' + varName,
      'enum-var-menu-' + varName,
      function (selectedValue) {
        const customInput = wrapEl.querySelector('.variable-modal-custom-input');
        if (selectedValue === '__custom__') {
          if (customInput) {
            customInput.classList.remove('hidden');
            customInput.focus();
          }
        } else {
          if (customInput) {
            customInput.classList.add('hidden');
            customInput.value = selectedValue;
          }
          variableInputState.inputValues[varName] = selectedValue;
        }
      }
    );
  });

  // Bind toggle switches in variable input modal
  document.querySelectorAll('.variable-modal-remember-toggle').forEach(function (container) {
    container.querySelectorAll('.toggle-option-3').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.disabled) {
          return;
        }

        container.querySelectorAll('.toggle-option-3').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        const varName = container.dataset.variableName;
        variableInputState.rememberFlags[varName] = btn.dataset.value;
      });
    });
  });

  var variableInputConfirmButton = document.getElementById('btn-variable-input-confirm');
  var variableInputCancelButton = document.getElementById('btn-variable-input-cancel');

  if (variableInputConfirmButton) {
    variableInputConfirmButton.addEventListener('click', function () {
      const commandId = variableInputState.commandId;
      const action = variableInputState.action;
      const returnToRunConfirm = variableInputState.returnToRunConfirm;

      if (!commandId || !action) {
        variableInputState = {commandId: null, action: null, missingVariables: [], inputValues: {}, rememberFlags: {}, returnToRunConfirm: false};
        render();
        return;
      }

      // Collect current values from the modal DOM
      document.querySelectorAll('.variable-modal-input').forEach(function (input) {
        const varName = input.dataset.variableName;
        variableInputState.inputValues[varName] = input.value;
      });

      // Collect remember flags from toggle switches in the modal DOM
      document.querySelectorAll('.variable-modal-remember-toggle').forEach(function (container) {
        const varName = container.dataset.variableName;
        const activeBtn = container.querySelector('.toggle-option-3.active');
        variableInputState.rememberFlags[varName] = activeBtn ? activeBtn.dataset.value : 'off';
      });

      // Apply input values to commandDraft
      const draft = getCommandDraft(commandId);
      Object.keys(variableInputState.inputValues).forEach(function (varName) {
        draft[varName] = variableInputState.inputValues[varName];
      });
      uiState.commandDrafts[commandId] = draft;

      // Apply remember flags
      const rememberMap = getCommandRemember(commandId);
      Object.keys(variableInputState.rememberFlags).forEach(function (varName) {
        rememberMap[varName] = variableInputState.rememberFlags[varName];
      });
      uiState.commandRemember[commandId] = rememberMap;

      // Persist if any flag is not 'off'
      const hasToSave = Object.values(variableInputState.rememberFlags).some(function (v) {
        return v !== 'off';
      });
      if (hasToSave) {
        persistCommandVariables();
      }

      // Close variable input modal
      variableInputState = {commandId: null, action: null, missingVariables: [], inputValues: {}, rememberFlags: {}, returnToRunConfirm: false};

      if (action === 'run') {
        const command = (state.data.commands || []).find(function (item) {
          return item.id === commandId;
        });

        if (command) {
          runConfirmState = {
            commandId,
            resolvedCommand: resolveCommandTemplate(command),
            selectedShellPath: runConfirmState.selectedShellPath,
            selectedShellName: runConfirmState.selectedShellName,
          };
        }

        render();
        return;
      }

      render();
      dispatchCommandAction(commandId, action, null, null);
    });
  }

  if (variableInputCancelButton) {
    variableInputCancelButton.addEventListener('click', function () {
      const returnToRunConfirm = variableInputState.returnToRunConfirm;
      variableInputState = {commandId: null, action: null, missingVariables: [], inputValues: {}, rememberFlags: {}, returnToRunConfirm: false};

      if (!returnToRunConfirm) {
        runConfirmState = {commandId: null, resolvedCommand: ''};
      }

      render();
    });
  }

  var confirmDeleteYesButton = document.getElementById('btn-confirm-delete-yes');
  var confirmDeleteNoButton = document.getElementById('btn-confirm-delete-no');

  if (confirmDeleteYesButton) {
    confirmDeleteYesButton.addEventListener('click', function () {
      executeDeleteConfirm();
    });
  }

  if (confirmDeleteNoButton) {
    confirmDeleteNoButton.addEventListener('click', function () {
      deleteConfirmState = {type: null, id: null, title: '', template: ''};
      render();
    });
  }
}

/** Execute the pending delete action based on deleteConfirmState */
function executeDeleteConfirm() {
  var type = deleteConfirmState.type;
  var id = deleteConfirmState.id;

  deleteConfirmState = {type: null, id: null, title: '', template: ''};

  if (type === 'clearRecent') {
    (state.data.commands || []).forEach(function (cmd) {
      delete cmd.lastRunAt;
      delete cmd.runCount;
    });
    persistDataThenRender('Recent history cleared.');
    return;
  }

  if (type === 'category') {
    state.data.categories = (state.data.categories || []).filter(function (category) {
      return category.id !== id;
    });

    state.data.commands = (state.data.commands || []).filter(function (command) {
      return command.categoryId !== id;
    });

    if (uiState.selectedCategoryId === id) {
      uiState.selectedCategoryId = '';
      uiState.selectedGroupId = 'all';
    }

    if (uiState.editingCommandId) {
      var editCmd = (state.data.commands || []).find(function (c) {
        return c.id === uiState.editingCommandId;
      });

      if (!editCmd) {
        uiState.editingCommandId = null;
        uiState.editCommandDraft = {title: '', template: '', description: '', groupId: ''};
      }
    }

    persistDataThenRender('Category deleted and saved.');
    return;
  }

  if (type === 'group') {
    var selectedCategory = getSelectedCategory();

    if (selectedCategory) {
      selectedCategory.groups = (selectedCategory.groups || []).filter(function (group) {
        return group.id !== id;
      });

      (state.data.commands || []).forEach(function (command) {
        if (command.categoryId === selectedCategory.id && command.groupId === id) {
          command.groupId = '';
        }
      });
    }

    if (uiState.selectedGroupId === id) {
      uiState.selectedGroupId = 'all';
    }

    persistDataThenRender('Group deleted and saved.');
    return;
  }

  if (type === 'command') {
    state.data.commands = (state.data.commands || []).filter(function (command) {
      return command.id !== id;
    });

    delete uiState.commandDrafts[id];
    delete uiState.commandRemember[id];

    if (state.commandVariables.commands && Object.prototype.hasOwnProperty.call(state.commandVariables.commands, id)) {
      delete state.commandVariables.commands[id];
    }

    if (state.globalCommandVariables && state.globalCommandVariables.commands && Object.prototype.hasOwnProperty.call(state.globalCommandVariables.commands, id)) {
      delete state.globalCommandVariables.commands[id];
    }

    if (uiState.editingCommandId === id) {
      uiState.editingCommandId = null;
      uiState.editCommandDraft = {title: '', template: '', description: '', groupId: ''};
      runConfirmState = {commandId: null, resolvedCommand: ''};
      uiState.activeTab = 'commands';
    }

    persistDataThenRender('Command deleted and saved.');
    return;
  }
}

function persistDataThenRender(successMessage) {
  showNotice(successMessage);
  render();
  vscode.postMessage({type: 'saveData', payload: state.data});
}

function persistCommandVariables() {
  const payload = buildCommandVariablesPayload();
  vscode.postMessage({type: 'saveCommandVariables', payload});
}

function syncEditCommandDraftFromDom() {
  if (!uiState.editingCommandId) {
    return;
  }

  const titleInput = document.getElementById('edit-command-title');
  const descriptionInput = document.getElementById('edit-command-description');
  const templateInput = document.getElementById('edit-command-template');
  const helpUrlInput = document.getElementById('edit-command-help-url');

  if (!titleInput || !templateInput) {
    return;
  }

  uiState.editCommandDraft.title = titleInput.value;
  uiState.editCommandDraft.description = descriptionInput ? descriptionInput.value : '';
  uiState.editCommandDraft.template = templateInput.value;
  if (helpUrlInput) {
    uiState.editCommandDraft.helpUrl = helpUrlInput.value;
  }
}

function syncEditCommandDraftFromCommand(command) {
  if (!command || uiState.editingCommandId !== command.id) {
    return;
  }

  if (!uiState.editCommandDraft.title && !uiState.editCommandDraft.template && !uiState.editCommandDraft.description && !uiState.editCommandDraft.groupId) {
    uiState.editCommandDraft = {
      title: command.title || '',
      template: command.command || '',
      description: command.description || '',
      groupId: command.groupId || '',
      helpUrl: command.helpUrl || '',
      variableMeta: command.variableMeta ? JSON.parse(JSON.stringify(command.variableMeta)) : {},
      targetCategoryId: command.categoryId || '',
    };
  }
}

function showNotice(message) {
  noticeIsError = false;
  uiState.noticeMessage = message;

  if (noticeTimer) {
    clearTimeout(noticeTimer);
  }

  noticeTimer = setTimeout(function () {
    uiState.noticeMessage = '';
    noticeIsError = false;
    render();
    noticeTimer = null;
  }, 3000);
}

function showError(message) {
  noticeIsError = true;
  uiState.noticeMessage = message;

  if (noticeTimer) {
    clearTimeout(noticeTimer);
  }

  noticeTimer = setTimeout(function () {
    uiState.noticeMessage = '';
    noticeIsError = false;
    render();
    noticeTimer = null;
  }, 4000);
}

function getMissingVariables(command) {
  const names = collectVariables([command.command]);
  const draft = getCommandDraft(command.id);

  return names.filter(function (name) {
    if (name === 'workspaceFolder') {
      return false;
    }

    return !draft[name];
  });
}

function performCommandAction(commandId, action) {
  const command = (state.data.commands || []).find(function (item) {
    return item.id === commandId;
  });

  if (!command) {
    return;
  }

  const missing = getMissingVariables(command);

  if (missing.length > 0) {
    const allVars = collectVariables([command.command]).filter(function (name) {
      return name !== 'workspaceFolder';
    });
    const draft = getCommandDraft(commandId);
    const rememberMap = getCommandRemember(commandId);
    const inputValues = {};
    const rememberFlags = {};
    allVars.forEach(function (name) {
      inputValues[name] = draft[name] || '';
      rememberFlags[name] = rememberMap[name] || 'off';
    });
    variableInputState = {
      commandId,
      action,
      missingVariables: allVars,
      inputValues,
      rememberFlags,
      returnToRunConfirm: false,
    };
    render();
    return;
  }

  dispatchCommandAction(commandId, action);
}

function dispatchCommandAction(commandId, action, shellPath, shellName) {
  const command = (state.data.commands || []).find(function (item) {
    return item.id === commandId;
  });

  if (!command) {
    return;
  }

  const resolved = resolveCommandTemplate(command);
  const commandVariables = buildCommandVariablesPayload();

  vscode.postMessage({
    type: 'performAction',
    payload: {
      action,
      commandId,
      resolvedCommand: resolved,
      commandVariables,
      ...(shellPath ? {shellPath} : {}),
      ...(shellName ? {shellName} : {}),
    },
  });
}

function resolveCommandTemplate(command) {
  const names = collectVariables([command.command]);
  let resolved = command.command;
  const draft = getCommandDraft(command.id);

  names.forEach(function (name) {
    const value = name === 'workspaceFolder' ? (state.workspaceFolder || '') : (draft[name] || '');
    resolved = resolved.replace(new RegExp(`\\$\\{${escapeRegExp(name)}\\}`, 'g'), value);
  });

  return resolved;
}

function buildCommandVariablesPayload() {
  const local = {version: 2, commands: {}};
  const global = {version: 2, commands: {}};

  Object.keys(uiState.commandRemember).forEach(function (commandId) {
    const rememberMap = uiState.commandRemember[commandId] || {};
    const draft = getCommandDraft(commandId);
    const localVars = {};
    const globalVars = {};

    Object.keys(rememberMap).forEach(function (variableName) {
      if (variableName === 'workspaceFolder') {
        return;
      }

      const flag = rememberMap[variableName];
      const val = draft[variableName];

      if (flag === 'local' && val) {
        localVars[variableName] = val;
      } else if (flag === 'global' && val) {
        globalVars[variableName] = val;
      }
    });

    if (Object.keys(localVars).length > 0) {
      local.commands[commandId] = localVars;
    }

    if (Object.keys(globalVars).length > 0) {
      global.commands[commandId] = globalVars;
    }
  });

  return {local, global};
}

function getCommandDraft(commandId) {
  if (!uiState.commandDrafts[commandId]) {
    const globalVars = (state.globalCommandVariables && state.globalCommandVariables.commands && state.globalCommandVariables.commands[commandId]) || {};
    const localVars = (state.commandVariables && state.commandVariables.commands && state.commandVariables.commands[commandId]) || {};
    uiState.commandDrafts[commandId] = {...globalVars, ...localVars};
  }

  return uiState.commandDrafts[commandId];
}

function getCommandRemember(commandId) {
  if (!uiState.commandRemember[commandId]) {
    const remembered = {};
    const globalVars = (state.globalCommandVariables && state.globalCommandVariables.commands && state.globalCommandVariables.commands[commandId]) || {};
    const localVars = (state.commandVariables && state.commandVariables.commands && state.commandVariables.commands[commandId]) || {};

    Object.keys(globalVars).forEach(function (key) {
      remembered[key] = 'global';
    });

    Object.keys(localVars).forEach(function (key) {
      remembered[key] = 'local';
    });

    uiState.commandRemember[commandId] = remembered;
  }

  return uiState.commandRemember[commandId];
}

function collectVariables(commandTemplates) {
  const names = new Set();
  const regex = /\$\{([a-zA-Z0-9_]+)\}/g;

  commandTemplates.forEach(function (template) {
    if (typeof template !== 'string') {
      return;
    }

    let match = regex.exec(template);

    while (match) {
      names.add(match[1]);
      match = regex.exec(template);
    }

    regex.lastIndex = 0;
  });

  return Array.from(names.values());
}

function resolveGroupTitle(groupId, groups) {
  if (!groupId) {
    return '-';
  }

  const group = groups.find(function (item) {
    return item.id === groupId;
  });

  return group ? group.title : groupId;
}

function generateEntityId(prefix) {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── Enum Manager & Help Link Functions ──────────────────────────────────────

/**
 * Renders the Enum Manager modal for a specific variable.
 */
function renderEnumManagerModal() {
  const s = enumManagerState;
  const values = s.enumValues || [];

  const rowsHtml = values.map(function (item, idx) {
    return `
      <tr class="enum-row" data-idx="${idx}">
        <td class="enum-cell-title">${escapeHtml(item.title)}</td>
        <td class="enum-cell-value"><code>${escapeHtml(item.value)}</code></td>
        <td class="enum-cell-desc">${escapeHtml(item.description)}</td>
        <td class="enum-cell-actions">
          <button type="button" class="btn small secondary btn-enum-edit" data-idx="${idx}" title="Edit">✏️</button>
          <button type="button" class="btn small danger btn-enum-delete" data-idx="${idx}" title="Delete">✕</button>
        </td>
      </tr>
    `;
  }).join('');

  const editFormHtml = `
    <div class="enum-add-form">
      <h4>${s.editIndex !== null ? 'Edit Enum Value' : 'Add Enum Value'}</h4>
      <div class="enum-form-grid">
        <label>Title<input id="enum-input-title" class="input" placeholder="e.g. Silent" value="${escapeAttr(s.editTitle)}" autocomplete="off" /></label>
        <label>Value<input id="enum-input-value" class="input" placeholder="e.g. silent" value="${escapeAttr(s.editValue)}" autocomplete="off" /></label>
        <label class="enum-form-desc">Description<input id="enum-input-desc" class="input" placeholder="What this option does..." value="${escapeAttr(s.editDescription)}" autocomplete="off" /></label>
      </div>
      <div class="row justify-content-flex-end" style="gap:6px;margin-top:8px">
        <button type="button" class="btn small primary" id="btn-enum-add-confirm">${s.editIndex !== null ? 'Update' : '+ Add'}</button>
        ${s.editIndex !== null ? '<button type="button" class="btn small secondary action" id="btn-enum-edit-cancel">Cancel Edit</button>' : ''}
      </div>
    </div>
  `;

  return `
    <div class="modal-overlay" id="enum-manager-overlay">
      <div class="modal-box enum-manager-box">
        <div class="row between">
          <h3>Enum Values for <code>\${${escapeHtml(s.varName)}}</code></h3>
        </div>
        ${values.length > 0 ? `
        <div class="table-wrap">
          <table class="enum-table">
            <thead><tr>
              <th>Title</th><th>Value</th><th>Description</th><th></th>
            </tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>` : `<p class="muted muted-no-margin">No enum values yet. Add one below.</p>`}
        ${editFormHtml}
        <div class="row justify-content-flex-end mt-20">
          <button class="btn small primary min-w65" id="btn-enum-manager-save">Save</button>
          <button class="btn small secondary action min-w65" id="btn-enum-manager-cancel">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Binds events for the Enum Manager modal.
 */
function bindEnumManagerEvents() {
  // --- Add / Update enum value ---
  const confirmBtn = document.getElementById('btn-enum-add-confirm');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', function () {
      const titleInput = document.getElementById('enum-input-title');
      const valueInput = document.getElementById('enum-input-value');
      const descInput = document.getElementById('enum-input-desc');

      const title = titleInput ? titleInput.value.trim() : '';
      const value = valueInput ? valueInput.value.trim() : '';
      const description = descInput ? descInput.value.trim() : '';

      if (!title || !value) {
        showNotice('Title and Value are required.');
        return;
      }

      if (enumManagerState.editIndex !== null) {
        enumManagerState.enumValues[enumManagerState.editIndex] = {title, value, description};
        enumManagerState.editIndex = null;
        enumManagerState.editTitle = '';
        enumManagerState.editValue = '';
        enumManagerState.editDescription = '';
      } else {
        enumManagerState.enumValues.push({title, value, description});
        enumManagerState.editTitle = '';
        enumManagerState.editValue = '';
        enumManagerState.editDescription = '';
      }

      render();
    });
  }

  // --- Cancel edit ---
  const cancelEditBtn = document.getElementById('btn-enum-edit-cancel');
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', function () {
      enumManagerState.editIndex = null;
      enumManagerState.editTitle = '';
      enumManagerState.editValue = '';
      enumManagerState.editDescription = '';
      render();
    });
  }

  // --- Edit row buttons ---
  document.querySelectorAll('.btn-enum-edit').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const idx = parseInt(btn.dataset.idx, 10);
      const item = enumManagerState.enumValues[idx];
      if (!item) {return;}
      enumManagerState.editIndex = idx;
      enumManagerState.editTitle = item.title;
      enumManagerState.editValue = item.value;
      enumManagerState.editDescription = item.description;
      render();
    });
  });

  // --- Delete row buttons ---
  document.querySelectorAll('.btn-enum-delete').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const idx = parseInt(btn.dataset.idx, 10);
      enumManagerState.enumValues.splice(idx, 1);
      if (enumManagerState.editIndex === idx) {
        enumManagerState.editIndex = null;
        enumManagerState.editTitle = '';
        enumManagerState.editValue = '';
        enumManagerState.editDescription = '';
      }
      render();
    });
  });

  // --- Save enum to command state ---
  const saveBtn = document.getElementById('btn-enum-manager-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      const varName = enumManagerState.varName;
      const commandId = enumManagerState.commandId;
      const enumValues = enumManagerState.enumValues.slice();

      // Apply to the correct draft's variableMeta
      if (commandId === null) {
        // New command context
        if (!uiState.newCommandDraft.variableMeta) {
          uiState.newCommandDraft.variableMeta = {};
        }
        if (enumValues.length > 0) {
          uiState.newCommandDraft.variableMeta[varName] = {type: 'enum', enumValues};
        } else {
          delete uiState.newCommandDraft.variableMeta[varName];
        }
      } else {
        // Edit command context — find command and update
        const command = (state.data.commands || []).find(function (c) {return c.id === commandId;});
        if (command) {
          if (!command.variableMeta) {
            command.variableMeta = {};
          }
          if (enumValues.length > 0) {
            command.variableMeta[varName] = {type: 'enum', enumValues};
          } else {
            delete command.variableMeta[varName];
            if (Object.keys(command.variableMeta).length === 0) {
              delete command.variableMeta;
            }
          }
        }
        // Also update editCommandDraft
        if (!uiState.editCommandDraft.variableMeta) {
          uiState.editCommandDraft.variableMeta = {};
        }
        if (enumValues.length > 0) {
          uiState.editCommandDraft.variableMeta[varName] = {type: 'enum', enumValues};
        } else {
          delete uiState.editCommandDraft.variableMeta[varName];
        }
      }

      enumManagerState = {
        visible: false, commandId: null, varName: '',
        enumValues: [], editIndex: null,
        editTitle: '', editValue: '', editDescription: '',
      };
      render();
    });
  }

  // --- Cancel ---
  const cancelBtn = document.getElementById('btn-enum-manager-cancel');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function () {
      enumManagerState = {
        visible: false, commandId: null, varName: '',
        enumValues: [], editIndex: null,
        editTitle: '', editValue: '', editDescription: '',
      };
      render();
    });
  }

  // --- Click outside to close ---
  const overlay = document.getElementById('enum-manager-overlay');
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        enumManagerState = {
          visible: false, commandId: null, varName: '',
          enumValues: [], editIndex: null,
          editTitle: '', editValue: '', editDescription: '',
        };
        render();
      }
    });
  }

  // --- Live input tracking ---
  const titleInput = document.getElementById('enum-input-title');
  const valueInput = document.getElementById('enum-input-value');
  const descInput = document.getElementById('enum-input-desc');

  if (titleInput) {
    titleInput.addEventListener('input', function () {
      enumManagerState.editTitle = titleInput.value;
    });
  }
  if (valueInput) {
    valueInput.addEventListener('input', function () {
      enumManagerState.editValue = valueInput.value;
    });
  }
  if (descInput) {
    descInput.addEventListener('input', function () {
      enumManagerState.editDescription = descInput.value;
    });
  }
}

/**
 * Binds click events on cmd-title-link elements (help links in tables).
 */
function bindCmdTitleLinks() {
  document.querySelectorAll('.cmd-title-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const url = link.dataset.url;
      if (url) {
        vscode.postMessage({type: 'openExternalUrl', payload: {url}});
      }
    });
  });
}

// ─── AI UI Render Functions ───────────────────────────────────────────────────

function renderAiSettingsModal() {
  const providers = [
    {value: 'gemini', label: 'Google Gemini (gemini-flash-latest)'},
    {value: 'openai', label: 'OpenAI ChatGPT (gpt-4.1)'},
    {value: 'anthropic', label: 'Anthropic Claude (claude-sonnet-4-6)'},
  ];

  const selectedProvider = aiState.settingsProviderName;
  const hasKey = aiState.keyStatus[selectedProvider];

  return `
    <div class="modal-overlay" id="ai-settings-overlay">
      <div class="modal-box">
        <h3>${iconAISettings()} AI Settings</h3>
        <div>
          <span style="font-size:0.86rem;display:block;margin-bottom:6px">AI Provider</span>
          ${renderCustomSelect(
    'ai-provider-select-wrap',
    'ai-provider-select-btn',
    'ai-provider-select-menu',
    providers,
    selectedProvider,
    'cs-btn-ai-provider', // btnExtraClass
    false, // menuUp
    'cs-wrap-full'  // ← يجعل القائمة بعرض 100%
  )}
        </div>
        <label>
          API Key for <strong>${escapeHtml(selectedProvider)}</strong>
          ${hasKey ? '<span class="ai-key-status ai-key-ok">✅ Key saved</span>' : '<span class="ai-key-status ai-key-missing">⚠️ No key saved</span>'}
          <input
            id="ai-api-key-input"
            class="input"
            type="password"
            placeholder="${hasKey ? 'Enter new key to update...' : 'Enter your API key...'}"
            value="${escapeAttr(aiState.apiKeyInput)}"
            autocomplete="off"
          />
        </label>
        <div class="row justify-content-flex-end mt-20">
          <button class="btn small primary min-w65" id="btn-ai-settings-save">Save</button>
          <button class="btn small secondary action min-w65" id="btn-ai-settings-cancel">Close</button>
        </div>
      </div>
    </div>
  `;
}

function renderAiPromptModal() {
  const isFullMode = aiState.mode === 'full';
  const selectedCategory = getSelectedCategory();
  const groups = getSelectedCategoryGroups();
  const selectedGroup = groups.find(function (g) {return g.id === aiState.groupId;});
  const contextLabel = isFullMode
    ? `${iconSparkles()} Create a new category with all its groups and commands`
    : `${iconSparkles()} Add a single command to group: <strong>${escapeHtml(selectedGroup ? selectedGroup.title : aiState.groupId)}</strong> in <strong>${escapeHtml(selectedCategory ? selectedCategory.title : aiState.categoryId)}</strong>`;

  return `
    <div class="modal-overlay" id="ai-prompt-overlay">
      <div class="modal-box ai-prompt-box">
        <h3>${contextLabel}</h3>
        ${aiState.error ? `<p class="ai-error-msg">❌ ${escapeHtml(aiState.error)}</p>` : ''}
        <label>
          Describe what you need
          <textarea
            id="ai-prompt-textarea"
            class="input"
            rows="4"
            placeholder="${isFullMode ? 'e.g. All commands for CodeIgniter 4 framework' : 'e.g. A command to create a new CodeIgniter 4 model'}"
          >${escapeHtml(aiState.prompt)}</textarea>
        </label>
        <div class="row justify-content-flex-end mt-20">
          <button class="btn small primary" id="btn-ai-generate">${iconSparkles()} Generate</button>
          <button class="btn small secondary action min-w65" id="btn-ai-prompt-cancel">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

function renderAiLoadingOverlay() {
  return `
    <div class="modal-overlay" id="ai-loading-overlay">
      <div class="modal-box ai-loading-box">
        <div class="ai-spinner" aria-label="Loading..."></div>
        <p class="ai-loading-text">Generating commands with AI...</p>
      </div>
    </div>
  `;
}

function renderAiResultsModal() {
  if (!aiState.result) {
    return '';
  }

  const isFullMode = aiState.mode === 'full';
  const allCommands = isFullMode ? (aiState.result.commands || []) : [aiState.result];
  const category = isFullMode ? aiState.result.category : null;
  const groups = isFullMode ? (aiState.result.category ? aiState.result.category.groups || [] : []) : getSelectedCategoryGroups();

  // Filter commands by active group tab
  const filteredCommands = aiState.filterGroupId === 'all'
    ? allCommands
    : allCommands.filter(function (cmd) {
      return cmd.groupId === aiState.filterGroupId;
    });

  const selectedCount = Object.values(aiState.checkedIds).filter(Boolean).length;

  // Build group tabs for filtering
  const groupTabs = isFullMode && groups.length > 0
    ? `
      <div class="group-tags-row">
        <button class="tag group-filter-tag ${aiState.filterGroupId === 'all' ? 'active' : ''}" data-ai-filter="all">All (${allCommands.length})</button>
        ${groups.map(function (g) {
      const count = allCommands.filter(function (cmd) {return cmd.groupId === g.id;}).length;
      return `<button class="tag group-filter-tag ${aiState.filterGroupId === g.id ? 'active' : ''}" data-ai-filter="${escapeAttr(g.id)}">${escapeHtml(g.title)} (${count})</button>`;
    }).join('')}
      </div>`
    : '';

  return `
    <div class="modal-overlay" id="ai-results-overlay">
      <div class="modal-box ai-results-box">
        <div class="row between">
          <h3>${iconSparkles()} AI Generated Commands</h3>
          ${isFullMode && category ? `<span class="muted ai-category-label">Category: <strong>${escapeHtml(category.title)}</strong></span>` : ''}
        </div>
        ${aiState.error ? `<p class="ai-error-msg">❌ ${escapeHtml(aiState.error)}</p>` : ''}
        ${groupTabs}
        <div class="table-wrap">
          <table class="cmds-table commands-table ai-results-table">
            <thead>
              <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Command</th>
              ${isFullMode ? '<th>Group</th>' : ''}
              <th><input type="checkbox" id="ai-check-all" ${selectedCount === allCommands.length ? 'checked' : ''} /></th>
              </tr>
            </thead>
            <tbody>
              ${filteredCommands.map(function (cmd) {
    const isChecked = aiState.checkedIds[cmd.id] !== false;
    const cmdGroups = isFullMode
      ? (function () {const g = groups.find(function (gr) {return gr.id === cmd.groupId;}); return g ? g.title : (cmd.groupId || '');})()
      : '';
    return `
                  <tr class="${isChecked ? '' : 'ai-row-unchecked'}">
                    <td><strong>${escapeHtml(cmd.title)}</strong></td>
                    <td>${escapeHtml(cmd.description || '-')}</td>
                    <td><pre class="template-cell">${escapeHtml(cmd.command)}</pre></td>
                    ${isFullMode ? `<td>${escapeHtml(cmdGroups || '-')}</td>` : ''}
                    <td>
                      <input type="checkbox" class="ai-cmd-checkbox" data-cmd-id="${escapeAttr(cmd.id)}" ${isChecked ? 'checked' : ''} />
                    </td>
                  </tr>
                `;
  }).join('')}
            </tbody>
          </table>
        </div>
        <div class="row justify-content-flex-end mt-20">
          <span class="muted ai-results-count">${selectedCount} of ${allCommands.length} selected</span>
          <button class="btn small primary" id="btn-ai-insert" ${selectedCount === 0 ? 'disabled' : ''}>Insert Selected (${selectedCount})</button>
          <button class="btn small secondary action min-w65" id="btn-ai-results-cancel">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

// ─── AI UI Bind Functions ─────────────────────────────────────────────────────

function bindAiEvents() {
  // ⚙️ AI Settings button (in header)
  const aiSettingsBtn = document.getElementById('btn-ai-settings');
  if (aiSettingsBtn) {
    aiSettingsBtn.addEventListener('click', function () {
      aiState.view = 'settings';
      aiState.apiKeyInput = '';
      // Fetch current settings from extension
      vscode.postMessage({type: 'aiGetSettings'});
    });
  }

  // "Create with AI" button (in manage tab)
  const createWithAiBtn = document.getElementById('btn-create-with-ai');
  if (createWithAiBtn) {
    createWithAiBtn.addEventListener('click', function () {
      aiState.mode = 'full';
      aiState.view = 'prompt';
      aiState.prompt = '';
      aiState.error = '';
      render();
    });
  }

  // "Add with AI" button (in commands tab)
  const addWithAiBtn = document.getElementById('btn-add-with-ai');
  if (addWithAiBtn) {
    addWithAiBtn.addEventListener('click', function () {
      const selectedCategory = getSelectedCategory();
      if (!selectedCategory) {return;}
      aiState.mode = 'single';
      aiState.categoryId = selectedCategory.id;
      aiState.groupId = uiState.selectedGroupId !== 'all' ? uiState.selectedGroupId : '';
      aiState.view = 'prompt';
      aiState.prompt = '';
      aiState.error = '';
      render();
    });
  }

  // --- Settings modal events ---
  if (aiState.view === 'settings') {
    // Bind AI provider custom select
    bindCustomSelect(
      'ai-provider-select-wrap',
      'ai-provider-select-btn',
      'ai-provider-select-menu',
      function (newProvider) {
        aiState.settingsProviderName = newProvider;
        aiState.apiKeyInput = '';
        render();
      }
    );

    const apiKeyInput = document.getElementById('ai-api-key-input');
    if (apiKeyInput) {
      apiKeyInput.addEventListener('input', function () {
        aiState.apiKeyInput = apiKeyInput.value;
      });
    }

    const saveBtn = document.getElementById('btn-ai-settings-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        vscode.postMessage({
          type: 'aiSaveSettings',
          payload: {
            providerName: aiState.settingsProviderName,
            apiKey: aiState.apiKeyInput,
          },
        });
        aiState.view = null;
        aiState.apiKeyInput = '';
      });
    }

    const cancelBtn = document.getElementById('btn-ai-settings-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        aiState.view = null;
        aiState.apiKeyInput = '';
        render();
      });
    }

    const overlay = document.getElementById('ai-settings-overlay');
    if (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
          aiState.view = null;
          aiState.apiKeyInput = '';
          render();
        }
      });
    }
  }

  // --- Prompt modal events ---
  if (aiState.view === 'prompt') {
    const textarea = document.getElementById('ai-prompt-textarea');
    if (textarea) {
      textarea.addEventListener('input', function () {
        aiState.prompt = textarea.value;
      });
      // Focus textarea
      setTimeout(function () {if (textarea) {textarea.focus();} }, 50);
    }

    const generateBtn = document.getElementById('btn-ai-generate');
    if (generateBtn) {
      generateBtn.addEventListener('click', function () {
        const prompt = document.getElementById('ai-prompt-textarea');
        const promptValue = prompt ? prompt.value.trim() : aiState.prompt.trim();
        if (!promptValue) {
          aiState.error = 'Please enter a prompt.';
          render();
          return;
        }
        aiState.prompt = promptValue;
        aiState.error = '';
        aiState.view = 'loading';
        render();

        vscode.postMessage({
          type: 'aiGenerate',
          payload: {
            mode: aiState.mode,
            prompt: promptValue,
            categoryId: aiState.categoryId,
            groupId: aiState.groupId,
          },
        });
      });
    }

    const cancelBtn = document.getElementById('btn-ai-prompt-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        aiState.view = null;
        aiState.error = '';
        aiState.prompt = '';
        render();
      });
    }
  }

  // --- Results modal events ---
  if (aiState.view === 'results') {
    const checkAll = document.getElementById('ai-check-all');
    if (checkAll) {
      checkAll.addEventListener('change', function () {
        const allCommands = aiState.mode === 'full' ? (aiState.result.commands || []) : [aiState.result];
        const newChecked = {};
        allCommands.forEach(function (cmd) {newChecked[cmd.id] = checkAll.checked;});
        aiState.checkedIds = newChecked;
        render();
      });
    }

    document.querySelectorAll('.ai-cmd-checkbox').forEach(function (checkbox) {
      checkbox.addEventListener('change', function () {
        aiState.checkedIds[checkbox.dataset.cmdId] = checkbox.checked;
        render();
      });
    });

    document.querySelectorAll('[data-ai-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        aiState.filterGroupId = btn.dataset.aiFilter;
        render();
      });
    });

    const insertBtn = document.getElementById('btn-ai-insert');
    if (insertBtn) {
      insertBtn.addEventListener('click', function () {
        const allCommands = aiState.mode === 'full' ? (aiState.result.commands || []) : [aiState.result];
        const selectedCommands = allCommands.filter(function (cmd) {
          return aiState.checkedIds[cmd.id] !== false;
        });

        if (!selectedCommands.length) {return;}

        vscode.postMessage({
          type: 'aiInsert',
          payload: {
            mode: aiState.mode,
            category: aiState.mode === 'full' ? (aiState.result.category || null) : null,
            commands: selectedCommands,
          },
        });
      });
    }

    const cancelBtn = document.getElementById('btn-ai-results-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        aiState.view = null;
        aiState.result = null;
        aiState.error = '';
        render();
      });
    }
  }
}

/**
 * Scrolls to a row with the given commandId and temporarily highlights it.
 * Works for both the commands table and the recent commands table.
 * @param {string} commandId
 */
function scrollToAndHighlight(commandId) {
  if (!commandId) {return;}
  // Find a button inside the row that carries the commandId
  var btn = document.querySelector('[data-command-id="' + commandId + '"]');
  if (!btn) {return;}
  var row = btn.closest('tr');
  if (!row) {return;}
  row.classList.add('row-highlight');
  row.scrollIntoView({behavior: 'smooth', block: 'center'});
  setTimeout(function () {
    row.classList.remove('row-highlight');
  }, 2000);
}

// Disable right-click context menu unless text is selected
document.addEventListener('contextmenu', function (e) {
  const selection = window.getSelection();
  if (!selection || selection.toString().trim() === '') {
    e.preventDefault();
  }
});

vscode.postMessage({type: 'ready'});
