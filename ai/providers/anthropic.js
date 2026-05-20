const Anthropic = require('@anthropic-ai/sdk');
const { SCHEMA_FULL, SCHEMA_SINGLE } = require('../schemas');

class AnthropicProvider {
  constructor(apiKey) {
    this.client = new Anthropic({ apiKey });
  }

  /**
   * Claude doesn't support structured output natively like OpenAI/Gemini,
   * so we embed the JSON Schema in the system instruction and enforce JSON output.
   *
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

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8096,
      system: enhancedSystem,
      messages: [
        { role: 'user', content: prompt },
      ],
    });

    const content = response.content[0].text;

    // Extract JSON from response (strip any accidental markdown fences)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Anthropic response did not contain valid JSON.');
    }

    return JSON.parse(jsonMatch[0]);
  }
}

module.exports = { AnthropicProvider };
