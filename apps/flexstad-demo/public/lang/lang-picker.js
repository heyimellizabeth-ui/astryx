/* ============================================================
   lang-picker.js  (version 1.0.0)

   A language picker with two kinds of languages:

   1. REAL pages (for example Dutch at the root and English in /en/).
      These are plain links to the same page in the other language.
      They work without JavaScript when you use the static markup.

   2. MACHINE-translated languages (Google Translate).
      Nothing from Google is loaded until someone picks one of them
      (or has picked one earlier: the googtrans cookie is the proof).

   It also remembers the visitor's choice in localStorage and can
   send a returning visitor from the main-language page to the page
   in the language they chose before.

   No libraries. No inline script needed (safe for a strict CSP).
   Load lang-picker-config.js FIRST, then this file.
   ============================================================ */
(function () {
  'use strict';

  var USER = window.LangPickerConfig;
  if (!USER || !USER.pageLanguages || !USER.pageLanguages.length) return;

  /* ---------------- settings ---------------- */
  var DEFAULTS = {
    basePath: '/',                 // where the site lives on the domain ('/' or '/my-site/')
    machine: ['de', 'fr', 'el', 'es', 'pt', 'it', 'pl', 'tr', 'ja', 'zh-CN', 'ru', 'ar'],
    machineExtra: [],              // extra machine languages: [{code:'ko', name:'한국어', flag:null}]
    mount: { selector: null, position: 'append' },   // where to build the picker if the page has none. null = do not build
    machineCookieDays: 0,          // 0 = the machine-language choice lasts for the visit; 30 = it is kept for 30 days
    remember: true,                // remember the choice in localStorage
    redirectToRemembered: true,    // main-language page -> remembered language
    storageKey: 'lp-lang',
    align: 'right',                // dropdown opens to the 'right' or 'left' edge of the button
    labels: {}                     // per page language: { choose, list, other }
  };
  var CFG = {}, k;
  for (k in DEFAULTS) CFG[k] = DEFAULTS[k];
  for (k in USER) CFG[k] = USER[k];

  var LANGS = CFG.pageLanguages;                 // [{code, name, flag, prefix}]; the first one lives at the root (prefix '')
  var DEFAULT = LANGS[0];
  var base = CFG.basePath;
  if (base.charAt(0) !== '/') base = '/' + base;
  if (base.charAt(base.length - 1) !== '/') base += '/';

  /* ---------------- native names and flags for the machine languages ---------------- */
  var KNOWN = {
    de: ['Deutsch', 'de'], fr: ['Français', 'fr'], el: ['Ελληνικά', 'gr'],
    es: ['Español', 'es'], pt: ['Português', 'pt'], it: ['Italiano', 'it'], pl: ['Polski', 'pl'],
    tr: ['Türkçe', 'tr'], ja: ['日本語', 'jp'], 'zh-CN': ['中文 (简体)', 'cn'],
    ru: ['Русский', 'ru'], ar: ['العربية', 'eg'],
    nl: ['Nederlands', 'nl'], en: ['English', 'gb']
  };

  /* ---------------- flags (32x24) ---------------- */
  var star = function (cx, cy, R, rot) {
    rot = rot === undefined ? -90 : rot;
    var r = R * 0.382, p = [];
    for (var i = 0; i < 10; i++) {
      var a = (rot + i * 36) * Math.PI / 180, d = i % 2 ? r : R;
      p.push((cx + d * Math.cos(a)).toFixed(2) + ',' + (cy + d * Math.sin(a)).toFixed(2));
    }
    return '<polygon points="' + p.join(' ') + '"/>';
  };
  var h3 = function (a, b, c) { return '<rect width="32" height="8" fill="' + a + '"/><rect y="8" width="32" height="8" fill="' + b + '"/><rect y="16" width="32" height="8" fill="' + c + '"/>'; };
  var v3 = function (a, b, c) { return '<rect width="10.67" height="24" fill="' + a + '"/><rect x="10.67" width="10.67" height="24" fill="' + b + '"/><rect x="21.33" width="10.67" height="24" fill="' + c + '"/>'; };
  var greece = function () {
    var s = '<rect width="32" height="24" fill="#0D5EAF"/>';
    for (var i = 1; i < 9; i += 2) s += '<rect y="' + (i * 24 / 9) + '" width="32" height="' + (24 / 9) + '" fill="#fff"/>';
    return s + '<rect width="13.33" height="13.33" fill="#0D5EAF"/><rect x="5.33" width="2.67" height="13.33" fill="#fff"/><rect y="5.33" width="13.33" height="2.67" fill="#fff"/>';
  };
  var FLAGS = {
    nl: h3('#E31D1C', '#F7FCFF', '#3D58DB'),
    de: h3('#000', '#DD0000', '#FFCE00'),
    ru: h3('#fff', '#0039A6', '#D52B1E'),
    eg: h3('#CE1126', '#fff', '#000') + '<circle cx="16" cy="12" r="2.6" fill="#C09300"/>',
    fr: v3('#0055A4', '#fff', '#EF4135'),
    it: v3('#009246', '#fff', '#CE2B37'),
    gb: '<rect width="32" height="24" fill="#012169"/><path d="M0 0L32 24M32 0L0 24" stroke="#fff" stroke-width="4.8"/><path d="M0 0L32 24M32 0L0 24" stroke="#C8102E" stroke-width="1.6"/><path d="M16 0V24M0 12H32" stroke="#fff" stroke-width="8"/><path d="M16 0V24M0 12H32" stroke="#C8102E" stroke-width="4.8"/>',
    gr: greece(),
    es: '<rect width="32" height="24" fill="#AA151B"/><rect y="6" width="32" height="12" fill="#F1BF00"/>',
    pt: '<rect width="32" height="24" fill="#DA291C"/><rect width="12.8" height="24" fill="#046A38"/><circle cx="12.8" cy="12" r="4.2" fill="#FFE000"/><circle cx="12.8" cy="12" r="2.4" fill="#DA291C"/>',
    pl: '<rect width="32" height="24" fill="#fff"/><rect y="12" width="32" height="12" fill="#DC143C"/>',
    tr: '<rect width="32" height="24" fill="#E30A17"/><circle cx="12" cy="12" r="6" fill="#fff"/><circle cx="13.5" cy="12" r="4.8" fill="#E30A17"/><g fill="#fff">' + star(19.6, 12, 2.4, 180) + '</g>',
    jp: '<rect width="32" height="24" fill="#fff"/><circle cx="16" cy="12" r="7.2" fill="#BC002D"/>',
    cn: '<rect width="32" height="24" fill="#EE1C25"/><g fill="#FFFF00">' + star(5.6, 5.6, 3.4) + star(11, 2.4, 1.1, -60) + star(13.2, 4.8, 1.1, -75) + star(13.2, 8, 1.1, -90) + star(11, 10.4, 1.1, -105) + '</g>'
  };
  var flagSVG = function (key) {
    return FLAGS[key] ? '<svg viewBox="0 0 32 24" xmlns="http://www.w3.org/2000/svg">' + FLAGS[key] + '</svg>' : '';
  };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };

  /* ---------------- machine list ---------------- */
  var pageCodes = LANGS.map(function (l) { return l.code; });
  var MACHINE = [];
  CFG.machine.forEach(function (code) {
    if (pageCodes.indexOf(code) !== -1 || !KNOWN[code]) return;      // a real page language is never machine-translated
    MACHINE.push({ code: code, name: KNOWN[code][0], flag: KNOWN[code][1] });
  });
  CFG.machineExtra.forEach(function (m) { if (pageCodes.indexOf(m.code) === -1) MACHINE.push(m); });
  var FLAG_OF = {};
  LANGS.forEach(function (l) { FLAG_OF[l.code] = l.flag || (KNOWN[l.code] || [])[1]; });
  MACHINE.forEach(function (m) { FLAG_OF[m.code] = m.flag; });

  /* ---------------- which language is this page? (by its folder) ---------------- */
  var path = location.pathname;
  var rest = path.indexOf(base) === 0 ? path.slice(base.length) : path.replace(/^\//, '');
  var CURRENT = DEFAULT;
  LANGS.forEach(function (l) {
    if (l.prefix && (rest === l.prefix.replace(/\/$/, '') || rest.indexOf(l.prefix) === 0)) CURRENT = l;
  });
  var pageLang = CURRENT.code;

  function counterpart(lang) {
    var r = path.indexOf(base) === 0 ? path.slice(base.length) : path.replace(/^\//, '');
    if (CURRENT.prefix && r.indexOf(CURRENT.prefix) === 0) r = r.slice(CURRENT.prefix.length);
    else if (CURRENT.prefix && r === CURRENT.prefix.replace(/\/$/, '')) r = '';
    r = r.replace(/index\.html$/, '');
    return base + (lang.prefix || '') + r + location.search + location.hash;
  }

  /* ---------------- texts ---------------- */
  var EN_TEXT = { choose: 'Choose language', list: 'Languages', other: 'Other languages (machine translation)' };
  var T = CFG.labels[pageLang] || CFG.labels.en || EN_TEXT;
  var tx = function (key) { return T[key] || EN_TEXT[key]; };

  /* ---------------- cookie and storage ---------------- */
  function readCookie() {
    var m = document.cookie.match(/(?:^|;\s*)googtrans=\/([^/]+)\/([^;]+)/);
    return m ? { from: m[1], to: decodeURIComponent(m[2]) } : null;
  }
  function writeCookie(val) {
    var host = location.hostname, baseDomain = host.split('.').slice(-2).join('.');
    var days = +CFG.machineCookieDays || 0;
    var exp = val ? (days > 0 ? '; max-age=' + Math.round(days * 86400) : '') : '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    ['', '; domain=' + host, '; domain=.' + baseDomain].forEach(function (d) {
      document.cookie = 'googtrans=' + (val || '') + '; path=/' + d + exp + '; SameSite=Lax';
    });
  }
  function remember(code) { if (CFG.remember) { try { window.localStorage.setItem(CFG.storageKey, code); } catch (e) { /* storage blocked: fine */ } } }
  function saved() { try { return window.localStorage.getItem(CFG.storageKey); } catch (e) { return null; } }

  /* ---------------- build (or find) the picker ---------------- */
  var CHEV = '<svg class="lp-chev" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M14.04 7.04a1 1 0 0 0-1.32-1.497l-.094.083L8 10.253 3.374 5.626a1 1 0 0 0-1.32-.083l-.094.083a1 1 0 0 0-.084 1.32l.084.094 5.333 5.334a1 1 0 0 0 1.32.083l.094-.083L14.04 7.04Z"/></svg>';
  var root = document.querySelector('.lp-root');
  if (!root) {
    if (!CFG.mount || !CFG.mount.selector) return;
    var host = document.querySelector(CFG.mount.selector);
    if (!host) return;
    root = document.createElement('details');
    root.className = 'lp-root notranslate' + (CFG.align === 'left' ? ' lp-left' : '');
    root.setAttribute('translate', 'no');
    root.setAttribute('data-other-label', tx('other'));
    root.innerHTML =
      '<summary class="lp-btn" aria-label="' + esc(tx('choose')) + '"><span class="lp-flag" aria-hidden="true"></span><span class="lp-cur"></span>' + CHEV + '</summary>' +
      '<ul class="lp-list" aria-label="' + esc(tx('list')) + '">' +
      LANGS.map(function (l) {
        return '<li><a class="lp-opt" data-lp-code="' + l.code + '" lang="' + l.code + '" hreflang="' + l.code + '" href="' + esc(counterpart(l)) + '">' +
          '<span class="lp-flag" data-flag="' + (FLAG_OF[l.code] || '') + '" aria-hidden="true"></span><span class="lp-name">' + esc(l.name) + '</span><span class="lp-code">' + l.code + '</span></a></li>';
      }).join('') + '</ul>';
    if (CFG.mount.position === 'prepend') host.insertBefore(root, host.firstChild); else host.appendChild(root);
  }
  var summary = root.querySelector('summary');
  var list = root.querySelector('.lp-list');
  var curFlag = summary.querySelector('.lp-flag');
  var curCode = summary.querySelector('.lp-cur');
  var current = pageLang;

  [].forEach.call(list.querySelectorAll('[data-flag]'), function (el) { el.innerHTML = flagSVG(el.getAttribute('data-flag')); });
  // static markup uses data-code; built markup uses data-lp-code: accept both
  [].forEach.call(list.querySelectorAll('a.lp-opt'), function (a) { if (!a.getAttribute('data-lp-code')) a.setAttribute('data-lp-code', a.getAttribute('data-code') || a.getAttribute('lang')); });

  var group = document.createElement('li');
  group.className = 'lp-group';
  group.setAttribute('role', 'presentation');
  group.textContent = root.getAttribute('data-other-label') || tx('other');
  if (MACHINE.length) list.appendChild(group);
  MACHINE.forEach(function (m) {
    var li = document.createElement('li');
    li.innerHTML = '<button type="button" class="lp-opt" data-lp-code="' + esc(m.code) + '" lang="' + esc(m.code) + '">' +
      '<span class="lp-flag" aria-hidden="true">' + flagSVG(m.flag) + '</span><span class="lp-name">' + esc(m.name) + '</span>' +
      '<span class="lp-code">' + esc(m.code.split('-')[0]) + '</span></button>';
    list.appendChild(li);
  });

  /* ---------------- paint the button and the list ---------------- */
  function paint() {
    curFlag.innerHTML = flagSVG(FLAG_OF[current]);
    curCode.textContent = current.split('-')[0].toUpperCase();
    [].forEach.call(list.querySelectorAll('.lp-opt'), function (o) {
      var code = o.getAttribute('data-lp-code');
      var on = o.tagName === 'A' ? (code === pageLang && current === pageLang) : code === current;
      if (on) o.setAttribute('aria-current', 'true'); else o.removeAttribute('aria-current');
    });
    document.documentElement.dir = current === 'ar' ? 'rtl' : 'ltr';
    root.dir = 'ltr';
  }
  // after a page swap without reload: refresh the links
  function refresh() {
    [].forEach.call(list.querySelectorAll('a.lp-opt'), function (a) {
      var l = LANGS.filter(function (x) { return x.code === a.getAttribute('data-lp-code'); })[0];
      if (l) a.setAttribute('href', counterpart(l));
    });
  }

  /* ---------------- Google Translate (only on demand) ---------------- */
  var loading = false;
  function loadGoogle(done) {
    if (!document.getElementById('lp-gt')) {
      var gt = document.createElement('div');
      gt.id = 'lp-gt';
      document.body.appendChild(gt);
    }
    window.lpGoogleInit = function () {
      new window.google.translate.TranslateElement({
        pageLanguage: pageLang,
        includedLanguages: MACHINE.map(function (m) { return m.code; }).join(','),
        autoDisplay: false
      }, 'lp-gt');
      done();
    };
    if (loading) { if (window.google && window.google.translate && document.querySelector('select.goog-te-combo')) done(); return; }
    loading = true;
    var s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=lpGoogleInit';
    s.async = true;
    document.body.appendChild(s);
  }
  function applyCombo(code) {
    var tries = 0;
    var t = setInterval(function () {
      var combo = document.querySelector('select.goog-te-combo');
      if (combo) { combo.value = code; combo.dispatchEvent(new Event('change')); clearInterval(t); }
      else if (++tries > 60) clearInterval(t);
    }, 100);
  }

  /* ---------------- open / close ---------------- */
  var frame = root.closest(root.getAttribute('data-lift') || '.lp-lift');   // optional: raise a fixed header while open
  function close(refocus) { root.open = false; if (refocus) summary.focus(); }
  root.addEventListener('toggle', function () { if (frame) frame.classList.toggle('lp-open', root.open); });
  document.addEventListener('pointerdown', function (e) { if (root.open && !root.contains(e.target)) close(false); });
  root.addEventListener('keydown', function (e) {
    var items = [].slice.call(list.querySelectorAll('a.lp-opt, button.lp-opt'));
    var i = items.indexOf(document.activeElement);
    if (e.key === 'Escape' && root.open) { e.preventDefault(); close(true); }
    else if (e.key === 'ArrowDown' && root.open) { e.preventDefault(); (items[i + 1] || items[0]).focus(); }
    else if (e.key === 'ArrowUp' && root.open) { e.preventDefault(); (items[i - 1] || items[items.length - 1]).focus(); }
  });

  /* ---------------- choices ---------------- */
  list.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('.lp-opt') : null;
    if (!el) return;
    var code = el.getAttribute('data-lp-code');
    if (el.tagName === 'A') {
      // A real page: go to the same page in that language.
      e.preventDefault();
      remember(code);
      writeCookie(null);
      if (code === pageLang) { close(false); if (current !== pageLang) location.reload(); return; }
      var target = LANGS.filter(function (l) { return l.code === code; })[0];
      location.assign(counterpart(target));
      return;
    }
    // A machine-translated language.
    close(false);
    if (code === current) return;
    current = code;
    paint();
    writeCookie('/' + pageLang + '/' + code);
    loadGoogle(function () { applyCombo(code); });
  });

  /* ---------------- on load ---------------- */
  var c = readCookie();
  if (c && c.from !== pageLang) { writeCookie(null); c = null; }       // a cookie from another language is not ours
  if (c && c.to !== pageLang && FLAG_OF.hasOwnProperty(c.to)) {
    current = c.to;
    loadGoogle(function () { applyCombo(c.to); });                      // they picked it earlier: keep it
  }
  paint();
  window.addEventListener('popstate', refresh);
  document.addEventListener('langpicker:refresh', refresh);
  window.LangPicker = { refresh: refresh, language: pageLang, version: '1.0.0' };

  // A returning visitor who chose another page language lands on it (main-language pages only).
  var want = saved();
  if (CFG.redirectToRemembered && CURRENT === DEFAULT && want && want !== DEFAULT.code && root.getAttribute('data-no-redirect') !== 'true') {
    var t = LANGS.filter(function (l) { return l.code === want; })[0];
    if (t) location.replace(counterpart(t));
  }
})();
