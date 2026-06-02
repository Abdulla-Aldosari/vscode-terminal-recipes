const js = require("@eslint/js");

const nodeGlobals = {
  require: "readonly",
  module: "readonly",
  exports: "readonly",
  __dirname: "readonly",
  __filename: "readonly",
  process: "readonly",
  console: "readonly",
  Buffer: "readonly",
  URL: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly",
};

const browserGlobals = {
  window: "readonly",
  document: "readonly",
  navigator: "readonly",
  localStorage: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly",
  requestAnimationFrame: "readonly",
  cancelAnimationFrame: "readonly",
  getComputedStyle: "readonly",
  console: "readonly",
  acquireVsCodeApi: "readonly",
};

module.exports = [
  js.configs.recommended,
  // Node.js files: extension entry point and lib modules
  {
    files: ["extension.js", "lib/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: nodeGlobals,
    },
    rules: {
      "no-unused-vars": "warn",
      // Allow empty catch blocks — intentional silent error handling
      "no-empty": ["error", { "allowEmptyCatch": true }],
      // Disable — flags valid initializer patterns (e.g. var x = ""; then reassign in if/else)
      "no-useless-assignment": "off",
    },
  },
  // Browser/WebView files
  {
    files: ["media/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: browserGlobals,
    },
    rules: {
      "no-unused-vars": "warn",
      // Allow empty catch blocks — intentional silent error handling (e.g. localStorage access)
      "no-empty": ["error", { "allowEmptyCatch": true }],
      // Disable — flags valid initializer patterns (e.g. var heading = ""; then reassign in if/else)
      "no-useless-assignment": "off",
    },
  },
  {
    ignores: ["dist/**", "node_modules/**", ".temp/**"],
  },
];
