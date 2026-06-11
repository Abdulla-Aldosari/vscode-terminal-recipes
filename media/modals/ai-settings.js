// Terminal Recipes — VS Code Extension
// Copyright (c) 2026 Abdulla Aldosari
// Licensed under the MIT License. See LICENSE in the project root for details.

// media/modals/ai-settings.js
// AI Settings modal and AI Provider Setup Help modal.
// Loads after new-command.js.

/**
 * Returns a display label for the active AI provider + model.
 * Used in the AI prompt modal footer link.
 * @param {string} providerName
 * @returns {string}
 */
function getAiModelLabel(providerName) {
  if (aiState.aiProviderSetup && aiState.aiProviderSetup[providerName]) {
    const cfg = aiState.aiProviderSetup[providerName];
    const modelId = aiState.settingsModelId || cfg.defaultModelId;
    const modelCfg = (cfg.models || []).find(function (m) { return m.modelId === modelId; });
    const modelLabel = modelCfg ? modelCfg.modelLabel : modelId;
    return `${cfg.serviceName} · ${modelLabel}`;
  }
  // Fallback labels (used before aiProviderSetup is loaded)
  const fallback = {
    gemini:         "Gemini · Gemini 2.0 Flash",
    openai:         "OpenAI · GPT-4.1 Mini",
    anthropic:      "Anthropic · Claude Haiku 4.5",
    deepseek:       "DeepSeek · DeepSeek V3 Chat",
    groq:           "Groq · Llama 3.3 70B",
    mistral:        "Mistral · Mistral Small",
    cohere:         "Cohere · Command R7B",
    bytedancesseed: "ByteDance Seed · Seed 1.6 Flash",
    stepfun:        "StepFun · Step 3.5 Flash",
  };
  return fallback[providerName] || providerName;
}

/**
 * Builds the model dropdown options for the given provider.
 * Free models get a "(Free)" suffix in the label.
 * @param {string} providerName
 * @returns {{ value: string, label: string }[]}
 */
function buildModelOptions(providerName) {
  if (!aiState.aiProviderSetup || !aiState.aiProviderSetup[providerName]) {
    return [];
  }
  const models = aiState.aiProviderSetup[providerName].models || [];
  return models.map(function (m) {
    return {
      value: m.modelId,
      label: m.free ? m.modelLabel + " (Free)" : m.modelLabel,
    };
  });
}

/**
 * Returns the resolved model ID for the given provider.
 * Falls back to the provider's defaultModelId if settingsModelId is not set
 * or does not belong to the selected provider's model list.
 * @param {string} providerName
 * @returns {string}
 */
function resolveSettingsModelId(providerName) {
  if (!aiState.aiProviderSetup || !aiState.aiProviderSetup[providerName]) {
    return aiState.settingsModelId || "";
  }
  const cfg = aiState.aiProviderSetup[providerName];
  const models = cfg.models || [];
  const savedId = aiState.settingsModelId;
  if (savedId && models.some(function (m) { return m.modelId === savedId; })) {
    return savedId;
  }
  return cfg.defaultModelId || (models.length > 0 ? models[0].modelId : "");
}

function renderAiSettingsModal() {
  // Build provider dropdown options dynamically from aiProviderSetup if available
  const providers = aiState.aiProviderSetup
    ? Object.values(aiState.aiProviderSetup).map(function (cfg) {
        return { value: cfg.name, label: cfg.displayLabel };
      })
    : [
        { value: "gemini",         label: "Google Gemini" },
        { value: "openai",         label: "OpenAI ChatGPT" },
        { value: "anthropic",      label: "Anthropic Claude" },
        { value: "deepseek",       label: "DeepSeek" },
        { value: "groq",           label: "Groq" },
        { value: "mistral",        label: "Mistral AI" },
        { value: "cohere",         label: "Cohere" },
        { value: "bytedancesseed", label: "ByteDance Seed" },
        { value: "stepfun",        label: "StepFun" },
      ];

  const selectedProvider = aiState.settingsProviderName;
  const hasKey           = aiState.keyStatus[selectedProvider];

  // Model dropdown
  const modelOptions    = buildModelOptions(selectedProvider);
  const selectedModelId = resolveSettingsModelId(selectedProvider);
  const modelDropdownHtml = modelOptions.length > 0
    ? `
        <div class="d-grid gap-6 mt-10">
          <span>Model</span>
          ${renderCustomSelect(
            "ai-model-select-wrap",
            "ai-model-select-btn",
            "ai-model-select-menu",
            modelOptions,
            selectedModelId,
            "cs-btn-ai-provider",
            false,
            "cs-wrap-full",
          )}
        </div>`
    : "";

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
        ${modelDropdownHtml}
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
