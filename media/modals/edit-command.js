/*-------------------------------------------------
 * Terminal Recipes — VS Code Extension
 * Copyright (c) 2026 Abdulla Aldosari
 * Licensed under the Apache License, Version 2.0.
 * See LICENSE in the project root for details.
 *-------------------------------------------------*/

// media/modals/edit-command.js
// Edit Command form (rendered as a full tab when uiState.editingCommandId is set).
// Loads after run-confirm.js (renderToggleSwitch3 dependency).

function syncEditCommandDraftFromDom() {
  if (!uiState.editingCommandId) {
    return;
  }

  const titleInput = document.getElementById("edit-command-title");
  const descriptionInput = document.getElementById("edit-command-description");
  const templateInput = document.getElementById("edit-command-template");
  const helpUrlInput = document.getElementById("edit-command-help-url");

  if (!titleInput || !templateInput) {
    return;
  }

  uiState.editCommandDraft.title = titleInput.value;
  uiState.editCommandDraft.description = descriptionInput ? descriptionInput.value : "";
  uiState.editCommandDraft.template = templateInput.value;
  if (helpUrlInput) {
    uiState.editCommandDraft.helpUrl = helpUrlInput.value;
  }
}

function syncEditCommandDraftFromCommand(command) {
  if (!command || uiState.editingCommandId !== command.id) {
    return;
  }

  if (
    !uiState.editCommandDraft.title &&
    !uiState.editCommandDraft.template &&
    !uiState.editCommandDraft.description &&
    !uiState.editCommandDraft.groupId
  ) {
    uiState.editCommandDraft = {
      title: command.title || "",
      template: command.command || "",
      description: command.description || "",
      groupId: command.groupId || "",
      helpUrl: command.helpUrl || "",
      variableMeta: command.variableMeta ? JSON.parse(JSON.stringify(command.variableMeta)) : {},
      targetCategoryId: command.categoryId || "",
    };
  }
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
  const groups = targetCategory ? targetCategory.groups || [] : [];
  const autoVarNames = getEnabledAutoVariableNames();
  const variables = collectVariables([editDraft.template || command.command]).filter(function (n) {
    return !autoVarNames.includes(n);
  });
  const commandRemember = getCommandRemember(command.id);
  const isMoved = targetCategoryId !== command.categoryId;

  return `
    <section class="card recipe-editor">
      <h2>Edit Command</h2>
      <form id="form-edit-command" class="form-grid add-command-grid">
        <label class="add-command-title">Command Title<input id="edit-command-title" class="input" required value="${escapeAttr(editDraft.title)}" /></label>
        <label class="add-command-template">Command Template<div class="template-editor-wrap"><div class="template-highlight" aria-hidden="true"></div>
        <textarea id="edit-command-template" class="input template-textarea" required rows="1">${escapeHtml(editDraft.template)}</textarea>
        </div><div class="template-var-legend">

        <span class="legend-item legend-auto hidden" data-tooltip="Reserved variables that are automatically resolved.<br>
        They do not require the user to assign a value."><span class="legend-dot" aria-hidden="true"></span>auto resolved</span>

        <span class="legend-item legend-user hidden" data-tooltip="Variables that are defined by the user.<br>
        Their values must be set by the user."><span class="legend-dot" aria-hidden="true"></span>user defined</span>

        </div></label>
        <label class="full-width">Description<textarea id="edit-command-description" class="input" rows="2">${escapeHtml(editDraft.description)}</textarea></label>
        <div class="full-width grouped-tags-wrap">
          <span class="groups-label">Category:</span>
          ${renderCustomSelect(
            "edit-category-select-wrap",
            "edit-category-select-btn",
            "edit-category-select-menu",
            allCategories.map(function (cat) {
              return { value: cat.id, label: cat.title };
            }),
            targetCategoryId,
            "cs-btn-sm cs-btn-category", // btnExtraClass
            false, // menuUp
            "cs-wrap-full" // wrapExtraClass
          )}
          ${isMoved ? `<span class="muted move-category-warning">${icons.exclamationTriangle} Moving to new category — (Please select a group from the list below)</span>` : ""}
        </div>
        <div class="full-width grouped-tags-wrap">
          <span class="groups-label">Groups:</span>
          <div class="inline-tags" id="edit-command-groups-tags">
            ${groups.length === 0 ? `<span class="muted">No groups in this category.</span>` : ""}
            ${groups
              .map(function (group) {
                return `<button type="button" class="tag d-focus edit-command-group-tag ${editDraft.groupId === group.id ? "active" : ""}" data-group-id="${escapeAttr(group.id)}">${escapeHtml(group.title)}</button>`;
              })
              .join("")}
          </div>
        </div>
        <label class="full-width">Help URL (optional)<input id="edit-command-help-url" class="input" placeholder="https://docs.example.com/command" value="${escapeAttr(editDraft.helpUrl || "")}" /></label>
        ${
          variables.length
            ? `
        <div class="full-width mt-5">
          <h3>Command Variables:</h3>
          <div class="variables-list">
            <div class="variable-row">
              <span></span>
              <span></span>
              <span class="muted vars-store-location" data-tooltip="Local = saved per workspace only<br>Global = saved across all workspaces<br>Off = not saved">Variables store location</span>
              <span></span>
            </div>
            ${variables
              .map(function (name) {
                const pref = commandRemember[name] || (state.workspaceFolder ? "local" : "global");
                const localDraftV = getCommandLocalDraft(command.id);
                const globalDraftV = getCommandGlobalDraft(command.id);
                const sessionDraftV = getCommandSessionDraft(command.id);
                let rawVal;
                if (pref === "local") {
                  rawVal = localDraftV[name];
                } else if (pref === "global") {
                  rawVal = globalDraftV[name];
                } else {
                  rawVal = sessionDraftV[name];
                }
                rawVal = rawVal !== undefined ? rawVal : "";
                const isEmptyVal = rawVal === RECIPES_EMPTY_VALUE;
                const displayVal = isEmptyVal ? "[EmptyValue]" : rawVal;
                const meta = editDraft.variableMeta && editDraft.variableMeta[name];
                const isEnum = meta && meta.type === "enum";
                const enumCount = isEnum ? meta.enumValues.length : 0;
                return `
              <div class="variable-row">
                <label class="variable-name">\${${escapeHtml(name)}}</label>
                <input class="input variable-input" data-command-id="${escapeAttr(command.id)}" data-variable-name="${escapeAttr(name)}" data-scope="${escapeAttr(pref)}" value="${escapeAttr(displayVal)}" placeholder="Enter value..."${isEmptyVal ? ' readonly data-is-empty-value="true"' : ""}/>
                ${renderToggleSwitch3(command.id, name, pref, "variable-remember-toggle")}
                <button type="button" class="btn small ${isEnum ? "primary" : "secondary"} btn-open-enum-manager" data-var-name="${escapeAttr(name)}" data-command-id="${escapeAttr(command.id)}" data-tooltip="Manage Enum values">${icons.adjustments} ${isEnum ? `Enum (${enumCount})` : "Set Enum"}</button>
              </div>
            `;
              })
              .join("")}
            <div class="variable-row">
              <span></span>
              <p class="muted variables-empty-hint"><kbd>Alt+0</kbd> to set focused variable as empty value</p>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        `
            : ""
        }
        ${
          command.lastRunAt
            ? `
        <div class="full-width mt-5">
          <span class="muted">Last Run: <strong data-tooltip="${escapeAttr(formatDateTime(command.lastRunAt))}">${escapeHtml(timeAgo(command.lastRunAt))}</strong> &nbsp;·&nbsp; ×${command.runCount || 0} runs</span>
        </div>
        `
            : ""
        }
        <div class="row full-width justify-content-flex-end mt-20">
          <button type="submit" class="btn small primary" id="btn-save-edit-command">Save Changes</button>
          <button type="button" id="btn-cancel-edit-command" class="btn small secondary action">Cancel</button>
        </div>
      </form>
    </section>
  `;
}

