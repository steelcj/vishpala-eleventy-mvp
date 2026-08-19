# Recommended course of action

> **Correction, added later**: §2 below claimed the File Collections
> migration was "already implemented and verified" — checked directly
> against the real repo, it wasn't; `admin/config.yml` was still Folder
> Collections. It has *since* been done for real (see `README.md`'s
> "CMS structure: File Collections" section). §1's registry item had
> the same problem — `npm run registry` didn't even exist in
> `package.json` at the time, which is the exact bug a real person hit
> running this document's own advice. §3 and §4 below weren't re-checked
> as part of this correction; verify before trusting either.

Prioritized by what blocks real editorial use of the CMS first, and what
can wait. "Done" items from `work-summary.md` aren't repeated here.

## 1. Before editors touch the CMS at all

- **Initialize the real git repo, if not already done**, and run
  `npm install` *after* that — the `prepare` script needs `.git` to
  exist to wire up the pre-commit hook; it degrades gracefully if run
  first, but won't actually be active until re-run after `git init`.
- **Regenerate the registry once against real history**:
  `npm run registry`, commit. Confirms the hook path works end-to-end
  before anyone relies on it.
- **Confirm the git-gateway backend's actual commit path.** The
  pre-commit hook (registry regeneration) only runs on commits made
  through local git — if Sveltia's backend commits directly to the
  remote, those commits bypass it. This was flagged as an open question
  in an earlier session and is still open. Matters more now that File
  Collections mean every commit through the CMS is a real, distinct file.

## 2. Recommended: adopt the File Collections model as the standing convention

**Now actually implemented and verified** — see `README.md`'s "CMS
structure: File Collections" section for the real version, including
what was checked (every declared path confirmed against the real
filesystem, YAML anchor resolution confirmed programmatically). The one
process change this requires going forward:

- **A genuinely new page always means a developer adds a `files:` entry
  to `admin/config.yml` first.** This isn't a workaround to route around
  later — it's an accurate reflection of a real, current Sveltia
  limitation (nested collections aren't implemented until their 2.0).
  Worth writing into whatever onboarding material future contributors
  see, so it isn't rediscovered as a surprise.
- Revisit if Sveltia ships nested collections — check
  `docs/decisions/native-i18n-migration-swot.md`'s "Currency check"
  section before assuming the constraint still holds; this project
  ships frequently.

## 3. Content gaps flagged by `validate.js`, not yet closed

- `content/en-ca/about/accessibility.md` has no `fr-ca` counterpart.
  Real translation needed, not machine-generated — matches the
  standing principle that translation work needs a real translator.
- `content/en-ca/careers/index.md` is `localeExclusive: true`
  (intentional, not a gap).

## 4. Deploy pipeline — still unconfirmed

`npm run build` only warns on a broken identifier/relation;
`npm run build:strict` (added this session) throws. Whatever actually
builds this site for deployment (Netlify, Cloudflare Pages, a
self-hosted pipeline — not yet specified) should run `build:strict`,
not `build`, so a broken UUID blocks a bad deploy instead of shipping
silently. Needs the actual deploy target named before this can be wired
in.

## 5. Deferred, not forgotten

- **`es-ca` (or a third locale generally)**: the underlying
  `relation`/registry model already generalizes to N locales — confirmed
  by this session's symmetric-relation fix. Adding one is now mostly
  mechanical (new content folder, new File Collection entries, new
  locale in `admin/config.yml`'s `i18n.locales`) rather than an
  architectural question. Still a real content/translation-resourcing
  decision, not a technical blocker.
- **Sidecar metadata proposal** (canonical DC record as a separate file
  from page content): raised, not ruled on. Given the File Collections
  migration just landed and already fixes the field-duplication concern
  that motivated the sidecar idea (via the shared `page_fields` anchor),
  worth asking whether it's still wanted before spending time on it —
  the original motivating problem may already be solved.
- **A true `relation`-widget autofill** (vs. today's copy-paste-from-
  registry): documented as a viable future enhancement in
  `admin/config.yml`'s comments, would need a separate genuinely-
  editable "seed a new Work" collection using Decap's `uuid` widget.
  Worth it only if copy-paste turns out to be real friction in practice
  — not worth building speculatively.

## Suggested order

1. Git repo init + registry regeneration + backend commit-path check (§1) — blocks everything else.
2. Confirm deploy target, wire `build:strict` in (§4) — cheap, prevents a real class of silent failure.
3. Get the French accessibility translation done (§3) — closes a known, visible gap.
4. Everything in §5 — revisit only when it's actually needed, not preemptively.
