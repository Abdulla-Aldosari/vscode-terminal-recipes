/**
 * Shared debug logging utilities for AI providers.
 * Used only when `terminalRecipes.aiDebugOutput` setting is enabled.
 */

/**
 * Formats an AI request log entry.
 * @param {string} provider
 * @param {'full'|'single'} mode
 * @param {string} systemInstruction
 * @param {string} prompt
 * @param {object} schema
 * @returns {string}
 */
function formatRequestLog(provider, mode, systemInstruction, prompt, schema) {
    const divider = '═'.repeat(60);
    const line = '─'.repeat(60);
    const ts = new Date().toLocaleString();

    return [
        '',
        divider,
        `📤  AI REQUEST  [${provider} | ${mode} mode]  ${ts}`,
        divider,
        '── System Instruction ' + '─'.repeat(38),
        systemInstruction,
        line,
        '── User Prompt ' + '─'.repeat(44),
        prompt,
        line,
        '── Response Schema ' + '─'.repeat(40),
        JSON.stringify(schema, null, 2),
        line,
    ].join('\n');
}

/**
 * Formats an AI raw response log entry.
 * @param {string} rawText
 * @returns {string}
 */
function formatResponseLog(rawText) {
    const divider = '═'.repeat(60);
    const line = '─'.repeat(60);

    let prettyText = rawText;
    try {
        prettyText = JSON.stringify(JSON.parse(rawText), null, 2);
    } catch {
        // If not valid JSON, show as-is
    }

    return [
        divider,
        '📥  AI RESPONSE (raw JSON)',
        divider,
        prettyText,
        line,
    ].join('\n');
}

module.exports = {formatRequestLog, formatResponseLog};
