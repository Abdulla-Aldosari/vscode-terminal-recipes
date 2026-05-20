const { GoogleGenerativeAI } = require('@google/generative-ai');
const { SCHEMA_FULL, SCHEMA_SINGLE } = require('../schemas');

class GeminiProvider {
  constructor(apiKey) {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  /**
   * @param {string} prompt
   * @param {'full'|'single'} mode
   * @param {string} systemInstruction
   * @returns {Promise<object>}
   */
  async generateCommands(prompt, mode, systemInstruction) {
    const schema = mode === 'full' ? SCHEMA_FULL : SCHEMA_SINGLE;

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
    return JSON.parse(text);
  }
}

module.exports = { GeminiProvider };
