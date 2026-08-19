Good instinct to pause here — a few things are worth closing out before editors start creating content through Sveltia, because some of them get much harder to fix retroactively once real pages exist.

**What I recall being open, based on our history** (I'd want to verify these against your actual current files before treating any as gospel — see below):

1. **`dc:date` depends on real git history**, and the zip you've been working from has no `.git` folder. Every page will show today's date until this becomes a real repo with commit history — worth confirming that's happened before content starts accumulating dates that don't mean anything.
   1. I will create a repo
2. **The `es/` third locale decision was deferred**, not resolved. The architecture already generalizes to it, but going from 2 to 3 locales after editors have started creating content is a bigger lift than deciding now.
   1. Define bigger lift. We want sites to be able to add additional languages over time using the CMS field for relating translated content, eventually we will want to do this for Expressions as well
3. **An Accessibility Statement page** was flagged as a real gap against your own Universal Cake framework, not yet built.
   1. So lets build the accessibility page:
      1. keyboard navigation
      2. aria
      3. accessibility "expressions" in that work in the same way as translations
4. **`validate.js`'s missing-translation warnings only surface at build time.** Once editors are creating pages through the CMS instead of you running `eleventy` locally, nobody will see those warnings unless something surfaces them — CI, a pre-deploy check, or similar.
   1. ok

I'd rather not guess further than that from memory — config files like `admin/config.yml` and `validate.js` have likely moved since the snippets I'm recalling. **Could you drop the current project zip in?** I want to audit against what's actually there, not what I last saw.

**On "page" as a content type — this is the right moment to raise it**, because right now you don't actually have a content-type *system*, you have one type (page) duplicated across two locale collections with ~20 hand-listed DC fields each. That's fine as long as page is the only type. It stops being fine the moment a second type shows up, because two problems appear at once:

- **Field duplication compounds.** Every new type re-lists title/creator/subject/description/etc. from scratch unless the common DC field set gets pulled into a shared, reusable block now, before there's a second copy to keep in sync.
  - We can always use sidecars, where the sidecar is the canonical metadata in dublic core format
- **`dc:type` and "content type" aren't the same concept, and conflating them is a trap.** `dc:type` is public metadata describing content's *nature* (Text, Image, Dataset — from the DCMI vocabulary) that visitors and search engines might see. "Content type" as you mean it is an internal templating concern — which layout, which nav behavior, which URL shape. A page and, say, a future press-release could both legitimately have `dc:type: Text` while needing completely different templates. Worth deciding explicitly now that these are two separate fields, rather than discovering the collision after a second type exists and something downstream is reading `dc:type` to pick a layout.
  - So lets state this very clearly in our README in a concise paragraph or two at the most and include examples of correct usage as a YAML file.

Once I can see the current files, I can propose an actual refactor — but broadly it'd mean: extract the shared DC field list into one YAML-anchored block `admin/config.yml` collections reuse, and decide whether "type" becomes an explicit front-matter field or stays purely structural (inferred from which content directory/CMS collection a file lives in — which fits your filesystem-as-source-of-truth principle better than a redundant declared field would).