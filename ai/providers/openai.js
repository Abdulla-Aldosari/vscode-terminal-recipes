const OpenAI = require('openai');
const { SCHEMA_FULL, SCHEMA_SINGLE, addAdditionalPropertiesFalse } = require('../schemas');

class OpenAIProvider {
  constructor(apiKey) {
    this.client = new OpenAI({ apiKey });
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
      model: 'gpt-4.1',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt },
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

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  }
}

module.exports = { OpenAIProvider };
