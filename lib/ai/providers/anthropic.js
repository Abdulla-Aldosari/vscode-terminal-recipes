// Terminal Recipes — VS Code Extension
// Copyright (c) 2026 Abdulla Aldosari
// Licensed under the MIT License. See LICENSE in the project root for details.

const Anthropic = require('@anthropic-ai/sdk');
const {SCHEMA_FULL, SCHEMA_SINGLE} = require('../schemas');
const {getProviderConfig} = require('../providers-config');

/**
 * AI provider implementation for Anthropic Claude.
 * Claude lacks native structured output support (unlike OpenAI/Gemini),
 * so the JSON schema is embedded directly in the system instruction and
 * JSON is extracted from the response via regex before parsing.
 */
class AnthropicProvider {
  constructor(apiKey, modelId) {
    this.client = new Anthropic({apiKey});
    const cfg = getProviderConfig('anthropic');
    this.modelId = modelId || cfg.defaultModelId || cfg.models[0].modelId;
  }

  /**
   * Returns the raw model list from the Anthropic API.
   * Filtering (keywords, exact IDs, deduplication) is handled centrally in factory.js.
   * @returns {Promise<{modelId: string, modelLabel: string}[]>}
   */
  async listModels() {
    const models = [];
    for await (const model of this.client.models.list()) {
      models.push({
        modelId: model.id,
        modelLabel: model.display_name || model.id,
      });
    }
    return models;
  }

  /**
   * Returns the raw markdown explanation of a CLI command.
   * @param {string} command
   * @param {string} systemInstruction
   * @returns {Promise<string>}
   */
  async explainCommand(command, systemInstruction) {
    const response = await this.client.messages.create({
      model: this.modelId,
      max_tokens: 4096,
      system: systemInstruction,
      messages: [
        {role: 'user', content: command},
      ],
    });
    return response.content[0].text;
  }

  async generateCommands(prompt, mode, systemInstruction) {
    const schema = mode === 'full' ? SCHEMA_FULL : SCHEMA_SINGLE;

    const enhancedSystem = `${systemInstruction}

You MUST respond with a valid JSON object that matches this JSON Schema exactly:
${JSON.stringify(schema, null, 2)}

Do NOT include any text, explanation, or markdown before or after the JSON.`;

    const response = await this.client.messages.create({
      model: this.modelId,
      max_tokens: 8096, // Claude requires an explicit max_tokens; 8096 comfortably fits full-mode responses
      system: enhancedSystem,
      messages: [
        {role: 'user', content: prompt},
      ],
    });

    const content = response.content[0].text;

    // Extract JSON from response (strip any accidental markdown fences)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Anthropic response did not contain valid JSON.');
    }

    return { data: JSON.parse(jsonMatch[0]), schema };
  }
}

module.exports = {AnthropicProvider};
