// Terminal Recipes — VS Code Extension
// Copyright (c) 2026 Abdulla Aldosari
// Licensed under the MIT License. See LICENSE in the project root for details.

// media/modals/ai-settings.js
// AI Settings modal and AI Provider Setup Help modal.
// Loads after new-command.js.

// ─── AI Models Cache Helpers ──────────────────────────────────────────────────
// Stores model lists per-provider in localStorage with a 7-day TTL.
// Falls back to providers-config.js static list when cache is absent or expired.

const AI_MODELS_CACHE_KEY = "tr_ai_models_cache";
const AI_MODELS_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Returns cached models for a provider if the cache entry exists and is fresh.
 * @param {string} providerName
 * @returns {{ modelId: string, modelLabel: string }[]|null}
 */
function getCachedModels(providerName) {
  try {
    const raw = localStorage.getItem(AI_MODELS_CACHE_KEY);
    if (!raw) {
      return null;
    }
    const cache = JSON.parse(raw);
    const entry = cache[providerName];
    if (!entry || !entry.fetchedAt || !Array.isArray(entry.models) || !entry.models.length) {
      return null;
    }
    if (Date.now() - entry.fetchedAt > AI_MODELS_CACHE_TTL_MS) {
      return null; // expired
    }
    return entry.models;
  } catch {
    return null;
  }
}

/**
 * Saves fetched models into the cache with the current timestamp.
 * @param {string} providerName
 * @param {{ modelId: string, modelLabel: string }[]} models
 */
function setModelsCache(providerName, models) {
  try {
    const raw = localStorage.getItem(AI_MODELS_CACHE_KEY);
    const cache = raw ? JSON.parse(raw) : {};
    cache[providerName] = { models, fetchedAt: Date.now() };
    localStorage.setItem(AI_MODELS_CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

/**
 * Returns the timestamp (ms) when the provider's model list was last cached, or null.
 * @param {string} providerName
 * @returns {number|null}
 */
function getModelsCacheFetchedAt(providerName) {
  try {
    const raw = localStorage.getItem(AI_MODELS_CACHE_KEY);
    if (!raw) {
      return null;
    }
    const cache = JSON.parse(raw);
    return cache[providerName] ? cache[providerName].fetchedAt : null;
  } catch {
    return null;
  }
}

/**
 * Formats a past timestamp as a human-readable "time ago" string.
 * @param {number} timestamp - ms since epoch
 * @returns {string}
 */
function formatTimeAgo(timestamp) {
  const diffMs = Date.now() - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) {
    return "just now";
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  return `${diffDays}d ago`;
}

// ─────────────────────────────────────────────────────────────────────────────

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
    const modelCfg = (cfg.models || []).find(function (m) {
      return m.modelId === modelId;
    });
    const modelLabel = modelCfg ? modelCfg.modelLabel : modelId;
    return `${cfg.serviceName} · ${modelLabel}`;
  }
  // Fallback labels (used before aiProviderSetup is loaded)
  const fallback = {
    gemini: "Gemini · Gemini 2.0 Flash",
    openai: "OpenAI · GPT-4.1 Mini",
    anthropic: "Anthropic · Claude Haiku 4.5",
    deepseek: "DeepSeek · DeepSeek V3 Chat",
    groq: "Groq · Llama 3.3 70B",
    mistral: "Mistral · Mistral Small",
    cohere: "Cohere · Command R7B",
    bytedancesseed: "ByteDance Seed · Seed 1.6 Flash",
    stepfun: "StepFun · Step 3.5 Flash",
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
  if (
    savedId &&
    models.some(function (m) {
      return m.modelId === savedId;
    })
  ) {
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
        { value: "gemini", label: "Google Gemini" },
        { value: "openai", label: "OpenAI ChatGPT" },
        { value: "anthropic", label: "Anthropic Claude" },
        { value: "deepseek", label: "DeepSeek" },
        { value: "groq", label: "Groq" },
        { value: "mistral", label: "Mistral AI" },
        { value: "cohere", label: "Cohere" },
        { value: "bytedancesseed", label: "ByteDance Seed" },
        { value: "stepfun", label: "StepFun" },
      ];

  const selectedProvider = aiState.settingsProviderName;
  const hasKey = aiState.keyStatus[selectedProvider];

  // Model dropdown — shows loading spinner while dynamic models are being fetched
  const modelOptions = buildModelOptions(selectedProvider);
  const selectedModelId = resolveSettingsModelId(selectedProvider);
  const fetchedAt = getModelsCacheFetchedAt(selectedProvider);

  // Build the refresh button tooltip
  const refreshTooltip = hasKey
    ? `Fetch latest models from each provider's API (all providers with a saved key).${fetchedAt ? `<br>( Updated ${formatTimeAgo(fetchedAt)} )` : ""}`
    : `No API key saved for this provider — add one to enable fetching models.`;

  // Chevron SVG — used in the loading state button
  const chevronSvg = `<svg width="17" height="17" viewBox="0 0 21 21" class="cs-chevron" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m6 9l6 6l6-6"></path></svg>`;

  // Model section — uses renderCustomSelect() when ready; shows a disabled loading button while fetching
  const modelDropdownHtml = `
      <div class="d-grid gap-6 mt-10">
        <span>Model</span>
        ${
          aiState.modelsLoading
            ? `<button class="cs-btn cs-btn-ai-provider" type="button" disabled>
                 <span class="cs-btn-label"><span class="ai-models-loading-spinner"></span> Loading models...</span>
                 ${chevronSvg}
               </button>`
            : modelOptions.length > 0
              ? renderCustomSelect(
                  "ai-model-select-wrap",
                  "ai-model-select-btn",
                  "ai-model-select-menu",
                  modelOptions,
                  selectedModelId,
                  "cs-btn-ai-provider",
                  false,
                  "cs-wrap-full"
                )
              : ""
        }
      </div>`;

  // Resolve provider setup info for links (if available)
  const providerSetup = aiState.aiProviderSetup && aiState.aiProviderSetup[selectedProvider];
  const apiKeyUrl = providerSetup ? providerSetup.apiKeyUrl : null;
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
            "cs-wrap-full"
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
        <div class="row between mt-20">
          <button class="btn small secondary ai-models-refresh-btn" id="btn-ai-refresh-models" type="button"${!hasKey ? " disabled" : ""} data-tooltip="${escapeAttr(refreshTooltip)}">↻ Refresh models</button>
          <div class="row">
            <button class="btn small primary min-w65" id="btn-ai-settings-save">Save</button>
            <button class="btn small secondary action min-w65" id="btn-ai-settings-cancel">Close</button>
          </div>
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
  const setup = aiState.aiProviderSetup && providerName ? aiState.aiProviderSetup[providerName] : null;

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
