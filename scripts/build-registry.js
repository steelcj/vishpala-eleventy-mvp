#!/usr/bin/env node
/**
 * scripts/build-registry.js
 *
 * Scans content/ recursively for markdown files and derives two
 * read-only registries that give human-readable labels to the UUIDs
 * used in dc:identifier / dc:relation front matter:
 *
 *   content/_registry/works/<uuid>.md        one per Work (dc:relation)
 *   content/_registry/expressions/<uuid>.md  one per page (dc:identifier)
 *
 * These live under content/_registry/ as git-tracked files (not build
 * output) because Sveltia CMS reads collections straight out of git, not
 * out of the Eleventy build. Two small file collections in
 * admin/config.yml point at these directories, and page fields like
 * dc:relation use a `relation` widget against them — so editors search
 * by title instead of pasting a UUID.
 *
 * Run automatically by .githooks/pre-commit on every commit (see
 * package.json's "prepare" script, and README.md for one-time setup).
 * Do NOT hand-edit files under content/_registry/ — they are overwritten
 * on every run.
 */

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const matter = require("gray-matter");

const ROOT = path.join(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const REGISTRY_DIR = path.join(CONTENT_DIR, "_registry");
const WORKS_DIR = path.join(REGISTRY_DIR, "works");
const EXPRESSIONS_DIR = path.join(REGISTRY_DIR, "expressions");

function stripUrn(uuid) {
  return String(uuid).replace(/^urn:uuid:/i, "").trim();
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function loadContentFiles() {
  const files = glob.sync("**/*.md", {
    cwd: CONTENT_DIR,
    ignore: ["_registry/**"],
    absolute: true,
  });

  return files.map((filePath) => {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw);
    return {
      relPath: path.relative(ROOT, filePath),
      data,
    };
  });
}

function deriveLocale(relPath) {
  // content/en-ca/about.md -> en-ca
  const parts = relPath.split(path.sep);
  const idx = parts.indexOf("content");
  return idx >= 0 && parts[idx + 1] ? parts[idx + 1] : "unknown";
}

function buildRegistries(entries) {
  const works = new Map(); // uuid -> { uuid, label, locales: {locale: relPath} }
  const expressions = new Map(); // uuid -> { uuid, label, locale, path }

  for (const { data, relPath } of entries) {
    const title = isNonEmptyString(data.title) ? data.title : relPath;
    const locale = deriveLocale(relPath);

    if (isNonEmptyString(data.identifier)) {
      const uuid = stripUrn(data.identifier);
      expressions.set(uuid, {
        uuid,
        label: `${title} (${locale})`,
        locale,
        path: relPath,
      });
    }

    if (isNonEmptyString(data.relation)) {
      const uuid = stripUrn(data.relation);
      const existing = works.get(uuid) || { uuid, label: title, locales: {} };
      existing.locales[locale] = relPath;
      // Prefer the default-locale title as the canonical label so it's
      // stable regardless of which file happens to be scanned first.
      if (locale === "en-ca") existing.label = title;
      works.set(uuid, existing);
    }
  }

  return { works, expressions };
}

function toFrontMatterYaml(frontMatter) {
  return Object.entries(frontMatter)
    .map(([key, value]) => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const nested = Object.entries(value)
          .map(([k, v]) => `  ${k}: ${JSON.stringify(v)}`)
          .join("\n");
        return `${key}:\n${nested}`;
      }
      return `${key}: ${JSON.stringify(value)}`;
    })
    .join("\n");
}

function writeRegistryFile(dir, uuid, frontMatter) {
  const filePath = path.join(dir, `${uuid}.md`);
  fs.writeFileSync(filePath, `---\n${toFrontMatterYaml(frontMatter)}\n---\n`);
}

function resetDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const entries = loadContentFiles();
  const { works, expressions } = buildRegistries(entries);

  resetDir(WORKS_DIR);
  resetDir(EXPRESSIONS_DIR);

  for (const work of works.values()) writeRegistryFile(WORKS_DIR, work.uuid, work);
  for (const expr of expressions.values()) writeRegistryFile(EXPRESSIONS_DIR, expr.uuid, expr);

  console.log(`Registry rebuilt: ${works.size} works, ${expressions.size} expressions.`);
}

main();
