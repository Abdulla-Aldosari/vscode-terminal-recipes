# Terminal Recipes

<p align="center">
  <img src="media/icon.png" alt="Terminal Recipes Icon" width="128" />
</p>

<p align="center">
  <strong>Manage categorized terminal commands and run, use, or copy them with variable support.</strong>
</p>

---

Terminal Recipes is a VS Code extension that gives you a central panel to organize, browse, and execute your frequently used terminal commands. Group them by category, define reusable variables, and run them with a single click.

## Features

### 📂 Categories & Groups

Organize your commands into **categories** (e.g., General, Spark, MySQL) and further refine them with **groups** (e.g., Setup, Build, Test, Deploy). Create, rename, and delete categories and groups as needed.

### 📝 Command Management

- **Add** new commands with a title, template, description, and group assignments.
- **Edit** existing commands — update the title, template, description, or group tags.
- **Delete** commands with a confirmation dialog.
- **Browse** commands in a filterable table view — filter by category and group.

### ⚡ Command Actions

Each command supports three actions:

| Action | Description |
|--------|-------------|
| **Run** | Sends the command to the terminal and executes it immediately (with a confirmation dialog). |
| **Use** | Sends the command to the terminal *without* pressing Enter, so you can review or modify it before running. |
| **Copy** | Copies the resolved command to your clipboard. |

### 🔤 Variable Support

Use `${variableName}` placeholders in your command templates. When you run, use, or copy a command, variables are resolved with the values you provide.

- **`${workspaceFolder}`** — Automatically resolved to your current workspace folder path.
- **Custom variables** — Define any variable (e.g., `${name}`, `${port}`, `${env}`) and fill in the values in the Edit Command tab.
- **Remember** — Check the "Remember" checkbox next to a variable to persist its value per workspace. Remembered values are saved to `.vscode/terminal-recipes.variables.json`.

### 💾 Global Commands Storage

All commands and categories are stored globally in:

```
~/.vscode-terminal-recipes/commands.json
```

You can open and edit this file directly from the panel using the **"Open Global JSON"** button. This means your recipes are available across all workspaces.

### 🏗️ Per-Workspace Variables

Variable values are stored per workspace in:

```
.vscode/terminal-recipes.variables.json
```

This allows different workspaces to have different variable values for the same commands.

## Getting Started

1. Install the extension.
2. Open the panel using one of:
   - **Command Palette** → `Terminal Recipes: Open Panel`
   - **Keyboard Shortcut** → `F4 F4` (press F4 twice)
3. Create a category and optionally add groups.
4. Add your commands with templates.
5. Run, use, or copy commands from the Commands tab.

## Example

Create a command with a template like:

```
php spark make:migration ${name}
```

When you run it, you'll be prompted to fill in `${name}`. Enter `CreateUsersTable` and the executed command becomes:

```
php spark make:migration CreateUsersTable
```

## Keyboard Shortcut

| Shortcut | Action |
|----------|--------|
| `F4 F4` | Open the Terminal Recipes panel |

## Requirements

- VS Code `1.86.0` or later.

## License

[MIT](LICENSE)
