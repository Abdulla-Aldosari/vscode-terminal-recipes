// Terminal Recipes — VS Code Extension
// Copyright (c) 2026 Abdulla Aldosari
// Licensed under the MIT License. See LICENSE in the project root for details.

// testing/syntax.test.js
// Runs "node --check <file>" on every JS file in the project (extension side
// and webview side) to catch syntax errors without executing any code.
// Run with: node testing/syntax.test.js

"use strict";

const { execSync } = require("child_process");
const path         = require("path");

// ---------------------------------------------------------------------------
// File list — every .js file that should be syntax-valid
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, "..");

/** @param {...string} parts */
function p(...parts) {
  return path.join(ROOT, ...parts);
}

const FILES = [
  // Extension entry point
  p("extension.js"),

  // lib/ — extension-side modules
  p("lib", "normalize.js"),
  p("lib", "storage.js"),
  p("lib", "terminal.js"),
  p("lib", "handlers.js"),
  p("lib", "auto-variables.js"),

  // lib/ai/ — AI provider modules
  p("lib", "ai", "factory.js"),
  p("lib", "ai", "providers-config.js"),
  p("lib", "ai", "schemas.js"),
  p("lib", "ai", "systemInstruction.js"),
  p("lib", "ai", "debugLogger.js"),

  // media/ — webview foundation
  p("media", "state.js"),
  p("media", "icons.js"),
  p("media", "utils.js"),
  p("media", "messages.js"),
  p("media", "render.js"),
  p("media", "main.js"),

  // media/tabs/
  p("media", "tabs", "recent.js"),
  p("media", "tabs", "commands.js"),
  p("media", "tabs", "favorites.js"),
  p("media", "tabs", "variables.js"),
  p("media", "tabs", "ai.js"),

  // media/modals/
  p("media", "modals", "run-confirm.js"),
  p("media", "modals", "edit-command.js"),
  p("media", "modals", "new-command.js"),
  p("media", "modals", "ai-settings.js"),
  p("media", "modals", "ai-generate.js"),
];

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;

console.log("\n── Syntax Check (node --check) ──\n");

for (const file of FILES) {
  const label = path.relative(ROOT, file).replace(/\\/g, "/");
  try {
    execSync(`node --check "${file}"`, { stdio: "pipe" });
    console.log(`  ✓  ${label}`);
    passed++;
  } catch (err) {
    const stderr = err.stderr ? err.stderr.toString().trim() : err.message;
    console.error(`  ✗  ${label}`);
    console.error(`       ${stderr.split("\n")[0]}`);
    failed++;
  }
}

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

console.log("\n" + "─".repeat(50));
console.log(`  Total : ${passed + failed}`);
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}`);
console.log("─".repeat(50));

if (failed > 0) {
  process.exit(1);
}
