// Terminal Recipes — VS Code Extension
// Copyright (c) 2026 Abdulla Aldosari
// Licensed under the MIT License. See LICENSE in the project root for details.

const Groq = require("groq-sdk");
const { SCHEMA_FULL, SCHEMA_SINGLE } = require("../schemas");
const { getProviderConfig } = require("../providers-config");

/**
 * AI provider implementation for Groq.
 * Groq provides an OpenAI-compatible API with extremely fast inference.
 * Uses json_object response format with schema embedded in the system prompt.
 * Free tier available with rate limits.
 */
class GroqProvider {
  constructor(apiKey, modelId) {
    this.client = new Groq({ apiKey });
    const cfg = getProviderConfig("groq");
    this.modelId = modelId || cfg.defaultModelId || cfg.models[0].modelId;
  }

  /**
   * Returns the raw model list from the Groq API.
   * Filtering (keywords, exact IDs, deduplication) is handled centrally in factory.js.
   * @returns {Promise<{modelId: string, modelLabel: string}[]>}
   */
  async listModels() {
    const response = await this.client.models.list();
    return (response.data || []).map(function (model) {
      return { modelId: model.id, modelLabel: model.id };
    });
  }

  /**
   * Returns the raw markdown explanation of a CLI command.
   * @param {string} command
   * @param {string} systemInstruction
   * @returns {Promise<string>}
   */
  async explainCommand(command, systemInstruction) {
    const response = await this.client.chat.completions.create({
      model: this.modelId,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: command },
      ],
    });
    return response.choices[0].message.content;
  }

  async generateCommands(prompt, mode, systemInstruction) {
    const schema = mode === "full" ? SCHEMA_FULL : SCHEMA_SINGLE;

    const enhancedSystem = `${systemInstruction}

You MUST respond with a valid JSON object that matches this JSON Schema exactly:
${JSON.stringify(schema, null, 2)}

Do NOT include any text, explanation, or markdown before or after the JSON.`;

    const response = await this.client.chat.completions.create({
      model: this.modelId,
      messages: [
        { role: "system", content: enhancedSystem },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Groq response did not contain valid JSON.");
    }

    return { data: JSON.parse(jsonMatch[0]), schema };
  }
}

module.exports = { GroqProvider };
