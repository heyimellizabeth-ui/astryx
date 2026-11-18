# Design: Flexstad (Astryx prototype)

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System

- Genre: modern-minimal (inferred)
- Shape of the first page: Manifesto (the client's headline is the hero), Banner posture
- Theme: brand, read from `src/flexstadTheme.ts`; no Hallmark theme dealt
- Axes: light/geometric-sans/warm · posture: Banner · nav: three-part bar on the content column
- Source of truth: `src/flexstadTheme.ts` (tokens, scale), `src/index.css` (stamp, band tokens). There is no `tokens.css`: the Astryx theme is the token file.

## Tokens

```css
:root {
  --color-background-body: oklch(0.953 0.009 280);  /* lavender page wash */
  --color-background-surface: #FFFFFF;
  --color-text-primary: oklch(0.314 0.097 312.6);   /* aubergine */
  --color-text-secondary: oklch(0.45 0.03 305);
  --color-accent: oklch(0.7 0.19 38);               /* orange, fills only */
  --color-text-accent: oklch(0.5 0.17 34);          /* orange as text */
  --color-on-accent: oklch(0.2 0.07 312);
  --color-border-emphasized: oklch(0.58 0.03 305);
  --flex-band: oklch(0.314 0.097 312.6);            /* aubergine band */
  --font-family-heading, --font-family-body: Geologica, system sans fallbacks;
  --radius-container: 16px;  --radius-full: pills for buttons, badges, tokens;
}
```

Dark mode values sit beside each colour in `flexstadTheme.ts`.

## Type scale

Geologica, base 17px, ratio 1.25, headings bold, one colour.

- Home head, `display-1`: clamp(40px, 8px + 5.2vw, 88px), 83px at 1440, leading 1.08
- Inner page head, `display-2`: clamp(36px, 14px + 3.5vw, 68px), 64px at 1440, leading 1.1
- **Section head, `h2` (`--text-heading-2-size`): clamp(30px, 16px + 1.95vw, 48px), 44px at 1440, leading 1.15**
- Item title `h3`, body 17px, labels one step down, sentence case, untracked

## Layout

- One container: 1200px content, 16px gutters on small screens, centred; gutters grow at 1920, grids do not.
- Nav and page content share the same left and right edge (wordmark at the content edge).
- Sections part by the `PageSection` rhythm; one radius (16px) for every card, tile and photo frame.

## Controls

- Primary: orange fill, aubergine label, pill, `size="lg"` = 48px (`--size-element-lg`)
- Secondary: Astryx secondary, same pill and height
- Fields: `size="lg"`, 48px

## Pictures

- No photographs yet: gradient stand-ins stay as labelled slots ("Foto volgt: ...") with the 81 waiver in `index.css`. Fewer, larger, consistent slots; the client's photos replace them.

## Motion

- Still: one reveal on the hero at load, scroll reveal on tiles; everything static under reduced motion.

## Exports

The Astryx theme file is the export. Tailwind, DTCG or shadcn blocks on request, per `export-formats.md`.
