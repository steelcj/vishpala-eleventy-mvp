/**
 * Turn a flat list of Eleventy page objects (all belonging to one locale)
 * into a nested tree that mirrors the ingressed content/<locale>/ folder
 * structure, so the menu is derived from the filesystem rather than
 * hand-maintained.
 *
 * A folder becomes a navigable node when it has an `index.md` (the folder
 * itself is a page). A folder with no index.md (e.g. `legal/` in the
 * example tree) still appears as a grouping label so its child pages
 * (`legal/privacy.md`) are reachable, it just has no `url` of its own.
 */
function buildNavTree(pages) {
  const root = { slug: "", title: "", url: null, children: {} };

  const sorted = [...pages].sort((a, b) => a.url.localeCompare(b.url));

  for (const page of sorted) {
    const segments = page.url.split("/").filter(Boolean);
    // First segment is always the locale folder itself; skip it, the
    // locale switch happens above the tree, not inside it.
    const pathSegments = segments.slice(1);

    let node = root;
    for (let i = 0; i < pathSegments.length; i++) {
      const slug = pathSegments[i];
      node.children[slug] ||= {
        slug,
        title: slug,
        url: null,
        order: Infinity,
        children: {},
      };
      node = node.children[slug];
    }

    node.url = page.url;
    node.title = page.data.navTitle || page.data.title || node.slug;
    node.order = page.data.order ?? node.order;
  }

  return sortTree(root);
}

function sortTree(node) {
  const children = Object.values(node.children)
    .map(sortTree)
    .sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.title.localeCompare(b.title);
    });
  return { ...node, children };
}

module.exports = { buildNavTree };
