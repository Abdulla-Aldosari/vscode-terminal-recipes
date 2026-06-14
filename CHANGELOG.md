# Changelog

All notable changes to **Terminal Recipes** are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).  
Versions follow [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

<!-- Add upcoming changes here before the next release. -->

---

## [1.0.0] - 2026-06-15

### Added

- **Command Management** — Create, edit, delete, and browse terminal commands organized by categories and groups.
- **Three Command Actions** — Run (execute immediately with confirmation), Use (paste into terminal without Enter), and Copy (copy to clipboard).
- **Variable Support** — Use `${variableName}` placeholders in command templates; fill in values at run time via an interactive input modal.
- **Three-Scope Variable System** — Each variable can be saved in Local scope (per workspace), Global scope (across all workspaces), or Off (session memory only, never written to disk).
- **Enum Variables** — Define a fixed list of allowed values for any variable; displayed as a dropdown at run time.
- **Auto Variables** — Built-in variables (`$date`, `$user`, `$workspaceFolder`) resolved automatically without user input.
- **AI Assistant — Command Generation** — Generate terminal commands from a plain-language prompt using any of 8 supported AI providers (Google Gemini, OpenAI, Anthropic Claude, DeepSeek, Groq, Mistral AI, Cohere, StepFun).
- **AI Assistant — Command Explanation** — Explain any command in detail directly inside the panel with structured Markdown output (purpose, breakdown, examples, warnings).
- **AI Settings** — Select provider and model, save API key to VS Code SecretStorage, fetch live model lists per provider, and set custom system instructions.
- **Favorites** — Mark commands as favorites with Global or Workspace scope; quick-add with a single click or manage scope with Ctrl+click.
- **Recent Commands** — Automatic history of recently executed commands with a dedicated tab and clear history action.
- **Drag-to-Reorder** — Toggle sort mode to reorder commands within a group by dragging rows.
- **Shell Selector** — Choose which terminal shell to use when running a command (PowerShell, CMD, Bash, etc.) directly from the run confirmation dialog.
- **Column Toggle** — Show or hide table columns in the Commands tab.
- **Navigate to Command** — Jump directly to any command in the Commands tab from the Favorites or Recent tabs.
- **Global Commands Storage** — Commands stored globally in `~/.vscode-terminal-recipes/commands.json`, shared across all workspaces.
- **Open JSON Files** — Open `commands.json`, local variables file, or global variables file directly in the VS Code editor from the panel header.
- **Keyboard Shortcut** — Open the panel with `F4 F4` (double press).
- **Command Palette** — Open the panel via `Terminal Recipes: Open Panel`.
