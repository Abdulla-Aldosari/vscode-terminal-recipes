const vscode = acquireVsCodeApi();

const uiState = {
  activeTab: 'recent',
  noticeMessage: '',
  selectedCategoryId: '',
  selectedGroupId: 'all',
  editingCommandId: null,
  commandDrafts: {},
  commandRemember: {},
  editCommandDraft: {
    title: '',
    template: '',
    description: '',
    groupIds: [],
  },
  newCommandDraft: {
    visible: false,
    title: '',
    template: '',
    description: '',
    groupIds: [],
  },
};

let noticeTimer = null;
let runConfirmState = {
  commandId: null,
  resolvedCommand: '',
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
});

function hydrateState(payload) {
  state.data = payload && payload.data ? payload.data : state.data;
  state.globalCommandsFile = payload && payload.globalCommandsFile ? payload.globalCommandsFile : '';
  state.workspaceFolder = payload ? payload.workspaceFolder : null;
  state.commandVariables = payload && payload.commandVariables ? payload.commandVariables : {version: 2, commands: {}};
  state.globalCommandVariables = payload && payload.globalCommandVariables ? payload.globalCommandVariables : {version: 2, commands: {}};

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

    return (command.groupIds || []).includes(uiState.selectedGroupId);
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
        </div>
      </header>
      <p class="meta">Workspace: <code>${escapeHtml(state.workspaceFolder || 'No workspace open')}</code></p>
      ${uiState.noticeMessage ? `<div class="notice">${escapeHtml(uiState.noticeMessage)}</div>` : ''}

      <section class="card tabs-section">
        <div class="tabs">
          <button class="tab ${uiState.activeTab === 'recent' ? 'active' : ''}" data-tab="recent">Recent Commands</button>
          <button class="tab ${uiState.activeTab === 'manage' ? 'active' : ''}" data-tab="manage">Categories & Groups</button>
          <button class="tab ${uiState.activeTab === 'commands' ? 'active' : ''}" data-tab="commands">Commands</button>
          <button class="tab tab-push-right ${uiState.activeTab === 'add' ? 'active' : ''}" data-tab="add" ${selectedCategory ? '' : 'disabled'}>Add New Command</button>
        </div>
      </section>

      ${uiState.activeTab === 'recent' ? renderRecentCommandsTab() : ''}
      ${uiState.activeTab === 'manage' ? renderManageTab() : ''}
      ${uiState.activeTab === 'commands' ? renderCommandsTab(selectedCategory) : ''}
      ${uiState.activeTab === 'add' ? renderAddCommandTab(selectedCategory) : ''}
      ${renderVariableInputModal()}
      ${renderRunConfirmModal()}
      ${renderDeleteConfirmModal()}
    </div>
  `;

  bindEvents();
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
            <button class="btn primary small" id="btn-open-add-category-modal">+ Add New Category</button>
          </div>
          <div class="manage-list">
            ${categories.length === 0 ? `<p class="muted manage-empty">No categories yet.</p>` : ''}
            ${categories.map(function (category) {
    const isActive = category.id === uiState.selectedCategoryId;
    return `
              <div class="manage-item ${isActive ? 'active' : ''}" data-category-id="${escapeAttr(category.id)}">
                <span class="manage-item-label">${escapeHtml(category.title)}</span>
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
                <span class="manage-item-label">${escapeHtml(group.title)}</span>
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
      
      <div class="row align-items-center">
        <h2>Commands Browser</h2>
        <select id="commands-category-select" class="input width-fit-content">
          ${(state.data.categories || []).map(function (category) {
    return `<option value="${escapeAttr(category.id)}" ${category.id === uiState.selectedCategoryId ? 'selected' : ''}>${escapeHtml(category.title)}</option>`;
  }).join('')}
        </select>
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
    return `<button type="button" class="tag new-command-group-tag ${draft.groupIds.includes(group.id) ? 'active' : ''}" data-group-id="${escapeAttr(group.id)}">${escapeHtml(group.title)}</button>`;
  }).join('')}
          </div>
        </div>
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

  return `
    <div class="table-wrap">
      <table>
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
    return `
              <tr>
                <td><strong>${escapeHtml(command.title)}</strong><br><span class="muted">${escapeHtml(command.id)}</span></td>
                <td>${escapeHtml(command.description || '-')}</td>
                <td><pre class="template-cell">&gt; ${escapeHtml(command.command)}</pre></td>
                <td>${escapeHtml(resolveGroupTitles(command.groupIds || [], groups))}</td>
                <td>
                <div class="actions-cell">
                  <button class="btn small success btn-run" data-command-id="${escapeAttr(command.id)}">Run</button>
                  <button class="btn small secondary btn-use action" data-command-id="${escapeAttr(command.id)}">Use</button>
                  <button class="btn small secondary btn-copy action" data-command-id="${escapeAttr(command.id)}">Copy</button>
                  <button class="btn small secondary btn-edit action" data-command-id="${escapeAttr(command.id)}">Edit</button>
                  <button class="btn small danger btn-delete-command" data-command-id="${escapeAttr(command.id)}">Delete</button>                
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
    return `<button type="button" class="tag new-command-group-tag ${draft.groupIds.includes(group.id) ? 'active' : ''}" data-group-id="${escapeAttr(group.id)}">${escapeHtml(group.title)}</button>`;
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

  const groups = getSelectedCategoryGroups();
  const variables = collectVariables([command.command]);
  const commandDraft = getCommandDraft(command.id);
  const commandRemember = getCommandRemember(command.id);
  syncEditCommandDraftFromCommand(command);
  const editDraft = uiState.editCommandDraft;

  return `
    <section class="card">
      <h2>Edit Command</h2>
      <form id="form-edit-command" class="form-grid add-command-grid">
        <label class="add-command-title">Command Title<input id="edit-command-title" class="input" required value="${escapeAttr(editDraft.title)}" /></label>
        <label class="add-command-template">Command Template<input id="edit-command-template" class="input" required value="${escapeAttr(editDraft.template)}" /></label>
        <label class="full-width">Description<textarea id="edit-command-description" class="input" rows="2">${escapeHtml(editDraft.description)}</textarea></label>
        <div class="full-width grouped-tags-wrap">
          <span class="groups-label">Groups:</span>
          <div class="inline-tags" id="edit-command-groups-tags">
            ${groups.map(function (group) {
    return `<button type="button" class="tag edit-command-group-tag ${editDraft.groupIds.includes(group.id) ? 'active' : ''}" data-group-id="${escapeAttr(group.id)}">${escapeHtml(group.title)}</button>`;
  }).join('')}
          </div>
        </div>
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
    return `
              <div class="variable-row">
                <label class="variable-name">\${${escapeHtml(name)}}</label>
                <input class="input variable-input" data-command-id="${escapeAttr(command.id)}" data-variable-name="${escapeAttr(name)}" value="${escapeAttr(value)}" ${name === 'workspaceFolder' ? 'readonly' : ''} />
                ${name === 'workspaceFolder' ? '<span></span>' : renderToggleSwitch3(command.id, name, rememberValue, 'variable-remember-toggle')}
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
        <pre class="modal-command-preview">&gt; ${escapeHtml(runConfirmState.resolvedCommand)}</pre>
        <p class="muted">⚠️ This command will be executed immediately</p>
        <div class="row justify-content-flex-end">
        ${hasVariables ? `<button class="btn small secondary min-w65" id="btn-confirm-run-variables">Edit Variables</button>` : ''}
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

  var detailHtml = '';

  if (deleteConfirmState.type === 'command') {
    detailHtml = `
      <p class="delete-confirm-command-name">${escapeHtml(deleteConfirmState.title)}</p>
      <pre class="modal-command-preview">&gt; ${escapeHtml(deleteConfirmState.template)}</pre>
    `;
  } else {
    detailHtml = `<p class="modal-description">${escapeHtml(deleteConfirmState.title || 'This action cannot be undone.')}</p>`;
  }

  return `
    <div class="modal-overlay" id="delete-confirm-overlay">
      <div class="modal-box">
        <h3>Do you want to delete this ${escapeHtml(deleteConfirmState.type)}?</h3>
        ${detailHtml}
        <div class="row justify-content-flex-end">
          <button class="btn small danger min-w65" id="btn-confirm-delete-yes">Delete</button>
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
          <span class="muted" style="font-size:0.8rem;padding:6px 4px">Total runs: <strong>${totalRuns}</strong></span>
          <button id="btn-clear-recent" class="btn danger small">Clear Recent</button>
        </div>
      </div>
      <div class="table-wrap recent-commands">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Template</th>
              <th style="white-space:nowrap">Last Run</th>
              <th style="text-align:center">×Runs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${recentCommands.map(function (command) {
    return `
                <tr>
                  <td><strong>${escapeHtml(command.title)}</strong></td>
                  <td><pre class="template-cell">&gt; ${escapeHtml(command.command)}</pre></td>
                  <td style="white-space:nowrap" title="${escapeAttr(formatDateTime(command.lastRunAt))}">${escapeHtml(timeAgo(command.lastRunAt))}</td>
                  <td style="text-align:center;font-size:0.85rem"><strong>×${command.runCount || 0}</strong></td>
                  <td>
                    <div class="actions-cell">
                      <button class="btn small success btn-run" data-command-id="${escapeAttr(command.id)}">Run</button>
                      <button class="btn small secondary btn-use action" data-command-id="${escapeAttr(command.id)}">Use</button>
                      <button class="btn small secondary btn-copy action" data-command-id="${escapeAttr(command.id)}">Copy</button>
                      <button class="btn small secondary btn-edit action" data-command-id="${escapeAttr(command.id)}">Edit</button>
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

  if (uiState.activeTab === 'recent') {
    bindRecentTabEvents();
  }

  if (uiState.activeTab === 'manage') {
    bindManageTabEvents();
  }

  if (uiState.activeTab === 'commands') {
    bindCommandsTabEvents();
    if (uiState.editingCommandId) {
      bindEditTabEvents();
    }
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
      (state.data.commands || []).forEach(function (cmd) {
        delete cmd.lastRunAt;
        delete cmd.runCount;
      });
      persistDataThenRender('Recent history cleared.');
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
        uiState.editCommandDraft = {title: '', template: '', description: '', groupIds: []};
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

      uiState.selectedCategoryId = item.dataset.categoryId;
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
      uiState.selectedCategoryId = categoryId;
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
      uiState.selectedCategoryId = categoryId;
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
    uiState.selectedCategoryId = newCategory.id;
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

function bindCommandsTabEvents() {
  const categorySelect = document.getElementById('commands-category-select');

  if (categorySelect) {
    categorySelect.addEventListener('change', function () {
      uiState.selectedCategoryId = categorySelect.value;
      uiState.selectedGroupId = 'all';
      render();
    });
  }

  document.querySelectorAll('.group-filter-tag').forEach(function (tagButton) {
    tagButton.addEventListener('click', function () {
      uiState.selectedGroupId = tagButton.dataset.groupId;
      render();
    });
  });
}

function bindAddCommandTabEvents() {
  const newCommandForm = document.getElementById('form-new-command');
  const cancelButton = document.getElementById('btn-cancel-add-command');

  const newCommandTitleInput = document.getElementById('new-command-title');
  const newCommandTemplateInput = document.getElementById('new-command-template');
  const newCommandDescriptionInput = document.getElementById('new-command-description');

  if (newCommandTitleInput) {
    newCommandTitleInput.addEventListener('input', function () {
      uiState.newCommandDraft.title = newCommandTitleInput.value;
    });
  }

  if (newCommandTemplateInput) {
    newCommandTemplateInput.addEventListener('input', function () {
      uiState.newCommandDraft.template = newCommandTemplateInput.value;
    });
  }

  if (newCommandDescriptionInput) {
    newCommandDescriptionInput.addEventListener('input', function () {
      uiState.newCommandDraft.description = newCommandDescriptionInput.value;
    });
  }

  document.querySelectorAll('.new-command-group-tag').forEach(function (tagButton) {
    tagButton.addEventListener('click', function () {
      const groupId = tagButton.dataset.groupId;
      const selected = uiState.newCommandDraft.groupIds;

      if (selected.includes(groupId)) {
        uiState.newCommandDraft.groupIds = selected.filter(function (id) {
          return id !== groupId;
        });
      } else {
        uiState.newCommandDraft.groupIds = [...selected, groupId];
      }

      render();
    });
  });

  if (cancelButton) {
    cancelButton.addEventListener('click', function () {
      uiState.newCommandDraft = {visible: false, title: '', template: '', description: '', groupIds: []};
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

      const title = titleInput ? titleInput.value.trim() : '';
      const description = descriptionInput ? descriptionInput.value.trim() : '';
      const commandTemplate = templateInput ? templateInput.value.trim() : '';
      const groupIds = uiState.newCommandDraft.groupIds;

      if (!title || !commandTemplate) {
        showNotice('Command title and template are required.');
        render();
        return;
      }

      if (!groupIds.length) {
        showNotice('Select at least one group.');
        render();
        return;
      }

      const newCommand = {
        id: generateEntityId('cmd'),
        title,
        description,
        command: commandTemplate,
        categoryId: selectedCategory.id,
        groupIds,
      };

      state.data.commands.push(newCommand);
      uiState.newCommandDraft = {visible: false, title: '', template: '', description: '', groupIds: []};
      uiState.activeTab = 'commands';
      persistDataThenRender('Command added and saved.');
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

    if (!draft.title || !draft.template) {
      showNotice('Command title and template are required.');
      render();
      return;
    }

    if (!draft.groupIds.length) {
      showNotice('Select at least one group.');
      render();
      return;
    }

    command.title = draft.title;
    command.description = draft.description;
    command.command = draft.template;
    command.groupIds = [...draft.groupIds];

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

    uiState.editingCommandId = null;
    uiState.editCommandDraft = {title: '', template: '', description: '', groupIds: []};
    uiState.activeTab = 'commands';
    persistDataThenRender('Command updated and saved.');
    persistCommandVariables();
  });

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
      const selected = uiState.editCommandDraft.groupIds;

      if (selected.includes(groupId)) {
        uiState.editCommandDraft.groupIds = selected.filter(function (id) {
          return id !== groupId;
        });
      } else {
        uiState.editCommandDraft.groupIds = [...selected, groupId];
      }

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

      uiState.editingCommandId = commandId;

      if (command) {
        uiState.editCommandDraft = {
          title: command.title || '',
          template: command.command || '',
          description: command.description || '',
          groupIds: [...(command.groupIds || [])],
        };
      }

      uiState.activeTab = 'commands';
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

  if (confirmRunYesButton) {
    confirmRunYesButton.addEventListener('click', function () {
      const commandId = runConfirmState.commandId;
      runConfirmState = {commandId: null, resolvedCommand: ''};
      render();

      if (!commandId) {
        return;
      }

      dispatchCommandAction(commandId, 'run');
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
          };
        }

        render();
        return;
      }

      render();
      dispatchCommandAction(commandId, action);
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
        uiState.editCommandDraft = {title: '', template: '', description: '', groupIds: []};
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
        if (command.categoryId === selectedCategory.id) {
          command.groupIds = (command.groupIds || []).filter(function (gid) {
            return gid !== id;
          });
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
      uiState.editCommandDraft = {title: '', template: '', description: '', groupIds: []};
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

  if (!titleInput || !templateInput) {
    return;
  }

  uiState.editCommandDraft.title = titleInput.value;
  uiState.editCommandDraft.description = descriptionInput ? descriptionInput.value : '';
  uiState.editCommandDraft.template = templateInput.value;
}

function syncEditCommandDraftFromCommand(command) {
  if (!command || uiState.editingCommandId !== command.id) {
    return;
  }

  if (!uiState.editCommandDraft.title && !uiState.editCommandDraft.template && !uiState.editCommandDraft.description && !uiState.editCommandDraft.groupIds.length) {
    uiState.editCommandDraft = {
      title: command.title || '',
      template: command.command || '',
      description: command.description || '',
      groupIds: [...(command.groupIds || [])],
    };
  }
}

function showNotice(message) {
  uiState.noticeMessage = message;

  if (noticeTimer) {
    clearTimeout(noticeTimer);
  }

  noticeTimer = setTimeout(function () {
    uiState.noticeMessage = '';
    render();
    noticeTimer = null;
  }, 3000);
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

function dispatchCommandAction(commandId, action) {
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

function resolveGroupTitles(groupIds, groups) {
  if (!groupIds.length) {
    return '-';
  }

  return groupIds.map(function (groupId) {
    const group = groups.find(function (item) {
      return item.id === groupId;
    });

    return group ? group.title : groupId;
  }).join(', ');
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

vscode.postMessage({type: 'ready'});
