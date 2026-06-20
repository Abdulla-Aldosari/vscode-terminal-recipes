// Syntax checker — runs `node --check` on all project JS files.
// Cross-platform (Node.js only, no shell dependencies).

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const EXCLUDE_DIRS = ["node_modules", "dist", ".vsenv", "media/dev", ".temp", ".git"];
const EXCLUDE_FILES = ["commitlint.config.js", "eslint.config.js"];

function collectFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(".", full).replaceAll("\\", "/");
    if (entry.isDirectory()) {
      if (!EXCLUDE_DIRS.some((ex) => rel.startsWith(ex))) {
        results.push(...collectFiles(full));
      }
    } else if (entry.name.endsWith(".js") && !EXCLUDE_FILES.includes(entry.name)) {
      results.push(rel);
    }
  }
  return results;
}

const files = collectFiles(".");

try {
  execFileSync(process.execPath, ["--check", ...files], { stdio: "inherit" });
  console.log(`✓ Syntax OK (${files.length} files checked)`);
} catch {
  process.exit(1);
}
