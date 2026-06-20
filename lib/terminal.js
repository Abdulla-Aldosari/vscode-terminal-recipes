// Terminal Recipes — VS Code Extension
// Copyright (c) 2026 Abdulla Aldosari
// Licensed under the MIT License. See LICENSE in the project root for details.

// lib/terminal.js
// Terminal shell resolution and lifecycle management.
// Fully isolated from file I/O and data normalization.

const vscode = require("vscode");

/**
 * Fixes a shell executable path on Windows by replacing the 32-bit Sysnative alias
 * with the actual 64-bit System32 path to avoid process resolution issues.
 * @param {string} rawPath
 * @returns {string}
 */
function fixShellPath(rawPath) {
  if (typeof rawPath !== "string") {
    return rawPath;
  }
  // Replace Sysnative (32-bit alias) with System32 (actual 64-bit path)
  return rawPath.replace(/\\Sysnative\\/i, "\\System32\\");
}

/**
 * Resolves the shell executable path for a named VS Code terminal profile source
 * (e.g. 'PowerShell', 'Git Bash', 'WSL') on Windows.
 * Returns null if the source is unrecognized or the platform is not Windows.
 * @param {string} source - The profile source name from VS Code settings
 * @returns {string|null}
 */
function resolveSourceProfilePath(source) {
  const platform = process.platform;

  if (platform === "win32") {
    const fsSync = require("fs");

    if (source === "PowerShell") {
      const pwsh7 = "C:\\Program Files\\PowerShell\\7\\pwsh.exe";
      try {
        fsSync.accessSync(pwsh7);
        return pwsh7;
      } catch {}
      return "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";
    }

    if (source === "Command Prompt") {
      return "C:\\Windows\\System32\\cmd.exe";
    }

    if (source === "Git Bash") {
      const fsSync2 = require("fs");
      const candidates = ["C:\\Program Files\\Git\\bin\\bash.exe", "C:\\Program Files (x86)\\Git\\bin\\bash.exe"];
      for (const p of candidates) {
        try {
          fsSync2.accessSync(p);
          return p;
        } catch {}
      }
      return null;
    }

    if (source === "WSL" || source === "WSL Bash") {
      return "C:\\Windows\\System32\\wsl.exe";
    }
  }

  return null;
}

/**
 * Reads the terminal profiles configured in VS Code settings for the current platform.
 * Returns a list of profiles with their resolved shell paths, and the default profile name.
 * @returns {{ defaultProfile: string, profiles: Array<{name: string, shellPath: string}> }}
 */
function getTerminalProfiles() {
  const platform = process.platform;
  const profileKey = platform === "win32" ? "windows" : platform === "darwin" ? "osx" : "linux";

  const defaultProfileName =
    vscode.workspace.getConfiguration("terminal.integrated.defaultProfile").get(profileKey) || "";

  const rawProfiles = vscode.workspace.getConfiguration("terminal.integrated.profiles").get(profileKey) || {};

  const profiles = [];

  for (const [name, config] of Object.entries(rawProfiles)) {
    if (!config || typeof config !== "object") {
      continue;
    }

    let shellPath = null;

    // Prefer explicit path
    if (config.path) {
      const rawPath = Array.isArray(config.path) ? config.path[0] : config.path;
      if (typeof rawPath === "string" && rawPath) {
        shellPath = fixShellPath(rawPath);
      }
    }

    // Fall back to resolving from source
    if (!shellPath && config.source) {
      shellPath = resolveSourceProfilePath(config.source);
    }

    if (!shellPath) {
      continue;
    }

    profiles.push({ name, shellPath });
  }

  return {
    defaultProfile: defaultProfileName,
    profiles,
  };
}

/**
 * Returns an existing active terminal or creates a new one with the given shell.
 * If no shellPath is provided, falls back to the user's default terminal profile.
 * If cwd is provided, always creates a new terminal opened at that directory.
 * @param {string|undefined} shellPath - Path to the shell executable
 * @param {string|undefined} shellName - Display name for the terminal tab
 * @param {string|undefined} cwd - Working directory for the new terminal
 * @returns {import('vscode').Terminal}
 */
function getOrCreateTerminal(shellPath, shellName, cwd) {
  // When a cwd is specified we must always create a new terminal so it opens
  // at the requested directory — reusing an existing terminal would ignore cwd.
  // Reuse the active terminal only when no specific shell or directory is requested.
  // A shellPath forces a new terminal to run the correct shell executable.
  // A cwd forces a new terminal so it opens at the requested directory.
  if (!shellPath && !cwd && vscode.window.activeTerminal) {
    return vscode.window.activeTerminal;
  }

  const terminalName = shellName ? `Terminal Recipes (${shellName})` : "Terminal Recipes";

  if (shellPath) {
    return vscode.window.createTerminal({
      name: terminalName,
      shellPath,
      ...(cwd ? { cwd } : {}),
    });
  }

  // No shellPath provided — resolve user's default profile
  const { defaultProfile: defaultProfileName, profiles } = getTerminalProfiles();
  const defaultEntry = profiles.find(function (p) {
    return p.name === defaultProfileName;
  });
  const resolvedShellPath = defaultEntry ? defaultEntry.shellPath : undefined;
  const resolvedName = defaultEntry ? `Terminal Recipes (${defaultEntry.name})` : "Terminal Recipes";

  return vscode.window.createTerminal({
    name: resolvedName,
    ...(resolvedShellPath ? { shellPath: resolvedShellPath } : {}),
    ...(cwd ? { cwd } : {}),
  });
}

module.exports = {
  fixShellPath,
  resolveSourceProfilePath,
  getTerminalProfiles,
  getOrCreateTerminal,
};
