# Design: Flexstad (Astryx prototype)

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System

- Genre: editorial (inferred). The brand is the logo itself, read from flexstad.com: aubergine `#421F54`, orange `#F6522A`, and the mark's four slanted bars.
- Shape of the first page: Manifesto, **Rise** posture on `/`: the canal photograph fills the first screen and an aubergine block rises out of the band below into it, carrying the client's headline. Block and band are one colour, so the page reads as one building rising into the street. Inner pages open on an aubergine Banner.
- Theme: brand, from `src/flexstadTheme.ts`; no Hallmark theme dealt.
- Axes: light/geometric-sans/warm · posture: Rise on `/`, aubergine Banner inside · nav: three-part, sticky on translucent paper, the real wordmark at the content edge.
- Source of truth: `src/flexstadTheme.ts` (tokens, scale), `src/index.css` (stamp, brand tokens), `src/sections/BrandMark.tsx` (the wordmark and the stripe).

## Brand devices

- **Wordmark:** `BrandMark`, the live site's own SVG. Letters take `currentColor` (light on aubergine and in dark mode); the bars are always `--flex-orange`. In the header at 136px, phones at 112px, and in the footer at the full column width.
- **Bar:** one bar of the mark, cut on its slant (half its height across), marks each reason on `/` and slides in beside an audience row on hover. Never a bullet anywhere else.
- **Stripe:** `BrandStripes`, three orange rows of 12px ending at staggered lengths, each end cut on the mark's slant. Only across the top of the footer, as on the live site.
- **Arched window:** `--flex-arch` (a half-circle over a 16px base). Every photograph beside text is framed as one: the audience heroes, the four index rows, the value section (where an orange arch sits behind it, offset 24px). Full-bleed photographs (the hero) keep no radius.

## Tokens

```css
:root {
  --color-background-body: oklch(0.975 0.006 25); /* warm paper */
  --color-background-surface: oklch(0.992 0.003 25);
  --color-background-muted: oklch(
    0.94 0.008 20
  ); /* the well under the listings */
  --color-text-primary: oklch(0.314 0.097 312.6); /* aubergine ink, #421F54 */
  --color-text-secondary: oklch(0.42 0.025 310);
  --color-accent: oklch(
    0.66 0.21 34.6
  ); /* the logo orange #F6522A: actions, focus */
  --color-text-accent: oklch(0.5 0.17 34); /* orange as text on paper */
  --color-on-accent: oklch(0.2 0.07 312);
  --flex-band: oklch(
    0.314 0.097 312.6
  ); /* the hero block, the band, inner heroes */
  --flex-band-deep: oklch(0.24 0.08 312); /* the footer */
  --flex-orange: oklch(
    0.66 0.21 34.6
  ); /* the figure, bars, stripe, closing band */
  --flex-on-orange: oklch(0.2 0.07 312); /* ink on the orange band, 4.6:1 */
  --flex-arch: 999px 999px 16px 16px;
  --flex-ease: cubic-bezier(0.16, 1, 0.3, 1);
}
```

Surfaces, in order down `/`: photograph, aubergine (block and band), paper (Voor wie), well (listings), paper (value, FAQ), orange (Interesse?), deep aubergine (footer). Never two orange or two aubergine sections apart from the block and its band. `bandStyles.onBand` flips text, accent-text, border and focus tokens to light on aubergine; `orangeStyles.onOrange` sets deep aubergine ink and turns the primary button aubergine with light text on the orange band.

## Type scale

Geologica, base 17px, ratio 1.25, one colour per head. Display heads are set tight (`letter-spacing: -0.028em` for h1 and h2, tighter on the largest sizes), the way the wordmark is set.

