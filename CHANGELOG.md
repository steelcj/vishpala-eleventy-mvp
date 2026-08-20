# Changelog

All notable changes to the vishpala-eleventy-mvp repository are recorded here. This is the repository-level changelog, it records what each tagged release contained and why. Each document additionally carries its own changelog, in its frontmatter and in a Changelog table, for changes internal to that document.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions track the `VERSION` file and the git tags. Dates are ISO 8601.

## [Unreleased]

## [0.1.0] - 2026-08-20

* Added file fairy sat-docs-automa release and pubish as well as other automa documents

### Added

- Standard OSAT repository skeleton: `VERSION`, `CHANGELOG.md`, `ROADMAP.md`, `LICENSE` (GPL-3.0-or-later, full text), `CONTRIBUTING.md`.
- Restructured `docs/` to `en/docs/`, the required language root per the standard repository layout. Existing documents renamed to the three-part hyphenated version-suffix pattern (`slug-v0-1-0.md`), and one filename typo corrected ("thins" to "things").
- Shared-zone adoption from sat-doc-automa via file-fairy: `check-conformance.py` (markdown house-rule linter), the markdown and AI-collaboration automa, the license blocks, the CLAUDE.md signpost block, and style-guide reference declarations. Synced inventory in `.file-fairy-state.yaml`.
- License section in `README.md`, reflecting the three-way split this repository actually needs: GPL-3.0-or-later for code, GPL-3.0-or-later for documents, CC BY 4.0 International for public site content, with the Vishpala logo and wordmark explicitly excluded from the content grant.
- Markdown conformance cleanup across all 9 project documents under `en/docs/`: 154 em dashes converted to commas, 11 numbered headings de-numbered with their cross-references rewritten to name the section instead of a now-absent number, three `dc:identifier`/filename mismatches introduced by the `en/docs/` rename fixed, two missing required frontmatter fields added. Verified with `check-conformance.py`: 21 files checked, 0 issues.
- Repointed two manifest items after upstream moves in sat-doc-automa: `conserving-bandwidth-and-compute-with-claude.md` (into `ai-collaboration/examples/`) and `license-block--agpl-3-0-or-later.md` renamed to `license-block--gpl-3-0-or-later.md` (fixing the filename/content mismatch flagged in the previous manifest version). Old paths declared `state: absent` and retracted for real via `file-fairy apply`, not just edited out of the manifest. Known gap: the re-synced ai-collaboration doc reverted to its original em-dashes, since it's a `mirror`-mode item and the fix from this same changelog entry only ever lived on the retracted local copy — needs fixing upstream in sat-doc-automa, not patchable here.
