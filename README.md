# Vishpala — Eleventy + Sveltia CMS MVP

Static site built by [Eleventy](https://www.11ty.dev/), authored through [Sveltia CMS](https://github.com/sveltia/sveltia-cms), with internationalization modeled through Dublin Core `identifier`/`relation` front matter rather than a locale-pairing feature baked into the CMS or the framework.

## Run it

```sh
npm install
npm start      # dev server with rebuild-on-save, http://localhost:8080
npm run build  # writes ./_site
```

## The content model

```
content/
├── en-ca/
│   ├── en-ca.json          ← directory data: locale, language, layout
│   ├── index.md
│   └── about/
│       ├── index.md
│       ├── index.assets/hero.svg
│       └── legal/
│           ├── privacy.md
│           └── privacy.assets/diagram.svg
└── fr-ca/                  ← same shape, mirrored (not identical) content
```

Two conventions, both read straight off the filesystem — nothing is hand-registered:

- **A folder's own page is `index.md`.** `about/index.md` is the page for `/about/`. Its sibling `index.assets/` folder holds its images, matched by the `index` filename stem.
- **A leaf page that has no children of its own is `name.md` directly inside its parent folder**, e.g. `legal/privacy.md`. Its assets live in `privacy.assets/`, next to it, matched by the `privacy` stem. `legal/` itself has no `index.md` — it's a pure grouping folder, and still shows up in the nav as an unlinked section label so `privacy` stays reachable.

Every `.md` file carries two Dublin Core fields:

```yaml
title: "About"
identifier: "urn:uuid:8a1e2f3b-…"   # unique to THIS file (this Expression)
relation: "urn:uuid:ffdca22b-…"     # shared Work UUID — same on every
                                     # locale's version of this page
```

`identifier` names the Expression (this specific realization in this particular language in this particular file).

 `relation` names the original Work it realizes.

Two files in different locale folders that share the same `relation` are treated as translations of one another; that's the entire mechanism the language switcher runs on.

Nothing about locale pairing lives in filenames, folder names, or CMS config — it's just a shared UUID in front matter, so it holds up if you later add more Expressions of the same Work (a grade-7 rewrite, an AAC rendering) without redesigning the pairing mechanism.

## What the build derives from the filesystem

`.eleventy.js` + `_11ty/nav-tree.js`:

- **`collections.navTrees[locale]`** — a nested tree built from every page's URL, one per locale, used by `_includes/partials/nav.njk` to render the sidebar menu. Add a folder, get a nav entry; no manual menu file to maintain. Sibling ordering is `order` (front matter, default last) then alphabetical by title.
- **`collections.byWork`** — every page grouped by its `relation` UUID, used by `_includes/partials/language-switcher.njk` to link a page to its sibling Expressions in other locales.
- **One deliberate permalink override** (`content/content.11tydata.js`):
  Eleventy's default "pretty URL" behavior would turn `privacy.md` into `privacy/index.html`, a directory deeper than `privacy.assets/`, which breaks the relative image path written in the source. Leaf (non-index) pages are instead output flat as `privacy.html`, staying in the same directory as their own assets folder. `index.md` pages already avoid this problem by default and are left alone.

## Sveltia CMS (`admin/config.yml`)

**Superseded — see "CMS structure: File Collections" further down for the current, accurate description.** Originally a folder collection per locale; migrated to File Collections after confirming Sveltia can't create nested folders through its UI. One thing worth noting explicitly since it was flagged as a real gap at the time: the old design couldn't *author* the `legal/privacy.md`-style flat leaf pattern through the CMS at all — File Collections' literal per-page paths close that gap for free, since `privacy` is just another explicit `files:` entry now, no special-casing needed.

The `media_folder`/`public_folder` relative-path setup for per-entry `index.assets/` folders is written the way current Decap-compatible docs describe it, but that resolution behavior has changed across CMS versions before, worth a smoke test against a real Sveltia CMS instance rather than trusting it blind.

`backend.name: git-gateway` is also still a placeholder. Point it at  github`/`gitlab`/whatever actually hosts this repo, and set `repo`, before this goes near production.

## SEO: canonical + hreflang (`_includes/partials/i18n-meta.njk`)

Every page emits a self-referencing `<link rel="canonical">` and, when it has a `relation`, one `<link rel="alternate" hreflang="…">` per sibling Expression plus one `hreflang="x-default"` pointing at the Work's default locale (`_11ty/site-config.js`, currently `en-ca`). All of it comes from `collections.byWork`, the same collection the visible language switcher reads, so the machine-readable linkage can't drift from what's shown in the UI.

 `site.url` is currently set to `https://vishpala.com` in `site-config.js`, confirm that's the real production origin before this goes live.

## Missing-translation handling (`partials/language-switcher.njk`)

The switcher now enumerates every locale that exists anywhere on the site (`collections.locales`), not just the ones with an Expression of the current Work. A locale with no Expression renders as a visibly muted link to that locale's home page, with a title/aria note explaining it's not translated yet, instead of just quietly not appearing.

Front matter `localeExclusive: true` opts a page out of that treatment entirely (for content that will never have a translation, vs. content that's simply pending one). See `content/en-ca/careers/index.md` (pending, shows the fallback + build warning) vs. `content/en-ca/press/index.md`'s where (`localeExclusive`, shows neither).

## Build-time validation (`_11ty/validate.js`)

Runs on every build via the `i18nValidation` collection. Catches:

- malformed `identifier`/`relation` values (must match `urn:uuid:…`)
- an `identifier` reused across more than one file
- a `relation` with more than one Expression in the *same* locale (probably not what you meant)
- a `relation` that only exists in one locale and isn't marked `localeExclusive` — usually means a translation is pending, or a typo broke the pairing on the other locale's page

All of the above print as `[i18n] warning:` / `[i18n] error:` to the console. Errors don't fail the build by default (so a typo doesn't block someone from previewing their edit) — set `ELEVENTY_STRICT=1` to make errors throw, e.g. in CI: `ELEVENTY_STRICT=1 npm run build`.

## CMS structure: File Collections, not Folder Collections (`admin/config.yml`)

**Two config bugs fixed after the CMS was actually run for the first
time** — real errors from a live Sveltia instance, screenshotted, not inferred from docs: `backend.name: git-gateway` was never a deferred placeholder, it's a backend Sveltia dropped entirely ("will not be supported due to performance limitations," confirmed directly against Sveltia's own docs) — the CMS refused to load at all. Every `date` field used the widget name removed in Decap CMS 3.0 and never present in Sveltia; confirmed the exact correct replacement (`widget: "datetime"` + `type: "date"`) against Sveltia's own DateTime
field documentation, matching the running tool's own error text exactly. Both fixed now — `backend.name: github` with this repo, and every `date` field converted. See git history for the fix commit if you want the full before/after.

