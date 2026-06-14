// Terminal Recipes — VS Code Extension
// Copyright (c) 2026 Abdulla Aldosari
// Licensed under the MIT License. See LICENSE in the project root for details.

const {Mistral} = require('@mistralai/mistralai');
const {SCHEMA_FULL, SCHEMA_SINGLE} = require('../schemas');
const {getProviderConfig} = require('../providers-config');

/**
 * AI provider implementation for Mistral AI.
 * Uses Mistral's chat completions API with json_object response format.
 * The JSON schema is embedded in the system instruction.
 * Mistral Small and Codestral are available on the free tier.
 */
class MistralProvider {
  constructor(apiKey, modelId) {
    this.client = new Mistral({apiKey});
    const cfg = getProviderConfig('mistral');
    this.modelId = modelId || cfg.defaultModelId || cfg.models[0].modelId;
  }

  /**
   * @returns {Promise<{modelId: string, modelLabel: string}[]>}
   */
  async listModels() {
    const cfg = getProviderConfig('mistral');
    const exclude = cfg.modelIdExcludeKeywords || [];
    const response = await this.client.models.list();
    return (response.data || [])
      .map(function (m) {
        return { modelId: m.id, modelLabel: m.id };
      })
      .filter(function (m) {
        const id = m.modelId.toLowerCase();
        return !exclude.some(function (kw) { return id.includes(kw); });
      });
  }

  /**
   * @param {string} prompt
   * @param {'full'|'single'} mode
   * @param {string} systemInstruction
   * @returns {Promise<object>}
   */
  async generateCommands(prompt, mode, systemInstruction) {
    const schema = mode === 'full' ? SCHEMA_FULL : SCHEMA_SINGLE;

    const enhancedSystem = `${systemInstruction}

You MUST respond with a valid JSON object that matches this JSON Schema exactly:
${JSON.stringify(schema, null, 2)}

Do NOT include any text, explanation, or markdown before or after the JSON.`;

    const response = await this.client.chat.complete({
      model: this.modelId,
      messages: [
        {role: 'system', content: enhancedSystem},
        {role: 'user', content: prompt},
      ],
      responseFormat: {type: 'json_object'},
    });

    const content = response.choices[0].message.content;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Mistral response did not contain valid JSON.');
    }

    return { data: JSON.parse(jsonMatch[0]), schema };
  }
}

module.exports = {MistralProvider};
