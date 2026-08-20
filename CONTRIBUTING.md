# Contributing

## Content changes

Most content lives in `content/en-ca/` and `content/fr-ca/`, edited through Sveltia CMS (`admin/index.html`) or directly as markdown. See `README.md` for the full architecture — the Dublin Core front matter conventions, the `identifier`/`relation` translation-pairing mechanism, and the CMS structure are all documented there in detail.

A genuinely new page requires a developer to add a `files:` entry to `admin/config.yml` first (Sveltia CMS's File Collections model, not a limitation specific to this project — see the "CMS structure" section of `README.md` for why).

## Markdown conventions

This repository follows the shared house rules from [sat-doc-automa](https://github.com/steelcj/sat-doc-automa), synced via file-fairy: no heading numbers, no horizontal rules, commas instead of em dashes, and the canonical license statement templates. Run `python3 check-conformance.py` before committing markdown changes.

## Commits and versioning

Follows the [Commit and Versioning Workflow](en/docs/guides/devops/commit-and-versioning-workflow-v0-3-0.md) once that guide is synced in. Until then: write `CHANGELOG.md`'s `## [Unreleased]` entries by hand as you go, under `### Added`, `### Changed`, or `### Removed`.

## Site build

```sh
npm install
npm start   # dev server
npm run build
```

See `README.md` for the full development setup, including the git pre-commit hook that regenerates the UUID registry.
