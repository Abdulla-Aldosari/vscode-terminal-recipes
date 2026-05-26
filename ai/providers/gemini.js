const {GoogleGenerativeAI} = require('@google/generative-ai');
const {SCHEMA_FULL_GEMINI, SCHEMA_SINGLE_GEMINI} = require('../schemas');
const {formatRequestLog, formatResponseLog, formatErrorLog} = require('../debugLogger');
const {getProviderConfig} = require('../providers-config');

/**
 * Appended to the system instruction so Gemini knows to use `variableMetaList`
 * (array format) instead of `variableMeta` (dynamic object keys), because
 * Gemini's responseSchema does not support dynamic/additionalProperties keys.
 *
 * The result is transformed back to the standard `variableMeta` object format
 * by `transformGeminiResponse` before being returned to the caller.
 */
const GEMINI_VARIABLE_META_ADDENDUM = `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GEMINI FORMAT NOTE — variableMetaList
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
In this response format, instead of a "variableMeta" object with dynamic keys,
you MUST use a "variableMetaList" array. Each item in the array represents one
TYPE B (Enum) variable and must include a "variableName" field with the exact
variable name as it appears in the command string (without the \${} syntax).

Example for the command "npm install --loglevel=\${LogLevel}":
{
  "variableMetaList": [
    {
      "variableName": "LogLevel",
      "type": "enum",
      "enumValues": [
        { "title": "Silent",  "value": "silent",  "description": "Suppresses all output." },
        { "title": "Error",   "value": "error",   "description": "Shows only errors." },
        { "title": "Warn",    "value": "warn",    "description": "Shows warnings and errors." },
        { "title": "Notice",  "value": "notice",  "description": "Default npm log level." },
        { "title": "HTTP",    "value": "http",    "description": "Shows HTTP requests." },
        { "title": "Info",    "value": "info",    "description": "Detailed lifecycle info." },
        { "title": "Verbose", "value": "verbose", "description": "Large amounts of debug data." },
        { "title": "Silly",   "value": "silly",   "description": "Shows absolutely everything." }
      ]
    }
  ]
}

If the command has NO TYPE B (Enum) variables, set "variableMetaList" to [].

⚠️  CRITICAL RULE — COMPLETE ENUM VALUES:
You MUST include EVERY documented valid value in "enumValues".
Do NOT filter or omit values based on the user's request context.
The user needs the FULL list to choose from — not a curated subset.`;

/**
 * Converts Gemini's `variableMetaList` array back to the standard `variableMeta` object.
 * Also works recursively for `full` mode (array of commands).
 *
 * @param {object} raw - Parsed Gemini response
 * @param {'full'|'single'} mode
 * @returns {object} - Normalized result with standard variableMeta
 */
function transformGeminiResponse(raw, mode) {
  function convertList(obj) {
    const list = Array.isArray(obj.variableMetaList) ? obj.variableMetaList : [];
    const variableMeta = {};
    for (const entry of list) {
      if (entry && typeof entry.variableName === 'string' && entry.variableName) {
        variableMeta[entry.variableName] = {
          type: entry.type || 'enum',
          enumValues: Array.isArray(entry.enumValues) ? entry.enumValues : [],
        };
      }
    }
    const result = {...obj};
    delete result.variableMetaList;
    result.variableMeta = variableMeta;
    return result;
  }

  if (mode === 'full') {
    return {
      category: raw.category,
      commands: (raw.commands || []).map(convertList),
    };
  }

  return convertList(raw);
}

class GeminiProvider {
  constructor(apiKey) {
    this.client = new GoogleGenerativeAI(apiKey);
    this.modelId = getProviderConfig('gemini').modelId;
  }

  /**
   * @param {string} prompt
   * @param {'full'|'single'} mode
   * @param {string} systemInstruction
   * @param {import('vscode').OutputChannel|null} [logger]
   * @returns {Promise<object>}
   */
  async generateCommands(prompt, mode, systemInstruction, logger) {
    const schema = mode === 'full' ? SCHEMA_FULL_GEMINI : SCHEMA_SINGLE_GEMINI;
    const enhancedInstruction = systemInstruction + GEMINI_VARIABLE_META_ADDENDUM;

    if (logger) {
      logger.appendLine(formatRequestLog('gemini', mode, enhancedInstruction, prompt, schema));
      logger.show(true);
    }

    const model = this.client.getGenerativeModel({
      model: this.modelId,
      systemInstruction: enhancedInstruction,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (err) {
      if (logger) {
        logger.appendLine(formatErrorLog(err));
      }
      throw err;
    }

    const text = result.response.text();

    if (logger) {
      logger.appendLine(formatResponseLog(text));
    }

    const parsed = JSON.parse(text);
    return transformGeminiResponse(parsed, mode);
  }
}

module.exports = {GeminiProvider};
