const {GeminiProvider} = require('./providers/gemini');
const {OpenAIProvider} = require('./providers/openai');
const {AnthropicProvider} = require('./providers/anthropic');
const {DEFAULT_SYSTEM_INSTRUCTION} = require('./systemInstruction');
const crypto = require('crypto');

/** @typedef {'gemini'|'openai'|'anthropic'} ProviderName */

/**
 * Creates an AI provider instance based on the provider name.
 * @param {ProviderName} providerName
 * @param {string} apiKey
 * @returns {GeminiProvider|OpenAIProvider|AnthropicProvider}
 */
function createProvider(providerName, apiKey) {
  switch (providerName) {
    case 'gemini': return new GeminiProvider(apiKey);
    case 'openai': return new OpenAIProvider(apiKey);
    case 'anthropic': return new AnthropicProvider(apiKey);
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
    const mappedGroupIds = (cmd.groupIds || [])
      .map(function (gid) {return idMap[gid] || gid;})
      .filter(Boolean);

    return {
      id: newCmdId,
      title: cmd.title,
      description: cmd.description,
      command: cmd.command,
      categoryId: mappedCategoryId,
      groupIds: mappedGroupIds,
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
    groupIds: groupId ? [groupId] : [],
    ...(aiResult.helpUrl ? {helpUrl: aiResult.helpUrl} : {}),
    ...(aiResult.variableMeta && Object.keys(aiResult.variableMeta).length > 0 ? {variableMeta: aiResult.variableMeta} : {}),
  };
}

/**
 * Main entry point: runs AI generation with proper provider, schema, and ID remapping.
 *
 * @param {{
 *   providerName: ProviderName,
 *   apiKey: string,
 *   prompt: string,
 *   mode: 'full'|'single',
 *   customSystemInstruction?: string,
 *   categoryId?: string,
 *   groupId?: string,
 *   logger?: import('vscode').OutputChannel|null,
 * }} options
 * @returns {Promise<object>}
 */
async function generateWithAI(options) {
  const {
    providerName,
    apiKey,
    prompt,
    mode,
    customSystemInstruction,
    categoryId,
    groupId,
    logger,
  } = options;

  const systemInstruction = customSystemInstruction || DEFAULT_SYSTEM_INSTRUCTION;
  const provider = createProvider(providerName, apiKey);
  const aiResult = await provider.generateCommands(prompt, mode, systemInstruction, logger || null);

  if (mode === 'full') {
    return remapFullModeIds(aiResult);
  }

  return remapSingleModeResult(aiResult, categoryId, groupId);
}

module.exports = {generateWithAI};
