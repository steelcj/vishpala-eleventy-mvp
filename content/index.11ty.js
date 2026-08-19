// Generated root index. Deliberately a JS template, not markdown: its job
// is to compute a redirect from whatever locales actually exist on disk,
// not to hold authored content, so it shouldn't tempt anyone into editing
// prose here later. Lives at content/index.11ty.js, outside every locale
// folder — same reasoning as before, it stays invisible to the
// locale/nav/language-switcher collections, which all key off `locale`.
const siteConfig = require("../_11ty/site-config.js");

module.exports = class {
  data() {
    return {
      eleventyExcludeFromCollections: true,
      layout: false,
    };
  }

  render(data) {
    const byLocale = data.collections.byLocale || {};
    const locales = Object.keys(byLocale).sort();

    const label = (locale) => {
      const page = byLocale[locale][0];
      return (page && page.data.localeLabel) || locale;
    };

    // Same default-locale config the <head> partial uses for x-default,
    // so "the fallback locale" means one thing sitewide. Only matters
    // here when JS is off or no browser language matches any available
    // locale's primary subtag.
    const fallback = locales.includes(siteConfig.defaultLocale)
      ? siteConfig.defaultLocale
      : locales[0];

    const links = locales
      .map((locale) => `<a href="/${locale}/">${label(locale)}</a>`)
      .join(" · ");

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Vishpala</title>
  <meta http-equiv="refresh" content="0; url=/${fallback}/">
  <link rel="canonical" href="/${fallback}/">
  <script>
    // Matches each available locale's primary language subtag
    // ("fr-ca" -> "fr") against the browser's preferred languages, in
    // order, and redirects to the first match. Falls back to the
    // meta-refresh above if nothing matches or JS is unavailable.
    var locales = ${JSON.stringify(locales)};
    var fallback = ${JSON.stringify(fallback)};
    var browserLangs = (navigator.languages || [navigator.language || fallback])
      .map(function (l) { return l.toLowerCase(); });

    var match = browserLangs
      .map(function (lang) {
        var primary = lang.split("-")[0];
        return locales.find(function (locale) {
          return locale.split("-")[0] === primary;
        });
      })
      .find(Boolean);

    location.replace("/" + (match || fallback) + "/");
  </script>
</head>
<body>
  <p>Redirecting… if nothing happens, choose a language: ${links}</p>
</body>
</html>
`;
  }
};
