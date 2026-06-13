// Terminal Recipes — VS Code Extension
// Copyright (c) 2026 Abdulla Aldosari
// Licensed under the MIT License. See LICENSE in the project root for details.

const {GeminiProvider}   = require('./providers/gemini');
const {OpenAIProvider}   = require('./providers/openai');
const {AnthropicProvider} = require('./providers/anthropic');
const {DeepSeekProvider} = require('./providers/deepseek');
const {GroqProvider}     = require('./providers/groq');
const {MistralProvider}  = require('./providers/mistral');
const {CohereProvider}        = require('./providers/cohere');
const {StepFunProvider}       = require('./providers/stepfun');
const {DEFAULT_SYSTEM_INSTRUCTION} = require('./systemInstruction');
const {logAiInteraction} = require('./debugLogger');
const crypto = require('crypto');

/** @typedef {'gemini'|'openai'|'anthropic'|'deepseek'|'groq'|'mistral'|'cohere'} ProviderName */

/**
 * Creates an AI provider instance based on the provider name and optional model ID.
 * @param {ProviderName} providerName
 * @param {string} apiKey
 * @param {string} [modelId]
 * @returns {GeminiProvider|OpenAIProvider|AnthropicProvider|DeepSeekProvider|GroqProvider|MistralProvider|CohereProvider}
 */
function createProvider(providerName, apiKey, modelId) {
  switch (providerName) {
    case 'gemini':    return new GeminiProvider(apiKey, modelId);
    case 'openai':    return new OpenAIProvider(apiKey, modelId);
    case 'anthropic': return new AnthropicProvider(apiKey, modelId);
    case 'deepseek':  return new DeepSeekProvider(apiKey, modelId);
    case 'groq':      return new GroqProvider(apiKey, modelId);
    case 'mistral':   return new MistralProvider(apiKey, modelId);
    case 'cohere':          return new CohereProvider(apiKey, modelId);
    case 'stepfun':         return new StepFunProvider(apiKey, modelId);
    default: throw new Error(`Unknown AI provider: "${providerName}"`);
  }
}

/**
 * Generates a safe local ID (lowercase letters, numbers, hyphens).
 * @returns {string}
 */
function generateLocalId() {
  return crypto.randomBytes(6).toString('hex');
}

/**
 * Remaps all AI-generated IDs to safe local IDs, maintaining internal references.
 * This ensures no ID conflicts with existing data.
 *
 * @param {object} aiResult - Raw AI response for `full` mode
 * @returns {object} - Normalized result with remapped IDs
 */
function remapFullModeIds(aiResult) {
  const idMap = {};

  // --- Remap category ID ---
  const newCategoryId = generateLocalId();
  idMap[aiResult.category.id] = newCategoryId;

  // --- Remap group IDs ---
  const remappedGroups = (aiResult.category.groups || []).map(function (group) {
    const newGroupId = generateLocalId();
    idMap[group.id] = newGroupId;
    return {id: newGroupId, title: group.title};
  });

  const remappedCategory = {
    id: newCategoryId,
    title: aiResult.category.title,
    groups: remappedGroups,
  };

  // --- Remap command IDs and references ---
  const remappedCommands = (aiResult.commands || []).map(function (cmd) {
    const newCmdId = generateLocalId();
    const mappedCategoryId = idMap[cmd.categoryId] || newCategoryId;
    const rawGroupId = cmd.groupId || '';
    const mappedGroupId = idMap[rawGroupId] || rawGroupId || '';

    return {
      id: newCmdId,
      title: cmd.title,
      description: cmd.description,
      command: cmd.command,
      categoryId: mappedCategoryId,
      groupId: mappedGroupId,
      ...(cmd.helpUrl ? {helpUrl: cmd.helpUrl} : {}),
      ...(cmd.variableMeta && Object.keys(cmd.variableMeta).length > 0 ? {variableMeta: cmd.variableMeta} : {}),
    };
  });

  return {
    category: remappedCategory,
    commands: remappedCommands,
  };
}

