#!/usr/bin/env node
/**
 * scripts/setup-git-hooks.js
 *
 * Run by npm's "prepare" lifecycle script (see package.json) on every
 * `npm install`. Points git at .githooks/ via `core.hooksPath` so
 * .githooks/pre-commit — which regenerates content/_registry/ before
 * every commit — is actually active.
 *
 * Deliberately does NOT fail the install if .git doesn't exist yet
 * (e.g. a fresh checkout of this zip, before `git init` has been run).
 * It prints a message and exits 0 instead. Re-run `npm run prepare`
 * (or `npm install` again) after `git init` to activate the hook.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const GIT_DIR = path.join(ROOT, ".git");
const HOOK_PATH = path.join(ROOT, ".githooks", "pre-commit");

if (!fs.existsSync(GIT_DIR)) {
  console.log(
    "[prepare] No .git directory yet — skipping git hook setup. " +
      "Run `git init`, then `npm run prepare` (or `npm install` again) " +
      "to activate the pre-commit registry hook."
  );
  process.exit(0);
}

try {
  execSync("git config core.hooksPath .githooks", { cwd: ROOT, stdio: "inherit" });

  if (fs.existsSync(HOOK_PATH)) {
    fs.chmodSync(HOOK_PATH, 0o755);
  } else {
    console.warn(`[prepare] Warning: ${HOOK_PATH} not found — hooksPath is set, but there's nothing there yet.`);
  }

  console.log("[prepare] git core.hooksPath set to .githooks — pre-commit will regenerate the registry on every commit.");
} catch (err) {
  console.error("[prepare] Failed to configure git hooks:", err.message);
  process.exit(1);
}
