# Contributing

Thank you for your interest in contributing to the Terminal Recipes VS Code extension! Feel free to open issues or PRs.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Visual Studio Code](https://code.visualstudio.com/)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/Abdulla-Aldosari/vscode-terminal-recipes.git
   cd vscode-terminal-recipes
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

## Development

### Common Commands

```bash
npm install       # Install dependencies
npm run check     # Syntax check (node --check)
npm run lint      # Run ESLint
npm run build     # Bundle and minify the extension
npm run watch     # Build and watch for changes
npm test          # Run tests
```

### Running the Extension

1. Open this repository in VS Code
2. Run `npm run watch` to build and watch for changes
3. Press `F5` or go to Debug sidebar → "Run Extension"
4. A new VS Code window will open with the extension loaded

### Running Tests

**Desktop Tests (Via VS Code):**

1. Open this repository in VS Code
2. Go to Debug sidebar → "Launch Tests"

**Desktop Tests (Via CLI):**

```bash
npm test
```

> **Note:** No VS Code instance can be running when using the CLI, or tests won't start.

## Code Style

- Linting is enforced with ESLint (run `npm run lint` to check)
- No inline styles - all styling must be defined in `media/styles.css` as CSS classes
- No native `<select>` elements - use `renderCustomSelect()` + `bindCustomSelect()` from `media/utils.js`
- Pre-commit hooks automatically lint staged files

## Architecture Overview

The extension has two execution contexts:

- **Extension Host (Node.js):** `extension.js` + `lib/` - CommonJS modules
- **Webview (Browser):** `media/` - plain `<script>` tags sharing a single `window` global scope

Key components:

- `extension.js` - Entry point: panel creation, message routing, state broadcasting
- `lib/handlers.js` - All webview message handler functions
- `lib/storage.js` - All file I/O and path constants (single source of truth for persistence)
- `lib/normalize.js` - Pure data normalization, no side effects
- `lib/terminal.js` - Terminal shell resolution and lifecycle management
- `lib/ai/factory.js` - AI command generation and provider instantiation
- `lib/ai/providers-config.js` - Single source of truth for all AI provider metadata

For a detailed breakdown of every file, export, and message type, see [docs/CODEBASE_MAP.md](docs/CODEBASE_MAP.md).

## Submitting Changes

1. Fork the repository and create a branch for your changes
2. Make your changes and ensure tests pass (`npm test`)
3. Run `npm run lint` to ensure code style compliance
4. Submit a pull request with a clear description of your changes

For bug fixes, please include a test case that demonstrates the fix when possible.