/**
 * Normalizes a `single` mode AI result by replacing the AI-generated ID
 * and injecting the known categoryId and groupIds.
 *
 * @param {object} aiResult - Raw AI response for `single` mode
 * @param {string} categoryId
 * @param {string} groupId
 * @returns {object}
 */
function remapSingleModeResult(aiResult, categoryId, groupId) {
  return {
    id: generateLocalId(),
    title: aiResult.title,
    description: aiResult.description,
    command: aiResult.command,
    categoryId,
    groupId: groupId || '',
    ...(aiResult.helpUrl ? {helpUrl: aiResult.helpUrl} : {}),
    ...(aiResult.variableMeta && Object.keys(aiResult.variableMeta).length > 0 ? {variableMeta: aiResult.variableMeta} : {}),
  };
}

/**
 * Builds a shell-environment section to append to the system instruction.
 * Tells the AI which shell's syntax to use when generating commands.
 * @param {string} shellName - Display name of the terminal profile (e.g. "PowerShell", "Git Bash")
 * @returns {string}
 */
function buildShellContext(shellName) {
  return `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SHELL ENVIRONMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The user's target shell is: ${shellName}

You MUST generate commands that are valid and executable in this specific shell.
Do NOT mix shell syntaxes. Use only the native built-in commands for the target shell.

Shell syntax reference:
- PowerShell → use Get-ChildItem, Remove-Item, Copy-Item, Write-Host, etc.
- Command Prompt (CMD) → use dir, del, copy, echo, etc.
- Git Bash / Bash / Zsh / WSL → use find, rm, ls, grep, cp, mv, etc.
- Any other Unix-like shell → use standard POSIX/Linux commands.`;
}

/**
 * Main entry point: runs AI generation with proper provider, schema, and ID remapping.
 *
 * @param {{
 *   providerName: ProviderName,
 *   modelId?: string,
 *   apiKey: string,
 *   prompt: string,
 *   mode: 'full'|'single',
 *   customSystemInstruction?: string,
 *   categoryId?: string,
 *   groupId?: string,
 *   shellName?: string,
 *   logger?: import('vscode').OutputChannel|null,
 * }} options
 * @returns {Promise<object>}
 */
async function generateWithAI(options) {
  const {
    providerName,
    modelId,
    apiKey,
    prompt,
    mode,
    customSystemInstruction,
    categoryId,
    groupId,
    shellName,
    logger,
  } = options;

  let systemInstruction = customSystemInstruction || DEFAULT_SYSTEM_INSTRUCTION;

  // Append shell context so the AI generates shell-appropriate commands
  if (shellName) {
    systemInstruction += buildShellContext(shellName);
  }

  const provider = createProvider(providerName, apiKey, modelId);

  let finalResult;
  let schema;
  try {
    const {data: aiResult, schema: providerSchema} = await provider.generateCommands(prompt, mode, systemInstruction);
    schema = providerSchema;
    finalResult = mode === 'full'
      ? remapFullModeIds(aiResult)
      : remapSingleModeResult(aiResult, categoryId, groupId);
  } catch (err) {
    logAiInteraction(logger, {provider: providerName, mode, prompt, systemInstruction, error: err});
    throw err;
  }

  logAiInteraction(logger, {provider: providerName, mode, prompt, systemInstruction, schema, result: finalResult});
  return finalResult;
}

/**
 * Lists available models for a given provider using the provider's API.
 * @param {ProviderName} providerName
 * @param {string} apiKey
 * @returns {Promise<{modelId: string, modelLabel: string}[]>}
 */
async function listModelsForProvider(providerName, apiKey) {
  const provider = createProvider(providerName, apiKey);
  return provider.listModels();
}

module.exports = {generateWithAI, listModelsForProvider};
