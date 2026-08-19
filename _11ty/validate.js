const UUID_RE = /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * @param {Array} pages Eleventy page objects (already filtered to
 *   locale-bearing content pages).
 * @returns {{ errors: string[], warnings: string[] }}
 */
function validateContent(pages) {
  const errors = [];
  const warnings = [];

  // ---- identifier: must be a well-formed urn:uuid, and unique ----
  const byIdentifier = new Map();
  for (const p of pages) {
    if (!p.data.identifier) continue;
    if (!UUID_RE.test(p.data.identifier)) {
      errors.push(
        `${p.inputPath}: identifier "${p.data.identifier}" is not a well-formed urn:uuid.`
      );
    }
    const list = byIdentifier.get(p.data.identifier) || [];
    list.push(p.inputPath);
    byIdentifier.set(p.data.identifier, list);
  }
  for (const [id, paths] of byIdentifier) {
    if (paths.length > 1) {
      errors.push(`identifier ${id} is used by more than one file: ${paths.join(", ")}`);
    }
  }

  // ---- relation: must be well-formed, and its group of pages checked ----
  // ---- for the two failure modes that break translation pairing     ----
  const byRelation = new Map();
  for (const p of pages) {
    if (!p.data.relation) continue;
    if (!UUID_RE.test(p.data.relation)) {
      errors.push(
        `${p.inputPath}: relation "${p.data.relation}" is not a well-formed urn:uuid.`
      );
    }
    const list = byRelation.get(p.data.relation) || [];
    list.push(p);
    byRelation.set(p.data.relation, list);
  }
  for (const [rel, group] of byRelation) {
    const byLocaleCount = new Map();
    for (const p of group) {
      byLocaleCount.set(p.data.locale, (byLocaleCount.get(p.data.locale) || 0) + 1);
    }
    for (const [loc, count] of byLocaleCount) {
      if (count > 1) {
        const paths = group
          .filter((p) => p.data.locale === loc)
          .map((p) => p.inputPath)
          .join(", ");
        warnings.push(
          `relation ${rel} has ${count} pages in the same locale "${loc}" (${paths}) — ` +
            `two Expressions of one Work in the same locale is unusual; check this is intentional.`
        );
      }
    }
    if (group.length === 1 && !group[0].data.localeExclusive) {
      warnings.push(
        `relation ${rel} only exists in locale "${group[0].data.locale}" ` +
          `(${group[0].inputPath}). If a translation is on the way, ignore this. If it's ` +
          `never getting one, add "localeExclusive: true" to its front matter to silence ` +
          `this warning — otherwise this usually means a typo broke the pairing on the ` +
          `missing locale's page.`
      );
    }
  }

  return { errors, warnings };
}

module.exports = { validateContent, UUID_RE };
