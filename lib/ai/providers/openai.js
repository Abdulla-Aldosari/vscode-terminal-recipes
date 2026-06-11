// Terminal Recipes — VS Code Extension
// Copyright (c) 2026 Abdulla Aldosari
// Licensed under the MIT License. See LICENSE in the project root for details.

const OpenAI = require('openai');
const {SCHEMA_FULL, SCHEMA_SINGLE, addAdditionalPropertiesFalse} = require('../schemas');
const {getProviderConfig} = require('../providers-config');

/**
 * AI provider implementation for OpenAI (GPT-4.1).
 * Uses OpenAI's structured JSON output (`json_schema`) for reliable response formatting.
 * OpenAI strict mode requires `additionalProperties: false` on every object schema,
 * which is injected via `addAdditionalPropertiesFalse` before sending.
 */
class OpenAIProvider {
  constructor(apiKey, modelId) {
    this.client = new OpenAI({apiKey});
    const cfg = getProviderConfig('openai');
    this.modelId = modelId || cfg.defaultModelId || cfg.models[0].modelId;
  }

  /**
   * @param {string} prompt
   * @param {'full'|'single'} mode
   * @param {string} systemInstruction
   * @returns {Promise<object>}
   */
  async generateCommands(prompt, mode, systemInstruction) {
    // OpenAI strict mode requires additionalProperties: false on every object
    const baseSchema = mode === 'full' ? SCHEMA_FULL : SCHEMA_SINGLE;
    const schema = addAdditionalPropertiesFalse(baseSchema);
    const schemaName = mode === 'full' ? 'terminal_commands_full' : 'terminal_commands_single';

    const response = await this.client.chat.completions.create({
      model: this.modelId,
      messages: [
        {role: 'system', content: systemInstruction},
        {role: 'user', content: prompt},
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: schemaName,
          strict: true,
          schema,
        },
      },
    });

    return { data: JSON.parse(response.choices[0].message.content), schema };
  }
}

module.exports = {OpenAIProvider};
