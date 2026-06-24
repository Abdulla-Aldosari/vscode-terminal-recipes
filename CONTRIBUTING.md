# Contributing

Thank you for your interest in contributing to the [vscode-terminal-recipes](https://github.com/Abdulla-Aldosari/vscode-terminal-recipes) VS Code extension.

When contributing, please first discuss the change you wish to make via an [issue](https://github.com/Abdulla-Aldosari/vscode-terminal-recipes/issues) or any other method with the owner of this repository before making a change.

Note that we have a [Code of Conduct](./CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

---

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Visual Studio Code](https://code.visualstudio.com/)

---

## Getting Started

1. Fork this repository and create your branch from `development`.

2. Clone your forked repository:

```bash
git clone https://github.com/{username}/vscode-terminal-recipes.git
cd vscode-terminal-recipes
```

3. Install dependencies:

```bash
npm install
```

4. Build the extension:

```bash
npm run build
```

---

## Development Workflow

1. Create a new branch from `development` for your changes:

```bash
git checkout development
git checkout -b my-feature-branch
```

2. Run `npm run watch` to build and watch for changes while developing.

3. Press `F5` in VS Code to launch the extension in a new window (Extension Development Host).

4. Run the syntax check to catch any errors:

```bash
npm run check
```

5. Add or update tests according to your changes, then verify they pass:

```bash
npm test
```

6. Run linting and formatting checks before committing:

```bash
npm run lint
npm run prettier:check
```

To auto-fix formatting:

```bash
npm run prettier
```

### Common Commands

```bash
npm install             # Install dependencies
npm run check           # Syntax check (node --check)
npm run lint            # Run ESLint
npm run prettier        # Format all files with Prettier
npm run prettier:check  # Check formatting without modifying files
npm run build           # Bundle and minify the extension
npm run watch           # Build and watch for changes
npm test                # Run tests
```

---

## Code Style

- Code formatting is enforced with Prettier (run `npm run prettier` to format all files)
- Linting is enforced with ESLint (run `npm run lint` to check)

---

## Architecture Overview

The extension has two execution contexts:

- **Extension Host (Node.js):** `extension.js` + `lib/` — CommonJS modules
- **Webview (Browser):** `media/` — plain `<script>` tags sharing a single `window` global scope

Key components:

- `extension.js` — Entry point: panel creation, message routing, state broadcasting
- `lib/handlers.js` — All webview message handler functions
- `lib/storage.js` — All file I/O and path constants (single source of truth for persistence)
- `lib/normalize.js` — Pure data normalization, no side effects
- `lib/terminal.js` — Terminal shell resolution and lifecycle management
- `lib/ai/factory.js` — AI command generation and provider instantiation
- `lib/ai/providers-config.js` — Single source of truth for all AI provider metadata

For a detailed breakdown of every file, export, and message type, see [docs/CODEBASE_MAP.md](docs/CODEBASE_MAP.md).

---

## Submitting Changes

1. Start committing your changes. Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

> [!NOTE]
>
> - `CHANGELOG.md` is generated automatically from commit messages using [git-cliff](https://git-cliff.org/). Do not edit it manually. Only commits of type `feat`, `fix`, `perf`, and breaking changes (`!`) appear in the changelog — all other types are excluded. Write clear, well-formed commit messages as they directly feed into the changelog.

2. Make your changes and ensure tests pass:

```bash
npm test
```

3. Run linting and formatting checks:

```bash
npm run lint
npm run prettier:check
```

4. Submit a pull request **targeting the `development` branch** with a clear description of your changes. Fill out all relevant sections of the PR template.

5. Wait for approval from the project owner/maintainer. Discuss any requested changes and update your PR accordingly.

6. You may merge the pull request once you have sign-off from the project owner, or request them to merge it if they haven't done so after a while.

For bug fixes, please include a test case that demonstrates the fix when possible.

---

## License

By contributing, you agree that your contributions will be licensed under the [Apache License 2.0](./LICENSE).
