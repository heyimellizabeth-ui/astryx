# CLAUDE.md: Flexstad

## What Flexstad is

Flexstad (flexstad.com) is a Dutch vacancy manager (leegstandsbeheerder). It fills empty buildings with
temporary users and manages them. The site serves four audiences: property owners (vastgoedeigenaren),
entrepreneurs and makers looking for affordable temporary space (ondernemers), municipalities
(gemeenten) and developers (ontwikkelaars). The main action: view the listings and react
("Bekijk ons aanbod", "Ik heb interesse!"). Language: Dutch; visitors are addressed with "u".

## Folders

- `flexstad-site 2/`: the live site. Edit and deploy only this one.
- `_archive/flexstad-site-old-2026-11-24/`: the old build, archived. Do not edit or deploy it.
- Source code: repo `heyimellizabeth-ui/astryx`, app `apps/flexstad-demo` (React, Vite, Astryx).
  Branch `claude/magical-goodall-5g7oju`. Build with `pnpm -F @astryxdesign/flexstad-demo build`; the output is `dist/`.
- Design rules live in one place only: `apps/flexstad-demo/design.md`. Everything useful from the old
  `design-system/` files (colour rules, contrast, dark mode, scales, audit outcome) was merged into it on
  2026-11-26. Use design.md only.

## Key decisions and why

- **Brand from the real logo:** aubergine #421F54, orange #f75027 (the logo file's own #F6522A is the same colour), Geologica only. They are Flexstad's own.
- **Only Flexstad's own photos** (`public/photos/flexstad/`, WebP in 640, 1024 and full sizes). Mood images
  keep "Sfeerimpressie" in their alt text, so a furnished impression is never shown as delivered.
- **Listings come straight after the hero**, because viewing listings is the page's job.
- **Astryx components wherever one exists**, so the site stays consistent and accessible.
- **Forms go to Asana through `public/api/aanvraag.php`**, because a static site cannot keep a token secret.
  - The token lives in `flexstad-asana-config.php`, one folder above `public_html`, never in git.
  - Each task is created in the project, then moved into its section. If the move fails, no submission is lost.
- **`?about=<key>` on links to /contact/** (from the enquiry-context plugin) fills in the subject and the first
  sentence. `src/enquiryConfig.ts` is the one file to edit; listing prices are read from `content.ts`.
- **`gebruik` per listing in `content.ts`** (`werken` | `wonen` | `beide`). Winkelwaard is `werken`, for businesses only.
- **The demo portal (`/mijnflexstad/`) never sends data**, because it is not on Flexstad's own domain.
- **The live flexstad.com uses Gravity Forms 3.2.1 on WordPress/Bricks.** Integrations there hook
  `gform_after_submission`, and must skip entries marked as spam.

## Deploy (Hostinger, hPanel)

1. Build. Put `.htaccess` (the SPA rewrite plus `DirectoryIndex index.html`) next to the build output.
2. Set folders to 755 and files to 644. Zip the **contents**, with no wrapper folder.
3. In hPanel, open Websites, pick the Flexstad site, then open File Manager and go to `public_html`.
4. Upload the zip, then right-click it and choose Extract, keeping the destination `public_html` itself. Overwrite.
5. `public_html` must hold exactly `index.html`, `.htaccess`, `api/`, `assets/` and `photos/`, plus the favicons.
   Delete the zip.
6. Purge the cache in Performance, then CDN. Hard-refresh.
7. Check `/`, `/aanbod/`, a listing, and `/contact/?about=de-molen`. Then POST to `/api/aanvraag.php`:
   before the config exists it answers 503 "Formulier nog niet gekoppeld"; with the config, 200.

- Never use hPanel's "Website migratie" for this. It queues for hours and creates a different site.

## Open to-dos (most important first)

1. **Asana live.** Create a personal access token in the client's Asana, under a dedicated account.
   Create `flexstad-asana-config.php` above `public_html` (copy `asana-config.example.php`). Use production GIDs,
   `dry_run => false`, and `allowed_origins` = the live domain. Then test one form.
2. **Client answers still missing:** the Asana plan and its data processing agreement (DPA); WordPress admin
   and staging access; the list of properties (panden); Google Sheets or Excel; ad channels and budget.
3. **Mail to Asana, quick start:** a Gmail filter forwards the form mails to the Asana project's e-mail address.
4. **Mail to Asana, structured:** a must-use plugin on flexstad.com hooked on `gform_after_submission`.
5. **Repair form** on flexstad.com, built in Gravity Forms: tenants submit, staff pick it up. Photos become
   Asana attachments, and the tenant gets a confirmation.
6. **Room spreadsheet to Asana**, one way: a status change creates a task. Google Apps Script if it is Sheets.
7. **Listing hub:** publish to the portals automatically where they allow it. First research per portal:
   Kamernet, Pararius, Funda (incl. in Business), Huurwoningen, Marktplaats, Meta.
8. **Formspree:** paste the endpoint into `FORMSPREE_ENDPOINT` in `src/enquiryConfig.ts`, rebuild, deploy.
   Blocked on the endpoint ID. When it is on, add Formspree to the privacy page's list of recipients.
9. **Ads:** the cookie banner, Consent Mode v2, GA4 page views and the `generate_lead` conversion are built
   (`src/analytics.ts`, `sections/ConsentBanner.tsx`) and switched off until the GA4 id is pasted into
   `GA_MEASUREMENT_ID`. Still to do: that id, a client review of `/privacy/`, then the Google and Meta campaigns.
10. **Ask the client** whether their own "je" copy should become "u": "Schrijf je nu in!", "Jouw gegevens",
    "jouw onderneming" on /aanbod/.
11. ~~**Redesign `/voor-wie/`**~~ Done: it uses the home page's rows through `sections/AudienceIndexList.tsx`.
12. **Ask Flexstad** for a sharper photo of the Roemer Visscherstraat facade (the current one is 1086px wide).
13. ~~**Merge** heyimellizabeth-ui/astryx#3, then #5.~~ Done 2026-11-26 (merge commits `b8d2dee`, `6eff7cf`).
