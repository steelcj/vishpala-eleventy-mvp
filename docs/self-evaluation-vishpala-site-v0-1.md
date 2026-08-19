---
dc:title: "Self-Evaluation — Vishpala Eleventy/Sveltia Build"
dcterms:version: "0.1.0"
dc:creator: "Claude (Anthropic)"
dc:contributor: "Christopher Steel"
dc:subject:
  - "evaluation"
  - "self-assessment"
  - "universal cake"
dc:description: >
  A self-evaluation of the Vishpala static site build (Eleventy, Sveltia
  CMS, self-hosted fonts) against Universal Cake Evaluation Metrics
  v0.3.1, using that document's own rating scale, evidence tags, and
  gates. Internal working document, not site content.
dc:publisher: "UniversalCake"
dcterms:created: "2026-08-17"
dcterms:modified: "2026-08-17"
dc:type: "Text"
dc:format: "text/markdown"
dc:language: "en"
dc:relation: "universal-cake-evaluation-metrics"
dc:identifier: "vishpala-site-self-evaluation-v0-1"
sat:uuid: ""
sat:migration_status: pre-sat
---

# Self-Evaluation — Vishpala Eleventy/Sveltia Build

Evaluated against [Universal Cake Evaluation Metrics
v0.3.1](./universal-cake-evaluation-metrics-v0-3-1.md), using its own
rating scale (Strong / Moderate / Weak / Unknown), evidence tags
(Verified / Inferred / Claimed), and gates.

**A methodological note before the ratings**: several rows below are
rated Unknown or Moderate rather than Strong, on evidence we don't
actually have yet — a formal accessibility audit, a real page-weight
measurement, a chosen CMS backend. Marking those Unknown isn't false
modesty; it's what the rubric's own logic requires. Rating something
Strong on the strength of good intentions is exactly the "unfalsifiable
promise" the rubric is built to catch, and doing that here would
undermine the point of running the evaluation at all.

## Scorecard

| Metric area | Rating | Evidence | Notes |
|---|---|---|---|
| Accessibility, alternative interaction | Moderate | Inferred | Skip link, semantic HTML, native `<details>/<summary>` nav (keyboard-operable, screen-reader-announced by default), `lang` set correctly per locale, `alt` text on images, `:focus-visible` styling. Not tested with actual assistive technology or automated tooling (axe/WAVE) — that's the gap between Inferred and Verified here. |
| Multilingual integration | Strong | Verified | `relation`/`identifier` Work-pairing, `hreflang` alternates, missing-translation fallback with visible indicator, CMS `relation` widget for pairing — all built and route-tested. One honest caveat: *adding content* in an existing locale is CMS-accessible to a non-developer translator; *adding a new locale* still requires a config/code change (a new CMS collection block), not a pure data file. |
| Economic and cognitive accessibility | Unknown | — | Not tested on low-end hardware or a throttled connection. Cognitively: plain language in UI chrome, no forced onboarding, no dark patterns introduced — reasonable by default, but unverified. |
| Representation | Unknown | — | No disclosed information about who built this (a Claude instance and one named collaborator) constitutes disabled representation or compensated community research. Per the rubric's own guidance: rating Unknown and recording that absence *is* the data point, not a placeholder for a better answer. |
| Compatibility | Moderate | Inferred | Modern-but-broadly-supported CSS (custom properties, Grid, `<details>`) — no IE11 support, deliberately. Not verified across a real device/browser matrix. |
| Resilience | Strong | Verified | Fully static output, zero runtime JS dependency for navigation (confirmed by deleting `nav.js` entirely in favor of native disclosure), no license servers, no live API calls. Degrades correctly with JS disabled because there's no JS to disable. |
| Agency, sovereignty & privacy | Moderate | Inferred | Content lives in plain git-tracked markdown (Sveltia is git-based, not a proprietary datastore) — self-hostable, forkable in principle. Held back from Strong: `admin/config.yml`'s `backend.name: git-gateway` is still a placeholder, so the real hosting/auth backend — which is where most sovereignty questions actually resolve — hasn't been chosen yet. |
| Agency, power-imbalance proxies | Strong (exit/portability) / Unknown (ToS, pricing) | Verified (exit/portability) | Exit cost: low — plain markdown + YAML, no proprietary export needed. Data portability: machine-readable (parseable front matter) and human-readable (plain prose) both pass, verified directly by reading the files. ToS volatility and pricing asymmetry: not yet applicable — no real backend/hosting vendor chosen yet, so nothing to measure. |
| Agency, interaction patterns | Strong | Inferred | No dark patterns present in the built chrome — no infinite scroll, no manufactured urgency, no consent walls, single honest nav. Inferred rather than Verified because this hasn't been checked against the full supportive/dark-pattern table row by row. |
| Environment, direct and indirect | Moderate | Inferred | Self-hosted fonts trimmed to used weights/subsets only (6 files, not full families); zero external requests. Not yet measured: actual total page weight, real bandwidth savings vs. a CDN-font baseline. Good architectural bet, not yet a verified number. |
| Security | Unknown | — | No formal security policy exists (there's no product to have one for yet). Genuinely strong point worth naming: runtime attack surface is close to zero by construction — static HTML/CSS, no server-side code, no database, nothing processing user input at request time. Supply chain: `package.json` uses `^` version ranges, not pinned — not yet audited. |
| Longevity | Unknown | Inferred | Eleventy and Sveltia CMS are both active open-source projects as of this writing, but "institutional backing, funding model, contributor pool" wasn't checked with fresh, dated evidence — this is a general impression, not a Verified rating. |
| Content endurance | Strong | Verified | Content is plain markdown with our own explicit Dublin Core front matter — genuinely readable and reusable with zero tooling if Eleventy or Sveltia disappeared tomorrow. This is the "enhancement layer, not a container" case the rubric describes directly. |
| Exit and portability **[GATE]** | Pass | Verified | Confirmed directly: every content file is plain text, git-tracked, in an open format, with no export step required. |
| Adjustability and support | Moderate | Inferred | Eleventy is MIT-licensed, widely documented, large community. Sveltia CMS's exact license wasn't independently re-confirmed for this evaluation — flagged rather than assumed. |
| Market position | Moderate (Eleventy) / Unknown (Sveltia) | Inferred | Eleventy: healthy plurality of static site generators exist, low platform lock-in risk. Sveltia CMS is a newer, smaller project (a Decap CMS fork) — meaningful bus-factor/contributor-concentration risk that hasn't been measured, just noted as a real open question. |
| **Gates** | **Pass, with one flagged** | — | Telemetry: none added, pass. Licence: Eleventy confirmed open; Sveltia not independently re-verified this pass. Accessibility floor: **not formally verified** — held at Unknown rather than assumed-pass, since the rubric requires Verified evidence on gate criteria specifically, and we don't have that yet for accessibility. Exit/portability: pass, verified. |

## What this evaluation actually recommends doing next

In the rubric's own terms, this project is at **Assess**, not **Trial** —
Inferred and Claimed tags are acceptable at this stage, but nothing here
should be treated as Adopted until the accessibility gate specifically
gets a Verified tag (a real audit, not inferred from good architecture),
and until the CMS backend is actually chosen (resolves most of the
Sovereignty and Market Position Unknowns at once).
