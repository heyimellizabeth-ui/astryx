// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {InternationalizationProvider} from '@astryxdesign/core/i18n';
import nlNL from '@astryxdesign/core/locales/nl-NL.generated.js';
import {Theme} from '@astryxdesign/core/theme';
import {flexstadTheme} from './flexstadTheme';
import {Aanbod} from './pages/Aanbod';
import {Audience} from './pages/Audience';
import {Home} from './pages/Home';
import {ListingDetail} from './pages/ListingDetail';
import {NotFound} from './pages/NotFound';
import {OverOns} from './pages/OverOns';
import {
  Abonneren,
  Contact,
  Dienst,
  Inschrijven,
  MijnFlexstad,
  Vacatures,
} from './pages/Simple';
import {VoorWie} from './pages/VoorWie';
import {RouterProvider, usePath} from './router';
import {SiteFooter} from './sections/SiteFooter';
import {SiteHeader} from './sections/SiteHeader';

const styles = stylex.create({
  page: {
    backgroundColor: 'var(--color-background-body)',
    minHeight: '100dvh',
  },
});

const AUDIENCE_SLUGS = new Set([
  'vastgoedeigenaren',
  'ondernemers',
  'gemeenten',
  'ontwikkelaars',
]);

/** Paths mirror flexstad.com. */
function Routes() {
  const path = usePath();
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
    case '/vacatures/':
      return <Vacatures />;
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
            <SiteHeader />
            <main>
              <Routes />
            </main>
            <SiteFooter />
          </div>
        </RouterProvider>
      </Theme>
    </InternationalizationProvider>
  );
}
