/**
 * AI Providers Configuration — Single Source of Truth
 *
 * This file defines all metadata for supported AI providers.
 * When adding a new provider:
 *   1. Add an entry here.
 *   2. Create its class file in ai/providers/<name>.js
 *   3. Add a case in ai/factory.js → createProvider()
 *   4. Update package.json → terminalRecipes.aiProvider enum (for VS Code Settings UI only)
 *
 * @typedef {{
 *   name: string,
 *   serviceName: string,
 *   providerName: string,
 *   modelId: string,
 *   modelLabel: string,
 *   displayLabel: string,
 *   apiKeyUrl: string,
 *   apiKeyUrlLabel: string,
 *   steps: string[],
 * }} ProviderConfig
 */

/** @type {Record<string, ProviderConfig>} */
const AI_PROVIDERS = {
    gemini: {
        name: 'gemini',
        serviceName: 'Google Gemini',
        providerName: 'Google',
        modelId: 'gemini-flash-latest',
        modelLabel: 'gemini-flash-latest',
        displayLabel: 'Google Gemini (gemini-flash-latest)',
        apiKeyUrl: 'https://aistudio.google.com/',
        apiKeyUrlLabel: 'Google AI Studio',
        steps: [
            'Go to Google AI Studio: https://aistudio.google.com/',
            'Sign in with your Google account.',
            'Click "Get API key" in the left sidebar.',
            'Click "Create API key".',
            'Name your key and choose an imported project (or create a new one).',
            'Copy the generated API key.',
            'Paste it in the API Key field and click Save.',
        ],
    },

    openai: {
        name: 'openai',
        serviceName: 'OpenAI ChatGPT',
        providerName: 'OpenAI',
        modelId: 'gpt-4.1',
        modelLabel: 'gpt-4.1',
        displayLabel: 'OpenAI ChatGPT (gpt-4.1)',
        apiKeyUrl: 'https://platform.openai.com/api-keys',
        apiKeyUrlLabel: 'OpenAI Platform',
        steps: [
            'Go to OpenAI Platform: https://platform.openai.com/',
            'Sign in or create an OpenAI account.',
            'Navigate to "API keys" in the left sidebar (or go to platform.openai.com/api-keys).',
            'Click "Create new secret key" and give it a name.',
            'Copy the key <code>immediately</code> — it will only be shown once.',
            'Paste it in the API Key field and click Save.',
        ],
    },

    anthropic: {
        name: 'anthropic',
        serviceName: 'Anthropic Claude',
        providerName: 'Anthropic',
        modelId: 'claude-sonnet-4-6',
        modelLabel: 'claude-sonnet-4-6',
        displayLabel: 'Anthropic Claude (claude-sonnet-4-6)',
        apiKeyUrl: 'https://console.anthropic.com/',
        apiKeyUrlLabel: 'Anthropic Console',
        steps: [
            'Go to Anthropic Console: https://console.anthropic.com/',
            'Sign in or create an Anthropic account.',
            'Click "API Keys" in the left sidebar Under the “Manage” category or by clicking the "Get API Key" button in the upper right corner .',
            'Click "Create Key" and give it a descriptive name.',
            'Copy the generated API key.',
            'Paste it in the API Key field and click Save.',
        ],
    },
};

/**
 * Returns an ordered array of provider configs for use in UI dropdowns.
 * @returns {ProviderConfig[]}
 */
function getProvidersArray() {
    return Object.values(AI_PROVIDERS);
}

/**
 * Returns the config for a specific provider, or null if not found.
 * @param {string} providerName
 * @returns {ProviderConfig|null}
 */
function getProviderConfig(providerName) {
    return AI_PROVIDERS[providerName] || null;
}

module.exports = {AI_PROVIDERS, getProvidersArray, getProviderConfig};
