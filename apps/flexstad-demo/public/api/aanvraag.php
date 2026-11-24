<?php
// Receives the website forms and turns each into a task in Asana.
// The token lives only in ../../flexstad-asana-config.php (above public_html).

declare(strict_types=1);

const MAX_BODY = 16384;
const RATE_MAX = 5;
const RATE_WINDOW = 600;
const MIN_FILL_MS = 3000;
const LIMITS = ['name' => 120, 'email' => 254, 'phone' => 40, 'text' => 2000];

// kind => [section label, task prefix, field => [label, limit key, required]]
const KINDS = [
    'interesse' => [
        'Interesse',
        [
            'name' => ['Naam', 'name'], 'email' => ['E-mailadres', 'email'],
            'phone' => ['Telefoonnummer', 'phone'], 'use' => ['Type gebruik', 'name'],
            'listing' => ['Pand', 'name'], 'gebruik' => ['Gebruik van het pand', 'name'],
            'budget' => ['Budget', 'name'], 'start' => ['Startdatum', 'name'],
            'end' => ['Einddatum', 'name'], 'notes' => ['Opmerkingen', 'text'],
        ],
    ],
    'contact' => [
        'Contact',
        [
            'name' => ['Naam', 'name'], 'email' => ['E-mailadres', 'email'],
            'subject' => ['Onderwerp', 'name'], 'message' => ['Bericht', 'text'],
        ],
    ],
    'inschrijving' => [
        'Inschrijving',
        [
            'first' => ['Voornaam', 'name'], 'last' => ['Achternaam', 'name'],
            'email' => ['E-mailadres', 'email'], 'phone' => ['Telefoonnummer', 'phone'],
            'start' => ['Gewenste startdatum', 'name'], 'region' => ['Regio', 'name'],
            'seeks' => ['Ik zoek', 'name'], 'budget' => ['Budget', 'name'],
            'who' => ['Ik ben', 'name'], 'persons' => ['Aantal personen', 'name'],
            'company' => ['Bedrijfsnaam', 'name'], 'sector' => ['Branche', 'name'],
            'staff' => ['Aantal medewerkers', 'name'], 'notes' => ['Toelichting', 'text'],
        ],
    ],
    'aanmelding' => [
        'Aanmelding',
        ['email' => ['E-mailadres', 'email']],
    ],
];

function reply(int $status, array $body): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

function fail(int $status, string $message): never
{
    reply($status, ['ok' => false, 'error' => $message]);
}

function clean(mixed $value, int $limit): string
{
    if (!is_string($value)) {
        return '';
    }
    $value = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', '', $value) ?? '');
    return mb_substr($value, 0, $limit);
}

function originAllowed(array $allowed): bool
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '' && !empty($_SERVER['HTTP_REFERER'])) {
        $parts = parse_url((string) $_SERVER['HTTP_REFERER']);
        if (!empty($parts['scheme']) && !empty($parts['host'])) {
            $origin = $parts['scheme'] . '://' . $parts['host'] . (isset($parts['port']) ? ':' . $parts['port'] : '');
        }
    }
    return $origin !== '' && in_array($origin, $allowed, true);
}

function rateLimited(string $salt): bool
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $file = sys_get_temp_dir() . '/flexstad-rl-' . hash('sha256', $salt . '|' . $ip);
    $now = time();
    $times = [];
    if (is_file($file)) {
        $times = array_filter(
            array_map('intval', explode(',', (string) file_get_contents($file))),
            static fn(int $t): bool => $t > $now - RATE_WINDOW
        );
    }
    if (count($times) >= RATE_MAX) {
        return true;
    }
    $times[] = $now;
    file_put_contents($file, implode(',', $times), LOCK_EX);
    return false;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    fail(405, 'Alleen POST is toegestaan.');
}

$configFile = __DIR__ . '/../../flexstad-asana-config.php';
$config = is_file($configFile) ? require $configFile : null;
if (!is_array($config)) {
    fail(503, 'Formulier nog niet gekoppeld.');
}

if (!originAllowed((array) ($config['allowed_origins'] ?? []))) {
    fail(403, 'Niet toegestaan.');
}

$type = strtolower(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]);
if (trim($type) !== 'application/json') {
    fail(415, 'Ongeldig verzoek.');
}
$length = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($length > MAX_BODY) {
    fail(413, 'Het bericht is te groot.');
}
$raw = file_get_contents('php://input', false, null, 0, MAX_BODY + 1);
if ($raw === false || strlen($raw) > MAX_BODY) {
    fail(413, 'Het bericht is te groot.');
}
$input = json_decode($raw, true);
if (!is_array($input)) {
    fail(422, 'Ongeldig verzoek.');
}

$kind = $input['kind'] ?? '';
if (!is_string($kind) || !isset(KINDS[$kind])) {
    fail(422, 'Onbekend formulier.');
}

