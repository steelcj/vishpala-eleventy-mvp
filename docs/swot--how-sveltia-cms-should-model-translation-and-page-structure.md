# SWOT: how Sveltia CMS should model translation and page structure

Status: decision needed. Written after cloning `sveltia/sveltia-cms` and
reading the actual slug/path-resolution source (`src/lib/services/common/slug.js`,
`src/lib/services/contents/draft/save/entry-path.js`), not just the docs —
see "Evidence" at the end for exact citations. Codebase: 564 JS/Svelte
files, ~232,000 lines — not small, but modular; the relevant logic for
this decision is two files totaling under 250 lines.

## Finding that reframes the whole question

Before comparing options: **the current CMS config can't create most of
the nested pages that already exist on this site**, and this has nothing
to do with i18n. `admin/config.yml`'s `en_ca`/`fr_ca` collections use
`path: "{{slug}}/index"` — exactly one directory level under
`content/en-ca`. That covers `about/index.md`. It does **not** cover
`about/commitments/index.md` (two levels) or `about/legal/privacy.md`
(two levels, under a folder with no index of its own). Those pages exist
today only because they were hand-placed outside the CMS. An editor
clicking "New entry" in Sveltia today cannot recreate that structure.

Confirmed directly from the maintainer, not inferred: [discussion #598](https://github.com/sveltia/sveltia-cms/discussions/598), 
*"a non-dev user wouldn't be able to create a new folder in the sidebar... End-users would be able to create folders once Sveltia CMS implements nested collections. This is one of our unimplemented
features... it will be added to Sveltia CMS 2.0."* Arbitrary editor-created nested structure is a known, currently-absent feature not a config mistake on our end.

This means the real decision isn't just "how do we link translations" —
it's "how do we make the CMS actually reach every page this site has,"
and locale is one axis of that, not the whole thing.

---

## Option A — Status quo: two independent locale collections + hand-rolled `relation`

What we have today: `en_ca`/`fr_ca` as separate collections, paired by a
typed/copy-pasted `relation` UUID, `modality` for accessibility variants,
the generated registry for lookup.

**Strengths**
- Already built, tested, working (verified with a clean `ELEVENTY_STRICT=1` build).
- Full control over the Work/Expression/Manifestation semantics — the
  `relation`+`modality` combination handles both translations *and*
  accessibility variants under one mechanism, which native i18n cannot do
  at all (see Option B).
- No dependency on Sveltia's slug/path templating working a particular way.

**Weaknesses**
- Editors can't create genuinely new nested pages through the CMS at all
  (the pre-existing limitation above) — same weakness File Collections
  fix, that this option doesn't.
- No side-by-side locale editing; no autofill; translation pairing is
  manual copy-paste from the registry.
- Every locale's fields are hand-duplicated in `admin/config.yml`.

**Opportunities**
- Could adopt File Collections (Option C) for structure while keeping
  `relation`/`modality` for cross-Expression semantics — these aren't
  mutually exclusive.

**Threats**
- None new — this is the known, already-shipped baseline.

---

## Option B — Full native i18n (`i18n:` block, `multiple_folders`, `localize` filter)

What was scoped last message, before the source reading.

**Strengths**
- Automatic cross-locale linking, no `relation` field needed for pure
  translations.
- Real side-by-side locale editing; optional DeepL-assisted translation.
- `relation: duplicate` would auto-copy the Work UUID across locales for
  entries it does support.

**Weaknesses — now confirmed, not hypothetical**
- **Cannot represent our nested, per-segment-translated tree.**
  `entry-path.js` fills the `path` (subPath) template using
  `currentValues[defaultLocale]` — only the terminal `{{slug}}` token
  gets per-locale substitution via `| localize`. A middle segment like
  `legal` → `mentions-legales` can never localize through config alone.
  This is read directly from source, not assumed.
- `slugify()` strips `/` in **both** `encoding: ascii` and the default
  `unicode` mode (`src/lib/services/common/slug.js` line 64 and line 68)
  — a field value can't smuggle a multi-segment path through the slug
  system either.
- Has no concept of `modality` at all — the accessibility-variant axis
  would still need our own mechanism bolted on regardless.
- Inherits the same "no nested collections" limitation as Option A,
  since it's still a folder/entry collection under the hood.

**Opportunities**
- Fine for genuinely flat content (a future blog, a press-release feed)
  if this site ever grows one.

**Threats**
- Adopting it as the primary model would require either flattening the
  site's real information architecture (losing the About/Commitments/
  Legal tree shape) or living with pages the CMS can't manage — a worse
  position than today.

**Verdict: not viable as the primary model for this site's existing structure.**

---

## Option C — File Collections (`files:` list) + `relation`/`modality` for Expression semantics — recommended

