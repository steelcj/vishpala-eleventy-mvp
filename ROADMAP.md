# Roadmap

Running record of decisions and open work for this repository. Newest entry first. This is distinct from `en/docs/roadmap-to-complete-site-v0-1-0.md`, which is a phased feature plan for the Vishpala site itself, not a decision log for the repository's own governance and structure.

## 2026-08-20 — Adopted the standard OSAT repository layout

Restructured `docs/` to `en/docs/`, added the required skeleton (`VERSION`, `CHANGELOG.md`, `ROADMAP.md`, `LICENSE`, `CONTRIBUTING.md`), and opted into the sat-doc-automa shared zone via file-fairy: `check-conformance.py`, the markdown and AI-collaboration automa, the license blocks, the CLAUDE.md signpost, and the style-guide reference declarations.

Deliberately excluded: the release-ceremony scripts (`bump-version.py`, `cut-release.py`, `publish-release.py`, `test_publish_release.py`). The standard scopes these to "release-managed repositories" specifically. This repository deploys continuously (push to `main`, host rebuilds) with no tagged-tarball release concept, so they don't currently fit. `VERSION` and `CHANGELOG.md` are still present per the skeleton's own requirement, they're just not driven by the release-ceremony tooling yet. Revisit if that changes.

## Open work

- `modality` field and Accessibility Statement page — described as built elsewhere, confirmed not actually present (see `en/docs/work-summary-v0-1-0.md`'s correction note).
- `dc:type` vs. content-type documentation — same status.
- CMS `relation` field: no live UUID-to-label resolution yet; editors still look up `content/_registry/works/` by hand.
- Markdown-automa conformance (no em dashes, no heading numbers, no horizontal rules, license statement templates) is opted into via the shared zone but not yet applied as an editing pass across existing documents. `check-conformance.py`, once synced, will surface the actual findings.
