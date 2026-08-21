---
dc:title: "Developer Note: Sveltia CMS, Local vs. GitHub Sign-In for Testing"
dcterms:version: "0.1.0"
dc:creator: "Claude (Anthropic)"
dc:contributor: "Christopher Steel"
dc:subject:
  - "sveltia cms"
  - "testing"
  - "developer notes"
dc:description: >
  Which Sveltia CMS sign-in option to use while testing locally, and
  why GitHub sign-in isn't the right choice yet.
dc:publisher: "UniversalCake"
dcterms:created: "2026-08-20"
dcterms:modified: "2026-08-20"
sat:uuid: ""
dc:type: "Text"
dc:format: "text/markdown"
dc:language: "en"
dc:identifier: "dev-note-sveltia-local-vs-github"
sat:migration_status: pre-sat
---

# Developer Note: Sveltia CMS, Local vs. GitHub Sign-In for Testing

## Short answer

**Use "Work with Local Repository" only. Don't sign in with GitHub,
not yet.**

## Why

Sveltia's sign-in screen offers these as **alternatives**, not things
you connect to at the same time. Local mode uses the browser's [File
System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API)
to read and write files on disk directly. It does **not** perform any
Git operations on its own, Sveltia's own documentation is explicit
about this: you still `fetch`, `pull`, `commit`, and `push` yourself,
using your normal Git client, exactly as before. Sveltia just edits the
files; you still own the Git workflow.

GitHub sign-in isn't ready yet, for two separate reasons:

1. **It would fail regardless.** `backend.name: github` in
   `admin/config.yml` is necessary but not sufficient for a real GitHub
   OAuth login, Sveltia also needs a deployed OAuth client (Sveltia's
   own Authenticator on Cloudflare Workers, a third-party client, or
   PAT-based auth) to complete the flow. None of that infrastructure
   exists in this project yet.
2. **It's not what testing needs.** Verifying that the CMS config loads
   correctly and fields behave as expected is entirely a local-files
   question. Nothing about it requires touching the remote.

## Testing sequence

1. Run the dev server (`npm start`, or your framework's equivalent).
2. Open `/admin/index.html` in **Chrome or Edge** (the File System
   Access API isn't available everywhere, Brave needs a flag enabled;
   Firefox and Safari aren't supported for this yet).
3. Click **"Work with Local Repository"** and grant it the project's
   root folder when prompted.
4. Confirm the CMS actually loads without configuration errors, and
   that fields render sensibly across a page or two.
5. Check `git status` afterward to see exactly what Sveltia wrote to
   disk, before committing anything.

## When GitHub sign-in becomes relevant

Once real remote access is needed (editing from a machine other than
this one, or handing off to a non-technical editor), GitHub sign-in
will need actual OAuth infrastructure deployed first, that's separate,
not-yet-started work, not a config toggle.
