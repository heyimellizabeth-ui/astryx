// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {InternationalizationProvider} from '@astryxdesign/core/i18n';
import nlNL from '@astryxdesign/core/locales/nl-NL.generated.js';
import {Theme} from '@astryxdesign/core/theme';
import {flexstadTheme} from './flexstadTheme';
import {AudienceCards} from './sections/AudienceCards';
import {EnquiryForm} from './sections/EnquiryForm';
import {Faq} from './sections/Faq';
import {Hero} from './sections/Hero';
import {ListingGrid} from './sections/ListingGrid';
import {SiteFooter} from './sections/SiteFooter';
import {SiteHeader} from './sections/SiteHeader';

const styles = stylex.create({
  page: {
    backgroundColor: 'var(--color-background-body)',
    minHeight: '100vh',
  },
});

export default function App() {
  return (
    <InternationalizationProvider locale="nl-NL" messages={{'nl-NL': nlNL}}>
      <Theme theme={flexstadTheme} mode="system">
        <div {...stylex.props(styles.page)}>
          <SiteHeader />
          <main>
            <Hero />
            <AudienceCards />
            <ListingGrid />
            <Faq />
            <EnquiryForm />
          </main>
          <SiteFooter />
        </div>
      </Theme>
    </InternationalizationProvider>
  );
}
