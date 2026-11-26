# Design: Flexstad (Astryx prototype)

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System

- Genre: editorial (inferred). The brand is the logo itself, read from flexstad.com: aubergine `#421F54`, orange `#F6522A`, and the mark's four slanted bars. The orange token `oklch(0.66 0.21 34.6)` renders as `#f75027`, one to two steps per channel from the logo file's `#F6522A`: the same colour to the eye, and `#f75027` is the value to use wherever a hex is needed.
- Shape of the first page: Manifesto, **Rise** posture on `/`: Flexstad's own photograph of a maker at work fills the first screen and an aubergine block rises out of the band below into it, carrying the client's headline. Block and band are one colour. Inner pages open on an aubergine Banner.
- Theme: brand, from `src/flexstadTheme.ts`; no Hallmark theme dealt.
- Axes: light/geometric-sans/warm · posture: Rise on `/`, aubergine Banner inside · nav: three-part, sticky on translucent paper, the real wordmark at the content edge.
- Source of truth: `src/flexstadTheme.ts` (tokens, scale), `src/index.css` (stamp, brand tokens), `src/sections/BrandMark.tsx` (the wordmark and the stripe).

## Brand devices

- **Wordmark:** `BrandMark`, the live site's own SVG. Letters take `currentColor` (light on aubergine and in dark mode); the bars are always `--flex-orange`. In the header at 136px, phones at 112px, and in the footer at the full column width.
- **Bar:** one bar of the mark, cut on its slant (half its height across), marks each reason on `/` and slides in beside an audience row on hover. Never a bullet anywhere else.
- **Stripe:** `BrandStripes`, three orange rows of 12px ending at staggered lengths, each end cut on the mark's slant. Only across the top of the footer, as on the live site.
- **Arched window:** `--flex-arch` (a half-circle over a 16px base). Every photograph beside text is framed as one: the audience heroes, the four index rows. Full-bleed photographs (the hero) keep no radius.

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
  --flex-on-orange: oklch(
    0.2 0.07 312
  ); /* ink on the orange band, 5.4:1 (measured) */
  --flex-arch: 999px 999px 16px 16px;
  --flex-ease: cubic-bezier(0.16, 1, 0.3, 1);
}
```

Surfaces, in order down `/`: photograph, aubergine (block and band), paper (Voor wie), well (listings), paper (value, FAQ), orange (Interesse?), deep aubergine (footer). Never two orange or two aubergine sections apart from the block and its band. `bandStyles.onBand` flips text, accent-text, border and focus tokens to light on aubergine; `orangeStyles.onOrange` sets deep aubergine ink and turns the primary button aubergine with light text on the orange band.

### Colour rules

1. Orange is a **fill** (buttons, the mark, the stripe, the closing band). For orange **text or icons on paper** use `--color-text-accent` (`#af2e0f`).
2. Text on an orange fill is deep aubergine ink (`--flex-on-orange`, `#20092c`), never white.
3. Neutrals lean toward the brand hue: warm pink-white in light mode, aubergine-black in dark. No pure grey.
4. Semantic colours (success, warning, error, info) and the ten tinted hues are Astryx defaults. Do not restyle them for the brand.
5. Orange on plain aubergine is for the mark, icons and large type only; small text on a band uses `--flex-on-band`.

### Contrast (computed, WCAG 2.x; the key pairs also read from the rendered site)

| Pair                                            | Ratio           | Result                                      |
| ----------------------------------------------- | --------------- | ------------------------------------------- |
| Aubergine ink on paper (`#421f54` on `#fbf5f5`) | 12.5:1          | AAA                                         |
| Secondary text on paper (`#514958`)             | 8.0:1           | AAA                                         |
| Ink on orange button (`#20092c` on `#f75027`)   | 5.4:1           | AA                                          |
| `--color-text-accent` on paper (`#af2e0f`)      | 6.1:1           | AA                                          |
| `--flex-on-band` / muted on aubergine           | 12.4:1 / 8.5:1  | AAA                                         |
| Body / secondary text on dark body              | 16.5:1 / 10.2:1 | AAA                                         |
| Orange on aubergine / on deep aubergine         | 3.9:1 / 4.9:1   | Large text and graphics only / AA           |
| **White on orange**                             | **3.35:1**      | **Fails: never use**                        |
| **Orange fill as text on paper**                | **3.18:1**      | **Fails below large size: use text-accent** |

### Dark mode

Every brand token has a dark counterpart; neutrals are tinted, not inverted grey.

| Role                    | Light                                               | Dark                                            |
| ----------------------- | --------------------------------------------------- | ----------------------------------------------- |
| Body                    | `#fbf5f5`                                           | `#110e13`                                       |
| Surface / card          | `#fefcfb`                                           | `#1a171d`                                       |
| Popover                 | `#fefcfb`                                           | `#1f1b22`                                       |
| Muted well              | `#f0e9e9`                                           | `#242027`                                       |
| Text                    | `#421f54`                                           | `#f4ecec`                                       |
| Secondary text          | `#514958`                                           | `#c0bbc5`                                       |
| Accent fill             | `#f75027`                                           | `#ff8051`                                       |
| Accent text, focus ring | `#af2e0f`                                           | `#ff9661`                                       |
| Emphasised border       | `#797180`                                           | `#908995`                                       |
| Band / deep band        | `oklch(0.314 0.097 312.6)` / `oklch(0.24 0.08 312)` | `oklch(0.20 0.06 310)` / `oklch(0.14 0.04 310)` |

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

## Spacing, radius and elevation