// Spam traps answer with a fake success so a bot learns nothing.
$fillMs = isset($input['startedAt']) && is_numeric($input['startedAt'])
    ? (int) (microtime(true) * 1000) - (int) $input['startedAt']
    : 0;
if (clean($input['website'] ?? '', 200) !== '' || $fillMs < MIN_FILL_MS) {
    reply(200, ['ok' => true]);
}

if (rateLimited((string) ($config['rate_salt'] ?? $config['token'] ?? 'flexstad'))) {
    fail(429, 'Je hebt te vaak verstuurd. Probeer het over een paar minuten opnieuw.');
}

[$prefix, $spec] = KINDS[$kind];
$fieldsIn = is_array($input['fields'] ?? null) ? $input['fields'] : [];
$fields = [];
foreach ($spec as $key => [$label, $limitKey]) {
    $value = clean($fieldsIn[$key] ?? '', LIMITS[$limitKey]);
    if ($value !== '') {
        $fields[$key] = [$label, $value];
    }
}

$email = $fields['email'][1] ?? '';
if ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    fail(422, 'Vul een geldig e-mailadres in.');
}
if ($kind !== 'interesse' && $email === '') {
    fail(422, 'Vul je e-mailadres in.');
}
if ($kind === 'contact' && !isset($fields['name'], $fields['message'])) {
    fail(422, 'Vul je naam en bericht in.');
}
if ($kind === 'inschrijving' && !isset($fields['first'], $fields['last'])) {
    fail(422, 'Vul je voor- en achternaam in.');
}

$who = match ($kind) {
    'inschrijving' => trim(($fields['first'][1] ?? '') . ' ' . ($fields['last'][1] ?? '')),
    default => $fields['name'][1] ?? '',
};
$who = $who !== '' ? $who : $email;
$name = match ($kind) {
    'interesse' => 'Interesse: ' . ($fields['listing'][1] ?? 'onbekend pand') . ' – ' . ($who !== '' ? $who : 'anoniem'),
    'aanmelding' => 'Aanmelding: ' . $email,
    default => $prefix . ': ' . $who,
};
$name = mb_substr($name, 0, 250);

$page = clean($input['page'] ?? '', 200);
$page = str_starts_with($page, '/') ? $page : '';
$time = (new DateTimeImmutable('now', new DateTimeZone('Europe/Amsterdam')))->format('Y-m-d H:i');

$esc = static fn(string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_XML1, 'UTF-8');
$html = '<body><ul>';
$plain = [];
foreach ($fields as [$label, $value]) {
    $html .= '<li><strong>' . $esc($label) . ':</strong> ' . $esc($value) . '</li>';
    $plain[] = $label . ': ' . $value;
}
if ($page !== '') {
    $html .= '<li><strong>Pagina:</strong> ' . $esc($page) . '</li>';
}
$html .= '<li><strong>Tijd:</strong> ' . $esc($time) . ' (Europe/Amsterdam)</li></ul></body>';

$sectionGid = (string) (($config['sections'] ?? [])[$kind] ?? '');
// Two documented Asana calls: create the task in the project, then move it
// into its form's section. If the move fails the task still exists in the
// project, so no submission is lost.
$task = [
    'name' => $name,
    'html_notes' => $html,
    'projects' => [(string) ($config['project_gid'] ?? '')],
];
if (!empty($config['dry_run'])) {
    reply(200, ['ok' => true, 'dryRun' => true, 'task' => $task, 'section' => $sectionGid]);
}

$generic = 'Versturen lukte niet. Probeer het later opnieuw.';
$token = (string) ($config['token'] ?? '');

/** POSTs JSON to the Asana API; returns [status, decoded body or null]. */
function asanaPost(string $path, array $data, string $token): array
{
    $ch = curl_init('https://app.asana.com/api/1.0' . $path);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode(['data' => $data], JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $token,
            'Content-Type: application/json',
            'Accept: application/json',
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_CONNECTTIMEOUT => 5,
    ]);
    $raw = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
    $body = is_string($raw) ? json_decode($raw, true) : null;
    return [$status, is_array($body) ? $body : null];
}

[$status, $created] = asanaPost('/tasks', $task, $token);
if ($status < 200 || $status >= 300) {
    error_log('flexstad aanvraag: asana status ' . $status . ' kind ' . $kind);
    fail(502, $generic);
}

$taskGid = (string) ($created['data']['gid'] ?? '');
if ($taskGid !== '' && $sectionGid !== '') {
    [$moved] = asanaPost('/sections/' . rawurlencode($sectionGid) . '/addTask', ['task' => $taskGid], $token);
    if ($moved < 200 || $moved >= 300) {
        // The task is saved in the project; only its section is missing.
        error_log('flexstad aanvraag: section move status ' . $moved . ' kind ' . $kind);
    }
}
reply(200, ['ok' => true]);
