# Flexstad × Astryx

An unofficial rebuild of the public flexstad.com site with Astryx components
and a local `flexstad` theme (`src/flexstadTheme.ts`) that extends
`@astryxdesign/theme-neutral`.

Not affiliated with Flexstad. Page copy comes from the public site (see
`src/content.ts`); only typography changed (long dashes became hyphens,
numbered headings lost their numbers). Photos are labelled gradient
placeholders. No form sends anything yet.

Routes mirror the live paths, all ending in a slash: `/`, `/aanbod/`,
`/aanbod/<slug>/`, `/voor-wie/`, the four audience pages, `/over-ons/`,
`/contact/`, `/inschrijven/`, `/abonneren/`, `/mijnflexstad/`, `/vacatures/`
and `/dienst/<slug>/`. A small History API router (`src/router.tsx`) turns
plain links into client navigation.

Known gaps:

- `/mijnflexstad/` does not collect credentials; the login stays disabled.
- `/abonneren/` assumes a single e-mail field (the live form is script-rendered).
- The live `/aanbod/winkelwaard-494/`, `/aanbod/linnaeusstraat/` and both
  `/dienst/` pages repeat text from other pages, so only facts and the shared
  copy are shown for them.
- The live listing filter also has a "Mogelijkheden" group; per-listing values
  are not public, so only Locatie and Status filter.

```bash
pnpm -F @astryxdesign/flexstad-demo dev
pnpm -F @astryxdesign/flexstad-demo build
```
