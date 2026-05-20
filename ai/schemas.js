/**
 * JSON Schemas for AI structured output.
 * Used to enforce exact response format from AI providers.
 *
 * NOTE: `additionalProperties` is intentionally omitted here because
 * Gemini does not support it in responseSchema. OpenAI injects it
 * separately when needed (see providers/openai.js).
 */

/**
 * Schema for `full` mode: generates a complete category with groups and commands.
 */
const SCHEMA_FULL = {
  type: 'object',
  properties: {
    category: {
      type: 'object',
      properties: {
        id:     { type: 'string' },
        title:  { type: 'string' },
        groups: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id:    { type: 'string' },
              title: { type: 'string' },
            },
            required: ['id', 'title'],
          },
        },
      },
      required: ['id', 'title', 'groups'],
    },
    commands: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id:          { type: 'string' },
          title:       { type: 'string' },
          description: { type: 'string' },
          command:     { type: 'string' },
          categoryId:  { type: 'string' },
          groupIds:    { type: 'array', items: { type: 'string' } },
        },
        required: ['id', 'title', 'description', 'command', 'categoryId', 'groupIds'],
      },
    },
  },
  required: ['category', 'commands'],
};

/**
 * Schema for `single` mode: generates a single command.
 * categoryId and groupIds are NOT included — they are injected locally.
 */
const SCHEMA_SINGLE = {
  type: 'object',
  properties: {
    id:          { type: 'string' },
    title:       { type: 'string' },
    description: { type: 'string' },
    command:     { type: 'string' },
  },
  required: ['id', 'title', 'description', 'command'],
};

/**
 * Recursively adds `additionalProperties: false` to every object in the schema.
 * Required by OpenAI when using strict JSON schema mode.
 * @param {object} schema
 * @returns {object} new schema with additionalProperties added
 */
function addAdditionalPropertiesFalse(schema) {
  if (!schema || typeof schema !== 'object') {
    return schema;
  }

  const result = { ...schema };

  if (result.type === 'object') {
    result.additionalProperties = false;
    if (result.properties) {
      const newProps = {};
      for (const [key, val] of Object.entries(result.properties)) {
        newProps[key] = addAdditionalPropertiesFalse(val);
      }
      result.properties = newProps;
    }
  }

  if (result.type === 'array' && result.items) {
    result.items = addAdditionalPropertiesFalse(result.items);
  }

  return result;
}

module.exports = { SCHEMA_FULL, SCHEMA_SINGLE, addAdditionalPropertiesFalse };
