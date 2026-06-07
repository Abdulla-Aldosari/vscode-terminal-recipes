// Terminal Recipes — VS Code Extension
// Copyright (c) 2026 Abdulla Aldosari
// Licensed under the MIT License. See LICENSE in the project root for details.

// media/utils.js
// Pure utility functions and the custom select component system.
// All functions are either stateless or read minimally from uiState/state.
// Loads after icons.js.

// ─── HTML Helpers ─────────────────────────────────────────────────────────────

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ─── Time Helpers ─────────────────────────────────────────────────────────────

function timeAgo(isoString) {
  if (!isoString) {
    return "–";
  }
  const diff    = Date.now() - new Date(isoString).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) {
    return "just now";
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  }
  return `${Math.floor(months / 12)} year${Math.floor(months / 12) !== 1 ? "s" : ""} ago`;
}

function formatDateTime(isoString) {
  if (!isoString) {
    return "";
  }
  try {
    return new Date(isoString).toLocaleString();
  } catch {
    return isoString;
  }
}

// ─── ID / Entity Helpers ──────────────────────────────────────────────────────

function generateEntityId(prefix) {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

// ─── Variable Collection & Resolution ─────────────────────────────────────────

/**
 * Collects all ${varName} placeholder names from an array of command templates.
 * @param {string[]} commandTemplates
 * @returns {string[]}
 */
function collectVariables(commandTemplates) {
  const names = new Set();
  const regex = /\$\{([a-zA-Z0-9_]+)\}/g;

  commandTemplates.forEach(function (template) {
    if (typeof template !== "string") {
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

/**
 * Returns a list of currently enabled auto variable names.
 * Used to exclude these variables from input prompts.
 * @returns {string[]}
 */
function getEnabledAutoVariableNames() {
  return (state.autoVariables || [])
    .filter(function (v) {
      return v.enabled;
    })
    .map(function (v) {
      return v.name;
    });
}

function getMissingVariables(command) {
  const names        = collectVariables([command.command]);
  const draft        = getCommandDraft(command.id);
  const autoVarNames = getEnabledAutoVariableNames();

  return names.filter(function (name) {
    if (autoVarNames.includes(name)) {
      return false;
    }
    // RECIPES_EMPTY_VALUE is an explicit empty value — it is NOT missing
    if (draft[name] === RECIPES_EMPTY_VALUE) {
      return false;
    }
    return !draft[name];
  });
}

/**
 * Resolves a command template by substituting all ${varName} tokens
 * with values from the command draft and auto variables.
 * @param {object} command - the command object with .command template
 * @returns {string}
 */
function resolveCommandTemplate(command) {
  const names        = collectVariables([command.command]);
  let resolved       = command.command;
  const draft        = getCommandDraft(command.id);
  const autoVarNames = getEnabledAutoVariableNames();

  names.forEach(function (name) {
    // Auto variables: use currentValue from state.autoVariables for preview
    if (autoVarNames.includes(name)) {
      const autoVarDef = (state.autoVariables || []).find(function (v) {
        return v.name === name;
      });
      const value = autoVarDef ? autoVarDef.currentValue || "" : "";
      resolved = resolved.replace(
        new RegExp("\\$\\{" + escapeRegExp(name) + "\\}", "g"),
        value,
      );
      return;
    }
    // Regular variables: from user draft
    // RECIPES_EMPTY_VALUE means the user explicitly wants an empty string
    const rawVal = draft[name];
    const value  = rawVal === RECIPES_EMPTY_VALUE ? "" : rawVal || "";
    resolved = resolved.replace(
      new RegExp("\\$\\{" + escapeRegExp(name) + "\\}", "g"),
      value,
    );
  });

  return resolved;
}

function resolveGroupTitle(groupId, groups) {
  if (!groupId) {
    return "-";
  }

  const group = groups.find(function (item) {
    return item.id === groupId;
  });

  return group ? group.title : groupId;
}

// ─── Command Draft / Remember ─────────────────────────────────────────────────

function getCommandDraft(commandId) {
  if (!uiState.commandDrafts[commandId]) {
    const globalVars =
      (state.globalCommandVariables &&
        state.globalCommandVariables.commands &&
        state.globalCommandVariables.commands[commandId]) ||
      {};
    const localVars =
      (state.commandVariables &&
        state.commandVariables.commands &&
        state.commandVariables.commands[commandId]) ||
      {};
    uiState.commandDrafts[commandId] = { ...globalVars, ...localVars };
  }

  return uiState.commandDrafts[commandId];
}

function getCommandRemember(commandId) {
  if (!uiState.commandRemember[commandId]) {
    const remembered = {};
    const globalVars =
      (state.globalCommandVariables &&
        state.globalCommandVariables.commands &&
        state.globalCommandVariables.commands[commandId]) ||
      {};
    const localVars =
      (state.commandVariables &&
        state.commandVariables.commands &&
        state.commandVariables.commands[commandId]) ||
      {};

    Object.keys(globalVars).forEach(function (key) {
      remembered[key] = "global";
    });

    Object.keys(localVars).forEach(function (key) {
      remembered[key] = "local";
    });

    uiState.commandRemember[commandId] = remembered;
  }

  return uiState.commandRemember[commandId];
}

function buildCommandVariablesPayload() {
  const local  = { version: 2, commands: {} };
  const global = { version: 2, commands: {} };

  Object.keys(uiState.commandRemember).forEach(function (commandId) {
    const rememberMap = uiState.commandRemember[commandId] || {};
    const draft       = getCommandDraft(commandId);
    const localVars   = {};
    const globalVars  = {};

    Object.keys(rememberMap).forEach(function (variableName) {
      if (variableName === "workspaceFolder") {
        return;
      }

      const flag = rememberMap[variableName];
      const val  = draft[variableName];

      if (flag === "local" && val) {
        localVars[variableName] = val;
      } else if (flag === "global" && val) {
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

  return { local, global };
}

// ─── Category / Group / Command Selection Helpers ─────────────────────────────

/**
 * Persists the selected category ID to localStorage and updates uiState.
 * @param {string} categoryId
 */
function setSelectedCategory(categoryId) {
  uiState.selectedCategoryId = categoryId;
  try {
    localStorage.setItem("selectedCategoryId", categoryId);
  } catch {}
}

/**
 * Returns the currently selected category object, or null if none matches.
 * @returns {object|null}
 */
function getSelectedCategory() {
  return (
    (state.data.categories || []).find(function (category) {
      return category.id === uiState.selectedCategoryId;
    }) || null
  );
}

/**
 * Returns the groups array of the currently selected category.
 * @returns {Array}
 */
function getSelectedCategoryGroups() {
  const category = getSelectedCategory();
  return category ? category.groups || [] : [];
}

/**
 * Returns commands visible under the current category + group filter.
 * @returns {Array}
 */
function getVisibleCommands() {
  return (state.data.commands || []).filter(function (command) {
    if (command.categoryId !== uiState.selectedCategoryId) {
      return false;
    }

    if (uiState.selectedGroupId === "all") {
      return true;
    }

    return command.groupId === uiState.selectedGroupId;
  });
}

/**
 * Returns the command object currently being edited, or null.
 * @returns {object|null}
 */
function getEditingCommand() {
  if (!uiState.editingCommandId) {
    return null;
  }

  return (
    (state.data.commands || []).find(function (command) {
      return command.id === uiState.editingCommandId;
    }) || null
  );
}

// ─── Template Syntax Highlighting ─────────────────────────────────────────────

/**
 * Returns HTML string with ${varName} tokens wrapped in colored spans.
 * .var-auto for reserved/auto-resolved variables, .var-user for user-defined.
 * @param {string} text - raw template text
 * @returns {string} HTML string safe for innerHTML
 */
function highlightTemplateHtml(text) {
  var autoVarNames = getEnabledAutoVariableNames();
  return escapeHtml(text).replace(
    /\$\{([a-zA-Z0-9_]+)\}/g,
    function (match, name) {
      var cls = autoVarNames.includes(name) ? "var-auto" : "var-user";
      return '<span class="' + cls + '">' + match + "</span>";
    },
  );
}

/**
 * Returns HTML string of a resolved command where each substituted variable value
 * is wrapped in a colored span reflecting its origin:
 * .var-auto (green) for auto-resolved variables, .var-user (blue) for user-defined.
 * @param {object} command - the command object with .command template
 * @returns {string} HTML string safe for innerHTML
 */
function highlightResolvedHtml(command) {
  var names        = collectVariables([command.command]);
  var draft        = getCommandDraft(command.id);
  var autoVarNames = getEnabledAutoVariableNames();
  var result       = escapeHtml(command.command);

  names.forEach(function (name) {
    var rawVal = draft[name];
    var value  = rawVal === RECIPES_EMPTY_VALUE ? "" : rawVal || "";
    var cls    = autoVarNames.includes(name) ? "var-auto" : "var-user";
    result = result.replace(
      new RegExp("\\$\\{" + escapeRegExp(name) + "\\}", "g"),
      '<span class="' + cls + '">' + escapeHtml(value) + "</span>",
    );
  });

  return result;
}

/**
 * Auto-resizes a textarea to fit its content.
 * Expands up to MAX_LINES lines, then shows vertical scrollbar.
 * @param {HTMLTextAreaElement} el
 */
function autoResizeTextarea(el) {
  if (!el) {
    return;
  }
  var MAX_LINES = 5;
  // Reset height to auto so we can measure the true content height
  el.classList.remove("ta-overflow");
  el.style.setProperty("--tr-textarea-h", "auto");
  void el.offsetHeight; // Force synchronous reflow before reading scrollHeight
  var computed      = getComputedStyle(el);
  var lineHeight    = parseFloat(computed.lineHeight);
  if (!lineHeight || isNaN(lineHeight)) {
    lineHeight = parseFloat(computed.fontSize) * 1.5;
  }
  var paddingTop    = parseFloat(computed.paddingTop) || 0;
  var paddingBottom = parseFloat(computed.paddingBottom) || 0;
  var maxHeight     = lineHeight * MAX_LINES + paddingTop + paddingBottom;
  var newHeight     = Math.min(el.scrollHeight, maxHeight);
  el.style.setProperty("--tr-textarea-h", newHeight + "px");
  if (el.scrollHeight > maxHeight) {
    el.classList.add("ta-overflow");
  }
  // Sync highlight div height to match the textarea
  var highlightEl = el.previousElementSibling;
  if (highlightEl && highlightEl.classList.contains("template-highlight")) {
    highlightEl.style.height = newHeight + "px";
  }
}

/**
 * Updates the syntax highlight overlay div for a template textarea.
 * Wraps ${varName} tokens in colored spans: .var-auto (reserved) or .var-user (user-defined).
 * @param {HTMLTextAreaElement} textarea
 */
function updateTemplateHighlight(textarea) {
  var highlightDiv = textarea.previousElementSibling;
  if (!highlightDiv || !highlightDiv.classList.contains("template-highlight")) {
    return;
  }
  var autoVarNames = getEnabledAutoVariableNames();
  var allVarNames  = collectVariables([textarea.value]);
  var hasAuto      = allVarNames.some(function (n) {
    return autoVarNames.includes(n);
  });
  var hasUser = allVarNames.some(function (n) {
    return !autoVarNames.includes(n);
  });
  var html = escapeHtml(textarea.value).replace(
    /\$\{([a-zA-Z0-9_]+)\}/g,
    function (match, name) {
      var cls = autoVarNames.includes(name) ? "var-auto" : "var-user";
      return '<span class="' + cls + '">' + match + "</span>";
    },
  );
  // Trailing \n prevents the last line from collapsing in height
  highlightDiv.innerHTML = html + "\n";
  // Keep scroll in sync
  highlightDiv.scrollTop = textarea.scrollTop;
  // Update legend visibility
  var legend =
    textarea.parentElement && textarea.parentElement.nextElementSibling;
  if (legend && legend.classList.contains("template-var-legend")) {
    var autoItem = legend.querySelector(".legend-auto");
    var userItem = legend.querySelector(".legend-user");
    if (autoItem) {
      autoItem.classList.toggle("hidden", !hasAuto);
    }
    if (userItem) {
      userItem.classList.toggle("hidden", !hasUser);
    }
  }
}

// ─── Notice / Alert ───────────────────────────────────────────────────────────

function showNotice(message, icon, type) {
  uiState.noticeMessage = message;
  uiState.noticeIcon    = icon !== undefined ? icon : icons.circleExclamation;
  uiState.noticeType    = type || "info";

  if (noticeTimer) {
    clearTimeout(noticeTimer);
  }

  noticeTimer = setTimeout(function () {
    uiState.noticeMessage = "";
    uiState.noticeIcon    = "";
    uiState.noticeType    = "";
    // Remove the notice element directly — no full re-render needed
    var noticeEl = document.querySelector(".notice");
    if (noticeEl) {
      noticeEl.remove();
    }
    noticeTimer = null;
  }, 3000);
}

function showError(message, icon, type) {
  uiState.noticeMessage = message;
  uiState.noticeIcon    = icon !== undefined ? icon : icons.circleX;
  uiState.noticeType    = type || "error";

  if (noticeTimer) {
    clearTimeout(noticeTimer);
  }

  noticeTimer = setTimeout(function () {
    uiState.noticeMessage = "";
    uiState.noticeIcon    = "";
    uiState.noticeType    = "";
    // Remove the notice element directly — no full re-render needed
    var noticeEl = document.querySelector(".notice");
    if (noticeEl) {
      noticeEl.remove();
    }
    noticeTimer = null;
  }, 4000);
}

/**
 * Inserts or updates the notice element in the DOM directly,
 * without triggering a full page re-render.
 * Call this after showNotice() / showError() when a full render is not needed.
 */
function paintNotice() {
  var layout = document.querySelector(".layout");
  if (!layout) {
    return;
  }
  // Remove any existing notice
  var existing = layout.querySelector(".notice");
  if (existing) {
    existing.remove();
  }
  if (!uiState.noticeMessage) {
    return;
  }
  var el = document.createElement("div");
  el.className =
    "notice" + (uiState.noticeType ? " notice-" + uiState.noticeType : "");
  el.innerHTML =
    '<div class="notice-icon">' +
    uiState.noticeIcon +
    '</div><div class="notice-message">' +
    uiState.noticeMessage +
    "</div>";
  // Insert after workspace-label (2nd child), before the tabs section
  var workspaceLabel = layout.querySelector(".workspace-label");
  if (workspaceLabel && workspaceLabel.nextSibling) {
    layout.insertBefore(el, workspaceLabel.nextSibling);
  } else {
    layout.appendChild(el);
  }
}

// ─── Scroll / DOM Helpers ─────────────────────────────────────────────────────

/**
 * Scrolls to a row with the given commandId and temporarily highlights it.
 * Works for both the commands table and the recent commands table.
 * @param {string} commandId
 */
function scrollToAndHighlight(commandId) {
  if (!commandId) {
    return;
  }
  // Find a button inside the row that carries the commandId
  var btn = document.querySelector('[data-command-id="' + commandId + '"]');
  if (!btn) {
    return;
  }
  var row = btn.closest("tr");
  if (!row) {
    return;
  }
  row.classList.add("row-highlight");
  row.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(function () {
    row.classList.remove("row-highlight");
  }, 2000);
}

/**
 * Binds click events on cmd-title-link elements (help links in tables).
 */
function bindCmdTitleLinks() {
  document.querySelectorAll(".cmd-title-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const url = link.dataset.url;
      if (url) {
        vscode.postMessage({ type: "openExternalUrl", payload: { url } });
      }
    });
  });
}

// ─── Favorites Helpers ────────────────────────────────────────────────────────

/**
 * Returns true if commandId is in either local or global favorites.
 */
function isInFavorites(commandId) {
  return (
    state.globalFavorites.includes(commandId) ||
    state.localFavorites.includes(commandId)
  );
}

/**
 * Returns the scope of the favorite: 'none' | 'local' | 'global' | 'both'
 */
function getFavoriteScope(commandId) {
  const inLocal  = state.localFavorites.includes(commandId);
  const inGlobal = state.globalFavorites.includes(commandId);
  if (inLocal && inGlobal) {
    return "both";
  }
  if (inLocal) {
    return "local";
  }
  if (inGlobal) {
    return "global";
  }
  return "none";
}

/**
 * Saves favorites to the extension.
 */
function persistFavorites(payload) {
  vscode.postMessage({ type: "saveFavorites", payload });
}

// ─── Persist Helpers ──────────────────────────────────────────────────────────

function persistDataThenRender(successMessage) {
  showNotice(successMessage, icons.circleCheck, "success");
  render();
  vscode.postMessage({ type: "saveData", payload: state.data });
}

function persistCommandVariables() {
  const payload = buildCommandVariablesPayload();
  vscode.postMessage({ type: "saveCommandVariables", payload });
}

// ─── Custom Select Component ──────────────────────────────────────────────────

/**
 * Renders a custom dropdown HTML string.
 * @param {string} wrapperId      - unique id for the .cs-wrap div
 * @param {string} btnId          - unique id for the toggle button
 * @param {string} menuId         - unique id for the dropdown menu div
 * @param {Array<{value:string,label:string}>} options - the menu items
 * @param {string} selectedValue  - the currently selected value
 * @param {string} [btnExtraClass]  - extra CSS classes for the button
 * @param {boolean} [menuUp]        - true = menu opens upward
 * @param {string} [wrapExtraClass] - extra CSS classes for the .cs-wrap wrapper
 *   Use 'cs-wrap-full' to make the dropdown stretch to 100% width.
 * @returns {string} HTML string
 */
function renderCustomSelect(
  wrapperId,
  btnId,
  menuId,
  options,
  selectedValue,
  btnExtraClass,
  menuUp,
  wrapExtraClass,
) {
  const selectedOption = options.find(function (o) {
    return o.value === selectedValue;
  });
  const selectedLabel = selectedOption
    ? selectedOption.label
    : options.length
      ? options[0].label
      : "—";

  const items = options
    .map(function (opt) {
      const isSelected = opt.value === selectedValue;
      return `
      <div class="cs-item" role="menuitem" tabindex="-1" data-value="${escapeAttr(opt.value)}"${opt.tooltip ? ` data-tooltip="${escapeAttr(opt.tooltip)}"` : ""}>
        <span class="cs-item-label">${escapeHtml(opt.label)}</span>
        ${isSelected ? icons.checkmark : ""}
      </div>
    `;
    })
    .join("");

  const menuClass = `cs-menu${menuUp ? " cs-menu-up" : ""}`;
  const wrapClass = `cs-wrap${wrapExtraClass ? " " + wrapExtraClass : ""}`;

  return `
    <div class="${wrapClass}" id="${escapeAttr(wrapperId)}">
      <button class="cs-btn${btnExtraClass ? " " + btnExtraClass : ""}" type="button" aria-haspopup="menu" aria-expanded="false" id="${escapeAttr(btnId)}">
        <span class="cs-btn-label">${escapeHtml(selectedLabel)}</span>
        ${icons.chevron}
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
  const btn  = document.getElementById(btnId);
  const menu = document.getElementById(menuId);

  if (!btn || !menu) {
    return;
  }

  function closeMenu() {
    if (!menu.hidden) {
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }
    document.removeEventListener("pointerdown", onPointerDown, true);
    window.removeEventListener("blur", onWindowBlur);
  }

  function onPointerDown(e) {
    if (wrap && !wrap.contains(e.target)) {
      closeMenu();
    }
  }

  function onWindowBlur() {
    closeMenu();
  }

  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (!menu.hidden) {
      closeMenu();
    } else {
      menu.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      document.addEventListener("pointerdown", onPointerDown, true);
      window.addEventListener("blur", onWindowBlur);
    }
  });

  menu.querySelectorAll(".cs-item").forEach(function (item) {
    item.addEventListener("click", function () {
      // Update button label to reflect the newly selected item
      var labelEl     = btn.querySelector(".cs-btn-label");
      var itemLabelEl = item.querySelector(".cs-item-label");
      if (labelEl && itemLabelEl) {
        labelEl.textContent = itemLabelEl.textContent;
      }
      // Move the checkmark to the newly selected item
      menu.querySelectorAll(".cs-check").forEach(function (el) {
        el.remove();
      });
      item.insertAdjacentHTML("beforeend", icons.checkmark);
      onChange(item.dataset.value);
      closeMenu();
    });
    item.addEventListener("mouseenter", function () {
      item.setAttribute("data-highlighted", "");
    });
    item.addEventListener("mouseleave", function () {
      item.removeAttribute("data-highlighted");
    });
  });
}
