// Terminal Recipes — VS Code Extension
// Copyright (c) 2026 Abdulla Aldosari
// Licensed under the MIT License. See LICENSE in the project root for details.

// media/tabs/ai.js
// "Categories & Groups" management tab (also hosts the AI Create entry points)
// and the Enum Manager modal used by both add-command and edit-command tabs.
// Loads after variables.js.

// ─── Manage Tab (Categories & Groups) ────────────────────────────────────────

/**
 * Renders the Categories & Groups management tab (two-panel layout).
 * @returns {string} HTML string
 */
function renderManageTab() {
  const categories       = state.data.categories || [];
  const selectedCategory = getSelectedCategory();
  const selectedGroups   = getSelectedCategoryGroups();

  return `
    <section class="card manage-card">
      <div class="manage-layout">

        <!-- Categories Panel -->
        <div class="manage-panel">
          <div class="manage-panel-header">
            <h2 class="manage-panel-title">Categories</h2>
            <div class="row">
              <button class="btn small secondary ai-create-btn" id="btn-create-with-ai" data-tooltip="Generate a full category with groups and commands using AI">${icons.sparkles} Create with AI</button>
              <button class="btn primary small" id="btn-open-add-category-modal" data-tooltip="Add a new category">+ Add New Category</button>
            </div>
          </div>
          <div class="manage-list">
            ${categories.length === 0 ? `<p class="muted manage-empty">No categories yet.</p>` : ""}
            ${categories
              .map(function (category) {
                const isActive = category.id === uiState.selectedCategoryId;
                return `
              <div class="manage-item ${isActive ? "active" : ""}" data-category-id="${escapeAttr(category.id)}">
                <div class="manage-item-info">
                  <span class="manage-item-label">${escapeHtml(category.title)}</span>
                  <code class="manage-item-count">${
                    (state.data.commands || []).filter(function (c) {
                      return c.categoryId === category.id;
                    }).length
                  }</code>
                </div>
                <div class="manage-item-actions">
                  <button class="btn small secondary btn-rename-category" data-category-id="${escapeAttr(category.id)}" data-category-title="${escapeAttr(category.title)}" data-tooltip="Rename category">Rename</button>
                  <button class="btn small danger btn-delete-category" data-category-id="${escapeAttr(category.id)}" data-category-title="${escapeAttr(category.title)}" data-tooltip="Delete category and all its commands">Delete</button>
                </div>
              </div>
            `;
              })
              .join("")}
          </div>
        </div>

        <!-- Groups Panel -->
        <div class="manage-panel">
          <div class="manage-panel-header">
            <h2 class="manage-panel-title">Groups</h2>
            <button class="btn small primary" id="btn-open-add-group-modal" ${selectedCategory ? "" : "disabled"} data-tooltip="${selectedCategory ? "Add a new group to this category" : "Select a category first"}">+ Add New Group</button>
          </div>
          <div class="manage-list">
            ${!selectedCategory ? `<p class="muted manage-empty">Select a category first.</p>` : ""}
            ${selectedCategory && selectedGroups.length === 0 ? `<p class="muted manage-empty">No groups yet.</p>` : ""}
            ${selectedGroups
              .map(function (group) {
                const isActive = group.id === uiState.selectedGroupId;
                return `
              <div class="manage-item ${isActive ? "active" : ""}" data-group-id="${escapeAttr(group.id)}">
                <div class="manage-item-info">
                  <span class="manage-item-label">${escapeHtml(group.title)}</span>
                  <code class="manage-item-count">${
                    (state.data.commands || []).filter(function (c) {
                      return (
                        c.categoryId === uiState.selectedCategoryId &&
                        c.groupId === group.id
                      );
                    }).length
                  }</code>
                </div>
                <div class="manage-item-actions">
                  <button class="btn small secondary btn-rename-group" data-group-id="${escapeAttr(group.id)}" data-group-title="${escapeAttr(group.title)}" data-tooltip="Rename group">Rename</button>
                  <button class="btn small danger btn-delete-group" data-group-id="${escapeAttr(group.id)}" data-group-title="${escapeAttr(group.title)}" data-tooltip="Delete group">Delete</button>
                </div>
              </div>
            `;
              })
              .join("")}
          </div>
        </div>

      </div>
    </section>
    ${renderManageModal()}
  `;
}

