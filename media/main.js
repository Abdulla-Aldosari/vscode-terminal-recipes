const vscode = acquireVsCodeApi();

const uiState = {
  activeTab: 'commands',
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
    } else {
      showNotice(`Action failed: ${message.payload && message.payload.message ? message.payload.message : 'Unknown error'}`);
    }

    render();
    return;
  }

  if (message.type === 'saveVariablesResult') {
    if (message.payload && message.payload.success) {
      state.commandVariables = message.payload.commandVariables;
      showNotice('Variables saved.');
    } else {
      showNotice(`Variables save failed: ${message.payload && message.payload.message ? message.payload.message : 'Unknown error'}`);
    }

    render();
  }
});

function hydrateState(payload) {
  state.data = payload && payload.data ? payload.data : state.data;
  state.globalCommandsFile = payload && payload.globalCommandsFile ? payload.globalCommandsFile : '';
  state.workspaceFolder = payload ? payload.workspaceFolder : null;
  state.commandVariables = payload && payload.commandVariables ? payload.commandVariables : {version: 2, commands: {}};

  Object.keys(state.commandVariables.commands || {}).forEach(function (commandId) {
    if (!uiState.commandDrafts[commandId]) {
      uiState.commandDrafts[commandId] = {...(state.commandVariables.commands[commandId] || {})};
    }

    if (!uiState.commandRemember[commandId]) {
      const remembered = {};
      Object.keys(state.commandVariables.commands[commandId] || {}).forEach(function (key) {
        remembered[key] = true;
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
          <button id="btn-open-commands-file" class="btn secondary">Open Global JSON</button>
        </div>
      </header>
      <p class="meta">Workspace: <code>${escapeHtml(state.workspaceFolder || 'No workspace open')}</code></p>
      ${uiState.noticeMessage ? `<div class="notice">${escapeHtml(uiState.noticeMessage)}</div>` : ''}

      <section class="card">
        <div class="tabs">
          <button class="tab ${uiState.activeTab === 'manage' ? 'active' : ''}" data-tab="manage">Categories & Groups</button>
          <button class="tab ${uiState.activeTab === 'commands' ? 'active' : ''}" data-tab="commands">Commands</button>
          <button class="tab ${uiState.activeTab === 'edit' ? 'active' : ''}" data-tab="edit" ${getEditingCommand() ? '' : 'disabled'}>Edit Command</button>
        </div>
      </section>

      ${uiState.activeTab === 'manage' ? renderManageTab() : ''}
      ${uiState.activeTab === 'commands' ? renderCommandsTab(selectedCategory) : ''}
      ${uiState.activeTab === 'edit' ? renderEditTab() : ''}
      ${renderVariableInputModal()}
      ${renderRunConfirmModal()}
      ${renderDeleteConfirmModal()}
    </div>
  `;

  bindEvents();
}

function renderManageTab() {
  const selectedCategory = getSelectedCategory();
  const selectedGroups = getSelectedCategoryGroups();

  return `
    <section class="card">
      <h2>Manage Categories</h2>
      <div class="row">
        <select id="manage-category-select" class="input">
          ${(state.data.categories || []).map(function (category) {
    return `<option value="${escapeAttr(category.id)}" ${category.id === uiState.selectedCategoryId ? 'selected' : ''}>${escapeHtml(category.title)}</option>`;
  }).join('')}
        </select>
      </div>
      <form id="form-add-category" class="form-grid">
        <label>Category Title<input id="new-category-title" class="input" required /></label>
        <div class="row flex-end">
          <button type="submit" class="btn secondary action">Add Category</button>
          <button type="button" id="btn-rename-category" class="btn secondary action" ${selectedCategory ? '' : 'disabled'}>Rename Selected</button>
          <button type="button" id="btn-delete-category" class="btn danger" ${selectedCategory ? '' : 'disabled'}>Delete Selected</button>
        </div>
      </form>
    </section>

    <section class="card">
      <h2>Manage Groups</h2>
      <div class="row">
        <select id="manage-group-select" class="input" ${selectedCategory ? '' : 'disabled'}>
          <option value="all" ${uiState.selectedGroupId === 'all' ? 'selected' : ''}>All</option>
          ${selectedGroups.map(function (group) {
    return `<option value="${escapeAttr(group.id)}" ${group.id === uiState.selectedGroupId ? 'selected' : ''}>${escapeHtml(group.title)}</option>`;
  }).join('')}
        </select>
      </div>
      <form id="form-add-group" class="form-grid" ${selectedCategory ? '' : 'data-disabled="true"'}>
        <label>Group Title<input id="new-group-title" class="input" ${selectedCategory ? 'required' : 'disabled'} /></label>
        <div class="row">
          <button type="submit" class="btn secondary action" ${selectedCategory ? '' : 'disabled'}>Add Group</button>
          <button type="button" id="btn-rename-group" class="btn secondary action" ${selectedCategory && uiState.selectedGroupId !== 'all' ? '' : 'disabled'}>Rename Selected</button>
          <button type="button" id="btn-delete-group" class="btn danger" ${selectedCategory && uiState.selectedGroupId !== 'all' ? '' : 'disabled'}>Delete Selected</button>
        </div>
      </form>
    </section>
  `;
}

function renderCommandsTab(selectedCategory) {
  const groups = getSelectedCategoryGroups();
  const commands = getVisibleCommands();
  const draft = uiState.newCommandDraft;

  if (!selectedCategory) {
    return `
      <section class="card">
        <p>Add a category first in Categories & Groups tab.</p>
      </section>
    `;
  }

  return `
    <section class="card">
      <h2>Commands Browser</h2>
      <div class="row">
        <select id="commands-category-select" class="input">
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

    <section class="card">
      <div class="row between">
        <h2>${draft.visible ? `Add Command to ( ${escapeHtml(selectedCategory.title)} )` : 'Add Command'}</h2>
        ${draft.visible ? '' : '<button id="btn-show-add-command" class="btn primary">Add New Command</button>'}
      </div>
      ${draft.visible ? renderNewCommandForm(groups, draft) : ''}
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
                <td><code class="template-cell">&gt; ${escapeHtml(command.command)}</code></td>
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
      
      <label class="add-command-template">Command Template<input id="new-command-template" class="input" required placeholder="php spark make:migration ${name}" value="${escapeAttr(draft.template)}" /></label>
      
      
      <label class="full-width">Description<textarea id="new-command-description" class="input" rows="2">${escapeAttr(draft.description)}</textarea></label>
      <div class="full-width grouped-tags-wrap">
        <span class="groups-label">Groups:</span>
        <div class="inline-tags" id="new-command-groups-tags">
          ${groups.map(function (group) {
    return `<button type="button" class="tag new-command-group-tag ${draft.groupIds.includes(group.id) ? 'active' : ''}" data-group-id="${escapeAttr(group.id)}">${escapeHtml(group.title)}</button>`;
  }).join('')}
        </div>
      </div>
      <div class="row">
        <button type="submit" class="btn primary">Add Command</button>
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
        <div class="row">
          <button type="submit" class="btn primary">Save Changes</button>
        </div>
      </form>
    </section>

    <section class="card">
      <h2>Command Variables</h2>
      ${variables.length ? `
        <div class="variables-list">
          ${variables.map(function (name) {
    const value = name === 'workspaceFolder' ? (state.workspaceFolder || '') : (commandDraft[name] || '');
    const rememberChecked = Boolean(commandRemember[name]);

    return `
              <div class="variable-row">
                <label class="variable-name">\${${escapeHtml(name)}}</label>
                <input class="input variable-input" data-command-id="${escapeAttr(command.id)}" data-variable-name="${escapeAttr(name)}" value="${escapeAttr(value)}" ${name === 'workspaceFolder' ? 'readonly' : ''} />
                <label class="remember-wrap">
                  <input type="checkbox" class="variable-remember" data-command-id="${escapeAttr(command.id)}" data-variable-name="${escapeAttr(name)}" ${rememberChecked ? 'checked' : ''} ${name === 'workspaceFolder' ? 'disabled' : ''} />
                  Remember
                </label>
              </div>
            `;
  }).join('')}
        </div>
      ` : '<p>No variables detected in this command template.</p>'}
    </section>
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
        <div class="row">
          <button class="btn primary min-w70" id="btn-confirm-run-yes">Yes</button>
          <button class="btn secondary action min-w70" id="btn-confirm-run-no">No</button>
          ${hasVariables ? `<button class="btn secondary min-w70" id="btn-confirm-run-variables" style="margin-left:auto">Variables</button>` : ''}
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
          ${vars.map(function (name) {
    const currentValue = variableInputState.inputValues[name] !== undefined
      ? variableInputState.inputValues[name]
      : (getCommandDraft(variableInputState.commandId)[name] || '');
    const rememberChecked = variableInputState.rememberFlags[name] !== undefined
      ? Boolean(variableInputState.rememberFlags[name])
      : Boolean((uiState.commandRemember[variableInputState.commandId] || {})[name]);
    return `
              <div class="variable-row">
                <label class="variable-name">\${${escapeHtml(name)}}</label>
                <input
                  class="input variable-modal-input"
                  data-variable-name="${escapeAttr(name)}"
                  value="${escapeAttr(currentValue)}"
                  placeholder="Enter value..."
                />
                <label class="remember-wrap">
                  <input
                    type="checkbox"
                    class="variable-modal-remember"
                    data-variable-name="${escapeAttr(name)}"
                    ${rememberChecked ? 'checked' : ''}
                  />
                  Remember
                </label>
              </div>
            `;
  }).join('')}
        </div>
        <div class="row">
          <button class="btn primary min-w70" id="btn-variable-input-confirm">Confirm</button>
          <button class="btn secondary action min-w70" id="btn-variable-input-cancel">Cancel</button>
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
        <div class="row">
          <button class="btn danger min-w70" id="btn-confirm-delete-yes">Yes</button>
          <button class="btn secondary action min-w70" id="btn-confirm-delete-no">No</button>
        </div>
      </div>
    </div>
  `;
}

function bindEvents() {
  bindTopActions();
  bindTabs();

  if (uiState.activeTab === 'manage') {
    bindManageTabEvents();
  }

  if (uiState.activeTab === 'commands') {
    bindCommandsTabEvents();
  }

  if (uiState.activeTab === 'edit') {
    bindEditTabEvents();
  }

  bindCommandActionButtons();
}

function bindTopActions() {
  const openCommandsFileButton = document.getElementById('btn-open-commands-file');

  if (openCommandsFileButton) {
    openCommandsFileButton.addEventListener('click', function () {
      vscode.postMessage({type: 'openCommandsFile'});
    });
  }
}

function bindTabs() {
  document.querySelectorAll('.tab').forEach(function (tabButton) {
    tabButton.addEventListener('click', function () {
      const nextTab = tabButton.dataset.tab;

      if (nextTab === 'edit' && !getEditingCommand()) {
        return;
      }

      uiState.activeTab = nextTab;
      render();
    });
  });
}

function bindManageTabEvents() {
  const categorySelect = document.getElementById('manage-category-select');
  const groupSelect = document.getElementById('manage-group-select');
  const addCategoryForm = document.getElementById('form-add-category');
  const addGroupForm = document.getElementById('form-add-group');
  const renameCategoryButton = document.getElementById('btn-rename-category');
  const deleteCategoryButton = document.getElementById('btn-delete-category');
  const renameGroupButton = document.getElementById('btn-rename-group');
  const deleteGroupButton = document.getElementById('btn-delete-group');

  if (categorySelect) {
    categorySelect.addEventListener('change', function () {
      uiState.selectedCategoryId = categorySelect.value;
      uiState.selectedGroupId = 'all';
      render();
    });
  }

  if (groupSelect) {
    groupSelect.addEventListener('change', function () {
      uiState.selectedGroupId = groupSelect.value;
      render();
    });
  }

  if (addCategoryForm) {
    addCategoryForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const input = document.getElementById('new-category-title');
      const title = input ? input.value.trim() : '';

      if (!title) {
        showNotice('Category title is required.');
        render();
        return;
      }

      const newCategory = {
        id: generateEntityId('cat'),
        title,
        groups: [],
      };

      state.data.categories.push(newCategory);
      uiState.selectedCategoryId = newCategory.id;
      uiState.selectedGroupId = 'all';
      persistDataThenRender('Category added and saved.');
    });
  }

  if (renameCategoryButton) {
    renameCategoryButton.addEventListener('click', function () {
      const selectedCategory = getSelectedCategory();
      const input = document.getElementById('new-category-title');
      const nextTitle = input ? input.value.trim() : '';

      if (!selectedCategory || !nextTitle) {
        showNotice('Select category and provide title to rename.');
        render();
        return;
      }

      selectedCategory.title = nextTitle;
      persistDataThenRender('Category renamed and saved.');
    });
  }

  if (deleteCategoryButton) {
    deleteCategoryButton.addEventListener('click', function () {
      const selectedCategory = getSelectedCategory();

      if (!selectedCategory) {
        return;
      }

      deleteConfirmState = {
        type: 'category',
        id: selectedCategory.id,
        title: selectedCategory.title,
      };
      render();
    });
  }

  if (addGroupForm) {
    addGroupForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const selectedCategory = getSelectedCategory();
      const input = document.getElementById('new-group-title');
      const title = input ? input.value.trim() : '';

      if (!selectedCategory || !title) {
        showNotice('Select category and provide group title.');
        render();
        return;
      }

      const newGroup = {
        id: generateEntityId('grp'),
        title,
      };

      selectedCategory.groups = selectedCategory.groups || [];
      selectedCategory.groups.push(newGroup);
      uiState.selectedGroupId = newGroup.id;
      persistDataThenRender('Group added and saved.');
    });
  }

  if (renameGroupButton) {
    renameGroupButton.addEventListener('click', function () {
      const selectedCategory = getSelectedCategory();
      const input = document.getElementById('new-group-title');
      const nextTitle = input ? input.value.trim() : '';

      if (!selectedCategory || uiState.selectedGroupId === 'all' || !nextTitle) {
        showNotice('Select group and provide title to rename.');
        render();
        return;
      }

      const group = (selectedCategory.groups || []).find(function (item) {
        return item.id === uiState.selectedGroupId;
      });

      if (!group) {
        showNotice('Selected group not found.');
        render();
        return;
      }

      group.title = nextTitle;
      persistDataThenRender('Group renamed and saved.');
    });
  }

  if (deleteGroupButton) {
    deleteGroupButton.addEventListener('click', function () {
      const selectedCategory = getSelectedCategory();

      if (!selectedCategory || uiState.selectedGroupId === 'all') {
        return;
      }

      const group = (selectedCategory.groups || []).find(function (item) {
        return item.id === uiState.selectedGroupId;
      });

      if (!group) {
        return;
      }

      deleteConfirmState = {
        type: 'group',
        id: group.id,
        title: group.title,
      };
      render();
    });
  }
}

function bindCommandsTabEvents() {
  const categorySelect = document.getElementById('commands-category-select');
  const newCommandForm = document.getElementById('form-new-command');
  const showAddCommandButton = document.getElementById('btn-show-add-command');

  if (categorySelect) {
    categorySelect.addEventListener('change', function () {
      uiState.selectedCategoryId = categorySelect.value;
      uiState.selectedGroupId = 'all';
      render();
    });
  }

  document.querySelectorAll('.group-filter-tag').forEach(function (tagButton) {
    tagButton.addEventListener('click', function () {
      syncNewCommandDraftFromDom();
      uiState.selectedGroupId = tagButton.dataset.groupId;
      render();
    });
  });

  if (showAddCommandButton) {
    showAddCommandButton.addEventListener('click', function () {
      uiState.newCommandDraft.visible = true;
      render();
    });
  }

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
      uiState.newCommandDraft = {
        visible: false,
        title: '',
        template: '',
        description: '',
        groupIds: [],
      };
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
      persistCommandVariables();
      syncEditCommandDraftFromDom();
    });
  });

  document.querySelectorAll('.variable-remember').forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      const commandId = checkbox.dataset.commandId;
      const variableName = checkbox.dataset.variableName;

      const rememberMap = getCommandRemember(commandId);
      rememberMap[variableName] = checkbox.checked;
      uiState.commandRemember[commandId] = rememberMap;
      persistCommandVariables();
      syncEditCommandDraftFromDom();
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
        variableInputState = {
          commandId,
          action: 'run',
          missingVariables: missing,
          inputValues: {},
          rememberFlags: {},
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

      uiState.activeTab = 'edit';
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

      // Show all non-workspaceFolder variables for editing
      const allVars = collectVariables([command.command]).filter(function (name) {
        return name !== 'workspaceFolder';
      });

      const draft = getCommandDraft(commandId);
      const rememberMap = getCommandRemember(commandId);
      const inputValues = {};
      const rememberFlags = {};

      allVars.forEach(function (name) {
        inputValues[name] = draft[name] || '';
        rememberFlags[name] = Boolean(rememberMap[name]);
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

      // Collect current values and remember flags from the modal DOM
      document.querySelectorAll('.variable-modal-input').forEach(function (input) {
        const varName = input.dataset.variableName;
        variableInputState.inputValues[varName] = input.value;
      });

      document.querySelectorAll('.variable-modal-remember').forEach(function (checkbox) {
        const varName = checkbox.dataset.variableName;
        variableInputState.rememberFlags[varName] = checkbox.checked;
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

      // Persist if any remember flags are set
      const hasRemembered = Object.values(variableInputState.rememberFlags).some(Boolean);
      if (hasRemembered) {
        persistCommandVariables();
      }

      // Close variable input modal
      variableInputState = {commandId: null, action: null, missingVariables: [], inputValues: {}, rememberFlags: {}, returnToRunConfirm: false};

      if (action === 'run') {
        const command = (state.data.commands || []).find(function (item) {
          return item.id === commandId;
        });

        if (command) {
          // Update the run confirm modal with the new resolved command
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

      // If we came from the run confirm modal, restore it
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
        if (uiState.activeTab === 'edit') {
          uiState.activeTab = 'commands';
        }
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
  if (uiState.activeTab !== 'edit' || !uiState.editingCommandId) {
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
    variableInputState = {
      commandId,
      action,
      missingVariables: missing,
      inputValues: {},
      rememberFlags: {},
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
  const payload = {
    version: 2,
    commands: {},
  };

  Object.keys(uiState.commandRemember).forEach(function (commandId) {
    const rememberMap = uiState.commandRemember[commandId] || {};
    const draft = getCommandDraft(commandId);
    const remembered = {};

    Object.keys(rememberMap).forEach(function (variableName) {
      if (variableName === 'workspaceFolder') {
        return;
      }

      if (rememberMap[variableName]) {
        remembered[variableName] = draft[variableName] || '';
      }
    });

    if (Object.keys(remembered).length > 0) {
      payload.commands[commandId] = remembered;
    }
  });

  return payload;
}

function getCommandDraft(commandId) {
  if (!uiState.commandDrafts[commandId]) {
    uiState.commandDrafts[commandId] = {
      ...(state.commandVariables.commands && state.commandVariables.commands[commandId]
        ? state.commandVariables.commands[commandId]
        : {}),
    };
  }

  return uiState.commandDrafts[commandId];
}

function getCommandRemember(commandId) {
  if (!uiState.commandRemember[commandId]) {
    const remembered = {};
    const values = state.commandVariables.commands && state.commandVariables.commands[commandId]
      ? state.commandVariables.commands[commandId]
      : {};

    Object.keys(values).forEach(function (key) {
      remembered[key] = true;
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

  return Array.from(names.values()).sort();
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
