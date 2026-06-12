// Terminal Recipes — VS Code Extension
// Copyright (c) 2026 Abdulla Aldosari
// Licensed under the MIT License. See LICENSE in the project root for details.

// media/main.js
// Entry point — postMessage sender functions + tooltip IIFE.
// All state, icons, utilities, modals, tabs, render, and messages are loaded
// by earlier <script> tags. This file is loaded last.

// ─── postMessage Sender Functions ─────────────────────────────────────────────
// Convenience wrappers for all webview → extension messages.

function postReady() {
  vscode.postMessage({ type: "ready" });
}

function postRequestState() {
  vscode.postMessage({ type: "requestState" });
}

function postSaveData(data) {
  vscode.postMessage({ type: "saveData", payload: data });
}

function postSaveCommandVariables(vars) {
  vscode.postMessage({ type: "saveCommandVariables", payload: vars });
}

function postPerformAction(payload) {
  vscode.postMessage({ type: "performAction", payload });
}

function postOpenCommandsFile() {
  vscode.postMessage({ type: "openCommandsFile" });
}

function postOpenGlobalVariablesFile() {
  vscode.postMessage({ type: "openGlobalVariablesFile" });
}

function postOpenLocalVariablesFile() {
  vscode.postMessage({ type: "openLocalVariablesFile" });
}

function postOpenExternalUrl(url) {
  vscode.postMessage({ type: "openExternalUrl", payload: { url } });
}

function postAiGetSettings() {
  vscode.postMessage({ type: "aiGetSettings" });
}

function postAiSaveSettings(payload) {
  vscode.postMessage({ type: "aiSaveSettings", payload });
}

function postAiGenerate(payload) {
  vscode.postMessage({ type: "aiGenerate", payload });
}

function postAiInsert(payload) {
  vscode.postMessage({ type: "aiInsert", payload });
}

function postSaveAutoVariablesSettings(payload) {
  vscode.postMessage({ type: "saveAutoVariablesSettings", payload });
}

function postSaveFavorites(payload) {
  vscode.postMessage({ type: "saveFavorites", payload });
}

function postAiListModels(providerName) {
  vscode.postMessage({ type: "aiListModels", payload: { providerName } });
}

// ─── Global Helpers ────────────────────────────────────────────────────────────

// Disable right-click context menu unless text is selected
document.addEventListener("contextmenu", function (e) {
  // Allow native context menu on text input elements (paste/cut/copy)
  const tag = e.target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || e.target.isContentEditable) {
    return;
  }

  const selection = window.getSelection();
  if (!selection || selection.toString().trim() === "") {
    e.preventDefault();
  }
});

// ===== VS Code-style Tooltip =====
(function () {
  let _hoverEl = null;
  let _showTimer = null;
  const DELAY = 550; // ms — same feel as VS Code
  const GAP = 6; // px — gap between element and tooltip

  function getOrCreateTooltip() {
    if (!_hoverEl) {
      _hoverEl = document.createElement("div");
      _hoverEl.className = "tr-tooltip-hover";
      _hoverEl.setAttribute("role", "tooltip");
      const inner = document.createElement("div");
      inner.className = "tr-tooltip-hover-content";
      _hoverEl.appendChild(inner);
    }
    return _hoverEl;
  }

  function positionTooltip(el) {
    const tip = getOrCreateTooltip();
    const pos = el.dataset.tooltipPos || "bottom";

    // Temporarily attach (hidden) to measure dimensions
    tip.style.visibility = "hidden";
    tip.style.left = "0px";
    tip.style.top = "0px";
    if (!tip.isConnected) document.body.appendChild(tip);

    const rect = el.getBoundingClientRect();
    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;

    let left, top;

    if (pos === "top") {
      left = rect.left + rect.width / 2 - tw / 2;
      top = rect.top - th - GAP;
    } else if (pos === "right") {
      left = rect.right + GAP;
      top = rect.top + rect.height / 2 - th / 2;
    } else if (pos === "left") {
      left = rect.left - tw - GAP;
      top = rect.top + rect.height / 2 - th / 2;
    } else {
      // bottom (default)
      left = rect.left + rect.width / 2 - tw / 2;
      top = rect.bottom + GAP;
    }

    // Clamp to viewport so it doesn't go off-screen
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    left = Math.max(GAP, Math.min(left, vw - tw - GAP));
    top = Math.max(GAP, Math.min(top, vh - th - GAP));

    tip.style.left = left + "px";
    tip.style.top = top + "px";
    tip.dataset.pos = pos; // used by CSS to show the correct arrow direction
    tip.style.visibility = "";
  }

  function showTooltip(el) {
    const tip = getOrCreateTooltip();
    tip.querySelector(".tr-tooltip-hover-content").innerHTML =
      el.dataset.tooltip;
    positionTooltip(el);
  }

  function hideTooltip() {
    clearTimeout(_showTimer);
    _showTimer = null;
    _hoverEl?.remove();
  }

  document.addEventListener("mouseover", function (e) {
    const el = e.target.closest("[data-tooltip]");
    if (!el) return;

    // Cancel any pending show for a different element
    clearTimeout(_showTimer);

    _showTimer = setTimeout(function () {
      showTooltip(el);
    }, DELAY);
  });

  document.addEventListener("mouseout", function (e) {
    const fromEl = e.target.closest("[data-tooltip]");
    const toEl = e.relatedTarget?.closest("[data-tooltip]");

    // Mouse stayed within tooltip-owning elements — do nothing
    if (fromEl && toEl && fromEl === toEl) return;

    hideTooltip();
  });

  // Hide immediately on any click/tap — before any handler fires
  document.addEventListener("pointerdown", function () {
    hideTooltip();
  });
})();

// ─── Initialization ────────────────────────────────────────────────────────────
// Signal the extension that the webview is ready to receive state.
postReady();
