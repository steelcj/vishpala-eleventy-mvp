---
dc:title: "Roadmap: Current State to Complete Site"
dcterms:version: "0.1.0"
dc:creator: "Claude (Anthropic)"
dc:contributor: "Christopher Steel"
dc:subject:
  - "roadmap"
  - "accessibility"
  - "seo"
  - "sovereignty"
  - "metadata"
dc:description: >
  Prioritized phases from the current verified state to a complete,
  accessible, low-bandwidth, sovereign, multilingual, SEO-strong site,
  including the new directory-derived-metadata/breadcrumb design.
dc:publisher: "UniversalCake"
dcterms:created: "2026-08-19"
dcterms:modified: "2026-08-20"
dc:type: "Text"
dc:format: "text/markdown"
dc:language: "en"
dc:identifier: "roadmap-to-complete-site"
sat:uuid: ""
sat:migration_status: pre-sat
---

# Roadmap: Current State to Complete Site

Ordered by Universal Cake's own priority (Accessibility first), with
SEO and the new directory-metadata design woven in where they naturally
land rather than treated as a separate track.

## Where things actually stand (verified against the live repo, not recalled)

Real and confirmed: i18n/DC metadata core (relation/identifier,
hreflang, missing-translation handling), self-hosted fonts, zero-JS
native nav, responsive layout, UUID registry + pre-commit hook, File
Collections CMS structure, Vishpala branding, Commitments page. Real
and confirmed *gaps*: no formal accessibility audit, no Accessibility
Statement page, no `modality` field, no standard SEO description tag,
no sitemap/robots.txt/structured data, no directory-derived taxonomy,
`backend.name: git-gateway` still a placeholder, only two of three real
locales (no `es`).

## Phase 1, Accessibility (first, because everything else depends on it)

- Formal audit: real screen reader pass (VoiceOver/NVDA), automated
  tooling (axe), not just the "Inferred" rating in the self-evaluation.
- Accessibility Statement page, explicitly requested, still not built.
- Consider the Atkinson Hyperlegible toggle Vishpala's real site
  already has, a genuine "accessibility Expression" candidate once the
  `modality` axis exists (see Phase 6).
- Contrast: confirmed accent-on-paper passes (~8.6:1). Still needs
  checking: accent-on-surface (footer), muted-text-on-paper, and focus
  ring visibility against every background the site actually uses.

## Phase 2, SEO fundamentals

- Add the standard `<meta name="description">` tag alongside
  `dc.description`, different consumers, both needed, one doesn't
  substitute for the other.
- `sitemap.xml`, Eleventy can generate this from `collections.all`
  directly; straightforward, not yet done.
- `robots.txt`, currently doesn't exist at all, meaning no explicit
  policy either way.
- `BreadcrumbList` JSON-LD, natural pairing with Phase 3 below; the
  same directory-chain data can drive both a visible breadcrumb and
  structured data from one mechanism.

## Phase 3, Directory-derived metadata (the new design)

The ask: `content/en-ca/wellbeing/practices/meditation.md` should pick
up "wellbeing" and "practices" as metadata automatically, the same way
locale and nav position are already derived from the filesystem rather
than hand-typed.

**Design**: an `eleventyComputed.subject` that walks each page's path,
takes every directory segment between the locale root and the file's
own containing folder, and appends those as `dc:subject` entries,
*merged with*, not replacing, any `subject` list already in front
matter. For `about/index.md`, that's just `["about"]`, a little
redundant for shallow pages, genuinely useful for deep ones like the
`wellbeing/practices/` example. Not special-cased either way, so the
mechanism stays uniform; an explicit `autoSubject: false` override is a
reasonable later refinement if a page needs to opt out.

**Same data, two more payoffs, for free**: the identical directory
chain, extracted once, can also render a visible breadcrumb trail
("Wellbeing > Practices > Meditation") and feed the `BreadcrumbList`
JSON-LD from Phase 2. One small piece of derived data, three consumers
(SEO metadata, visible navigation aid, structured data), worth
building once, correctly, rather than three separate mechanisms that
could drift from each other.

## Phase 4, Low-bandwidth, measured not just architected

Everything so far has been a good bet, never actually measured:

- Real page-weight audit per route (Lighthouse or equivalent), first
  actual number, not an inference from "self-hosted fonts + zero JS."
- Respect `prefers-reduced-data`/`navigator.connection.saveData` where
  it would meaningfully change what loads.
- A real image pipeline, SVGs are fine as-is, but there's no
  responsive-image/`srcset` strategy for photographic content yet, and
  the site doesn't have any raster images to test that against.

## Phase 5, Sovereignty, for real this time

`backend.name: git-gateway` in `admin/config.yml` has been a
placeholder through every prior phase of this project. Everything else
(content portability, plain-text formats, no proprietary datastore)
only fully cashes out once this is an actual, chosen, configured
backend, this is the biggest lever left in the self-evaluation's
`Unknown`-rated rows.

## Phase 6, Multilingual completion

- `es` locale: real Vishpala has three locales, this build has two.
  Mechanically straightforward (the architecture already generalizes to
  N locales), the actual translation work is not something to
  fabricate, needs a real translator.
- CMS pairing UX: still copy-paste from `content/_registry/works/`, not
  an interactive picker. A real `relation` widget against dedicated
  registry file collections would close this, flagged, not yet built.
- `modality` axis (accessibility-variant Expressions, ties back to
  Phase 1), same shape as locale pairing, still doesn't exist.

## Phase 7, "Beautiful," last on purpose

Visual polish is explicitly sequenced last: a beautiful site that fails
Phase 1 isn't the goal here. Once 1–6 hold: replace remaining
placeholder content (Team/Careers/Press are still demo fixtures, not
real Vishpala content), wire up the dark-mode logo variant that's
already sitting in `assets/img/logos/` unused, and a final full design
pass once real content, not placeholders, is what's actually being
designed around.
