const { buildNavTree } = require("./_11ty/nav-tree.js");
const { validateContent } = require("./_11ty/validate.js");
const siteConfig = require("./_11ty/site-config.js");

module.exports = function (eleventyConfig) {
  // Available in every template as `site.url` / `site.defaultLocale` /
  // `site.copyrightHolder`, and imported directly (not duplicated) by
  // content/index.11ty.js and this file's own collections below — one
  // source of truth.
  eleventyConfig.addGlobalData("site", siteConfig);

  // Build year for the footer's copyright line — computed once per
  // build, not hand-typed and liable to go stale.
  eleventyConfig.addGlobalData("buildYear", () => new Date().getFullYear());

  // ---- Date filter: renders Eleventy's resolved `date` (a JS Date,
  // once resolved from "git Created"/etc. or explicit front matter) as
  // YYYY-MM-DD, the format DCMI's usage guide recommends for dc:date.
  eleventyConfig.addFilter("dcDate", (date) => {
    if (!date) return null;
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d)) return null;
    return d.toISOString().slice(0, 10);
  });

  // Copy any per-page asset folders (index.assets, privacy.assets, etc.)
  // straight through to output, unprocessed.
  eleventyConfig.addPassthroughCopy("content/**/*.assets/**");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("admin");

  // ---- Collection: every locale-bearing page, grouped by locale ----
  eleventyConfig.addCollection("byLocale", (api) => {
    const pages = api.getAll().filter((item) => item.data.locale);
    const byLocale = {};
    for (const page of pages) {
      const locale = page.data.locale;
      (byLocale[locale] ||= []).push(page);
    }
    return byLocale;
  });

  // ---- Collection: every locale that exists on disk, sorted ----
  // Used to enumerate the full locale set (including ones with no
  // Expression of the *current* Work) when rendering the language
  // switcher, so a missing translation can be shown as missing rather
  // than silently omitted.
  eleventyConfig.addCollection("locales", (api) => {
    const pages = api.getAll().filter((item) => item.data.locale);
    return [...new Set(pages.map((p) => p.data.locale))].sort();
  });

  // ---- Collection: pages grouped by dc:relation (the "Work" they realize) ----
  // Any two pages that share the same `relation` UUID are treated as
  // Expressions of the same Work (e.g. en-ca and fr-ca versions of "About").
  // Shape: { [relationUUID]: { locales: { [locale]: {url,title,identifier,hreflang} }, defaultExpr } }
  eleventyConfig.addCollection("byWork", (api) => {
    const pages = api.getAll().filter((item) => item.data.relation);
    const byWork = {};
    for (const page of pages) {
      const work = page.data.relation;
      byWork[work] ||= { locales: {} };
      byWork[work].locales[page.data.locale] = {
        url: page.url,
        title: page.data.title,
        identifier: page.data.identifier,
        hreflang: page.data.hreflang,
      };
    }
    for (const work in byWork) {
      const locales = byWork[work].locales;
      byWork[work].defaultExpr =
        locales[siteConfig.defaultLocale] || Object.values(locales)[0];
    }
    return byWork;
  });

  // ---- Build-time validation of the identifier/relation graph ----
  // Runs on every build. Warnings are non-fatal (printed to the console).
  // Errors are also printed; set ELEVENTY_STRICT=1 to make them fail the
  // build instead (useful in CI, noisy for local editing).
  eleventyConfig.addCollection("i18nValidation", (api) => {
    const pages = api.getAll().filter((item) => item.data.locale);
    const { errors, warnings } = validateContent(pages);
    for (const w of warnings) console.warn(`[i18n] warning: ${w}`);
    for (const e of errors) console.error(`[i18n] error: ${e}`);
    if (errors.length && process.env.ELEVENTY_STRICT) {
      throw new Error(
        `i18n validation failed with ${errors.length} error(s) — see console output above.`
      );
    }
    return { errors, warnings };
  });

  // ---- Collection: nested nav tree, one per locale, built from the ----
  // ---- ingressed folder structure under content/<locale>/            ----
  eleventyConfig.addCollection("navTrees", (api) => {
    const pages = api.getAll().filter((item) => item.data.locale);
    const byLocale = {};
    for (const page of pages) {
      (byLocale[page.data.locale] ||= []).push(page);
    }
    const trees = {};
    for (const locale in byLocale) {
      trees[locale] = buildNavTree(byLocale[locale]);
    }
    return trees;
  });

  return {
    dir: {
      input: "content",
      includes: "../_includes",
      output: "_site",
    },
    // Markdown files are Eleventy's default template language for `input`,
    // so no htmlTemplateEngine change is needed — .md files are rendered
    // through Nunjucks front matter + Markdown by default.
  };
};