**This changed since the last update — the previous section here described a mechanism that no longer exists.** Migrated from Folder Collections (`folder: "content/en-ca"`, `path: "{{slug}}/index"`) to File Collections (`files:`, one explicit hand-listed entry per page).

**Why**: confirmed directly from Sveltia's maintainer
([discussion #598](https://github.com/sveltia/sveltia-cms/discussions/598)),  Sveltia CMS cannot create new nested folders through its UI; this is a
known, currently-unimplemented feature, planned for a 2.0 release, not a configuration mistake. The old Folder Collections' `path: "{{slug}}/index"` template is exactly one directory level, so it could never reach `about/commitments/index.md` or `about/legal/privacy.md` (both two levels deep), those pages only ever worked because they were hand-placed in the filesystem outside the CMS. An editor clicking "New entry" could never have recreated that structure. Full analysis, including why native i18n doesn't solve this either (this site's translated slugs — `about`/`a-propos`, `team`/`équipe` — can't be
expressed through Sveltia's `{{locale}}` placeholder, which only substitutes the locale code, not arbitrary path segments), is in `en/docs/swot--how-sveltia-cms-should-model-translation-and-page-structure-v0-1-0.md`.

**What changed structurally**:
- Every real page (12 total) is now an explicit `files:` entry, listed under `en_ca`/`fr_ca` collections as before, same locale grouping in the CMS sidebar, different mechanism underneath. Every declared path was checked against the actual filesystem before shipping; all 12 matched with no typos.
- **Home is a singleton**, not a normal file entry — the one page on this site where the en-ca and fr-ca slugs are genuinely identical (`index`), confirmed by checking every real page's slug pair. That's what makes it the one place `i18n: true` and the `{{locale}}`
  placeholder actually apply, with real side-by-side locale editing and `relation: duplicate` auto-copying the shared Work UUID to both files automatically — no copy-paste needed for Home specifically.
- **The `fr_ca`-only `relation` widget (searching `en_ca` by title) is gone.** It depended on a clean "one collection per locale" structure that File Collections doesn't preserve the same way. `relation` is now a plain, pattern-validated string field on every page, symmetric
  across locales — same field shape as `identifier`. An editor pairing a translation now copies the Work UUID from `content/_registry/works/` (human-readable labels, searchable by title) instead of picking from an interactive widget. Real tradeoff, not hidden: this is a step back in convenience from the old one-direction autofill, traded for a
  structure that can actually reach every page.
- Shared field list (~19 fields — the 15 DC elements, `identifier`, `relation`, `localeExclusive`, `hero`) extracted into one YAML anchor (`_page_fields`) referenced by all 10 non-Home entries, rather than duplicated per page. Verified programmatically that the anchor resolves to the same shared object in every entry, not a silently-diverged copy.

**What editors need to know going forward**: every existing page is freely editable from the CMS sidebar. **A genuinely new page still requires a developer to add a `files:` entry to `admin/config.yml` first** — not a workaround to route around later, an accurate reflection of the real Sveltia limitation above. Revisit if Sveltia ships nested collections — check the SWOT doc's "Currency check" section before assuming this constraint still holds; that project ships frequently (500+ releases at time of writing).

**Not done as part of this migration**: `modality` (the field for accessibility-variant Expressions sharing a Work with the standard reading) doesn't exist in this codebase yet, despite being described as already-integrated in the SWOT doc's Option A/C comparison. That description was inaccurate at the time it was written — checked directly, zero occurrences anywhere in code or content. The File Collections structure here doesn't depend on `modality` existing and is ready to receive it, but adding it is separate, undone work, not a
side effect of this migration.

## dc:date — a single scalar, not a repeatable field

Unlike `subject`, `date` isn't a list. Multiple dates were considered (Plone's HTML output uses `DC.date.modified` / `DC.date.created`, a real precedent, but it's Plone's own house convention layered on the element name, not `dcterms:`, and still a form of qualification we  decided against).

Unqualified `dc:date` has no built-in way to say *which* date a value represents, and DCMI's own definition frames it as one date, "typically associated with the creation or availability of the resource", so this project uses exactly one: creation.

It's derived automatically, not hand-typed: `content/content.11tydata.js` sets a directory-wide default of `date: "git Created"`, Eleventy's built-in mechanism for resolving a page's date from its *first* git commit (not the plain filesystem-birthtime default, which resets on
every fresh clone/CI checkout and isn't a meaningful "creation date" once this leaves one machine). `partials/dc-meta.njk` reads the resolved value from `page.date` — not the bare `date` variable, which stays as the literal string `"git Created"` in the data cascade; only
`page.date` is where Eleventy actually resolves it. A page can still override this with an explicit `date:` in its own front matter (the normal data cascade — front matter beats directory data), which the CMS exposes as an optional field for cases like backdating migrated content.

**Caveat that matters before you trust the build output**: `"git Created"` only resolves meaningfully in an actual git repository with real commit history. In a freshly unzipped copy with no `.git` folder, like this delivery, right now, Eleventy can't read git log and falls
back to `Date.now()`, so every page's `dc.date` will show today's date and change on every rebuild. It becomes meaningful once the site is pushed to whatever backs the Sveltia CMS `backend.name` and built from that real history.

## Full unqualified Dublin Core (`_11ty/dublin-core.js`, `partials/dc-meta.njk`)

Every page can now carry any of the 15 unqualified DCMES 1.1 elements as plain front matter — `title`, `creator`, `subject` (repeatable — a list, one `<meta name="dc.subject">` per entry), `description`, `publisher`, `contributor`, `date`, `type`, `format`, `identifier`, `source`, `language`, `relation`, `coverage`, `rights` — all optional except `title`. Whatever's present renders as `<meta name="dc.X" content="…">` in `<head>`; whatever's absent renders nothing (see `content/en-ca/about/` for a page using most of them, vs. `content/en-ca/team/` using none). `dc.language` is derived from the locale's `hreflang` rather than typed per page.

**Deliberately unqualified — no `dcterms:` refinements** (no `isVersionOf`/`hasVersion`, `isPartOf`/`hasPart`, `replaces`, split `created`/`modified`, etc.). That's a real constraint, not just an omission: unqualified `dc:relation` has no way to sub-type what kind of relation it is. This site defines a local convention instead — `relation` means Work-pairing (the same locale-switcher/`byWork` mechanism as before) and nothing else. Don't repurpose it for "see also" or "part of" links; there's no field-level way to keep those apart from translation pairing once they're mixed into one value, and `collections.byWork` assumes every `relation` means exactly one thing. If those other relation types (supersession, part-of, companion-to) become necessary later, they'll need either their own front matter field under a project-specific name, or a revisit of the qualified-terms decision — not reuse of this
field.

The 12 elements beyond title/identifier/relation have no cross-file validation (unlike identifier/relation, they're free-text with no structural relationship to check) — `_11ty/validate.js` wasn't extended for them, on the same "does this axis earn its cost" basis as everything else in this project.

## Design system (`assets/`)

```
assets/
├── css/site.css                    — single stylesheet; see below for why it's not split further yet
├── fonts/
│   ├── public-sans/                 — body/UI face, latin subset, weights 400/400i/600/700
│   └── ibm-plex-mono/               — mono accent, latin subset, weights 400/500
└── img/logos/
    ├── favicon.svg                  — Vishpala mark, supplied
    ├── logo-lockup-dark.svg         — BLACK text — despite the "-dark" name, this is the
    │                                   one for LIGHT backgrounds (named for the text's own
    │                                   weight, not the surface it's meant for) — currently
    │                                   in use in the header, since the page is light
    └── logo-lockup.svg              — WHITE text — for DARK backgrounds; unused until dark
                                        mode exists (see "Deliberately not yet built")
```

**Brand assets are supplied files, not design decisions made here.**
`favicon.svg`, `logo-lockup.svg`, `logo-lockup-dark.svg`, and the About page's illustration (`content/*/index.assets/about-work.svg` — a real De Stijl composition, blue/yellow/red blocks divided by black rules) were provided directly and used as-is, colors and all — not recolored or reinterpreted. `--accent` (`#0033cc`) in `site.css` is the exact blue from the logo, not an invented placeholder — replaces an earlier teal that was picked before this project had a real brand to match. 

**Fonts are fully self-hosted, zero external requests.** Vendored from `@fontsource/public-sans` and `@fontsource/ibm-plex-mono` (SIL OFL 1.1 license text sits alongside the font files in each subfolder). Only the `latin` subset was kept, it covers accented French characters (é, è, ç, œ, etc.) for en-CA/fr-CA; `latin-ext` (Central/Eastern European) was left out to keep the payload small. Only the weights actually used were vendored (4 files for Public Sans, 2 for the mono face) rather than the full family — trimming this took a manual pass through the package's `files/` directory, not a blind `npm install` + copy-everything.

**Type direction:** Public Sans for body/UI, designed for the U.S. federal design system (USWDS) specifically for legible, trustworthy civic service. This was picked before the project had a confirmed name, on a bet about the site's likely character (bilingual, standards-driven,
archival), and turned out to line up well with Vishpala's own stated focus on accessibility and infrastructure, rather than needing to change once the real brand landed. IBM Plex Mono is reserved specifically for `urn:uuid:`/`dc:` values (`.meta-value`/`code` styling in `site.css`), 
the one deliberate signature touch, since this site foregrounds its own metadata more than most sites do.

**Why `css/` isn't split into `base/`/`components/` yet:** one file is still easy to navigate at this size (~360 lines). Worth revisiting once it grows past that, not before.

## Responsive layout + mobile nav (`site.css`)

Mobile-first, two breakpoints. Revised from an earlier JS-driven hamburger-drawer version after checking a reference implementation (vishpala.netlify.app) that solves this with plain HTML instead, worth doing that check before building custom JS for something the platform already provides:

- **< 700px**: the full nested nav tree lives inside a native `<details>/<summary>` disclosure ("Menu"), positioned above the main content. Opening it pushes content down in normal document flow, no backdrop, nothing covering the page. The separate horizontal header menu is hidden here; the disclosure's full tree already contains everything it would show.
- **700–959px**: header menu (top-level sections) becomes visible inline *in addition to* the disclosure, which keeps carrying the full tree. (An earlier version of this hid the full tree entirely in this range, leaving nested pages like `about/legal/privacy` unreachable
  between 700–959px — fixed here.)
- **≥ 960px**: the disclosure is replaced by a persistent sidebar column (the original two-column layout); header menu stays visible.

**No JavaScript at all for navigation** — `<details>/<summary>` is native HTML: keyboard-operable, announced correctly by screen readers, works identically whether JS loads or not, and needs no focus-trap or Escape-key handling because nothing about it is modal. The earlier `assets/js/nav.js` (custom drawer open/close/focus logic) and the `no-js`/`js` class-swap it depended on have been deleted, there's nothing left for them to enhance.

**Not built**: no fine-grained breakpoint between 960px and very wide screens (`--content-max: 960px` just centers everything past that point, doesn't reflow further).

## Footer (`partials/footer.njk`)

Reuses `partials/header-nav.njk` directly against the same `tree` variable already in scope in `base.njk`, rather than duplicating the top-level-links loop — same generated-not-hand-maintained principle as the header and sidebar. Below that: a copyright line (`buildYear` is
computed once per build via `addGlobalData`, not hand-typed) and a short colophon crediting Eleventy and Dublin Core. `site.copyrightHolder` lives in `_11ty/site-config.js` alongside `url`/`defaultLocale` — same single-source-of-truth pattern as everything else there.

## Commitments page (`content/*/about/commitments|engagements/`)

A real content addition, not scaffolding — distilled from Christopher's Universal Cake Evaluation Metrics rubric (`en/docs/`) into plain public language: Accessibility, Sustainability, Sovereignty, Data Portability, Longevity. Paired across locales the normal way (shared `relation` UUID, different URL slugs — `commitments` vs `engagements` — exactly what that mechanism exists for). Nested under About via the ordinary folder+`order` convention, no new code.

**Scoped as one page with five sections, not five separate pages** —
matches the rubric's five pillars but not (yet) Vishpala's real About structure, which has each commitment as its own dated, versionable page ("In force" since a specific date). Splitting these out later is straightforward if wanted; started smaller deliberately rather than generating five pages of content in one pass.

**This is drafted content, not confirmed copy.** It's grounded in Christopher's own rubric rather than invented from nothing, but it's still Claude writing public statements on behalf of a real organization — it hasn't been reviewed or approved as accurate. Treat it as a strong first draft, not a publish-ready commitment.

**`en/docs/`** holds internal project documents, not public site content: the source rubric (`universal-cake-evaluation-metrics-v0-3-1.md`) and a self-evaluation of this actual build against it (`self-evaluation-vishpala-site-v0-1.md`) — rated honestly, including several `Unknown`s (Representation, Security, Longevity) rather than assuming Strong across the board, since the rubric's own logic treats an unfalsifiable "Strong, trust us" rating as worse than an honest `Unknown`. Both use the rubric's own mixed `dc:`/`dcterms:`/`sat:` front matter convention, deliberately different from the site's own strict-unqualified-`dc:` rule — two different documents doing two different jobs, not an inconsistency to fix.

## UUID registry (`scripts/build-registry.js`, `.githooks/pre-commit`)

Generates human-readable labels for the `dc:identifier`/`dc:relation` UUIDs scattered through content, so a CMS field can eventually let an editor search by title instead of pasting a UUID by hand — the same gap noted in "CMS translation pairing" above, but generalized. Writes two sets of files under `content/_registry/` (`works/<uuid>.md`, `expressions/<uuid>.md`), git-tracked as real content rather than build output, excluded from Eleventy's own page-building via `eleventyConfig.ignores.add("content/_registry/**")` in `.eleventy.js`.

**One-time setup after cloning**: `git init` (if not already a repo), then `npm install` — the `prepare` script wires `.githooks/pre-commit` by setting `git config core.hooksPath .githooks`. Installing before `.git` exists is fine; the script detects that and skips with a message instead of failing, and re-runs cleanly (`npm install` again, or `npm run prepare` directly) once a repo does exist.

**Runs automatically, not manually** — every commit that touches content regenerates and stages `content/_registry/` via the pre-commit hook, so it's structurally impossible for a commit to ship a stale registry. `npm run registry` also exists to run it by hand (useful right
after setup, or to sanity-check the output), but isn't required day to day.

**Real bugs fixed getting this working, not just wired up**: `package.json` as originally written referenced a `registry` script and a `prepare` script that didn't exist, and didn't declare `glob`/ `gray-matter` as dependencies even though `build-registry.js` requires
both — that combination is exactly what produced the original `npm error Missing script: "registry"`. Separately, and only found by actually *running* the script rather than trusting it once wired up: its own docstring contained the literal text `content/**/*.md` inside a `/** */` block comment — and `**/ ` contains the two-character sequence `*/`, which terminates a block comment early. That's a real syntax error (`Unexpected token '*'`), not a configuration problem, and it would have surfaced as a second failure immediately after fixing the first one. Verified end-to-end afterward: added a throwaway page, confirmed the registry picked up its UUID on commit with no manual step, removed the page, confirmed the registry dropped it too.

**Registry lookup is manual, not widget-driven** — `admin/config.yml`'s `relation` field is a plain string on every page (see "CMS structure: File Collections" above), not a CMS widget querying the registry directly. An editor pairing a translation opens `content/_registry/works/<uuid>.md` (human-readable labels, searchable by title in any file browser) and copies the UUID by hand into the `relation` field. Confirmed directly against a live CMS session: the field's hint text already points editors at the registry, but there's no *live* confirmation once a UUID is pasted in — nothing on screen resolves it back to a label, so a correctly-paired page and a typo'd-but-still-valid-looking UUID look identical while editing. Not a correctness bug (the build-time validator in `_11ty/validate.js` still catches real breakage), but a real gap between "the data is right" and "the editor can see that it's right."

**The concrete shape of the real fix, for whenever this gets picked back up**: turn `content/_registry/works/` and `content/_registry/expressions/` into genuine Sveltia collections, then give `relation` an actual `relation`-type widget pointed at the `works` collection — that gets a live, resolved label the moment a UUID is selected, not just a hint pointing elsewhere. Worth going further than a generic implementation while at it: label that collection and its fields with the real FRBR terms — **Work**, **Expression** — directly in the CMS UI, the same vocabulary already used throughout this project's hints, docs, and front matter, rather than reverting to generic CMS jargon at the one point where an editor is actually staring at the concept. A true interactive picker built this way remains a real, scoped, deferred improvement — not done here.

## Deliberately not yet built

- **Rest of `admin/config.yml` hasn't been re-verified against a live Sveltia instance beyond the two confirmed bug classes (backend name, date widget).** Both bugs came from the same root cause, Decap-CMS syntax assumed compatible with Sveltia without checking, despite Sveltia being a from-scratch rewrite that explicitly documents
  breaking changes from Decap in multiple places (camelCase option names, the `relation` widget's exact behavior, etc.). Other fields in this config (`image`, `list`, `boolean`, `relation`) haven't each been individually re-confirmed the same way `datetime` now has, treat them as unverified until someone actually opens the CMS and checks, not as safe by association with the two fields that did get checked.
- No accessibility-modality axis (AAC rendering, plain-language pass, audio transcript) — same shape as locale/readability, not built yet. A `modality` field and an Accessibility Statement page were both described as already built in `en/docs/work-summary-v0-1-0.md` and the SWOT doc — confirmed directly against the real repo that neither exists;
  see the correction notes at the top of `en/docs/work-summary-v0-1-0.md` and
  `en/docs/recommended-actions-v0-1-0.md`.
- No `dc:type` vs. "content type" documentation, also claimed done elsewhere, also checked and not present.
- No supersession/version-lineage or part-of/companion-to relations, those are a different kind of relatedness than translation and shouldn't be folded into `relation` the way locale pairing is.
- No home-page-specific layout, it currently uses the generic `layouts/page.njk` like every other page.
- No dark mode / `prefers-color-scheme` handling — `color-scheme: light` is hardcoded in `:root`, and only the light-background logo variant (`logo-lockup-dark.svg`) is wired into the header. The white-text variant (`logo-lockup.svg`) is already sitting in `assets/img/logos/` waiting for it — this wasn't a guess, it's an asset that was supplied and hasn't been used yet.
- The missing-translation fallback always lands on the target locale's *home page*. It doesn't try to find "the nearest translated ancestor" in the URL tree — e.g. a missing `fr-ca/team/leads/` doesn't fall back to a translated `fr-ca/team/`, it goes straight to `fr-ca/`. Worth revisiting if the site grows deep enough for that gap to matter.
- No user-facing preferences/control panel (text size, contrast, a "simplify this page" toggle in the style of IDRC's own UI Options tool). Presentation-only preferences (size/contrast/spacing) would be a self-contained CSS-variable + localStorage addition. A genuine "simplify this page" toggle would reuse the same `byWork`/`relation` mechanism as the language switcher, generalized to a second axis,  gated on designing that accessibility-modality registry first.

## License

Vishpala.com is a mix of code and content, so it doesn't get one blanket license — treating a brand's wordmark and an Eleventy build script as legally identical would be wrong in both directions.

This software, *vishpala-eleventy-mvp*, by **Christopher Steel**, with AI assistance from **Claude (Anthropic)**, is licensed under the [GNU General Public License v3.0 or later (GPL-3.0-or-later)](https://www.gnu.org/licenses/gpl-3.0.html). You may redistribute and/or modify this software under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. Full text in `LICENSE`.

[![License: GPL v3+](https://img.shields.io/badge/License-GPLv3%2B-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

This repository's own documents (`README.md`, everything under `en/docs/`), by **Christopher Steel**, with AI assistance from **Claude (Anthropic)**, are licensed under the [GNU General Public License v3.0 or later](https://www.gnu.org/licenses/gpl-3.0.html) as well, per the same house convention as the code.

The public Vishpala site content (`content/en-ca/`, `content/fr-ca/`), by **Christopher Steel**, with AI assistance from **Claude (Anthropic)**, is licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/) — consistent with this project's own stated Sovereignty and Data Portability commitments, an open license fits better than "all rights reserved" would have.

![CC License](https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by.svg)

**The Vishpala name, logo, and wordmark** (`assets/img/logos/`) are excluded from the content grant above. Trademark-like brand assets aren't covered by reuse-with-attribution the way prose content is.

## Regarding CC-Licensed Works and AI Training

* [Using CC-Licensed Works for AI Training](https://creativecommons.org/using-cc-licensed-works-for-ai-training-2/)

* [Using-CC-licensed-Works-for-AI-Training.pdf](https://creativecommons.org/wp-content/uploads/2025/05/Using-CC-licensed-Works-for-AI-Training.pdf)

* [Artificial intelligence and CC licenses](https://creativecommons.org/faq/#artificial-intelligence-and-cc-licenses)

### European Commission

* [Creative Commons Attribution 4.0 International (CC-BY-4.0)](https://interoperable-europe.ec.europa.eu/licence/creative-commons-attribution-40-international-cc-40)
