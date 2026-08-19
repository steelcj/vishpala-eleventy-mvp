module.exports = {
  // dc:date default: the file's first git commit ("git Created"), not
  // Eleventy's plain filesystem-birthtime default — birthtime resets on
  // every fresh clone/CI checkout, so it's not a meaningful "creation
  // date" once this leaves a single machine. Reads git log instead.
  // Per-page front matter `date: ...` still overrides this per the
  // normal data cascade (front matter beats directory data).
  //
  // CAVEAT this is worth knowing before trusting the build output: if
  // the working tree isn't an actual git repo with real commit history
  // — e.g. a freshly unzipped copy with no `.git` folder — Eleventy
  // can't resolve "git Created" and falls back to Date.now(), so every
  // page's date will appear to be "right now" and will change on every
  // build. This only becomes meaningful once the site is a real git
  // repo (which it will be, once pushed to whatever backs the Sveltia
  // CMS `backend.name`) — see README.
  date: "git Created",

  eleventyComputed: {
    // Eleventy's default "pretty URL" behaviour turns `privacy.md` into
    // `privacy/index.html`, one directory deeper than the source file.
    // That breaks the relative `privacy.assets/diagram.svg` reference
    // written in the markdown, because output and source no longer
    // share a directory. `index.md` files don't have this problem —
    // their default output already lands in the same directory as their
    // own `index.assets/` sibling — so only override the non-index case.
    permalink: (data) => {
      const stem = data.page.filePathStem; // e.g. "/en-ca/about/legal/privacy"
      if (stem.endsWith("/index")) return undefined; // keep Eleventy's default
      return `${stem}.html`;
    },
  },
};