Each existing page becomes an explicit, hand-listed entry with a
**literal** (not generated) `file:` path, using the `{{locale}}`
placeholder for locale substitution. Since nothing about a File
Collection entry's path is generated from a slug template, the
`entry-path.js` limitation above doesn't apply — arbitrary nesting and
arbitrarily different per-locale paths (`about` vs `a-propos`,
`legal` vs `mentions-legales`) are just... literal strings the developer
writes once.

**Strengths**
- Reaches every existing page, including the two-level-deep ones nothing
  else in this SWOT can reach.
- Per-file `i18n: true` still gets side-by-side locale editing and
  `relation: duplicate` auto-copying, for the pages that want it.
- No dependency on any slug-templating behavior — sidesteps the entire
  class of limitation found in Option B.
- Matches this site's actual content model: a small, curated, developer-
  defined set of pages, not a growing stream of editor-created posts.

**Weaknesses**
- **A genuinely new nested page still requires a developer to add a
  `files:` entry to `admin/config.yml`** — editors can edit any listed
  page freely, but can't originate a brand-new one from the sidebar.
  This is a real, disclosed limitation, not a workaround failure — it's
  the same "no nested collections until 2.0" limitation from the
  maintainer's own words, just made honest instead of hidden.
- More config verbosity — one explicit entry per page, vs. a template
  covering a whole folder.

**Opportunities**
- If Sveltia ships nested collections in 2.0 (maintainer has stated this
  is planned), this option's core problem disappears without needing a
  rewrite — File Collections remain valid either way.
- A future flat content type (blog, press releases) could still use a
  templated Entry Collection *alongside* the File Collection for
  hand-curated pages — these compose in one `config.yml`.

**Threats**
- If page-creation frequency turns out to be higher than expected (i.e.
  editors routinely need brand-new pages, not just edits), the
  "developer adds a config line" step becomes a recurring bottleneck
  worth revisiting.

**Verdict: recommended.** Implemented below.

### Refinement found while implementing — worth stating plainly

Sveltia's `{{locale}}` placeholder (used by both native i18n's
`multiple_folders` structure *and* File Collections) substitutes only
the locale **code** — it does not translate arbitrary path segments. It
only auto-links a page across locales when the path is otherwise
identical. Checked against every real page on this site:

| Page | en-ca slug | fr-ca slug | `{{locale}}`-compatible? |
|---|---|---|---|
| Home | `index` | `index` | Yes |
| About | `about` | `a-propos` | No |
| Commitments | `about/commitments` | `a-propos/engagements` | No |
| Privacy | `about/legal/privacy` | `a-propos/mentions-legales/confidentialite` | No |
| Team | `team` | `equipe` | No |

Given the site's deliberate translated-URL convention, **native
cross-locale linking applies to exactly one page out of eight.**
Everything else still needs the hand-typed `relation` pairing this site
already has — File Collections fix *reachability* (nesting), not
*linking*, for pages with a translated slug. That's not a reason to
abandon File Collections — reachability was the actual bug — but it
does mean `relation`/`modality` isn't going away for this site, and
`i18n: true` only gets applied where the slug genuinely doesn't change.

---

## Evidence

- `src/lib/services/common/slug.js` (cloned from `sveltia/sveltia-cms`,
  commit at time of writing) — `slugify()`, lines 63–69: strips `/` in
  both `ascii` and default `unicode` encoding.
- `src/lib/services/contents/draft/save/entry-path.js` — `createEntryPath()`,
  lines 90–99: `subPath` (the collection's `path:` option) is filled via
  `fillTemplate(subPath, { ..., content: currentValues[defaultLocale] })` —
  default-locale content only, except for the `slug` argument threaded in
  separately per locale.
- [sveltia/sveltia-cms discussion #598](https://github.com/sveltia/sveltia-cms/discussions/598) —
  maintainer confirms nested end-user-created folders are unimplemented,
  planned for a 2.0 release.
- [sveltiacms.app/en/docs/collections](https://sveltiacms.app/en/docs/collections) —
  File Collections / Singletons as the documented mechanism for
  individually-named, explicitly-pathed pages.
- [sveltiacms.app/en/docs/i18n](https://sveltiacms.app/en/docs/i18n) —
  `{{locale}}` placeholder support in File Collection `file:` paths.

## Currency check

Re-verified against [sveltiacms.app/en/docs/roadmap](https://sveltiacms.app/en/docs/roadmap)
and the GitHub releases list on 2026-08-18, after the recommendation
below was already implemented: nested collections remain slated for a
**Sveltia CMS 2.0** milestone, distinct from and later than the 1.0
compatibility release currently in progress. Latest tagged release at
time of check: v0.182.0. Nothing has shipped that changes the
recommendation — re-check this section if picking this decision back up
much later, since this project ships frequently (500+ releases to date).
