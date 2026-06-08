// Terminal Recipes — VS Code Extension
// Copyright (c) 2026 Abdulla Aldosari
// Licensed under the MIT License. See LICENSE in the project root for details.

// media/tabs/commands.js
// "Commands" tab — category/group filtering, command card list, column visibility, sorting mode.
// Also contains all command action buttons binding, delete confirm, and drag-and-drop.
// Loads after recent.js.

function renderCommandsTab(selectedCategory) {
  // Show edit form inline when editing
  if (uiState.editingCommandId) {
    return renderEditTab();
  }

  const groups   = getSelectedCategoryGroups();
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
        <button class="btn small secondary ml-auto${uiState.sortingMode ? " sort-btn-active" : ""}" id="btn-toggle-sort" data-tooltip="${uiState.sortingMode ? "Click to exit sort mode" : "Drag to reorder commands"}">${icons.sort} ${uiState.sortingMode ? "Done Sorting" : "Sort"}</button>
        ${renderColumnToggleDropdown()}
        <button class="btn small secondary ai-create-btn" id="btn-add-with-ai" data-tooltip="${uiState.selectedGroupId === "all" ? "Select a specific group first" : "Generate a command using AI"}" ${uiState.selectedGroupId === "all" || uiState.sortingMode ? "disabled" : ""}>${icons.sparkles} Add with AI</button>
      </div>
      <div class="group-tags-row${uiState.sortingMode ? " sort-disabled-wrap" : ""}">
        <span class="groups-label">Groups:</span>
        <button class="tag group-filter-tag ${uiState.selectedGroupId === "all" ? "active" : ""}" data-group-id="all">All</button>
        ${groups
          .map(function (group) {
            return `<button class="tag group-filter-tag ${uiState.selectedGroupId === group.id ? "active" : ""}" data-group-id="${escapeAttr(group.id)}">${escapeHtml(group.title)}</button>`;
          })
          .join("")}
      </div>
      <div class="table-panel">
        ${renderCommandsTable(commands, groups)}
      </div>
    </section>
  `;
}

function renderCustomCategorySelect() {
  const categories    = state.data.categories || [];
  const selected      = getSelectedCategory();
  const selectedTitle = selected ? selected.title : "Select category";

  const items = categories
    .map(function (category) {
      const isSelected = category.id === uiState.selectedCategoryId;
      return `
      <div class="cs-item" role="menuitem" tabindex="-1" data-value="${escapeAttr(category.id)}">
        <span class="cs-item-label">${escapeHtml(category.title)}</span>
        ${isSelected ? icons.checkmark : ""}
      </div>
    `;
    })
    .join("");

  return `
    <div class="cs-wrap${uiState.sortingMode ? " sort-disabled-wrap" : ""}" id="custom-category-select">
      <button class="cs-btn" type="button" aria-haspopup="menu" aria-expanded="false" id="cs-btn-toggle">
        <span class="cs-btn-label">${escapeHtml(selectedTitle)}</span>
        ${icons.chevron}
      </button>
      <div class="cs-menu" role="menu" id="cs-menu" hidden>
        ${items}
      </div>
    </div>
  `;
}

function renderColumnToggleDropdown() {
  const columns = [
    { key: "description", label: "Description" },
    { key: "groups",      label: "Groups" },
  ];

  const items = columns
    .map(function (col) {
      const checked = uiState.columnVisibility[col.key];
      return `
      <label class="col-toggle-item" data-col-key="${escapeAttr(col.key)}">
        <input type="checkbox" class="col-toggle-checkbox" data-col-key="${escapeAttr(col.key)}" ${checked ? "checked" : ""} />
        <span class="col-toggle-label">${escapeHtml(col.label)}</span>
      </label>
    `;
    })
    .join("");

  return `
    <div class="cs-wrap${uiState.sortingMode ? " sort-disabled-wrap" : ""}" id="col-toggle-wrap">
      <button class="cs-btn cs-btn-col-toggle" type="button" aria-haspopup="menu" aria-expanded="false" id="col-toggle-btn" data-tooltip="Show/Hide Columns">
        ${icons.column}
        <span class="cs-btn-label col-toggle-btn-label">Columns</span>
        ${icons.chevron}
      </button>
      <div class="cs-menu col-toggle-menu" id="col-toggle-menu" hidden>
        <div class="col-toggle-header">Show/Hide Columns</div>
        ${items}
      </div>
    </div>
  `;
}

function renderCommandsTable(commands, groups) {
  if (!commands.length) {
    return "<p>No commands found for this filter.</p>";
  }

  const isSorting = uiState.sortingMode;

  const tableClasses = [
    "cmds-table commands-table main-table",
    !uiState.columnVisibility.description ? "hide-description" : "",
    !uiState.columnVisibility.groups ? "hide-groups" : "",
    isSorting ? "sorting-mode" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `
    <div class="table-wrap">
      <table class="${tableClasses}" id="commands-sortable-table">
        <thead>
          <tr>
            ${isSorting ? '<th class="main-t-drag-handle-column"></th>' : ""}
            <th class="main-t-title-column">Title</th>
            <th class="main-t-description-column">Description</th>
            <th class="main-t-template-column">Template</th>
            <th class="main-t-groups-column">Groups</th>
            ${!isSorting ? '<th class="main-t-action-column">Actions</th>' : ""}
          </tr>
        </thead>
        <tbody>
          ${commands
            .map(function (command) {
              const titleHtml = command.helpUrl
                ? `<a class="cmd-title-link" data-url="${escapeAttr(command.helpUrl)}" data-tooltip="Open documentation">${escapeHtml(command.title)}</a>`
                : `<strong>${escapeHtml(command.title)}</strong>`;
              const _useVars = collectVariables([command.command]).filter(
                function (n) {
                  return n !== "workspaceFolder";
                },
              );
              const _useMissing  = getMissingVariables(command);
              const _useCtrlHint =
                _useVars.length > 0 && _useMissing.length === 0;
              const _useTitle = _useCtrlHint
                ? "Insert into terminal (without running)<br>Press CTRL key to edit the variables"
                : "Insert into terminal (without running)";
              return `
              <tr data-command-id="${escapeAttr(command.id)}" draggable="${isSorting ? "true" : "false"}">
                ${isSorting ? `<td class="main-t-drag-handle-column drag-handle-cell"><span class="drag-handle" data-tooltip="Drag to reorder">${icons.dragHandle}</span></td>` : ""}
                <td class="main-t-title-column">${titleHtml}<br><span class="muted">${escapeHtml(command.id)}</span></td>
                <td class="main-t-description-column">${escapeHtml(command.description || "-")}</td>
                <td class="main-t-template-column"><pre class="template-cell">${highlightTemplateHtml(command.command)}</pre></td>
                <td class="main-t-groups-column">${escapeHtml(resolveGroupTitle(command.groupId || "", groups))}</td>
                ${
                  !isSorting
                    ? `<td class="main-t-action-column">
                <div class="actions-cell">
                  <button class="btn icon-btn success btn-run" data-command-id="${escapeAttr(command.id)}" data-tooltip="Run command">${icons.run}</button>
                  ${command.command.includes("\n") ? `<button class="btn icon-btn secondary" disabled data-tooltip="Use is not available for multi-line commands">${icons.use}</button>` : `<button class="btn icon-btn secondary btn-use action" data-command-id="${escapeAttr(command.id)}" data-tooltip="${escapeAttr(_useTitle)}">${icons.use}</button>`}
                  <button class="btn icon-btn secondary btn-copy action" data-command-id="${escapeAttr(command.id)}" data-tooltip="Copy to clipboard">${icons.copy}</button>
                  <button class="btn icon-btn secondary btn-edit action" data-command-id="${escapeAttr(command.id)}" data-tooltip="Edit command">${icons.edit}</button>
                  <button class="btn icon-btn danger btn-delete-command" data-command-id="${escapeAttr(command.id)}" data-tooltip="Delete command">${icons.delete}</button>
                  ${(function () {
                    const _fs  = getFavoriteScope(command.id);
                    const _cls =
                      _fs === "none"
                        ? "secondary"
                        : _fs === "local"
                          ? "fav-state-local"
                          : _fs === "global"
                            ? "fav-state-global"
                            : "fav-state-both";
                    const _icon =
                      _fs === "none" ? icons.heartPlus : icons.heartActive;
                    const _tip =
                      _fs === "none"
                        ? 'Ctrl+Click: Add Global  •  Ctrl+Right-Click: Remove Global<br>Shift+Click: Add Local  •  Shift+Right-Click: Remove Local<br>Ctrl+Shift+Click: Add Both  •  Ctrl+Shift+Right-Click: Remove Both<br><span class="muted-tip">(Click to manage)</span>'
                        : _fs === "local"
                          ? "In Local Favorites<br>(click to manage)"
                          : _fs === "global"
                            ? "In Global Favorites<br>(click to manage)"
                            : "In Local &amp; Global Favorites<br>(click to manage)";
                    return `<button class="btn icon-btn ${_cls} btn-add-favorite" data-command-id="${escapeAttr(command.id)}" data-tooltip="${escapeAttr(_tip)}" data-tooltip-pos="left">${_icon}</button>`;
                  })()}
                </div>
                </td>`
                    : ""
                }
              </tr>
            `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * Reads the current DOM row order and syncs it back to state.data.commands,
 * then persists. Called after live DOM reordering completes (on dragend).
 */
function syncCommandOrderFromDOM(tbody) {
  var rows = tbody.querySelectorAll("tr[data-command-id]");
  if (!rows.length) {
    return;
  }

  var allCommands = state.data.commands;

  // Step 1: new order of visible command IDs (as they appear in the DOM right now)
  var newOrderIds = [];
  rows.forEach(function (row) {
    newOrderIds.push(row.dataset.commandId);
  });

  // Step 2: build a set of visible IDs for fast lookup
  var visibleIdSet = {};
  newOrderIds.forEach(function (id) {
    visibleIdSet[id] = true;
  });

  // Step 3: find which positions in allCommands belong to the visible set
  var visibleIndices = [];
  for (var i = 0; i < allCommands.length; i++) {
    if (visibleIdSet[allCommands[i].id]) {
      visibleIndices.push(i);
    }
  }

  // Step 4: build a lookup map id → command object
  var cmdMap = {};
  allCommands.forEach(function (c) {
    cmdMap[c.id] = c;
  });

  // Step 5: write new order into exactly those positions
  newOrderIds.forEach(function (id, idx) {
    if (idx < visibleIndices.length && cmdMap[id]) {
      allCommands[visibleIndices[idx]] = cmdMap[id];
    }
  });

  persistDataThenRender("Order saved.");
}

/**
 * Binds live-reorder Drag & Drop on the sortable commands table.
 * Rows are physically moved in the DOM during dragover — no drop indicator line.
 * Supports auto-scroll when dragging near the top/bottom edges of the viewport.
 */
function bindDragAndDrop() {
  var table = document.getElementById("commands-sortable-table");
  if (!table) {
    return;
  }

  var draggedRow     = null;
  var draggedId      = null;
  var lastTargetId   = null;
  var autoScrollTimer = null;
  var lastDragY      = 0;
  var SCROLL_ZONE    = 80;
  var SCROLL_SPEED   = 12;

  function stopAutoScroll() {
    if (autoScrollTimer) {
      cancelAnimationFrame(autoScrollTimer);
      autoScrollTimer = null;
    }
  }

  function startAutoScroll() {
    stopAutoScroll();
    function frame() {
      var y  = lastDragY;
      var vh = window.innerHeight;
      if (y < SCROLL_ZONE) {
        window.scrollBy(0, -SCROLL_SPEED * (1 - y / SCROLL_ZONE));
      } else if (y > vh - SCROLL_ZONE) {
        window.scrollBy(
          0,
          SCROLL_SPEED * ((y - (vh - SCROLL_ZONE)) / SCROLL_ZONE),
        );
      }
      autoScrollTimer = requestAnimationFrame(frame);
    }
    autoScrollTimer = requestAnimationFrame(frame);
  }

  var tbody = table.querySelector("tbody");
  if (!tbody) {
    return;
  }

  // dragstart
  table.querySelectorAll('tr[draggable="true"]').forEach(function (row) {
    row.addEventListener("dragstart", function (e) {
      draggedRow  = row;
      draggedId   = row.dataset.commandId;
      lastTargetId = null;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", draggedId);
      // Delay so the ghost image captures the row before opacity drops
      setTimeout(function () {
        row.classList.add("row-dragging");
      }, 0);
      startAutoScroll();
    });

    // dragend — sync DOM order to state and persist
    row.addEventListener("dragend", function () {
      row.classList.remove("row-dragging");
      stopAutoScroll();
      if (draggedRow) {
        syncCommandOrderFromDOM(tbody);
      }
      draggedRow   = null;
      draggedId    = null;
      lastTargetId = null;
    });
  });

  // dragover — live DOM reorder
  tbody.addEventListener("dragover", function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    lastDragY = e.clientY;

    if (!draggedRow) {
      return;
    }

    var targetRow = e.target.closest("tr[data-command-id]");
    if (!targetRow || targetRow === draggedRow) {
      return;
    }

    var targetId = targetRow.dataset.commandId;

    // Determine: insert before or after target based on mouse Y
    var rect         = targetRow.getBoundingClientRect();
    var midY         = rect.top + rect.height / 2;
    var insertBefore = e.clientY < midY;

    // Build a positional key to avoid redundant DOM moves
    var posKey = targetId + (insertBefore ? "-before" : "-after");
    if (posKey === lastTargetId) {
      return;
    }
    lastTargetId = posKey;

    // Move the dragged row in the DOM immediately
    if (insertBefore) {
      tbody.insertBefore(draggedRow, targetRow);
    } else {
      var nextSibling = targetRow.nextElementSibling;
      if (nextSibling) {
        tbody.insertBefore(draggedRow, nextSibling);
      } else {
        tbody.appendChild(draggedRow);
      }
    }
  });

  // drop — just prevent default; dragend handles the persist
  tbody.addEventListener("drop", function (e) {
    e.preventDefault();
  });
}

function bindCommandsTabEvents() {
  // --- Custom category select ---
  const csWrap = document.getElementById("custom-category-select");
  const csBtn  = document.getElementById("cs-btn-toggle");
  const csMenu = document.getElementById("cs-menu");

  if (csBtn && csMenu) {
    // Helper: close the menu and remove listeners
    function closeMenu() {
      if (!csMenu.hidden) {
        csMenu.hidden = true;
        csBtn.setAttribute("aria-expanded", "false");
      }
      document.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("blur", onWindowBlur);
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
    csBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = !csMenu.hidden;

      if (isOpen) {
        closeMenu();
      } else {
        csMenu.hidden = false;
        csBtn.setAttribute("aria-expanded", "true");
        // Register outside-click and blur listeners
        document.addEventListener("pointerdown", onPointerDown, true);
        window.addEventListener("blur", onWindowBlur);
      }
    });

    // Item click → select + close
    csMenu.querySelectorAll(".cs-item").forEach(function (item) {
      item.addEventListener("click", function () {
        setSelectedCategory(item.dataset.value);
        uiState.selectedGroupId = "all";
        closeMenu();
        render();
      });

      // Hover: add/remove data-highlighted
      item.addEventListener("mouseenter", function () {
        item.setAttribute("data-highlighted", "");
      });
      item.addEventListener("mouseleave", function () {
        item.removeAttribute("data-highlighted");
      });
    });
  }

  document.querySelectorAll(".group-filter-tag").forEach(function (tagButton) {
    tagButton.addEventListener("click", function () {
      uiState.selectedGroupId = tagButton.dataset.groupId;
      // Exit sort mode when switching groups
      if (uiState.sortingMode) {
        uiState.sortingMode = false;
      }
      render();
    });
  });

  // --- Sort Toggle Button ---
  var sortBtn = document.getElementById("btn-toggle-sort");
  if (sortBtn) {
    sortBtn.addEventListener("click", function () {
      uiState.sortingMode = !uiState.sortingMode;
      render();
    });
  }

  // --- ESC key to exit sort mode ---
  if (uiState.sortingMode) {
    document.addEventListener("keydown", function onEscExitSort(e) {
      if (e.key === "Escape") {
        uiState.sortingMode = false;
        document.removeEventListener("keydown", onEscExitSort);
        render();
      }
    });
  }

  // --- Bind Drag & Drop if sorting mode is active ---
  if (uiState.sortingMode) {
    bindDragAndDrop();
  }

  // --- Column Toggle Dropdown ---
  const colToggleWrap = document.getElementById("col-toggle-wrap");
  const colToggleBtn  = document.getElementById("col-toggle-btn");
  const colToggleMenu = document.getElementById("col-toggle-menu");

  if (colToggleBtn && colToggleMenu) {
    function closeColMenu() {
      if (!colToggleMenu.hidden) {
        colToggleMenu.hidden = true;
        colToggleBtn.setAttribute("aria-expanded", "false");
      }
      document.removeEventListener("pointerdown", onColPointerDown, true);
    }

    function onColPointerDown(e) {
      if (colToggleWrap && !colToggleWrap.contains(e.target)) {
        closeColMenu();
      }
    }

    colToggleBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = !colToggleMenu.hidden;
      if (isOpen) {
        closeColMenu();
      } else {
        colToggleMenu.hidden = false;
        colToggleBtn.setAttribute("aria-expanded", "true");
        document.addEventListener("pointerdown", onColPointerDown, true);
      }
    });

    // Checkbox change → update state + re-render table only (keep menu open)
    colToggleMenu
      .querySelectorAll(".col-toggle-checkbox")
      .forEach(function (checkbox) {
        checkbox.addEventListener("change", function (e) {
          // Stop propagation so the pointerdown outside-click doesn't fire and close the menu
          e.stopPropagation();
          const colKey = checkbox.dataset.colKey;
          if (
            colKey &&
            Object.prototype.hasOwnProperty.call(
              uiState.columnVisibility,
              colKey,
            )
          ) {
            uiState.columnVisibility[colKey] = checkbox.checked;
            // Persist to localStorage
            try {
              localStorage.setItem(
                "columnVisibility",
                JSON.stringify(uiState.columnVisibility),
              );
            } catch {}
            // Re-render just the table panel without closing the menu
            const tablePanel = document.querySelector(".table-panel");
            if (tablePanel) {
              const groups   = getSelectedCategoryGroups();
              const commands = getVisibleCommands();
              tablePanel.innerHTML = renderCommandsTable(commands, groups);
              bindCommandActionButtons();
            }
          }
        });
      });
  }
}

