// Terminal Recipes — VS Code Extension
// Copyright (c) 2026 Abdulla Aldosari
// Licensed under the MIT License. See LICENSE in the project root for details.

// media/modals/ai-settings.js
// AI Settings modal and AI Provider Setup Help modal.
// Loads after new-command.js.

/**
 * Returns a display label for the AI provider and its associated model.
 * Uses dynamic data from aiState.aiProviderSetup (from providers-config.js) when available.
 * Falls back to hardcoded labels if setup data hasn't been loaded yet.
 * @param {string} providerName
 * @returns {string}
 */
function getAiModelLabel(providerName) {
  if (aiState.aiProviderSetup && aiState.aiProviderSetup[providerName]) {
    const cfg = aiState.aiProviderSetup[providerName];
    return `${cfg.serviceName} · ${cfg.modelLabel}`;
  }
  // Fallback labels (used before aiProviderSetup is loaded)
  const fallback = {
    gemini:    "Gemini · gemini-flash-latest",
    openai:    "OpenAI · gpt-4.1",
    anthropic: "Anthropic · claude-sonnet-4-5",
  };
  return fallback[providerName] || providerName;
}

function renderAiSettingsModal() {
  // Build provider dropdown options dynamically from aiProviderSetup if available
  const providers = aiState.aiProviderSetup
    ? Object.values(aiState.aiProviderSetup).map(function (cfg) {
        return { value: cfg.name, label: cfg.displayLabel };
      })
    : [
        { value: "gemini",    label: "Google Gemini (gemini-flash-latest)" },
        { value: "openai",    label: "OpenAI ChatGPT (gpt-4.1)" },
        { value: "anthropic", label: "Anthropic Claude (claude-sonnet-4-5)" },
      ];

  const selectedProvider = aiState.settingsProviderName;
  const hasKey           = aiState.keyStatus[selectedProvider];

  // Resolve provider setup info for links (if available)
  const providerSetup =
    aiState.aiProviderSetup && aiState.aiProviderSetup[selectedProvider];
  const apiKeyUrl      = providerSetup ? providerSetup.apiKeyUrl      : null;
  const apiKeyUrlLabel = providerSetup ? providerSetup.apiKeyUrlLabel : null;

  const providerLinksHtml = apiKeyUrl
    ? `
    <div class="ai-provider-links">    
      Don't have an API key?    
      <div class="ai-provider-help-item">
        ${icons.key}
        <a class="ai-provider-link" id="btn-ai-get-api-key" data-url="${escapeAttr(apiKeyUrl)}" href="#" data-tooltip="Open ${escapeAttr(apiKeyUrlLabel || apiKeyUrl)} in browser">
          Get API Key (${escapeHtml(apiKeyUrlLabel || apiKeyUrl)})
        </a>
      </div>
      <div class="ai-provider-help-item">
        ${icons.aiSetupHelp}
        <a class="ai-provider-link ai-provider-link-help" id="btn-ai-show-setup-help" href="#" data-tooltip="Show step-by-step instructions">
          How to get (${escapeHtml(apiKeyUrlLabel || apiKeyUrl)}) API Key?
        </a>
      </div>
    </div>
  `
    : "";

  return `
    <div class="modal-overlay" id="ai-settings-overlay" data-dismiss-on-outside-click="false">
      <div class="modal-box">
        <h3>${icons.aiSettings} AI Settings</h3>
        <div class="d-grid gap-6">
          <span>AI Provider</span>
          ${renderCustomSelect(
            "ai-provider-select-wrap",
            "ai-provider-select-btn",
            "ai-provider-select-menu",
            providers,
            selectedProvider,
            "cs-btn-ai-provider", // btnExtraClass
            false, // menuUp
            "cs-wrap-full",
          )}
        </div>
        <label>
          <div>
            API Key for <strong>${escapeHtml(selectedProvider)}</strong>
          </div>          
        ${
          hasKey
            ? `
          <div class="ai-provider-key-status-item ai-key-ok">
            ${icons.checkboxOk}
            <span class="ai-key-status ai-key-ok">Key saved</span>
          </div>
          `
            : `
          <div class="ai-provider-key-status-item ai-key-missing">
            ${icons.exclamationTriangle}
            <span class="ai-key-status ai-key-missing">No key saved</span>
          </div>
        `
        }
          <input id="ai-api-key-input" class="input" type="password" placeholder="${hasKey ? "Enter new key to update..." : "Enter your API key..."}" value="${escapeAttr(aiState.apiKeyInput)}" autocomplete="off" />

          <div class="ai-SecretStorage-note">
            Using VS Code's native <code>SecretStorage</code>, your API key is securely encrypted and stored within your operating system's native credential manager (e.g., Windows Credential Manager, macOS Keychain, or Linux Secret Service). It is never saved as plain text in your local settings or workspace files.
          </div>




        </label>
        ${providerLinksHtml}
        <div class="row justify-content-flex-end mt-20">
          <button class="btn small primary min-w65" id="btn-ai-settings-save">Save</button>
          <button class="btn small secondary action min-w65" id="btn-ai-settings-cancel">Close</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the AI Provider Setup Help modal.
 * Shows step-by-step instructions for getting an API key for the selected provider.
 */
function renderAiProviderSetupModal() {
  const providerName = aiProviderSetupModalState.providerName;
  const setup =
    aiState.aiProviderSetup && providerName
      ? aiState.aiProviderSetup[providerName]
      : null;

  if (!setup) {
    return "";
  }

  const stepsHtml = setup.steps
    .map(function (step, idx) {
      return `<li class="ai-setup-step"><span class="ai-setup-step-num">${idx + 1}</span><span>${step}</span></li>`;
    })
    .join("");

  return `
    <div class="modal-overlay" id="ai-provider-setup-overlay" data-dismiss-on-outside-click="true">
      <div class="modal-box ai-setup-box">
        <h3>${icons.key} How to get API Key for <strong>${escapeHtml(setup.serviceName)}</strong></h3>
        <ol class="ai-setup-steps">
          ${stepsHtml}
        </ol>
        <div class="ai-setup-footer">
          <a class="ai-provider-link" id="btn-ai-setup-open-url" data-url="${escapeAttr(setup.apiKeyUrl)}" href="#" data-tooltip="Open ${escapeAttr(setup.apiKeyUrlLabel)} in browser">
            ${icons.externalLink}  Open ${escapeHtml(setup.apiKeyUrlLabel)}
          </a>
        </div>
        <div class="row justify-content-flex-end">
          <button class="btn small secondary action min-w65" id="btn-ai-setup-close">Close</button>
        </div>
      </div>
    </div>
  `;
}
