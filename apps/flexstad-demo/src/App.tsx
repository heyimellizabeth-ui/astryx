// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {lazy, Suspense, useEffect} from 'react';
import {InternationalizationProvider} from '@astryxdesign/core/i18n';
import nlNL from '@astryxdesign/core/locales/nl-NL.generated.js';
import {Theme} from '@astryxdesign/core/theme';
import {flexstadTheme} from './flexstadTheme';
import {initAnalytics, trackPageView} from './analytics';
import {AUDIENCE_PAGES, LISTINGS} from './content';
import {Home} from './pages/Home';
import {NotFound} from './pages/NotFound';
import {RouterProvider, usePath} from './router';
import {ConsentBanner} from './sections/ConsentBanner';
import {SiteFooter} from './sections/SiteFooter';
import {SiteHeader} from './sections/SiteHeader';

// A visitor who accepted analytics on an earlier visit gets the tag again.
initAnalytics();

const styles = stylex.create({
  page: {
    backgroundColor: 'var(--color-background-body)',
    minHeight: '100dvh',
  },
});

// Every route but the home page loads on demand, so `/` ships without the
// forms, the listing gallery and the demo portal.
const Aanbod = lazy(() =>
  import('./pages/Aanbod').then(m => ({default: m.Aanbod})),
);
const Audience = lazy(() =>
  import('./pages/Audience').then(m => ({default: m.Audience})),
);
const ListingDetail = lazy(() =>
  import('./pages/ListingDetail').then(m => ({default: m.ListingDetail})),
);
const OverOns = lazy(() =>
  import('./pages/OverOns').then(m => ({default: m.OverOns})),
);
const VoorWie = lazy(() =>
  import('./pages/VoorWie').then(m => ({default: m.VoorWie})),
);
const Contact = lazy(() =>
  import('./pages/Simple').then(m => ({default: m.Contact})),
);
const Inschrijven = lazy(() =>
  import('./pages/Simple').then(m => ({default: m.Inschrijven})),
);
const Abonneren = lazy(() =>
  import('./pages/Simple').then(m => ({default: m.Abonneren})),
);
const MijnFlexstad = lazy(() =>
  import('./pages/Simple').then(m => ({default: m.MijnFlexstad})),
);
const Vacatures = lazy(() =>
  import('./pages/Simple').then(m => ({default: m.Vacatures})),
);
const Dienst = lazy(() =>
  import('./pages/Simple').then(m => ({default: m.Dienst})),
);
const Privacy = lazy(() =>
  import('./pages/Privacy').then(m => ({default: m.Privacy})),
);
const PortalShell = lazy(() =>
  import('./portal/PortalShell').then(m => ({default: m.PortalShell})),
);

const TITLES: Record<string, string> = {
  '/aanbod/': 'Aanbod',
  '/voor-wie/': 'Voor wie',
  '/over-ons/': 'Over ons',
  '/contact/': 'Contact',
  '/inschrijven/': 'Inschrijven',
  '/abonneren/': 'Aanmelden',
  '/mijnflexstad/': 'MijnFlexstad',
  '/mijnflexstad/overzicht/': 'MijnFlexstad',
  '/vacatures/': 'Vacatures',
  '/privacy/': 'Privacy en cookies',
};

/** The document title for a path: the page's own name, then Flexstad. */
function titleFor(path: string) {
  const [first, second] = path.split('/').filter(Boolean);
  if (!first) {
    return 'Flexstad | Leegstaand vastgoed? Wij activeren, beheren en exploiteren';
  }
  const listing =
    first === 'aanbod' && second
      ? LISTINGS.find(item => item.slug === second)
      : undefined;
  const page =
    listing?.name ??
    AUDIENCE_PAGES[first]?.navTitle ??
    TITLES[path] ??
    'Pagina niet gevonden';
  return `${page} | Flexstad`;
}

const AUDIENCE_SLUGS = new Set([
  'vastgoedeigenaren',
  'ondernemers',
  'gemeenten',
  'ontwikkelaars',
]);

/** Paths mirror flexstad.com. */
function Routes() {
  const path = usePath();
  useEffect(() => {
    document.title = titleFor(path);
    trackPageView(path);
  }, [path]);
  const [first, second] = path.split('/').filter(Boolean);
  if (!first) {
    return <Home />;
  }
  if (first === 'aanbod') {
    return second ? <ListingDetail slug={second} /> : <Aanbod />;
  }
  if (first === 'dienst' && second) {
    return <Dienst slug={second} />;
  }
  if (AUDIENCE_SLUGS.has(first) && !second) {
    return <Audience slug={first} />;
  }
  switch (path) {
    case '/over-ons/':
      return <OverOns />;
    case '/voor-wie/':
      return <VoorWie />;
    case '/contact/':
      return <Contact />;
    case '/inschrijven/':
      return <Inschrijven />;
    case '/abonneren/':
      return <Abonneren />;
    case '/mijnflexstad/':
      return <MijnFlexstad />;
    case '/mijnflexstad/overzicht/':
      return <PortalShell />;
    case '/vacatures/':
      return <Vacatures />;
    case '/privacy/':
      return <Privacy />;
    default:
      return <NotFound />;
  }
}

export default function App() {
  return (
    <InternationalizationProvider locale="nl-NL" messages={{'nl-NL': nlNL}}>
      <Theme theme={flexstadTheme} mode="system">
        <RouterProvider>
          <div {...stylex.props(styles.page)}>
            <a href="#inhoud" className="flex-skip">
              Naar de inhoud
            </a>
            <SiteHeader />
            <main id="inhoud" tabIndex={-1}>
              <Suspense fallback={null}>
                <Routes />
              </Suspense>
            </main>
            <SiteFooter />
            <ConsentBanner />
          </div>
        </RouterProvider>
      </Theme>
    </InternationalizationProvider>
  );
}
