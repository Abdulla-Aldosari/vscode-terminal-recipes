const OpenAI = require('openai');
const {SCHEMA_FULL, SCHEMA_SINGLE, addAdditionalPropertiesFalse} = require('../schemas');
const {formatRequestLog, formatResponseLog, formatErrorLog} = require('../debugLogger');
const {getProviderConfig} = require('../providers-config');

/**
 * AI provider implementation for OpenAI (GPT-4.1).
 * Uses OpenAI's structured JSON output (`json_schema`) for reliable response formatting.
 * OpenAI strict mode requires `additionalProperties: false` on every object schema,
 * which is injected via `addAdditionalPropertiesFalse` before sending.
 */
class OpenAIProvider {
  constructor(apiKey) {
    this.client = new OpenAI({apiKey});
    this.modelId = getProviderConfig('openai').modelId;
  }

  /**
   * @param {string} prompt
   * @param {'full'|'single'} mode
   * @param {string} systemInstruction
   * @param {import('vscode').OutputChannel|null} [logger]
   * @returns {Promise<object>}
   */
  async generateCommands(prompt, mode, systemInstruction, logger) {
    // OpenAI strict mode requires additionalProperties: false on every object
    const baseSchema = mode === 'full' ? SCHEMA_FULL : SCHEMA_SINGLE;
    const schema = addAdditionalPropertiesFalse(baseSchema);
    const schemaName = mode === 'full' ? 'terminal_commands_full' : 'terminal_commands_single';

    if (logger) {
      logger.appendLine(formatRequestLog('openai', mode, systemInstruction, prompt, schema));
      logger.show(true);
    }

    let response;
    try {
      response = await this.client.chat.completions.create({
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

    return JSON.parse(content);
  }
}

module.exports = {OpenAIProvider};
