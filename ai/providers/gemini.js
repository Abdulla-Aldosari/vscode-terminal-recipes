const {GoogleGenerativeAI} = require('@google/generative-ai');
const {SCHEMA_FULL, SCHEMA_SINGLE} = require('../schemas');
const {formatRequestLog, formatResponseLog} = require('../debugLogger');

class GeminiProvider {
  constructor(apiKey) {
    this.client = new GoogleGenerativeAI(apiKey);
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

    if (logger) {
      logger.appendLine(formatRequestLog('gemini', mode, systemInstruction, prompt, schema));
      logger.show(true);
    }

    const model = this.client.getGenerativeModel({
      model: 'gemini-flash-latest',
      systemInstruction,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    if (logger) {
      logger.appendLine(formatResponseLog(text));
    }

    return JSON.parse(text);
  }
}

module.exports = {GeminiProvider};
