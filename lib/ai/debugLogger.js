// Terminal Recipes — VS Code Extension
// Copyright (c) 2026 Abdulla Aldosari
// Licensed under the MIT License. See LICENSE in the project root for details.

/**
 * AI debug logger — centralized logging for all AI interactions.
 * Used only when `terminalRecipes.aiDebugOutput` setting is enabled.
 * All logging logic lives here; providers and factory.js do not call logger directly.
 */

const dash    = '─'.repeat(60);
const divider = '═'.repeat(60);

/**
 * Serializes an error object into a plain JSON-safe object.
 * Copies all enumerable own properties from the error as-is,
 * plus adds `summary_message` from `error.message`.
 * @param {unknown} error
 * @returns {object}
 */
function serializeError(error) {
  if (!error) return { summary_message: 'Unknown error' };
  const plain = { summary_message: error.message ? error.message : String(error) };
  if (typeof error === 'object') {
    for (const key of Object.keys(error)) {
      plain[key] = error[key];
    }
  }
  return plain;
}

/**
 * Logs a complete AI interaction to the VS Code output channel.
 * Prints the system instruction first (in its own block), then the
 * request/response or error as a structured JSON block.
 *
 * @param {import('vscode').OutputChannel|null} logger
 * @param {{
 *   provider: string,
 *   mode: string,
 *   prompt: string,
 *   systemInstruction: string,
 *   result?: object,
 *   error?: unknown,
 * }} entry
 */
function logAiInteraction(logger, entry) {
  if (!logger) return;

  // ── Block 1: System Instruction ──────────────────────────────
  logger.appendLine([
    '',
    dash,
    '📋 system instruction :',
    divider,
    entry.systemInstruction,
    divider,
  ].join('\n'));

  // ── Block 2: Schema (optional — not available on error before API call) ──
  if (entry.schema !== undefined) {
    logger.appendLine([
      '',
      dash,
      '📐 schema :',
      divider,
      JSON.stringify(entry.schema, null, 2),
      divider,
    ].join('\n'));
  }

  // ── Block 3: AI Request / Response or Error ───────────────────
  const log = {
    ai_request: {
      model:     entry.provider,
      mode:      entry.mode,
      timestamp: new Date().toLocaleString(),
    },
    user_prompt: entry.prompt,
  };

  if (entry.error !== undefined) {
    log.ai_error = serializeError(entry.error);
  } else {
    log.ai_response = entry.result;
  }

  logger.appendLine([
    '',
    dash,
    '📩 AI Request :',
    divider,
    JSON.stringify(log, null, 2),
    divider,
  ].join('\n'));

  logger.show(true);
}

module.exports = {logAiInteraction};