function performCommandAction(commandId, action, forceShowVariables) {
  const command = (state.data.commands || []).find(function (item) {
    return item.id === commandId;
  });

  if (!command) {
    return;
  }

  const autoVarNames  = getEnabledAutoVariableNames();
  const allVars       = collectVariables([command.command]).filter(function (name) {
    return !autoVarNames.includes(name);
  });
  const hasVariables  = allVars.length > 0;

  // If CTRL is held and the command has variables → force open the variable input modal
  if (forceShowVariables && hasVariables) {
    const rememberMap     = getCommandRemember(commandId);
    const inputValues     = {};
    const rememberFlags   = {};
    const localScopeBuffer   = {};
    const globalScopeBuffer  = {};
    const sessionScopeBuffer = {};
    allVars.forEach(function (name) {
      const pref = rememberMap[name] || (state.workspaceFolder ? "local" : "global");
      var lv = getCommandLocalDraft(commandId)[name];
      var gv = getCommandGlobalDraft(commandId)[name];
      var sv = getCommandSessionDraft(commandId)[name];
      localScopeBuffer[name]   = lv !== undefined ? lv : "";
      globalScopeBuffer[name]  = gv !== undefined ? gv : "";
      sessionScopeBuffer[name] = sv !== undefined ? sv : "";
      rememberFlags[name] = pref;
      inputValues[name]   = pref === "local" ? localScopeBuffer[name]
                          : pref === "global" ? globalScopeBuffer[name]
                          : sessionScopeBuffer[name];
    });
    variableInputState = {
      commandId,
      action,
      missingVariables:   allVars,
      inputValues,
      rememberFlags,
      localScopeBuffer,
      globalScopeBuffer,
      sessionScopeBuffer,
      returnToRunConfirm: false,
    };
    render();
    return;
  }

  // Default behavior: open modal only if there are missing variables
  const missing = getMissingVariables(command);

  if (missing.length > 0) {
    const rememberMap     = getCommandRemember(commandId);
    const inputValues     = {};
    const rememberFlags   = {};
    const localScopeBuffer   = {};
    const globalScopeBuffer  = {};
    const sessionScopeBuffer = {};
    allVars.forEach(function (name) {
      const pref = rememberMap[name] || (state.workspaceFolder ? "local" : "global");
      var lv = getCommandLocalDraft(commandId)[name];
      var gv = getCommandGlobalDraft(commandId)[name];
      var sv = getCommandSessionDraft(commandId)[name];
      localScopeBuffer[name]   = lv !== undefined ? lv : "";
      globalScopeBuffer[name]  = gv !== undefined ? gv : "";
      sessionScopeBuffer[name] = sv !== undefined ? sv : "";
      rememberFlags[name] = pref;
      inputValues[name]   = pref === "local" ? localScopeBuffer[name]
                          : pref === "global" ? globalScopeBuffer[name]
                          : sessionScopeBuffer[name];
    });
    variableInputState = {
      commandId,
      action,
      missingVariables:   allVars,
      inputValues,
      rememberFlags,
      localScopeBuffer,
      globalScopeBuffer,
      sessionScopeBuffer,
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

  const resolved          = resolveCommandTemplate(command);
  const commandVariables  = buildCommandVariablesPayload();

  vscode.postMessage({
    type: "performAction",
    payload: {
      action,
      commandId,
      resolvedCommand: resolved,
      commandVariables,
      ...(shellPath ? { shellPath } : {}),
      ...(shellName ? { shellName } : {}),
    },
  });
}

function bindCommandActionButtons() {
  document.querySelectorAll(".btn-run").forEach(function (button) {
    button.addEventListener("click", function () {
      syncEditCommandDraftFromDom();
      const commandId = button.dataset.commandId;
      const command   = (state.data.commands || []).find(function (item) {
        return item.id === commandId;
      });

      if (!command) {
        return;
      }

      const missing = getMissingVariables(command);

      if (missing.length > 0) {
        const autoVarNames  = getEnabledAutoVariableNames();
        const allVars       = collectVariables([command.command]).filter(
          function (name) { return !autoVarNames.includes(name); },
        );
        const rememberMap     = getCommandRemember(commandId);
        const inputValues     = {};
        const rememberFlags   = {};
        const localScopeBuffer   = {};
        const globalScopeBuffer  = {};
        const sessionScopeBuffer = {};
        allVars.forEach(function (name) {
          const pref = rememberMap[name] || (state.workspaceFolder ? "local" : "global");
          var lv = getCommandLocalDraft(commandId)[name];
          var gv = getCommandGlobalDraft(commandId)[name];
          var sv = getCommandSessionDraft(commandId)[name];
          localScopeBuffer[name]   = lv !== undefined ? lv : "";
          globalScopeBuffer[name]  = gv !== undefined ? gv : "";
          sessionScopeBuffer[name] = sv !== undefined ? sv : "";
          rememberFlags[name] = pref;
          inputValues[name]   = pref === "local" ? localScopeBuffer[name]
                              : pref === "global" ? globalScopeBuffer[name]
                              : sessionScopeBuffer[name];
        });
        variableInputState = {
          commandId,
          action:             "run",
          missingVariables:   allVars,
          inputValues,
          rememberFlags,
          localScopeBuffer,
          globalScopeBuffer,
          sessionScopeBuffer,
          returnToRunConfirm: false,
        };
        render();
        return;
      }

      runConfirmState = {
        commandId,
        resolvedCommand:   resolveCommandTemplate(command),
        selectedShellPath: runConfirmState.selectedShellPath,
        selectedShellName: runConfirmState.selectedShellName,
      };

      render();
    });
  });

  document.querySelectorAll(".btn-use").forEach(function (button) {
    button.addEventListener("click", function (e) {
      syncEditCommandDraftFromDom();
      performCommandAction(button.dataset.commandId, "use", e.ctrlKey);
    });
  });

  document.querySelectorAll(".btn-copy").forEach(function (button) {
    button.addEventListener("click", function () {
      syncEditCommandDraftFromDom();
      performCommandAction(button.dataset.commandId, "copy");
    });
  });

  document.querySelectorAll(".btn-edit").forEach(function (button) {
    button.addEventListener("click", function () {
      const commandId = button.dataset.commandId;
      const command   = (state.data.commands || []).find(function (item) {
        return item.id === commandId;
      });

      // Save the tab we came from so we can return to it
      uiState.editSourceTab    = uiState.activeTab;
      uiState.editingCommandId = commandId;

      if (command) {
        uiState.editCommandDraft = {
          title:          command.title || "",
          template:       command.command || "",
          description:    command.description || "",
          groupId:        command.groupId || "",
          helpUrl:        command.helpUrl || "",
          variableMeta:   command.variableMeta
            ? JSON.parse(JSON.stringify(command.variableMeta))
            : {},
          targetCategoryId: command.categoryId || "",
        };
      }

      // Do NOT change activeTab — keep it as-is, tabs will show no active selection
      render();
    });
  });

  document.querySelectorAll(".btn-delete-command").forEach(function (button) {
    button.addEventListener("click", function () {
      const commandId = button.dataset.commandId;
      const command   = (state.data.commands || []).find(function (item) {
        return item.id === commandId;
      });

      deleteConfirmState = {
        type:     "command",
        id:       commandId,
        title:    command ? command.title : commandId,
        template: command ? command.command : "",
      };
      render();
    });
  });

  // --- Add to Favorites buttons (in Commands and Recent tabs) ---
  document.querySelectorAll(".btn-add-favorite").forEach(function (button) {
    // ── Left-click ────────────────────────────────────────────────────────────
    button.addEventListener("click", function (e) {
      const commandId   = button.dataset.commandId;
      const ctrlOrMeta  = e.ctrlKey || e.metaKey;
      const shift       = e.shiftKey;
      const hasWorkspace = !!state.workspaceFolder;

      if (ctrlOrMeta && shift) {
        // Ctrl+Shift+Click → Add to Both
        const newGlobal = state.globalFavorites.includes(commandId)
          ? state.globalFavorites
          : state.globalFavorites.concat([commandId]);
        const newLocal = hasWorkspace
          ? state.localFavorites.includes(commandId)
            ? state.localFavorites
            : state.localFavorites.concat([commandId])
          : state.localFavorites;
        state.globalFavorites = newGlobal;
        state.localFavorites  = newLocal;
        persistFavorites({ global: newGlobal, local: newLocal });
        showNotice(
          hasWorkspace
            ? "Added to Global & Local Favorites."
            : "Added to Global Favorites. (No workspace for local)",
          icons.heartPlus,
          "success",
        );
        render();
      } else if (ctrlOrMeta) {
        // Ctrl+Click → Add to Global
        const newGlobal = state.globalFavorites.includes(commandId)
          ? state.globalFavorites
          : state.globalFavorites.concat([commandId]);
        state.globalFavorites = newGlobal;
        persistFavorites({ global: newGlobal, local: state.localFavorites });
        showNotice("Added to Global Favorites.", icons.heartPlus, "success");
        render();
      } else if (shift) {
        // Shift+Click → Add to Local (requires workspace)
        if (!hasWorkspace) {
          showNotice(
            "Local favorites require an open workspace.",
            icons.exclamationTriangle,
            "warning",
          );
          paintNotice();
          return;
        }
        const newLocal = state.localFavorites.includes(commandId)
          ? state.localFavorites
          : state.localFavorites.concat([commandId]);
        state.localFavorites = newLocal;
        persistFavorites({ global: state.globalFavorites, local: newLocal });
        showNotice("Added to Local Favorites.", icons.heartPlus, "success");
        render();
      } else {
        // Plain click → Open unified manage modal
        favoriteModalState = {
          visible:       true,
          commandId,
          selectedLocal:  state.localFavorites.includes(commandId),
          selectedGlobal: state.globalFavorites.includes(commandId),
        };
        render();
      }
    });

    // ── Right-click (contextmenu) — modifier key required ─────────────────────
    button.addEventListener("contextmenu", function (e) {
      const ctrlOrMeta = e.ctrlKey || e.metaKey;
      const shift      = e.shiftKey;

      // Only intercept when a modifier is held; otherwise let global handler handle it
      if (!ctrlOrMeta && !shift) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const commandId   = button.dataset.commandId;
      const hasWorkspace = !!state.workspaceFolder;

      if (ctrlOrMeta && shift) {
        // Ctrl+Shift+Right → Remove from Both
        const newGlobal = state.globalFavorites.filter(function (id) {
          return id !== commandId;
        });
        const newLocal = state.localFavorites.filter(function (id) {
          return id !== commandId;
        });
        state.globalFavorites = newGlobal;
        state.localFavorites  = newLocal;
        persistFavorites({ global: newGlobal, local: newLocal });
        showNotice(
          "Removed from Global & Local Favorites.",
          icons.heartMinus,
          "info",
        );
        render();
      } else if (ctrlOrMeta) {
        // Ctrl+Right → Remove from Global
        if (state.globalFavorites.includes(commandId)) {
          const newGlobal = state.globalFavorites.filter(function (id) {
            return id !== commandId;
          });
          state.globalFavorites = newGlobal;
          persistFavorites({ global: newGlobal, local: state.localFavorites });
          showNotice(
            "Removed from Global Favorites.",
            icons.heartMinus,
            "info",
          );
          render();
        }
      } else if (shift) {
        // Shift+Right → Remove from Local (requires workspace)
        if (!hasWorkspace) {
          showNotice(
            "Local favorites require an open workspace.",
            icons.exclamationTriangle,
            "warning",
          );
          paintNotice();
          return;
        }
        if (state.localFavorites.includes(commandId)) {
          const newLocal = state.localFavorites.filter(function (id) {
            return id !== commandId;
          });
          state.localFavorites = newLocal;
          persistFavorites({ global: state.globalFavorites, local: newLocal });
          showNotice("Removed from Local Favorites.", icons.heartMinus, "info");
          render();
        }
      }
    });
  });

  // Bind favorite modal events if modal is visible (from Commands/Recent tab)
  if (favoriteModalState.visible) {
    bindFavoriteModalEvents();
  }

  const confirmRunYesButton      = document.getElementById("btn-confirm-run-yes");
  const confirmRunNoButton       = document.getElementById("btn-confirm-run-no");
  const confirmRunVariablesButton = document.getElementById("btn-confirm-run-variables");

  // --- Shell selector dropdown ---
  const shellSelectorWrap = document.getElementById("shell-selector-wrap");
  const shellSelectorBtn  = document.getElementById("shell-selector-btn");
  const shellSelectorMenu = document.getElementById("shell-selector-menu");

  if (shellSelectorBtn && shellSelectorMenu) {
    function closeShellMenu() {
      if (!shellSelectorMenu.hidden) {
        shellSelectorMenu.hidden = true;
        shellSelectorBtn.setAttribute("aria-expanded", "false");
      }
      document.removeEventListener("pointerdown", onShellPointerDown, true);
    }

    function onShellPointerDown(e) {
      if (shellSelectorWrap && !shellSelectorWrap.contains(e.target)) {
        closeShellMenu();
      }
    }

    shellSelectorBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = !shellSelectorMenu.hidden;
      if (isOpen) {
        closeShellMenu();
      } else {
        shellSelectorMenu.hidden = false;
        shellSelectorBtn.setAttribute("aria-expanded", "true");
        document.addEventListener("pointerdown", onShellPointerDown, true);
      }
    });

    shellSelectorMenu.querySelectorAll(".cs-item").forEach(function (item) {
      item.addEventListener("click", function () {
        runConfirmState.selectedShellName = item.dataset.shellName || null;
        runConfirmState.selectedShellPath = item.dataset.shellPath || null;
        closeShellMenu();
        render();
      });

      item.addEventListener("mouseenter", function () {
        item.setAttribute("data-highlighted", "");
      });
      item.addEventListener("mouseleave", function () {
        item.removeAttribute("data-highlighted");
      });
    });
  }

  if (confirmRunYesButton) {
    confirmRunYesButton.addEventListener("click", function () {
      const commandId  = runConfirmState.commandId;
      const shellPath  = runConfirmState.selectedShellPath || null;
      const shellName  = runConfirmState.selectedShellName || null;
      runConfirmState = {
        commandId:         null,
        resolvedCommand:   "",
        selectedShellPath: shellPath,
        selectedShellName: shellName,
      };
      render();

      if (!commandId) {
        return;
      }

      dispatchCommandAction(commandId, "run", shellPath, shellName);
    });
  }

  if (confirmRunNoButton) {
    confirmRunNoButton.addEventListener("click", function () {
      runConfirmState = {
        commandId:         null,
        resolvedCommand:   "",
        selectedShellPath: runConfirmState.selectedShellPath,
        selectedShellName: runConfirmState.selectedShellName,
      };
      render();
    });
  }

  if (confirmRunVariablesButton) {
    confirmRunVariablesButton.addEventListener("click", function () {
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

      const autoVarNamesRunVars = getEnabledAutoVariableNames();
      const allVars             = collectVariables([command.command]).filter(
        function (name) {
          return !autoVarNamesRunVars.includes(name);
        },
      );

      const rememberMap     = getCommandRemember(commandId);
      const inputValues     = {};
      const rememberFlags   = {};
      const localScopeBuffer   = {};
      const globalScopeBuffer  = {};
      const sessionScopeBuffer = {};

      allVars.forEach(function (name) {
        const pref = rememberMap[name] || (state.workspaceFolder ? "local" : "global");
        var lv = getCommandLocalDraft(commandId)[name];
        var gv = getCommandGlobalDraft(commandId)[name];
        var sv = getCommandSessionDraft(commandId)[name];
        localScopeBuffer[name]   = lv !== undefined ? lv : "";
        globalScopeBuffer[name]  = gv !== undefined ? gv : "";
        sessionScopeBuffer[name] = sv !== undefined ? sv : "";
        rememberFlags[name] = pref;
        inputValues[name]   = pref === "local" ? localScopeBuffer[name]
                            : pref === "global" ? globalScopeBuffer[name]
                            : sessionScopeBuffer[name];
      });

      variableInputState = {
        commandId,
        action:             "run",
        missingVariables:   allVars,
        inputValues,
        rememberFlags,
        localScopeBuffer,
        globalScopeBuffer,
        sessionScopeBuffer,
        returnToRunConfirm: true,
      };

      render();
    });
  }

  // Alt+0 to toggle empty value on modal inputs
  document.querySelectorAll(".variable-modal-input").forEach(function (input) {
    input.addEventListener("keydown", function (e) {
      if (e.altKey && e.key === "0") {
        e.preventDefault();
        const varName = input.dataset.variableName;
        if (!varName) return;
        if (input.dataset.isEmptyValue === "true") {
          input.readOnly = false;
          input.removeAttribute("data-is-empty-value");
          input.value = "";
          variableInputState.inputValues[varName] = "";
        } else {
          input.readOnly = true;
          input.setAttribute("data-is-empty-value", "true");
          input.value = "[EmptyValue]";
          variableInputState.inputValues[varName] = RECIPES_EMPTY_VALUE;
        }
      }
    });
  });

  // Bind custom selects for enum variables in variable input modal
  document
    .querySelectorAll(".enum-input-wrap[data-variable-name]")
    .forEach(function (wrapEl) {
      const varName = wrapEl.dataset.variableName;
      if (!varName) {
        return;
      }
      bindCustomSelect(
        "enum-var-wrap-" + varName,
        "enum-var-btn-" + varName,
        "enum-var-menu-" + varName,
        function (selectedValue) {
          const customInput = wrapEl.querySelector(
            ".variable-modal-custom-input",
          );
          if (selectedValue === "__custom__") {
            if (customInput) {
              customInput.classList.remove("hidden");
              customInput.focus();
            }
          } else {
            if (customInput) {
              customInput.classList.add("hidden");
              customInput.value = selectedValue;
            }
            variableInputState.inputValues[varName] = selectedValue;
          }
        },
      );
    });

  // Bind toggle switches in variable input modal — switches active scope + updates input/dropdown value
  document
    .querySelectorAll(".variable-modal-remember-toggle")
    .forEach(function (container) {
      container.querySelectorAll(".toggle-option-3").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (btn.disabled) { return; }

          const varName   = container.dataset.variableName;
          const commandId = variableInputState.commandId;
          const newScope  = btn.dataset.value;

          // Find the modal text input and the enum wrap for this variable
          const inputEl = document.querySelector(".variable-modal-input[data-variable-name=\"" + varName + "\"]");
          const enumWrap = document.getElementById("enum-var-wrap-" + varName);

          // Determine the current value from the modal (enum dropdown or text input)
          var currentActiveVal = variableInputState.inputValues[varName] || "";
          if (inputEl && !inputEl.classList.contains("hidden")) {
            currentActiveVal = inputEl.dataset.isEmptyValue === "true" ? RECIPES_EMPTY_VALUE : inputEl.value;
          }

          // Step 1: Save current value to current scope BUFFER (not scope draft)
          const currentActiveBtn = container.querySelector(".toggle-option-3.active");
          const currentScope     = currentActiveBtn ? currentActiveBtn.dataset.value : "off";
          if (variableInputState.localScopeBuffer && currentScope === "local") {
            variableInputState.localScopeBuffer[varName] = currentActiveVal;
          } else if (variableInputState.globalScopeBuffer && currentScope === "global") {
            variableInputState.globalScopeBuffer[varName] = currentActiveVal;
          } else if (variableInputState.sessionScopeBuffer) {
            variableInputState.sessionScopeBuffer[varName] = currentActiveVal;
          }

          // Step 2: Update active class
          container.querySelectorAll(".toggle-option-3").forEach(function (b) {
            b.classList.remove("active");
          });
          btn.classList.add("active");

          // Step 3: Update rememberFlag
          variableInputState.rememberFlags[varName] = newScope;

          // Step 4: Load new scope's value from BUFFER
          var newVal = "";
          if (variableInputState.localScopeBuffer && newScope === "local") {
            newVal = variableInputState.localScopeBuffer[varName] || "";
          } else if (variableInputState.globalScopeBuffer && newScope === "global") {
            newVal = variableInputState.globalScopeBuffer[varName] || "";
          } else if (variableInputState.sessionScopeBuffer) {
            newVal = variableInputState.sessionScopeBuffer[varName] || "";
          }
          variableInputState.inputValues[varName] = newVal;

          // Step 5a: Update text input (for non-enum or enum custom input)
          if (inputEl) {
            const isEmptyValue = newVal === RECIPES_EMPTY_VALUE;
            inputEl.value    = isEmptyValue ? "[EmptyValue]" : newVal;
            inputEl.readOnly = isEmptyValue;
            if (isEmptyValue) { inputEl.setAttribute("data-is-empty-value", "true"); }
            else { inputEl.removeAttribute("data-is-empty-value"); }
          }

          // Step 5b: If this is an Enum variable, also update the dropdown selection
          if (enumWrap && commandId) {
            const command    = (state.data.commands || []).find(function (c) { return c.id === commandId; });
            const enumMeta   = command && command.variableMeta && command.variableMeta[varName];
            const isEnum     = enumMeta && enumMeta.type === "enum" && enumMeta.enumValues && enumMeta.enumValues.length > 0;
            if (isEnum) {
              const displayVal = newVal === RECIPES_EMPTY_VALUE ? "" : newVal;
              const isInEnum   = enumMeta.enumValues.some(function (ev) { return ev.value === displayVal; });
              const btnEl      = document.getElementById("enum-var-btn-" + varName);
              const menuEl     = document.getElementById("enum-var-menu-" + varName);
              const customEl   = enumWrap.querySelector(".variable-modal-custom-input");

              if (isInEnum) {
                // Show the selected enum option
                if (btnEl) { var lbl = btnEl.querySelector(".cs-btn-label"); if (lbl) lbl.textContent = displayVal; }
                if (menuEl) {
                  menuEl.querySelectorAll(".cs-item").forEach(function (item) {
                    item.querySelectorAll(".cs-check").forEach(function (el) { el.remove(); });
                    if (item.dataset.value === displayVal) { item.insertAdjacentHTML("beforeend", icons.checkmark); }
                  });
                }
                if (customEl) { customEl.classList.add("hidden"); }
                if (inputEl)  { inputEl.classList.add("hidden"); }
              } else {
                // Switch to custom input mode
                if (btnEl) { var lbl2 = btnEl.querySelector(".cs-btn-label"); if (lbl2) lbl2.textContent = "✏️ Custom value..."; }
                if (menuEl) {
                  menuEl.querySelectorAll(".cs-item").forEach(function (item) {
                    item.querySelectorAll(".cs-check").forEach(function (el) { el.remove(); });
                    if (item.dataset.value === "__custom__") { item.insertAdjacentHTML("beforeend", icons.checkmark); }
                  });
                }
                if (customEl) { customEl.classList.remove("hidden"); customEl.value = displayVal; }
                if (inputEl)  { inputEl.classList.remove("hidden"); inputEl.value = displayVal; }
              }
            }
          }

          // Step 6: Update scope indicator dots
          updateScopeIndicatorDots(container, commandId, varName, newScope);
        });
      });
    });

  var variableInputConfirmButton = document.getElementById(
    "btn-variable-input-confirm",
  );
  var variableInputCancelButton = document.getElementById(
    "btn-variable-input-cancel",
  );

  if (variableInputConfirmButton) {
    variableInputConfirmButton.addEventListener("click", function () {
      const commandId = variableInputState.commandId;
      const action    = variableInputState.action;

      if (!commandId || !action) {
        variableInputState = {
          commandId:          null,
          action:             null,
          missingVariables:   [],
          inputValues:        {},
          rememberFlags:      {},
          returnToRunConfirm: false,
        };
        render();
        return;
      }

      // Collect remember flags from toggle switches in the modal DOM
      document
        .querySelectorAll(".variable-modal-remember-toggle")
        .forEach(function (container) {
          const varName   = container.dataset.variableName;
          const activeBtn = container.querySelector(".toggle-option-3.active");
          variableInputState.rememberFlags[varName] = activeBtn
            ? activeBtn.dataset.value
            : "off";
        });

      // Collect current DOM values → update the active scope's buffer
      document
        .querySelectorAll(".variable-modal-input")
        .forEach(function (input) {
          const varName = input.dataset.variableName;
          if (!varName) return;
          const val = input.dataset.isEmptyValue === "true" ? RECIPES_EMPTY_VALUE : input.value;
          variableInputState.inputValues[varName] = val;
          const scope = variableInputState.rememberFlags[varName] || "off";
          if (scope === "local" && variableInputState.localScopeBuffer) {
            variableInputState.localScopeBuffer[varName] = val;
          } else if (scope === "global" && variableInputState.globalScopeBuffer) {
            variableInputState.globalScopeBuffer[varName] = val;
          } else if (variableInputState.sessionScopeBuffer) {
            variableInputState.sessionScopeBuffer[varName] = val;
          }
        });

      // Write ALL scope buffers to their respective scope drafts (Cancel-safe approach)
      variableInputState.missingVariables.forEach(function (varName) {
        if (variableInputState.localScopeBuffer && variableInputState.localScopeBuffer[varName] !== undefined) {
          getCommandLocalDraft(commandId)[varName] = variableInputState.localScopeBuffer[varName];
        }
        if (variableInputState.globalScopeBuffer && variableInputState.globalScopeBuffer[varName] !== undefined) {
          getCommandGlobalDraft(commandId)[varName] = variableInputState.globalScopeBuffer[varName];
        }
        if (variableInputState.sessionScopeBuffer && variableInputState.sessionScopeBuffer[varName] !== undefined) {
          getCommandSessionDraft(commandId)[varName] = variableInputState.sessionScopeBuffer[varName];
        }
      });

      // Apply remember flags → update commandRemember (scope preference)
      const rememberMap = getCommandRemember(commandId);
      Object.keys(variableInputState.rememberFlags).forEach(function (varName) {
        rememberMap[varName] = variableInputState.rememberFlags[varName];
      });
      uiState.commandRemember[commandId] = rememberMap;

      // Always persist — buildCommandVariablesPayload writes only non-empty scope values
      persistCommandVariables();

      // Close variable input modal
      variableInputState = {
        commandId:          null,
        action:             null,
        missingVariables:   [],
        inputValues:        {},
        rememberFlags:      {},
        returnToRunConfirm: false,
      };

      if (action === "run") {
        const command = (state.data.commands || []).find(function (item) {
          return item.id === commandId;
        });

        if (command) {
          runConfirmState = {
            commandId,
            resolvedCommand:   resolveCommandTemplate(command),
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
    variableInputCancelButton.addEventListener("click", function () {
      const returnToRunConfirm = variableInputState.returnToRunConfirm;
      variableInputState = {
        commandId:          null,
        action:             null,
        missingVariables:   [],
        inputValues:        {},
        rememberFlags:      {},
        returnToRunConfirm: false,
      };

      if (!returnToRunConfirm) {
        runConfirmState = {
          commandId:         null,
          resolvedCommand:   "",
          selectedShellPath: runConfirmState.selectedShellPath,
          selectedShellName: runConfirmState.selectedShellName,
        };
      }

      render();
    });
  }

  var confirmDeleteYesButton = document.getElementById("btn-confirm-delete-yes");
  var confirmDeleteNoButton  = document.getElementById("btn-confirm-delete-no");

  if (confirmDeleteYesButton) {
    confirmDeleteYesButton.addEventListener("click", function () {
      executeDeleteConfirm();
    });
  }

  if (confirmDeleteNoButton) {
    confirmDeleteNoButton.addEventListener("click", function () {
      deleteConfirmState = { type: null, id: null, title: "", template: "" };
      render();
    });
  }
}

/** Execute the pending delete action based on deleteConfirmState */
function executeDeleteConfirm() {
  var type = deleteConfirmState.type;
  var id   = deleteConfirmState.id;

  deleteConfirmState = { type: null, id: null, title: "", template: "" };

  if (type === "clearRecent") {
    (state.data.commands || []).forEach(function (cmd) {
      delete cmd.lastRunAt;
      delete cmd.runCount;
    });
    persistDataThenRender("Recent history cleared.");
    return;
  }

  if (type === "category") {
    state.data.categories = (state.data.categories || []).filter(
      function (category) {
        return category.id !== id;
      },
    );

    state.data.commands = (state.data.commands || []).filter(
      function (command) {
        return command.categoryId !== id;
      },
    );

    if (uiState.selectedCategoryId === id) {
      uiState.selectedCategoryId = "";
      uiState.selectedGroupId    = "all";
    }

    if (uiState.editingCommandId) {
      var editCmd = (state.data.commands || []).find(function (c) {
        return c.id === uiState.editingCommandId;
      });

      if (!editCmd) {
        uiState.editingCommandId = null;
        uiState.editCommandDraft = {
          title:       "",
          template:    "",
          description: "",
          groupId:     "",
        };
      }
    }

    persistDataThenRender("Category deleted and saved.");
    return;
  }

  if (type === "group") {
    var selectedCategory = getSelectedCategory();

    if (selectedCategory) {
      selectedCategory.groups = (selectedCategory.groups || []).filter(
        function (group) {
          return group.id !== id;
        },
      );

      (state.data.commands || []).forEach(function (command) {
        if (
          command.categoryId === selectedCategory.id &&
          command.groupId === id
        ) {
          command.groupId = "";
        }
      });
    }

    if (uiState.selectedGroupId === id) {
      uiState.selectedGroupId = "all";
    }

    persistDataThenRender("Group deleted and saved.");
    return;
  }

  if (type === "command") {
    state.data.commands = (state.data.commands || []).filter(
      function (command) {
        return command.id !== id;
      },
    );

    delete uiState.commandDrafts[id];
    delete uiState.commandLocalDrafts[id];
    delete uiState.commandGlobalDrafts[id];
    delete uiState.commandSessionDrafts[id];
    delete uiState.commandRemember[id];

    if (
      state.commandVariables.commands &&
      Object.prototype.hasOwnProperty.call(state.commandVariables.commands, id)
    ) {
      delete state.commandVariables.commands[id];
    }

    if (
      state.globalCommandVariables &&
      state.globalCommandVariables.commands &&
      Object.prototype.hasOwnProperty.call(
        state.globalCommandVariables.commands,
        id,
      )
    ) {
      delete state.globalCommandVariables.commands[id];
    }

    if (uiState.editingCommandId === id) {
      uiState.editingCommandId = null;
      uiState.editCommandDraft = {
        title:       "",
        template:    "",
        description: "",
        groupId:     "",
      };
      runConfirmState = {
        commandId:         null,
        resolvedCommand:   "",
        selectedShellPath: runConfirmState.selectedShellPath,
        selectedShellName: runConfirmState.selectedShellName,
      };
      uiState.activeTab = "commands";
    }

    persistDataThenRender("Command deleted and saved.");
    return;
  }
}