function bindEditTabEvents() {
  const command = getEditingCommand();
  const form = document.getElementById("form-edit-command");

  if (!command || !form) {
    return;
  }

  // Take a snapshot of the current scope drafts when the edit form first opens.
  // If the user presses Cancel, the snapshot is restored so no changes persist.
  if (!uiState.editCommandScopeSnapshot || uiState.editCommandScopeSnapshot.commandId !== command.id) {
    uiState.editCommandScopeSnapshot = {
      commandId: command.id,
      local: Object.assign({}, getCommandLocalDraft(command.id)),
      global: Object.assign({}, getCommandGlobalDraft(command.id)),
      session: Object.assign({}, getCommandSessionDraft(command.id)),
      commandRemember: Object.assign({}, getCommandRemember(command.id)),
    };
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    syncEditCommandDraftFromDom();
    const draft = uiState.editCommandDraft;

    const titleTrimmed = draft.title ? draft.title.trim() : "";
    const templateTrimmed = draft.template ? draft.template.trim() : "";

    if (titleTrimmed.length < 3) {
      showError("Command Title must be at least 3 characters.");
      render();
      return;
    }

    if (!templateTrimmed) {
      showError("Command Template is required.");
      render();
      return;
    }

    // Apply trimmed values
    draft.title = titleTrimmed;
    draft.template = templateTrimmed;

    if (!draft.groupId) {
      showError("Please select at least one group from the list below.", icons.exclamationTriangle, "warning");
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

    // Read variable values from DOM → write to scope-specific drafts
    document.querySelectorAll(".variable-input").forEach(function (varInput) {
      const cid = varInput.dataset.commandId;
      const vname = varInput.dataset.variableName;
      if (!cid || !vname) {
        return;
      }
      const scope = varInput.dataset.scope || getCommandRemember(cid)[vname] || "off";
      const val = varInput.dataset.isEmptyValue === "true" ? RECIPES_EMPTY_VALUE : varInput.value;
      if (scope === "local") {
        getCommandLocalDraft(cid)[vname] = val;
      } else if (scope === "global") {
        getCommandGlobalDraft(cid)[vname] = val;
      } else {
        getCommandSessionDraft(cid)[vname] = val;
      }
    });

    // Read toggle states from DOM → update commandRemember
    document.querySelectorAll(".variable-remember-toggle").forEach(function (container) {
      const cid = container.dataset.commandId;
      const vname = container.dataset.variableName;
      const activeBtn = container.querySelector(".toggle-option-3.active");
      if (cid && vname && activeBtn) {
        const rm = getCommandRemember(cid);
        rm[vname] = activeBtn.dataset.value;
        uiState.commandRemember[cid] = rm;
      }
    });

    const savedCommandId = command.id;
    const returnTab = uiState.editSourceTab || "commands";
    uiState.editCommandScopeSnapshot = null; // Discard snapshot — save was intentional
    uiState.editingCommandId = null;
    uiState.editCommandDraft = {
      title: "",
      template: "",
      description: "",
      groupId: "",
    };
    uiState.editSourceTab = null;
    uiState.activeTab = returnTab;
    uiState.pendingScrollCommandId = savedCommandId;
    persistDataThenRender("Command saved.");
    persistCommandVariables();
  });

  const cancelEditButton = document.getElementById("btn-cancel-edit-command");
  if (cancelEditButton) {
    cancelEditButton.addEventListener("click", function () {
      const savedCommandId = command.id;
      const returnTab = uiState.editSourceTab || "commands";

      // Restore scope drafts from snapshot — discard all edits made in this session
      if (uiState.editCommandScopeSnapshot && uiState.editCommandScopeSnapshot.commandId === command.id) {
        uiState.commandLocalDrafts[command.id] = uiState.editCommandScopeSnapshot.local;
        uiState.commandGlobalDrafts[command.id] = uiState.editCommandScopeSnapshot.global;
        uiState.commandSessionDrafts[command.id] = uiState.editCommandScopeSnapshot.session;
        uiState.commandRemember[command.id] = uiState.editCommandScopeSnapshot.commandRemember;
        uiState.editCommandScopeSnapshot = null;
      }

      uiState.editingCommandId = null;
      uiState.editCommandDraft = {
        title: "",
        template: "",
        description: "",
        groupId: "",
      };
      uiState.editSourceTab = null;
      uiState.activeTab = returnTab;
      uiState.pendingScrollCommandId = savedCommandId;
      render();
    });
  }

  const editCommandTitleInput = document.getElementById("edit-command-title");
  const editCommandTemplateInput = document.getElementById("edit-command-template");
  const editCommandDescriptionInput = document.getElementById("edit-command-description");

  if (editCommandTitleInput) {
    editCommandTitleInput.addEventListener("input", function () {
      uiState.editCommandDraft.title = editCommandTitleInput.value;
    });
  }

  if (editCommandTemplateInput) {
    editCommandTemplateInput.addEventListener("input", function () {
      uiState.editCommandDraft.template = editCommandTemplateInput.value;
      // Preserve cursor position before re-render (to update variables section)
      const cursorStart = editCommandTemplateInput.selectionStart;
      const cursorEnd = editCommandTemplateInput.selectionEnd;
      render();
      // Restore focus and cursor after re-render
      const restored = document.getElementById("edit-command-template");
      if (restored) {
        restored.focus();
        restored.setSelectionRange(cursorStart, cursorEnd);
      }
    });
  }

  if (editCommandDescriptionInput) {
    editCommandDescriptionInput.addEventListener("input", function () {
      uiState.editCommandDraft.description = editCommandDescriptionInput.value;
    });
  }

  document.querySelectorAll(".edit-command-group-tag").forEach(function (tabButton) {
    tabButton.addEventListener("click", function () {
      const groupId = tabButton.dataset.groupId;
      uiState.editCommandDraft.groupId = uiState.editCommandDraft.groupId === groupId ? "" : groupId;
      render();
    });
  });

  document.querySelectorAll(".variable-input").forEach(function (input) {
    // Write typed value to the correct scope draft based on data-scope attribute
    input.addEventListener("input", function () {
      const commandId = input.dataset.commandId;
      const variableName = input.dataset.variableName;
      const scope = input.dataset.scope || getCommandRemember(commandId)[variableName] || "off";
      const val = input.value;
      if (scope === "local") {
        getCommandLocalDraft(commandId)[variableName] = val;
      } else if (scope === "global") {
        getCommandGlobalDraft(commandId)[variableName] = val;
      } else {
        getCommandSessionDraft(commandId)[variableName] = val;
      }
      // Update scope indicator dots
      const toggleContainer = document.querySelector(
        '.variable-remember-toggle[data-command-id="' + commandId + '"][data-variable-name="' + variableName + '"]'
      );
      updateScopeIndicatorDots(toggleContainer, commandId, variableName, scope);
    });

    // Alt+0 to toggle empty value — writes to the scope-specific draft
    input.addEventListener("keydown", function (e) {
      if (e.altKey && e.key === "0") {
        e.preventDefault();
        const commandId = input.dataset.commandId;
        const varName = input.dataset.variableName;
        const scope = input.dataset.scope || getCommandRemember(commandId)[varName] || "off";
        if (!varName || !commandId) {
          return;
        }
        const scopeDraft =
          scope === "local"
            ? getCommandLocalDraft(commandId)
            : scope === "global"
              ? getCommandGlobalDraft(commandId)
              : getCommandSessionDraft(commandId);
        if (input.dataset.isEmptyValue === "true") {
          const saved = input.dataset.preEmptyValue !== undefined ? input.dataset.preEmptyValue : "";
          input.removeAttribute("data-pre-empty-value");
          input.readOnly = false;
          input.removeAttribute("data-is-empty-value");
          input.value = saved;
          scopeDraft[varName] = saved;
        } else {
          input.setAttribute("data-pre-empty-value", input.value);
          input.readOnly = true;
          input.setAttribute("data-is-empty-value", "true");
          input.value = "[EmptyValue]";
          scopeDraft[varName] = RECIPES_EMPTY_VALUE;
        }
      }
    });
  });

  // Bind category selector in edit tab (custom select)
  bindCustomSelect(
    "edit-category-select-wrap",
    "edit-category-select-btn",
    "edit-category-select-menu",
    function (newCategoryId) {
      uiState.editCommandDraft.targetCategoryId = newCategoryId;
      // If the user reverts to the original category, restore the original groupId
      if (newCategoryId === command.categoryId) {
        uiState.editCommandDraft.groupId = command.groupId || "";
      } else {
        uiState.editCommandDraft.groupId = ""; // reset group — it belongs to the new category
      }
      render();
    }
  );

  // Bind helpUrl input in edit tab
  const editHelpUrlInput = document.getElementById("edit-command-help-url");
  if (editHelpUrlInput) {
    editHelpUrlInput.addEventListener("input", function () {
      uiState.editCommandDraft.helpUrl = editHelpUrlInput.value;
    });
  }

  // Bind Enum Manager buttons in edit tab
  document.querySelectorAll(".btn-open-enum-manager").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const varName = btn.dataset.varName;
      const commandId = btn.dataset.commandId || null;

      let currentEnumValues = [];
      if (commandId === null || commandId === "") {
        const meta = uiState.newCommandDraft.variableMeta && uiState.newCommandDraft.variableMeta[varName];
        currentEnumValues =
          meta && meta.type === "enum" && meta.enumValues
            ? meta.enumValues.map(function (e) {
                return Object.assign({}, e);
              })
            : [];
      } else {
        const meta = uiState.editCommandDraft.variableMeta && uiState.editCommandDraft.variableMeta[varName];
        currentEnumValues =
          meta && meta.type === "enum" && meta.enumValues
            ? meta.enumValues.map(function (e) {
                return Object.assign({}, e);
              })
            : [];
      }

      enumManagerState = {
        visible: true,
        commandId: commandId === "" ? null : commandId,
        varName,
        enumValues: currentEnumValues,
        editIndex: null,
        editTitle: "",
        editValue: "",
        editDescription: "",
      };
      render();
    });
  });

  // Bind toggle switches in edit tab — switches active scope without re-render
  document.querySelectorAll(".variable-remember-toggle").forEach(function (container) {
    container.querySelectorAll(".toggle-option-3").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.disabled) {
          return;
        }

        const commandId = container.dataset.commandId;
        const variableName = container.dataset.variableName;
        const newScope = btn.dataset.value;

        // Find the corresponding input element
        const inputEl = document.querySelector(
          '.variable-input[data-command-id="' + commandId + '"][data-variable-name="' + variableName + '"]'
        );

        // Step 1: Save current input value to current scope's draft before switching
        if (inputEl) {
          const currentActiveBtn = container.querySelector(".toggle-option-3.active");
          const currentScope = currentActiveBtn ? currentActiveBtn.dataset.value : "off";
          const currentVal = inputEl.dataset.isEmptyValue === "true" ? RECIPES_EMPTY_VALUE : inputEl.value;
          const currentScopeDraft =
            currentScope === "local"
              ? getCommandLocalDraft(commandId)
              : currentScope === "global"
                ? getCommandGlobalDraft(commandId)
                : getCommandSessionDraft(commandId);
          currentScopeDraft[variableName] = currentVal;
        }

        // Step 2: Update active class
        container.querySelectorAll(".toggle-option-3").forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");

        // Step 3: Update commandRemember (scope preference)
        const rememberMap = getCommandRemember(commandId);
        rememberMap[variableName] = newScope;
        uiState.commandRemember[commandId] = rememberMap;

        // Step 4: Load new scope's value into the input
        if (inputEl) {
          let newVal = "";
          if (newScope === "local") {
            newVal = getCommandLocalDraft(commandId)[variableName] || "";
          } else if (newScope === "global") {
            newVal = getCommandGlobalDraft(commandId)[variableName] || "";
          } else {
            newVal = getCommandSessionDraft(commandId)[variableName] || "";
          }
          const isEmptyValue = newVal === RECIPES_EMPTY_VALUE;
          inputEl.value = isEmptyValue ? "[EmptyValue]" : newVal;
          inputEl.readOnly = isEmptyValue;
          if (isEmptyValue) {
            inputEl.setAttribute("data-is-empty-value", "true");
          } else {
            inputEl.removeAttribute("data-is-empty-value");
          }
          inputEl.removeAttribute("data-pre-empty-value");
          inputEl.setAttribute("data-scope", newScope);
        }

        // Step 5: Update scope indicator dots
        updateScopeIndicatorDots(container, commandId, variableName, newScope);
        // No auto-save here — save happens on form submit
      });
    });
  });
}
