// Copyright (c) Meta Platforms, Inc. and affiliates.

import {Theme} from '@astryxdesign/core/theme';
import {flexstadTheme} from './flexstadTheme';
import {AudienceCards} from './sections/AudienceCards';
import {EnquiryForm} from './sections/EnquiryForm';
import {Faq} from './sections/Faq';
import {Hero} from './sections/Hero';
import {ListingGrid} from './sections/ListingGrid';
import {SiteFooter} from './sections/SiteFooter';
import {SiteHeader} from './sections/SiteHeader';

export default function App() {
  return (
    <Theme theme={flexstadTheme} mode="system">
      <SiteHeader />
      <main>
        <Hero />
        <AudienceCards />
        <ListingGrid />
        <Faq />
        <EnquiryForm />
      </main>
      <SiteFooter />
    </Theme>
  );
}