- **Spacing:** a 4px unit. Steps 2, 4, 6, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48px (Astryx `--spacing-*`); card and section padding 12px; large controls 48px.
- **Radius tokens:** inner 8px, element 10px, container 16px, page 28px, full 9999px. Buttons, badges and tokens are pills; cards are 16px.
- **Elevation:** `low`, `med` and `high`, two soft layers each. In dark mode the alpha rises and a 1px light inner edge replaces reliance on shadow. Listing cards use none (see Controls); the consent banner uses `high`.
- **Breakpoints:** 640px (rows gain a photo column) and 900px (the wide layouts); `pointer: coarse` under 1024px for touch sizing.

## Controls

- Primary: orange fill, deep aubergine label, pill, `size="lg"` = 48px. On the orange band it turns aubergine with a light label.
- Secondary and ghost: Astryx, same pill and height. Fields: `size="lg"`, 48px.
- Listing cards: flat on the well, a hairline frame that turns ink on hover, no shadow; the street name is the largest thing on the card.

## Composition of `/` and the listing pages

- `/`: Rise hero (`sections/RiseHero.tsx`), then **Actueel aanbod as a bento on the aubergine band** (`sections/ListingBento.tsx`: the available listings, the first tall on seven columns, each an Astryx `ClickableCard` filled by its building's photograph with name, city, price and total on a solid plate), then 2.000+ on paper (ink, the plus in orange), Voor wie, Van leegstand naar meerwaarde (Linnaeusstraat, linked), FAQ, Interesse?, footer.
- `/voor-wie/`: the Voor wie rows of the home page, from one shared component (`sections/AudienceIndexList.tsx`), so the two pages cannot drift apart. Four audiences, equal weight: title, first sentence, arched window; each row links to that audience's own page, where its action lives. No per-audience buttons or extra copy here.
- `/privacy/`: privacy and cookies (`pages/Privacy.tsx`), linked from the footer and the consent banner.
- `/aanbod/<slug>/`: the same Rise hero with the building's cover photograph, the head, address, facts and Ik heb interesse! on the block; the rest of its photographs as a mosaic on the aubergine band beneath (the Lightbox holds them all, the cover first).
- Every photograph ships with 640 and 1024px cuts (`srcSetFor` in `photos.ts`) and a `sizes` for its slot. Routes other than `/` load on demand (`React.lazy` in `App.tsx`); `/` preloads its hero photograph from `index.html`; Geologica loads from `index.html` with preconnects. A skip link ("Naar de inhoud") leads to `<main id="inhoud">`, and every route sets its own document title.

## Pictures

- **Every photograph is Flexstad's own**, taken from the public flexstad.com pages and served as WebP from `public/photos/flexstad/` (`src/photos.ts`). The footer credits them as "Foto's: Flexstad." No library stand-in remains.
- Listings show their own building: each card leads with its cover (`LISTING_PHOTOS[slug].cover`, 4/3, a small zoom on hover), and each detail page opens with a mosaic of its photographs (the cover large, four tiles, the last counting the rest) that opens the Astryx `Lightbox`. Furnished impressions keep the live site's word "Sfeerimpressie" in their alt text.
- `/`: the hero is the maker at work in her atelier (the live site's own hero photograph); the Voor wie rows and the four audience heroes take the photographs flexstad.com gives each audience page; Van leegstand naar meerwaarde shows the Linnaeusstraat shop empty and as the African fashion store it became, wiped with the Astryx `Slider` (keyboard steps included), captioned with the live site's own line.
- Rendered by `PhotoImage` (`isArch` for the arched frame) or, inside components, a plain `<img>` with `width`/`height`, Dutch `alt` and `object-fit: cover`. The first photograph on a route is `fetchPriority="high"`; every other one is lazy.
- **Overlay rule:** text on a photograph sits on a solid plate (the aubergine hero block, a Badge, the "+N foto's" pill), never on a scrim or the bare image.

## Consent and privacy

- Analytics is off until a GA4 measurement id is pasted into `GA_MEASUREMENT_ID` in `src/analytics.ts`. While it is empty nothing loads, no cookie is set and no banner shows.
- Strict consent: Google's script is not requested until the visitor accepts. Accepting grants the four Consent Mode v2 signals (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`) in the order default denied, then update granted. Declining or withdrawing keeps the script away, sets the disable flag and removes the `_ga` cookies.
- The choice lives in `localStorage['flexstad-cookie-consent']` (`granted` or `denied`) and nowhere else. The footer's "Cookie-instellingen" (shown only when analytics is on) and the privacy page reopen it.
- The banner (`sections/ConsentBanner.tsx`): a surface panel at the bottom, **both choices the same button style and size** ("Alleen noodzakelijke cookies", "Alles accepteren"), copy addressed with "u", a link to `/privacy/`. It does not take focus on a first visit; reopened from the footer it does.
- Page views are sent by the router effect (the site routes on the client); a successful form send fires `generate_lead` with the form kind. Both only after consent.
- The privacy text is written from what the site does (forms into Asana, Hostinger hosting, optional Analytics). It makes no claim about data processing agreements or retention periods; those need the client's answers before it goes live.

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

## Audit log

- **2026-11-26, design audit.** Three suspected problems were checked on the rendered site and none was a defect: the Figtree rules in the compiled CSS belong to the unused `neutral` theme, headings render in Geologica with all four weights; no component sets white text on orange (every orange button uses the ink, 5.4:1); the only orange text on paper is the decorative 230px "+" (3.18:1, which passes for large text). The rules above stay as guards for new components.
- Radius tokens differ between layers: the compiled Astryx CSS shows 12 / 10 / 6px, the theme overrides them to 16 / 8px at runtime. Use the theme values.

## Exports

The Astryx theme file is the export. Tailwind, DTCG or shadcn blocks on request, per `export-formats.md`.
