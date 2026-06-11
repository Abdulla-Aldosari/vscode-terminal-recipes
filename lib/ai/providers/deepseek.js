// Terminal Recipes — VS Code Extension
// Copyright (c) 2026 Abdulla Aldosari
// Licensed under the MIT License. See LICENSE in the project root for details.

const OpenAI = require('openai');
const {SCHEMA_FULL, SCHEMA_SINGLE} = require('../schemas');
const {formatRequestLog, formatResponseLog, formatErrorLog} = require('../debugLogger');
const {getProviderConfig} = require('../providers-config');

/**
 * AI provider implementation for DeepSeek.
 * DeepSeek exposes an OpenAI-compatible API, so we reuse the OpenAI SDK
 * with a custom baseURL. Structured JSON output is requested via `response_format`.
 */
class DeepSeekProvider {
  constructor(apiKey, modelId) {
    this.client = new OpenAI({
      apiKey,
      baseURL: 'https://api.deepseek.com/v1',
    });
    const cfg = getProviderConfig('deepseek');
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

    // DeepSeek supports json_object response format — embed the schema in the prompt
    const enhancedSystem = `${systemInstruction}

You MUST respond with a valid JSON object that matches this JSON Schema exactly:
${JSON.stringify(schema, null, 2)}

Do NOT include any text, explanation, or markdown before or after the JSON.`;

    if (logger) {
      logger.appendLine(formatRequestLog('deepseek', mode, enhancedSystem, prompt, schema));
      logger.show(true);
    }

    let response;
    try {
      response = await this.client.chat.completions.create({
        model: this.modelId,
        messages: [
          {role: 'system', content: enhancedSystem},
          {role: 'user', content: prompt},
        ],
        response_format: {type: 'json_object'},
      });
    } catch (err) {
      if (logger) {
        logger.appendLine(formatErrorLog(err));
      }
      throw err;
    }

    const content = response.choices[0].message.content;

    if (logger) {
      logger.appendLine(formatResponseLog(content));
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('DeepSeek response did not contain valid JSON.');
    }

    return JSON.parse(jsonMatch[0]);
  }
}

module.exports = {DeepSeekProvider};