- Home head: clamp(40px, 12px + 4vw, 76px), leading 1, three lines at 1440 on a 900px block
- Inner page head, `display-2`: clamp(36px, 12px + 4.6vw, 84px), leading 1.02
- Section head, `h2`: clamp(32px, 14px + 2.6vw, 56px), leading 1.06
- Set pieces: `2.000+` at clamp(5.5rem, 2rem + 16.5vw, 19.5rem) in the logo orange; the Voor wie head at up to 120px; audience row titles at up to 68px; `Interesse?` at up to 140px
- Item title `h3`, body 17px, labels one step down, sentence case, untracked

## Layout

- One container: 1200px content, 16px gutters on phones, centred; gutters grow at 1920, grids do not.
- Nav, hero block and page content share the same left edge.
- One radius per nesting level: 0 for a full-bleed photograph, 16px for cards, panels and the top corners of the hero block, the arch for framed photographs, pills for controls.

## Controls

- Primary: orange fill, deep aubergine label, pill, `size="lg"` = 48px. On the orange band it turns aubergine with a light label.
- Secondary and ghost: Astryx, same pill and height. Fields: `size="lg"`, 48px.
- Listing cards: flat on the well, a hairline frame that turns ink on hover, no shadow; the street name is the largest thing on the card.

## Pictures

- Library photographs (`src/photos.ts`, credited in the footer via `PHOTO_CREDITS_LINE`) are mood images only: never on a listing, never standing in for a customer or teammate. Rendered by `PhotoImage` (`isArch` for the arched frame): a real `<img>` with `width`/`height`, Dutch `alt`, `object-fit: cover`. The first photograph on a route is `fetchPriority="high"`; every other one is lazy.
- **Overlay rule:** text on a photograph sits on a solid aubergine block (`--flex-band` with `bandStyles.onBand`), never on a scrim or the bare image. The hero headline sits on the block, 12.4:1.
- In use: `heroCanal` (hero), and in the Voor wie index `ownersEntrance`, `makersAtticStudio`, `aboutStreet` (gemeenten) and `developersShell`; `aboutWindowsill` beside Van leegstand naar meerwaarde; the audience heroes keep theirs; `/over-ons/` shows `aboutStreet` 21/9 across.
- Listing cards and the four gallery slots on each listing detail carry no photograph until the client supplies them.

## Demo portal

`/mijnflexstad/` is a demo login and `/mijnflexstad/overzicht/` the space behind it (Huurder and Eigenaar views, built from Astryx Card, Table, TabList, SegmentedControl, MetadataList, List, Badge, StatusDot, Banner, Selector, TextArea, FormLayout). The site is not hosted on Flexstad's domain, so these safeguards hold and none may be weakened:

- The check runs in the browser against one published test account (KEESFLEX, compared without case, and 12345678). No `fetch`, XHR or beacon, no form `action`, no `name` on inputs, `autoComplete="off"`; typed values live in React state only and never reach storage, the address, the console or the network.
- The login panel prints the account in a Demo banner and says never to type real details; any other input gets "Dit is een demo. Alleen het testaccount werkt."
- Storage: `sessionStorage['flexstad-demo-session']` and `['flexstad-demo-view']` only; Uitloggen clears both. Logged out, the overview redirects to the login with no portal content rendered; logged in, the login redirects to the overview.
- Every portal screen carries a Demo badge and "Alle gegevens op deze pagina zijn voorbeelddata."; the sample data (`src/portal/sampleData.ts`) is fictional (Kees, Voorbeeldstraat 12) and never uses real listing addresses, people or prices. Only the contact card shows real Flexstad details.

## Motion

- On load: the hero photograph settles from 1.08 to 1 and the block rises 56px into place (1.1s, `--flex-ease`).
- On scroll: reasons and listing cards reveal through a view timeline.
- On hover or focus of an audience row: the bar slides in, the title moves along by its length, the arched window lifts and tilts 2deg.
- Under `prefers-reduced-motion: reduce` nothing moves: content is at full opacity, and only the bar's opacity changes on hover.

## Exports

The Astryx theme file is the export. Tailwind, DTCG or shadcn blocks on request, per `export-formats.md`.
