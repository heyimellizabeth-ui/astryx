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

## Wonen of werken per pand instellen

Elk pand in `src/content.ts` (de lijst `LISTINGS`) heeft één instelling,
`gebruik`. Verander alleen dat ene woord:

```ts
{
  slug: 'winkelwaard-494',
  gebruik: 'werken', // 'werken', 'wonen' of 'beide'
  name: 'Winkelwaard',
  ...
}
```

- `'werken'`: alleen voor bedrijven. De kaart en de pandpagina tonen
  "Alleen voor bedrijven, niet voor bewoning", en het reactieformulier
  vult "Werken" vast in.
- `'wonen'`: alleen om te wonen, op dezelfde manier.
- `'beide'`, of de regel weglaten: de bezoeker kiest zelf Wonen of Werken.

Daarna opnieuw bouwen (`pnpm -F @astryxdesign/flexstad-demo build`) en de
map `dist` uploaden.

## Formulieren koppelen aan Asana

Elk formulier op de site (Interesse per pand, Contact, Inschrijven, Aanmelden) wordt
een taak in Asana. De site zelf is statisch; een klein PHP-bestand op dezelfde
Hostinger-hosting (`public/api/aanvraag.php`, na de build `dist/api/`) stuurt de taak
door. De demo-omgeving (`/mijnflexstad/`) is bewust niet gekoppeld en doet geen verzoeken.

1. Maak een persoonlijk toegangstoken: Asana, Mijn instellingen, Apps, Developer console.
2. Kopieer `asana-config.example.php` naar `flexstad-asana-config.php` en vul het token,
   de GID's (project, secties, workspace) en `allowed_origins` (het echte domein) in.
3. Upload dat bestand één niveau BOVEN `public_html` (dus niet in `public_html`).
4. Zet `dry_run` op `false`. Met `true` wordt de taak alleen opgebouwd en teruggegeven, niet aangemaakt.
5. Upload de inhoud van `dist/` naar `public_html` en test met één formulier.

Overstappen naar de Asana van de werkgever: nieuw token en nieuwe GID's in het
configuratiebestand op de server. Geen codewijziging en geen nieuwe build.

Veiligheid: het token staat alleen op de server, nooit in de browser of in git
(`flexstad-asana-config.php` staat in `.gitignore`). Is het token ooit zichtbaar geweest,
trek het dan in en maak een nieuw. Het endpoint accepteert alleen POST vanaf de eigen
site, beperkt de grootte en het aantal verzoeken per IP, en een verborgen veld plus een
minimale invultijd houden bots tegen.

## Contactformulier: "U vraagt naar" en Formspree

Een link naar de contactpagina kan zeggen waar de vraag over gaat:
`/contact/?about=de-molen`. De contactpagina toont dan "U vraagt naar: De Molen,
Houten (vanaf €250 p/m)", vult het onderwerp en de eerste zin van het bericht in, en
stuurt de sleutel mee naar Asana en Formspree. Een onbekende sleutel, of geen
sleutel, verandert niets.

- Alles staat in één bestand: `src/enquiryConfig.ts`. De panden komen automatisch
  uit `content.ts` (de sleutel is het laatste stuk van het pandadres, de prijs is
  altijd gelijk aan de prijs op de site). Doelgroepen voeg je daar zelf toe.
- De knoppen "Neem contact op" op de pandpagina's en de doelgroeppagina's sturen de
  sleutel al mee.
- **Formspree** (een e-mailkopie van het contactformulier): zet het adres van je
  formulier in `FORMSPREE_ENDPOINT`, bijvoorbeeld `https://formspree.io/f/abcdwxyz`
  (formspree.io, je formulier, Integration), bouw opnieuw en upload. Formspree
  gebruikt het onderwerp als onderwerp van de e-mail. Leeg laten = alleen Asana.
