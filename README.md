# UUID Registry — setup instructions

This adds a generated, git-tracked registry that maps your `dc:identifier` /
`dc:relation` UUIDs to human-readable labels, so Sveltia CMS can offer a
searchable picker (by title) instead of requiring editors to paste raw
UUIDs when linking a page to an existing Work.

Nothing here is hand-maintained. The registry is fully derived from the
`title`, `identifier`, and `relation` front matter already on your content
files, rebuilt automatically before every commit.

## What's in this zip

```
scripts/build-registry.js    the generator — reads content/, writes content/_registry/
.githooks/pre-commit         runs the generator and stages the result before each commit
README.md                    this file
```

Unzip into your project root so `scripts/` and `.githooks/` land alongside
your existing `content/`, `.eleventy.js`, and `admin/` directories.

## One-time setup

**1. Install the two dependencies the script needs:**

```bash
npm install --save-dev glob gray-matter
```

(`gray-matter` may already be present transitively via `@11ty/eleventy` —
installing it explicitly as a direct devDependency avoids relying on that.)

**2. Make the hook executable** (the zip should preserve this, but confirm):

```bash
chmod +x .githooks/pre-commit
```

**3. Add a `prepare` script to `package.json`** so every clone points git
at the versioned hooks folder automatically on `npm install`:

```json
{
  "scripts": {
    "prepare": "git config core.hooksPath .githooks"
  }
}
```

Then run `npm install` once yourself to activate it in your current
checkout (or run `git config core.hooksPath .githooks` directly).

**4. Tell Eleventy not to build the registry as pages.** In `.eleventy.js`,
inside `module.exports = function (eleventyConfig) { ... }`, add:

```js
eleventyConfig.ignores.add("content/_registry/**");
```

**5. Add two file collections to `admin/config.yml`** — these are what the
`relation` widget searches against:

```yaml
  - name: "registry_works"
    label: "Registry — Works (internal)"
    folder: "content/_registry/works"
    format: "frontmatter"
    extension: "md"
    create: false
    delete: false
    editor:
      preview: false
    fields:
      - { label: "UUID", name: "uuid", widget: "string" }
      - { label: "Label", name: "label", widget: "string" }
      - { label: "Locales", name: "locales", widget: "object", required: false }

  - name: "registry_expressions"
    label: "Registry — Expressions (internal)"
    folder: "content/_registry/expressions"
    format: "frontmatter"
    extension: "md"
    create: false
    delete: false
    editor:
      preview: false
    fields:
      - { label: "UUID", name: "uuid", widget: "string" }
      - { label: "Label", name: "label", widget: "string" }
      - { label: "Locale", name: "locale", widget: "string" }
      - { label: "Path", name: "path", widget: "string" }
```

**6. Switch the `relation` field on your `en_ca` / `fr_ca` collections**
from a plain string to a `relation` widget:

```yaml
      - label: "Relation (dc:relation)"
        name: "relation"
        widget: "relation"
        required: false
        collection: "registry_works"
        search_fields: ["label", "uuid"]
        value_field: "uuid"
        display_fields: ["label"]
        hint: "Search by title to link this page to an existing Work. Leave blank if this is the first page of a brand-new Work."
```

**7. Run it once by hand** to generate the initial registry before your
first commit:

```bash
node scripts/build-registry.js
git add content/_registry scripts .githooks package.json .eleventy.js admin/config.yml
git commit -m "feat: add generated UUID registry for CMS relation linking"
```

## Day-to-day

Nothing to do. Every `git commit` runs the hook, which regenerates
`content/_registry/` from whatever `title` / `identifier` / `relation`
values exist in `content/` at that moment, and stages the result into the
same commit. The registry can never drift out of sync with the content
that produced it, because it's rebuilt from scratch (not merged) every
time — the same "regenerate, don't append" hygiene as the MVP's zip
packaging fix.

## Caveats worth knowing about

- **The hook only runs on commits made through local git.** If Sveltia's
  git-gateway backend commits directly to the remote (rather than through
  a contributor's local git client), those commits bypass the hook
  entirely and the registry won't reflect that change until someone next
  commits locally. Worth confirming how your backend is configured.
- **`prepare` runs on every `npm install`**, repointing `core.hooksPath`
  unconditionally. Harmless here, but mention it in your own README if
  anyone on the project relies on other local hooks.
- **`create: false` / `delete: false` stop editors from hand-adding
  registry entries through the CMS UI**, but Decap/Sveltia doesn't have a
  first-class "hide this collection from the sidebar" flag as far as
  documented — worth checking current Sveltia docs if you want the
  registry collections fully invisible rather than just read-only.
- **A brand-new Work has no registry entry until its first page is
  committed.** That's intentional: the first Expression originates the
  Work; a second Expression (translation) or a future Manifestation
  searches and links to it.
- **`dc:identifier` itself stays a plain string**, not a relation widget —
  it's a page declaring its own UUID, not referencing someone else's. The
  `registry_expressions` collection exists for later, when an
  assets/Manifestations collection needs to link back to "which
  Expression does this file realize" via search.
