// Terminal Recipes — VS Code Extension
// Copyright (c) 2026 Abdulla Aldosari
// Licensed under the MIT License. See LICENSE in the project root for details.

// media/tabs/recent.js
// "Recent Commands" tab — shows commands ordered by lastRunAt.
// Loads after the modal files.

function renderRecentCommandsTab() {
  const recentCommands = (state.data.commands || [])
    .filter(function (cmd) {
      return cmd.lastRunAt;
    })
    .slice()
    .sort(function (a, b) {
      return new Date(b.lastRunAt) - new Date(a.lastRunAt);
    });

  const totalRuns = recentCommands.reduce(function (sum, cmd) {
    return sum + (cmd.runCount || 0);
  }, 0);

  if (!recentCommands.length) {
    return `
      <section class="card">
        <div class="row between">
          <h2>Recent Commands</h2>
        </div>
        <p class="muted">No recent commands yet. Run or Use a command to see it here.</p>
      </section>
    `;
  }

  return `
    <section class="card">
      <div class="row between">
        <h2>Recent Commands</h2>
        <div class="row">
          <span class="muted total-runs">Total runs: <strong>${totalRuns}</strong></span>
          <button id="btn-clear-recent" class="btn small danger" data-tooltip="Clear all recent command history">Clear Recent</button>
        </div>
      </div>
      <div class="table-wrap recent-commands">
        <table class="cmds-table recent-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Template</th>
              <th>Last Run</th>
              <th>×Runs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${recentCommands
              .map(function (command) {
                const titleHtml = command.helpUrl
                  ? `<a class="cmd-title-link" data-url="${escapeAttr(command.helpUrl)}" data-tooltip="Open documentation">${escapeHtml(command.title)}</a>`
                  : `<strong>${escapeHtml(command.title)}</strong>`;
                const _useVars = collectVariables([command.command]).filter(
                  function (n) {
                    return n !== "workspaceFolder";
                  },
                );
                const _useMissing  = getMissingVariables(command);
                const _useCtrlHint =
                  _useVars.length > 0 && _useMissing.length === 0;
                const _useTitle = _useCtrlHint
                  ? "Insert into terminal (without running)<br>Press CTRL key to edit the variables"
                  : "Insert into terminal (without running)";
                return `
                <tr>
                  <td>${titleHtml}</td>
                  <td><pre class="template-cell">${highlightTemplateHtml(command.command)}</pre></td>
                  <td data-tooltip="${escapeAttr(formatDateTime(command.lastRunAt))}">${escapeHtml(timeAgo(command.lastRunAt))}</td>
                  <td><strong>×${command.runCount || 0}</strong></td>
                    <td>
                    <div class="actions-cell">
                      <button class="btn icon-btn success btn-run" data-command-id="${escapeAttr(command.id)}" data-tooltip="Run command">${icons.run}</button>
                      ${command.command.includes("\n") ? `<button class="btn icon-btn secondary" disabled data-tooltip="Use is not available for multi-line commands">${icons.use}</button>` : `<button class="btn icon-btn secondary btn-use action" data-command-id="${escapeAttr(command.id)}" data-tooltip="${escapeAttr(_useTitle)}">${icons.use}</button>`}
                      <button class="btn icon-btn secondary btn-copy action" data-command-id="${escapeAttr(command.id)}" data-tooltip="Copy to clipboard">${icons.copy}</button>
                      <button class="btn icon-btn secondary btn-edit action" data-command-id="${escapeAttr(command.id)}" data-tooltip="Edit command">${icons.edit}</button>
                      ${(function () {
                        const _fs  = getFavoriteScope(command.id);
                        const _cls =
                          _fs === "none"
                            ? "secondary"
                            : _fs === "local"
                              ? "fav-state-local"
                              : _fs === "global"
                                ? "fav-state-global"
                                : "fav-state-both";
                        const _icon =
                          _fs === "none" ? icons.heartPlus : icons.heartActive;
                        const _tip =
                          _fs === "none"
                            ? "Add to favorites"
                            : _fs === "local"
                              ? "In Local Favorites (click to manage)"
                              : _fs === "global"
                                ? "In Global Favorites (click to manage)"
                                : "In Local &amp; Global Favorites (click to manage)";
                        return `<button class="btn icon-btn ${_cls} btn-add-favorite" data-command-id="${escapeAttr(command.id)}" data-tooltip="${escapeAttr(_tip)}" data-tooltip-pos="left">${_icon}</button>`;
                      })()}
                    </div>
                  </td>
                </tr>
              `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function bindRecentTabEvents() {
  const clearRecentButton = document.getElementById("btn-clear-recent");

  if (clearRecentButton) {
    clearRecentButton.addEventListener("click", function () {
      deleteConfirmState = {
        type:     "clearRecent",
        id:       null,
        title:    "All recent history will be cleared.",
        template: "",
      };
      render();
    });
  }
}
