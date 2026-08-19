// The 15 unqualified Dublin Core Metadata Element Set (DCMES 1.1) elements
// this site recognizes as front matter keys, rendered as <meta name="dc.X">
// tags by _includes/partials/dc-meta.njk.
//
// Deliberately NOT using the qualified DCMI Metadata Terms (dcterms:) —
// no isVersionOf/hasVersion, isPartOf/hasPart, replaces/isReplacedBy,
// created/modified split, etc. Unqualified DC has no way to sub-type
// `relation`, so this site defines a local convention instead (allowed
// under DCMES 1.1): `relation` means "the other locale Expressions of
// the same Work" and nothing else. Don't repurpose it for "see also" or
// "part of" links — there's no field-level way to tell those apart once
// they're mixed into the same value, and collections.byWork assumes
// every `relation` value means Work-pairing.
module.exports = [
  "title",
  "creator",
  "subject", // repeatable: array in front matter, one <meta> per value
  "description",
  "publisher",
  "contributor",
  "date",
  "type",
  "format",
  "identifier",
  "source",
  "language", // derived from locale's `hreflang` unless explicitly overridden
  "relation", // local convention: Work-pairing UUID only, see above
  "coverage",
  "rights",
];
