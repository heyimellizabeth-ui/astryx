# Design: Flexstad (Astryx prototype)

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System

- Genre: modern-minimal (inferred)
- Shape of the first page: Manifesto, Ledge posture on `/`: a library photograph is the tall field across the screen and the client's headline rests under it; inner pages stay Banner
- Theme: brand, read from `src/flexstadTheme.ts`; no Hallmark theme dealt
- Axes: light/geometric-sans/warm · posture: Ledge on `/`, Banner inside · nav: three-part bar on the content column, on paper above the photograph
- Source of truth: `src/flexstadTheme.ts` (tokens, scale), `src/index.css` (stamp, band tokens). There is no `tokens.css`: the Astryx theme is the token file.

## Tokens

```css
:root {
  --color-background-body: oklch(0.975 0.006 25);   /* warm paper, a faint rose toward the aubergine */
  --color-background-surface: oklch(0.992 0.003 25); /* one step above paper, never pure white */
  --color-background-muted: oklch(0.94 0.008 20);   /* tinted well */
  --color-text-primary: oklch(0.314 0.097 312.6);   /* aubergine ink */
  --color-text-secondary: oklch(0.42 0.025 310);
  --color-accent: oklch(0.7 0.19 38);               /* orange: actions and the focus ring only */
  --color-text-accent: oklch(0.5 0.17 34);          /* orange as text on links */
  --color-on-accent: oklch(0.2 0.07 312);
  --color-border-emphasized: oklch(0.56 0.025 310); /* field edge, 4.3:1 on paper */
  --flex-band: oklch(0.314 0.097 312.6);            /* aubergine band and photo plate */
  --font-family-heading, --font-family-body: Geologica, system sans fallbacks;
  --radius-container: 16px;  --radius-inner: 8px;  --radius-full: pills for buttons, badges, tokens;
}
```

Dark mode values sit beside each colour in `flexstadTheme.ts` (paper L 0.17, surface 0.21, muted 0.25, all chroma 0.012 to 0.016 at hue 310). The paper moved from a blue lavender (L 0.953, hue 280) to a lighter, warmer one; neutrals are one family tinted toward it. Orange is no longer used for the `2.000+` figure (it is ink); the audience tiles on `/` are aubergine, muted or surface, never orange.

## Type scale

Geologica, base 17px, ratio 1.25, headings bold, one colour.

- Home head, `display-1`: clamp(38px, 11px + 3.95vw, 72px), 68px at 1440, leading 1.08 (two lines at 1200px; the photograph carries the screen)
- Inner page head, `display-2`: clamp(28px, 14px + 3.5vw, 68px), 64px at 1440, leading 1.1
- **Section head, `h2` (`--text-heading-2-size`): clamp(30px, 16px + 1.95vw, 48px), 44px at 1440, leading 1.15**
- Item title `h3`, body 17px, labels one step down, sentence case, untracked

## Layout

- One container: 1200px content, 16px gutters on small screens, centred; gutters grow at 1920, grids do not.
- Nav and page content share the same left and right edge (wordmark at the content edge).
- Sections part by the `PageSection` rhythm. One radius per nesting level: 0 for a full-bleed photograph, 16px (`--radius-container`) for every card, tile and framed photo, 8px (`--radius-inner`) for a plate or picture inside a padded container, pills for controls.

## Controls

- Primary: orange fill, aubergine label, pill, `size="lg"` = 48px (`--size-element-lg`)
- Secondary: Astryx secondary, same pill and height
- Fields: `size="lg"`, 48px

## Pictures

- Library photographs (`src/photos.ts`, `PHOTOS`, credited in the footer via `PHOTO_CREDITS_LINE`) are mood images only: never on a listing, never standing in for a customer or teammate. Rendered by `PhotoImage` in `src/sections/ui.tsx`: real `<img>` with `width`/`height`, Dutch `alt`, `object-fit: cover`, the stored `object-position`. The hero image alone is `fetchPriority="high"` with no `loading`; every other one is `loading="lazy"`.
- Ratios: `wide` 21/9 across, `landscape` 3/2, `portrait` 4/5 beside text, `square` 1/1 in pairs (`PHOTO_RATIOS`). The hero fills a box sized by flex, so layout never waits for the image (CLS 0).
- Treatment on every photograph: `saturate(0.94)`, and `brightness(0.9)` in dark mode. Photographs take at most a third of the page below the hero and never lead two sections in a row.
- **Overlay rule: text on a photograph sits on a solid plate of `--flex-band` with `bandStyles.onBand` (aubergine, light text), 8px radius inside a 16px frame, never on a scrim or the bare image.** Contrast is then a colour pair: 12.4:1 (muted line 8.5:1) in light, 17.7:1 (12.1:1) in dark, the same over every pixel. The hero carries no text on its photograph.
- Photographs in use: `heroCanal` (hero), `ownersEntrance` and `makersAtticStudio` (the two wide audience tiles on `/`). Municipalities have no photograph and `developersShell` is too weak a mood to pass the deletion test, so those two audience tiles are type-led. The footer credits exactly these three (`USED_PHOTOS`, `PHOTO_CREDITS_LINE`, `data-credits`).
- Listing cards are type-led: no picture, no gradient; the street name is the largest thing on the card (24 to 30px), then the city, status, facts and feature lines. Four across from 1100px, a snap rail below.
- Remaining stand-ins (stated once, the 81 waiver in `index.css`): the four gallery slots on each listing detail and the team slot on `/over-ons/` stay labelled "Foto volgt" until the client supplies photographs.

## Motion

- Still: one reveal on the hero at load, scroll reveal on tiles; everything static under reduced motion.

## Exports

The Astryx theme file is the export. Tailwind, DTCG or shadcn blocks on request, per `export-formats.md`.
