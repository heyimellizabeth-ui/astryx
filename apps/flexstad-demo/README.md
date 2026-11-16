# Flexstad × Astryx prototype

An unofficial migration prototype. It rebuilds the public flexstad.com homepage
and enquiry form with Astryx components and a local `flexstad` theme
(`src/flexstadTheme.ts`) that extends `@astryxdesign/theme-neutral`.

Not affiliated with Flexstad. Headings, labels, listing facts and three FAQ
entries are copied from the public site (see `src/content.ts`). Images are
gradient placeholders. The enquiry form sends nothing.

Not built: listing filters, photo gallery, breadcrumbs, the call-to-action
band and a phone navigation drawer (the top bar wraps on narrow screens).

```bash
pnpm -F @astryxdesign/flexstad-demo dev
pnpm -F @astryxdesign/flexstad-demo build
```
