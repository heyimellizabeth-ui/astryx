<?php
// Copy to flexstad-asana-config.php and upload ONE LEVEL ABOVE public_html.
// Never commit the real file and never put it inside public_html.
return [
    // Asana personal access token. Server only; rotate it if it was ever exposed.
    'token' => 'PASTE_TOKEN_HERE',
    'workspace_gid' => '1220338766470567',
    'project_gid' => '1220866335082780', // "Flexstad website – aanvragen"
    'sections' => [
        'interesse' => '1220867772939466',    // Interesse per pand
        'contact' => '1220866334231980',      // Contactverzoeken
        'inschrijving' => '1220866331650207', // Inschrijvingen
        'aanmelding' => '1220869466400434',   // Nieuwsbriefaanmeldingen
        // Create a section "Reparatiemeldingen" in the same project and paste its GID here.
        // Without it, repair tasks still land in the project, just not in a section.
        'reparatie' => 'PASTE_SECTION_GID',
    ],
    // Exact origins (scheme + host) the site is served from.
    'allowed_origins' => ['https://www.example.nl', 'https://example.nl'],
    // true: build the task and return it, but do not call Asana.
    'dry_run' => true,
    // Optional: any random string, salts the hashed IPs of the rate limiter.
    'rate_salt' => 'CHANGE_ME',
];
