// Terminal Recipes — VS Code Extension
// Copyright (c) 2026 Abdulla Aldosari
// Licensed under the MIT License. See LICENSE in the project root for details.

const {CohereClient} = require('cohere-ai');
const {SCHEMA_FULL, SCHEMA_SINGLE} = require('../schemas');
const {formatRequestLog, formatResponseLog, formatErrorLog} = require('../debugLogger');
const {getProviderConfig} = require('../providers-config');

/**
 * AI provider implementation for Cohere.
 * Uses Cohere's chat API with response_format json_object.
 * The JSON schema is embedded in the system instruction (preamble).
 * Command R7B is available on the free trial tier.
 */
class CohereProvider {
  constructor(apiKey, modelId) {
    this.client = new CohereClient({token: apiKey});
    const cfg = getProviderConfig('cohere');
    this.modelId = modelId || cfg.defaultModelId || cfg.models[0].modelId;
  }

  /**
   * @param {string} prompt
   * @param {'full'|'single'} mode
   * @param {string} systemInstruction
   * @param {import('vscode').OutputChannel|null} [logger]
   * @returns {Promise<object>}
   */
  async generateCommands(prompt, mode, systemInstruction, logger) {
    const schema = mode === 'full' ? SCHEMA_FULL : SCHEMA_SINGLE;

    const preamble = `${systemInstruction}

You MUST respond with a valid JSON object that matches this JSON Schema exactly:
${JSON.stringify(schema, null, 2)}

Do NOT include any text, explanation, or markdown before or after the JSON.`;

    if (logger) {
      logger.appendLine(formatRequestLog('cohere', mode, preamble, prompt, schema));
      logger.show(true);
    }

    let response;
    try {
      response = await this.client.chat({
        model: this.modelId,
        preamble,
        message: prompt,
        responseFormat: {type: 'json_object'},
      });
    } catch (err) {
      if (logger) {
        logger.appendLine(formatErrorLog(err));
      }
      throw err;
    }

    const content = response.text;

    if (logger) {
      logger.appendLine(formatResponseLog(content));
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Cohere response did not contain valid JSON.');
    }

    return JSON.parse(jsonMatch[0]);
  }
}

module.exports = {CohereProvider};
