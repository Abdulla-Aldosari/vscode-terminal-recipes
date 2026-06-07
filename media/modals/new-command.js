// Terminal Recipes — VS Code Extension
// Copyright (c) 2026 Abdulla Aldosari
// Licensed under the MIT License. See LICENSE in the project root for details.

// media/modals/new-command.js
// Add Command form (rendered as the "add" tab).
// Loads after edit-command.js (renderToggleSwitch3 dependency).

function renderAddCommandTab(selectedCategory) {
  if (!selectedCategory) {
    return `
      <section class="card">
        <p>Add a category first in Categories &amp; Groups tab.</p>
      </section>
    `;
  }

  const groups         = getSelectedCategoryGroups();
  const draft          = uiState.newCommandDraft;
  const autoVarNames   = getEnabledAutoVariableNames();
  const detectedVars   = draft.template
    ? collectVariables([draft.template]).filter(function (n) {
        return !autoVarNames.includes(n);
      })
    : [];
  const newCommandDraft   = getCommandDraft("__new__");
  const newCommandRemember = getCommandRemember("__new__");

  return `
    <section class="card recipe-editor">
      <h2>Add Command to ( ${escapeHtml(selectedCategory.title)} )</h2>
      <form id="form-new-command" class="form-grid add-command-grid">
        <label class="add-command-title">Command Title<input id="new-command-title" class="input" required value="${escapeAttr(draft.title)}" /></label>
        <label class="add-command-template">Command Template (Variables supported)<div class="template-editor-wrap"><div class="template-highlight" aria-hidden="true"></div>
        <textarea id="new-command-template" class="input template-textarea" required placeholder="npm install \${package_name}" rows="1">${escapeHtml(draft.template)}</textarea></div>
        <div class="template-var-legend">

        <span class="legend-item legend-auto hidden" data-tooltip="Reserved variables that are automatically resolved.<br>
        They do not require the user to assign a value."><span class="legend-dot" aria-hidden="true"></span>auto resolved</span>

        <span class="legend-item legend-user hidden" data-tooltip="Variables that are defined by the user.<br>
        Their values must be set by the user."><span class="legend-dot" aria-hidden="true"></span>user defined</span></div>
        </label>
        <label class="full-width">Description<textarea id="new-command-description" class="input" rows="2">${escapeAttr(draft.description)}</textarea></label>
        <div class="full-width grouped-tags-wrap">
          <span class="groups-label">Groups:</span>
          <div class="inline-tags" id="new-command-groups-tags">
            ${groups
              .map(function (group) {
                return `<button type="button" class="tag new-command-group-tag ${draft.groupId === group.id ? "active" : ""}" data-group-id="${escapeAttr(group.id)}">${escapeHtml(group.title)}</button>`;
              })
              .join("")}
          </div>
        </div>
        <label class="full-width">Help URL (optional)<input id="new-command-help-url" class="input" placeholder="https://docs.example.com/command" value="${escapeAttr(draft.helpUrl || "")}" /></label>
        ${
          detectedVars.length
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
            ${detectedVars
              .map(function (name) {
                const rawVal      = newCommandDraft[name];
                const isEmptyVal  = rawVal === RECIPES_EMPTY_VALUE;
                const displayVal  = isEmptyVal ? "[EmptyValue]" : (rawVal || "");
                const rememberValue = newCommandRemember[name] || "off";
                const meta        = draft.variableMeta && draft.variableMeta[name];
                const isEnum      = meta && meta.type === "enum";
                const enumCount   = isEnum ? meta.enumValues.length : 0;
                return `
              <div class="variable-row">
                <label class="variable-name">\${${escapeHtml(name)}}</label>
                <input class="input variable-input" data-command-id="__new__" data-variable-name="${escapeAttr(name)}" value="${escapeAttr(displayVal)}" placeholder="Enter value..."${isEmptyVal ? ' readonly data-is-empty-value="true"' : ""} />
                ${renderToggleSwitch3("__new__", name, rememberValue, "variable-remember-toggle")}
                <button type="button" class="btn small ${isEnum ? "primary" : "secondary"} btn-open-enum-manager" data-var-name="${escapeAttr(name)}" data-command-id="" data-tooltip="Manage Enum values for this variable">
                  ${icons.adjustments} ${isEnum ? `Enum (${enumCount})` : "Set Enum"}
                </button>
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
        <div class="row full-width justify-content-flex-end mt-20">
          <button type="submit" class="btn small primary">Add Command</button>
          <button type="button" id="btn-cancel-add-command" class="btn small secondary action">Cancel</button>
        </div>
      </form>
    </section>
  `;
}

function bindAddCommandTabEvents() {
  const newCommandForm              = document.getElementById("form-new-command");
  const cancelButton                = document.getElementById("btn-cancel-add-command");

  const newCommandTitleInput        = document.getElementById("new-command-title");
  const newCommandTemplateInput     = document.getElementById("new-command-template");
  const newCommandDescriptionInput  = document.getElementById("new-command-description");
  const newCommandHelpUrlInput      = document.getElementById("new-command-help-url");

  if (newCommandTitleInput) {
    newCommandTitleInput.addEventListener("input", function () {
      uiState.newCommandDraft.title = newCommandTitleInput.value;
    });
  }

  if (newCommandTemplateInput) {
    newCommandTemplateInput.addEventListener("input", function () {
      uiState.newCommandDraft.template = newCommandTemplateInput.value;
      // Preserve cursor position before re-render
      const cursorStart = newCommandTemplateInput.selectionStart;
      const cursorEnd   = newCommandTemplateInput.selectionEnd;
      render();
      // Restore focus and cursor after re-render
      const restored = document.getElementById("new-command-template");
      if (restored) {
        restored.focus();
        restored.setSelectionRange(cursorStart, cursorEnd);
      }
    });
  }

  if (newCommandDescriptionInput) {
    newCommandDescriptionInput.addEventListener("input", function () {
      uiState.newCommandDraft.description = newCommandDescriptionInput.value;
    });
  }

  if (newCommandHelpUrlInput) {
    newCommandHelpUrlInput.addEventListener("input", function () {
      uiState.newCommandDraft.helpUrl = newCommandHelpUrlInput.value;
    });
  }

  // --- Enum Manager buttons (in Add Command tab) ---
  document.querySelectorAll(".btn-open-enum-manager").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const varName   = btn.dataset.varName;
      const commandId = btn.dataset.commandId || null;

      // Get current enum values for this variable from the appropriate source
      let currentEnumValues = [];
      if (commandId === null || commandId === "") {
        // New command context
        const meta =
          uiState.newCommandDraft.variableMeta &&
          uiState.newCommandDraft.variableMeta[varName];
        currentEnumValues =
          meta && meta.type === "enum" && meta.enumValues
            ? meta.enumValues.map(function (e) {
                return Object.assign({}, e);
              })
            : [];
      } else {
        // Edit command context
        const meta =
          uiState.editCommandDraft.variableMeta &&
          uiState.editCommandDraft.variableMeta[varName];
        currentEnumValues =
          meta && meta.type === "enum" && meta.enumValues
            ? meta.enumValues.map(function (e) {
                return Object.assign({}, e);
              })
            : [];
      }

      enumManagerState = {
        visible:         true,
        commandId:       commandId === "" ? null : commandId,
        varName,
        enumValues:      currentEnumValues,
        editIndex:       null,
        editTitle:       "",
        editValue:       "",
        editDescription: "",
      };
      render();
    });
  });

  // --- Variable inputs in Add Command tab ---
  document
    .querySelectorAll('.variable-input[data-command-id="__new__"]')
    .forEach(function (input) {
      input.addEventListener("input", function () {
        const variableName = input.dataset.variableName;
        const draft        = getCommandDraft("__new__");
        draft[variableName] = input.value;
        uiState.commandDrafts["__new__"] = draft;
      });

      // Alt+0 to toggle empty value on Add Command tab inputs
      input.addEventListener("keydown", function (e) {
        if (e.altKey && e.key === "0") {
          e.preventDefault();
          const varName = input.dataset.variableName;
          if (!varName) return;
          if (input.dataset.isEmptyValue === "true") {
            input.readOnly = false;
            input.removeAttribute("data-is-empty-value");
            input.value = "";
            const d = getCommandDraft("__new__");
            d[varName] = "";
            uiState.commandDrafts["__new__"] = d;
          } else {
            input.readOnly = true;
            input.setAttribute("data-is-empty-value", "true");
            input.value = "[EmptyValue]";
            const d = getCommandDraft("__new__");
            d[varName] = RECIPES_EMPTY_VALUE;
            uiState.commandDrafts["__new__"] = d;
          }
        }
      });
    });

  // --- Toggle switches in Add Command tab ---
  document
    .querySelectorAll('.variable-remember-toggle[data-command-id="__new__"]')
    .forEach(function (container) {
      container.querySelectorAll(".toggle-option-3").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (btn.disabled) {
            return;
          }
          container.querySelectorAll(".toggle-option-3").forEach(function (b) {
            b.classList.remove("active");
          });
          btn.classList.add("active");
          const variableName = container.dataset.variableName;
          const value        = btn.dataset.value;
          const rememberMap  = getCommandRemember("__new__");
          rememberMap[variableName] = value;
          uiState.commandRemember["__new__"] = rememberMap;
        });
      });
    });

  document
    .querySelectorAll(".new-command-group-tag")
    .forEach(function (tagButton) {
      tagButton.addEventListener("click", function () {
        const groupId = tagButton.dataset.groupId;
        uiState.newCommandDraft.groupId =
          uiState.newCommandDraft.groupId === groupId ? "" : groupId;
        render();
      });
    });

  if (cancelButton) {
    cancelButton.addEventListener("click", function () {
      uiState.newCommandDraft = {
        visible:      false,
        title:        "",
        template:     "",
        description:  "",
        groupId:      "",
        helpUrl:      "",
        variableMeta: {},
      };
      delete uiState.commandDrafts["__new__"];
      delete uiState.commandRemember["__new__"];
      uiState.activeTab = "commands";
      render();
    });
  }

  if (newCommandForm) {
    newCommandForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const selectedCategory = getSelectedCategory();

      if (!selectedCategory) {
        showNotice(
          "Select category first.",
          icons.exclamationTriangle,
          "warning",
        );
        render();
        return;
      }

      const titleInput       = document.getElementById("new-command-title");
      const descriptionInput = document.getElementById("new-command-description");
      const templateInput    = document.getElementById("new-command-template");
      const helpUrlInputEl   = document.getElementById("new-command-help-url");

      const title           = titleInput       ? titleInput.value.trim()       : "";
      const description     = descriptionInput ? descriptionInput.value.trim() : "";
      const commandTemplate = templateInput    ? templateInput.value.trim()    : "";
      const helpUrl         = helpUrlInputEl   ? helpUrlInputEl.value.trim()   : "";
      const groupId         = uiState.newCommandDraft.groupId;
      const variableMeta    = uiState.newCommandDraft.variableMeta || {};

      if (title.length < 3) {
        showError("Command Title must be at least 3 characters.");
        render();
        return;
      }

      if (!commandTemplate) {
        showError("Command Template is required.");
        render();
        return;
      }

      if (!groupId) {
        showError(
          "Please select at least one group from the list below.",
          icons.exclamationTriangle,
          "warning",
        );
        render();
        return;
      }

      const newCommand = {
        id:          generateEntityId("cmd"),
        title,
        description,
        command:     commandTemplate,
        categoryId:  selectedCategory.id,
        groupId,
        ...(helpUrl ? { helpUrl } : {}),
        ...(Object.keys(variableMeta).length > 0 ? { variableMeta } : {}),
      };

      const newCommandId = newCommand.id;
      state.data.commands.push(newCommand);

      // Read latest variable values from DOM before state is cleared
      // If input has data-is-empty-value="true" → store RECIPES_EMPTY_VALUE
      document
        .querySelectorAll('.variable-input[data-command-id="__new__"]')
        .forEach(function (varInput) {
          const vname = varInput.dataset.variableName;
          if (vname) {
            const d = getCommandDraft("__new__");
            d[vname] = varInput.dataset.isEmptyValue === "true"
              ? RECIPES_EMPTY_VALUE
              : varInput.value;
          }
        });

      // Read latest toggle states from DOM
      document
        .querySelectorAll(
          '.variable-remember-toggle[data-command-id="__new__"]',
        )
        .forEach(function (container) {
          const vname     = container.dataset.variableName;
          const activeBtn = container.querySelector(".toggle-option-3.active");
          if (vname && activeBtn) {
            const rm = getCommandRemember("__new__");
            rm[vname] = activeBtn.dataset.value;
          }
        });

      // Transfer variable data from '__new__' to the real newCommandId
      if (uiState.commandDrafts["__new__"]) {
        uiState.commandDrafts[newCommandId] = uiState.commandDrafts["__new__"];
        delete uiState.commandDrafts["__new__"];
      }
      if (uiState.commandRemember["__new__"]) {
        uiState.commandRemember[newCommandId] =
          uiState.commandRemember["__new__"];
        delete uiState.commandRemember["__new__"];
      }

      uiState.newCommandDraft = {
        visible:      false,
        title:        "",
        template:     "",
        description:  "",
        groupId:      "",
        helpUrl:      "",
        variableMeta: {},
      };
      uiState.activeTab              = "commands";
      uiState.pendingScrollCommandId = newCommandId;
      persistDataThenRender("Command added and saved.");
      persistCommandVariables();
    });
  }
}