/**
 * Renders the inline modal for add/rename category/group actions.
 * Returns empty string if the modal is not currently visible.
 * @returns {string} HTML string
 */
function renderManageModal() {
  if (!manageModalState.visible) {
    return "";
  }

  const mode = manageModalState.mode;
  let title       = "";
  let placeholder = "";
  let btnLabel    = "";

  if (mode === "add-category") {
    title       = "Add New Category";
    placeholder = "Category name...";
    btnLabel    = "Add";
  } else if (mode === "rename-category") {
    title       = "Rename Category";
    placeholder = "New name...";
    btnLabel    = "Rename";
  } else if (mode === "add-group") {
    title       = "Add New Group";
    placeholder = "Group name...";
    btnLabel    = "Add";
  } else if (mode === "rename-group") {
    title       = "Rename Group";
    placeholder = "New name...";
    btnLabel    = "Rename";
  }

  return `
    <div class="modal-overlay" id="manage-modal-overlay" data-dismiss-on-outside-click="false">
      <div class="modal-box">
        <h3>${escapeHtml(title)}</h3>
        <input id="manage-modal-input" class="input" placeholder="${escapeAttr(placeholder)}" value="${escapeAttr(manageModalState.value)}" autocomplete="off" />
        <div class="row justify-content-flex-end">
          <button class="btn small primary min-w65" id="btn-manage-modal-confirm">${escapeHtml(btnLabel)}</button>
          <button class="btn small secondary action min-w65" id="btn-manage-modal-cancel">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

function bindManageTabEvents() {
  // --- Category item click (select category) ---
  document
    .querySelectorAll(".manage-item[data-category-id]")
    .forEach(function (item) {
      item.addEventListener("click", function (e) {
        // Don't trigger selection if a button inside was clicked
        if (e.target.closest("button")) {
          return;
        }

        setSelectedCategory(item.dataset.categoryId);
        uiState.selectedGroupId = "all";
        render();
      });
    });

  // --- Group item click (select group) ---
  document
    .querySelectorAll(".manage-item[data-group-id]")
    .forEach(function (item) {
      item.addEventListener("click", function (e) {
        if (e.target.closest("button")) {
          return;
        }

        uiState.selectedGroupId = item.dataset.groupId;
        render();
      });
    });

  // --- Open Add Category Modal ---
  const addCategoryBtn = document.getElementById("btn-open-add-category-modal");
  if (addCategoryBtn) {
    addCategoryBtn.addEventListener("click", function () {
      manageModalState = { visible: true, mode: "add-category", value: "" };
      render();
      const input = document.getElementById("manage-modal-input");
      if (input) {
        input.focus();
      }
    });
  }

  // --- Open Add Group Modal ---
  const addGroupBtn = document.getElementById("btn-open-add-group-modal");
  if (addGroupBtn) {
    addGroupBtn.addEventListener("click", function () {
      manageModalState = { visible: true, mode: "add-group", value: "" };
      render();
      const input = document.getElementById("manage-modal-input");
      if (input) {
        input.focus();
      }
    });
  }

  // --- Rename Category buttons ---
  document.querySelectorAll(".btn-rename-category").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const categoryId    = btn.dataset.categoryId;
      const categoryTitle = btn.dataset.categoryTitle;
      setSelectedCategory(categoryId);
      manageModalState = {
        visible: true,
        mode:    "rename-category",
        value:   categoryTitle,
      };
      render();
      const input = document.getElementById("manage-modal-input");
      if (input) {
        input.focus();
        input.select();
      }
    });
  });

  // --- Delete Category buttons ---
  document.querySelectorAll(".btn-delete-category").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const categoryId    = btn.dataset.categoryId;
      const categoryTitle = btn.dataset.categoryTitle;
      setSelectedCategory(categoryId);
      deleteConfirmState = {
        type:  "category",
        id:    categoryId,
        title: categoryTitle,
      };
      render();
    });
  });

  // --- Rename Group buttons ---
  document.querySelectorAll(".btn-rename-group").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const groupId    = btn.dataset.groupId;
      const groupTitle = btn.dataset.groupTitle;
      uiState.selectedGroupId = groupId;
      manageModalState = {
        visible: true,
        mode:    "rename-group",
        value:   groupTitle,
      };
      render();
      const input = document.getElementById("manage-modal-input");
      if (input) {
        input.focus();
        input.select();
      }
    });
  });

  // --- Delete Group buttons ---
  document.querySelectorAll(".btn-delete-group").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const groupId    = btn.dataset.groupId;
      const groupTitle = btn.dataset.groupTitle;
      uiState.selectedGroupId = groupId;
      deleteConfirmState = {
        type:  "group",
        id:    groupId,
        title: groupTitle,
      };
      render();
    });
  });

  // --- Modal Confirm ---
  const modalConfirmBtn = document.getElementById("btn-manage-modal-confirm");
  if (modalConfirmBtn) {
    modalConfirmBtn.addEventListener("click", function () {
      executeManageModalConfirm();
    });
  }

  // --- Modal Cancel ---
  const modalCancelBtn = document.getElementById("btn-manage-modal-cancel");
  if (modalCancelBtn) {
    modalCancelBtn.addEventListener("click", function () {
      manageModalState = { visible: false, mode: null, value: "" };
      render();
    });
  }

  // --- Modal Input: confirm on Enter ---
  const modalInput = document.getElementById("manage-modal-input");
  if (modalInput) {
    modalInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        executeManageModalConfirm();
      }
      if (e.key === "Escape") {
        manageModalState = { visible: false, mode: null, value: "" };
        render();
      }
    });
  }
}

function executeManageModalConfirm() {
  const input = document.getElementById("manage-modal-input");
  const value = input ? input.value.trim() : "";
  const mode  = manageModalState.mode;

  if (!value) {
    showNotice("Name is required.", icons.exclamationTriangle, "warning");
    if (input) {
      input.focus();
    }
    return;
  }

  if (mode === "add-category") {
    const newCategory = {
      id:     generateEntityId("cat"),
      title:  value,
      groups: [],
    };
    state.data.categories.push(newCategory);
    setSelectedCategory(newCategory.id);
    uiState.selectedGroupId = "all";
    manageModalState = { visible: false, mode: null, value: "" };
    persistDataThenRender("Category added and saved.");
    return;
  }

  if (mode === "rename-category") {
    const category = getSelectedCategory();
    if (category) {
      category.title = value;
    }
    manageModalState = { visible: false, mode: null, value: "" };
    persistDataThenRender("Category renamed and saved.");
    return;
  }

  if (mode === "add-group") {
    const selectedCategory = getSelectedCategory();
    if (!selectedCategory) {
      showNotice(
        "Select a category first.",
        icons.exclamationTriangle,
        "warning",
      );
      return;
    }
    const newGroup = {
      id:    generateEntityId("grp"),
      title: value,
    };
    selectedCategory.groups = selectedCategory.groups || [];
    selectedCategory.groups.push(newGroup);
    uiState.selectedGroupId = newGroup.id;
    manageModalState = { visible: false, mode: null, value: "" };
    persistDataThenRender("Group added and saved.");
    return;
  }

  if (mode === "rename-group") {
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
    manageModalState = { visible: false, mode: null, value: "" };
    persistDataThenRender("Group renamed and saved.");
    return;
  }
}

// ─── Enum Manager Modal ────────────────────────────────────────────────────────

/**
 * Renders the Enum Manager modal for a specific variable.
 */
function renderEnumManagerModal() {
  const s      = enumManagerState;
  const values = s.enumValues || [];

  const rowsHtml = values
    .map(function (item, idx) {
      return `
      <tr class="enum-row" data-idx="${idx}">
        <td class="enum-cell-title">${escapeHtml(item.title)}</td>
        <td class="enum-cell-value"><code>${escapeHtml(item.value)}</code></td>
        <td class="enum-cell-desc">${escapeHtml(item.description)}</td>
        <td class="enum-cell-actions">
          <div>
            <button type="button" class="btn icon-btn small secondary btn-enum-edit" data-idx="${idx}" data-tooltip="Edit enum value">${icons.edit}</button>
            <button type="button" class="btn icon-btn small danger btn-enum-delete" data-idx="${idx}" data-tooltip="Delete enum value">${icons.delete}</button>
          </div>
        </td>
      </tr>
          `;
    })
    .join("");

  const editFormHtml = `
    <div class="enum-add-form">
      <h4>${s.editIndex !== null ? "Edit Enum Value" : "Add Enum Value"}</h4>
      <div class="enum-form-grid">
        <label>Title<input id="enum-input-title" class="input" placeholder="e.g. Silent" value="${escapeAttr(s.editTitle)}" autocomplete="off" /></label>
        <label>Value<input id="enum-input-value" class="input" placeholder="e.g. silent" value="${escapeAttr(s.editValue)}" autocomplete="off" /></label>
        <label class="enum-form-desc">Description<input id="enum-input-desc" class="input" placeholder="What this option does..." value="${escapeAttr(s.editDescription)}" autocomplete="off" /></label>
      </div>
      <div class="row justify-content-flex-end">
        <button type="button" class="btn small primary" id="btn-enum-add-confirm">${s.editIndex !== null ? "Update" : "+ Add"}</button>
        ${s.editIndex !== null ? '<button type="button" class="btn small secondary action" id="btn-enum-edit-cancel">Cancel Edit</button>' : ""}
      </div>
    </div>
  `;

  return `
    <div class="modal-overlay" id="enum-manager-overlay" data-dismiss-on-outside-click="false">
      <div class="modal-box enum-manager-box">
        <div class="row between">
          <h3>Enum Values for <code>\${${escapeHtml(s.varName)}}</code></h3>
        </div>
        ${
          values.length > 0
            ? `
        <div class="table-wrap">
          <div class="enum-table-scroll">
            <table class="enum-table">
              <thead><tr>
                <th>Title</th><th>Value</th><th>Description</th><th></th>
              </tr></thead>
              <tbody>${rowsHtml}</tbody>
            </table>
          </div>
        </div>`
            : `<p class="muted muted-no-margin">No enum values yet. Add one below.</p>`
        }
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
  const confirmBtn = document.getElementById("btn-enum-add-confirm");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", function () {
      const titleInput = document.getElementById("enum-input-title");
      const valueInput = document.getElementById("enum-input-value");
      const descInput  = document.getElementById("enum-input-desc");

      const title       = titleInput ? titleInput.value.trim() : "";
      const value       = valueInput ? valueInput.value.trim() : "";
      const description = descInput  ? descInput.value.trim()  : "";

      if (!title || !value) {
        showNotice(
          "Title and Value are required.",
          icons.exclamationTriangle,
          "warning",
        );
        return;
      }

      if (enumManagerState.editIndex !== null) {
        enumManagerState.enumValues[enumManagerState.editIndex] = {
          title,
          value,
          description,
        };
        enumManagerState.editIndex       = null;
        enumManagerState.editTitle       = "";
        enumManagerState.editValue       = "";
        enumManagerState.editDescription = "";
      } else {
        enumManagerState.enumValues.push({ title, value, description });
        enumManagerState.editTitle       = "";
        enumManagerState.editValue       = "";
        enumManagerState.editDescription = "";
      }

      render();
    });
  }

  // --- Cancel edit ---
  const cancelEditBtn = document.getElementById("btn-enum-edit-cancel");
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", function () {
      enumManagerState.editIndex       = null;
      enumManagerState.editTitle       = "";
      enumManagerState.editValue       = "";
      enumManagerState.editDescription = "";
      render();
    });
  }

  // --- Edit row buttons ---
  document.querySelectorAll(".btn-enum-edit").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const idx  = parseInt(btn.dataset.idx, 10);
      const item = enumManagerState.enumValues[idx];
      if (!item) {
        return;
      }
      enumManagerState.editIndex       = idx;
      enumManagerState.editTitle       = item.title;
      enumManagerState.editValue       = item.value;
      enumManagerState.editDescription = item.description;
      render();
    });
  });

  // --- Delete row buttons ---
  document.querySelectorAll(".btn-enum-delete").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const idx = parseInt(btn.dataset.idx, 10);
      enumManagerState.enumValues.splice(idx, 1);
      if (enumManagerState.editIndex === idx) {
        enumManagerState.editIndex       = null;
        enumManagerState.editTitle       = "";
        enumManagerState.editValue       = "";
        enumManagerState.editDescription = "";
      }
      render();
    });
  });

  // --- Save enum to command state ---
  const saveBtn = document.getElementById("btn-enum-manager-save");
  if (saveBtn) {
    saveBtn.addEventListener("click", function () {
      const varName    = enumManagerState.varName;
      const commandId  = enumManagerState.commandId;
      const enumValues = enumManagerState.enumValues.slice();

      // Apply to the correct draft's variableMeta
      if (commandId === null) {
        // New command context
        if (!uiState.newCommandDraft.variableMeta) {
          uiState.newCommandDraft.variableMeta = {};
        }
        if (enumValues.length > 0) {
          uiState.newCommandDraft.variableMeta[varName] = {
            type: "enum",
            enumValues,
          };
        } else {
          delete uiState.newCommandDraft.variableMeta[varName];
        }
      } else {
        // Edit command context — find command and update
        const command = (state.data.commands || []).find(function (c) {
          return c.id === commandId;
        });
        if (command) {
          if (!command.variableMeta) {
            command.variableMeta = {};
          }
          if (enumValues.length > 0) {
            command.variableMeta[varName] = { type: "enum", enumValues };
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
          uiState.editCommandDraft.variableMeta[varName] = {
            type: "enum",
            enumValues,
          };
        } else {
          delete uiState.editCommandDraft.variableMeta[varName];
        }
      }

      enumManagerState = {
        visible:         false,
        commandId:       null,
        varName:         "",
        enumValues:      [],
        editIndex:       null,
        editTitle:       "",
        editValue:       "",
        editDescription: "",
      };
      render();
    });
  }

  // --- Cancel ---
  const cancelBtn = document.getElementById("btn-enum-manager-cancel");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", function () {
      enumManagerState = {
        visible:         false,
        commandId:       null,
        varName:         "",
        enumValues:      [],
        editIndex:       null,
        editTitle:       "",
        editValue:       "",
        editDescription: "",
      };
      render();
    });
  }

  // --- Live input tracking ---
  const titleInput = document.getElementById("enum-input-title");
  const valueInput = document.getElementById("enum-input-value");
  const descInput  = document.getElementById("enum-input-desc");

  if (titleInput) {
    titleInput.addEventListener("input", function () {
      enumManagerState.editTitle = titleInput.value;
    });
  }
  if (valueInput) {
    valueInput.addEventListener("input", function () {
      enumManagerState.editValue = valueInput.value;
    });
  }
  if (descInput) {
    descInput.addEventListener("input", function () {
      enumManagerState.editDescription = descInput.value;
    });
  }
}
