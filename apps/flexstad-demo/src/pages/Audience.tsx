// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {VStack} from '@astryxdesign/core/Layout';
import {AUDIENCE_PAGES} from '../content';
import {PHOTOS, type Photo} from '../photos';
import {ListingGrid} from '../sections/ListingGrid';
import {PageSection} from '../sections/PageSection';
import {
  CtaBand,
  LeadIntro,
  PageHero,
  PhotoImage,
  Paragraphs,
  RowsSection,
} from '../sections/ui';
import {NotFound} from './NotFound';

const styles = stylex.create({
  panel: {
    padding: 40,
    borderRadius: 'var(--radius-container)',
    backgroundColor: 'var(--color-background-muted)',
  },
  // The closing question on the left, its two paragraphs on the right.
  closing: {
    display: 'grid',
    gap: 24,
    alignItems: 'start',
    minHeight: 240,
    padding: 48,
    borderRadius: 'var(--radius-container)',
    backgroundColor: 'var(--color-background-muted)',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'minmax(0, 5fr) minmax(0, 7fr)',
    },
  },
});

// Mood photographs where one passes the deletion test. Municipalities have no
// fitting library photograph: that page stays type-led, with the lead sentence
// set as type on paper.
// Each audience page keeps the photograph flexstad.com gives it.
const PAGE_PHOTOS: Record<string, Photo> = {
  vastgoedeigenaren: PHOTOS.ownersApartmentFacade,
  ondernemers: PHOTOS.makersClothingRail,
  gemeenten: PHOTOS.municipalitiesOfficeFloor,
  ontwikkelaars: PHOTOS.developersDesk,
};

/** One template for the four audience pages; the copy comes from content.ts. */
export function Audience({slug}: {slug: string}) {
  const page = AUDIENCE_PAGES[slug];
  if (!page) {
    return <NotFound />;
  }
  const photo: Photo | undefined = PAGE_PHOTOS[slug];
  return (
    <>
      <PageHero
        title={page.heading}
        trail={[
          {title: 'Home', href: '/'},
          {title: 'Voor wie', href: '/voor-wie/'},
          {title: page.navTitle},
        ]}
        ctas={[
          // The contact link names the audience (?about=), so the contact
          // page opens with it filled in (enquiryConfig.ts).
          page.cta.href === '/contact/'
            ? {...page.cta, href: `/contact/?about=${slug}`}
            : page.cta,
        ]}
        isAsidePhoto={photo !== undefined}
        aside={
          photo ? (
            <PhotoImage
              photo={photo}
              isFilled
              isPriority
              isArch
              sizes="(min-width: 900px) 440px, 340px"
            />
          ) : undefined
        }
      />
      <PageSection>
        <LeadIntro paragraphs={page.intro} />
      </PageSection>
      {slug === 'ondernemers' ? <ListingGrid /> : null}
      {page.sections ? (
        <PageSection>
          <Grid
            columns={{minWidth: 280, repeat: 'fit'}}
            gap={6}
            align="stretch">
            {page.sections.map(section => (
              <div key={section.title} {...stylex.props(styles.panel)}>
                <VStack gap={3}>
                  <Heading level={3}>{section.title}</Heading>
                  <Paragraphs items={section.body} />
                </VStack>
              </div>
            ))}
          </Grid>
        </PageSection>
      ) : null}
      {page.bullets ? (
        <PageSection isWashed>
          <RowsSection title={page.bulletsTitle ?? ''} items={page.bullets} />
        </PageSection>
      ) : null}
      {page.closing ? (
        <PageSection isWashed>
          <div {...stylex.props(styles.closing)}>
            <Heading level={2}>{page.closing.title}</Heading>
            <Paragraphs items={page.closing.body} />
          </div>
        </PageSection>
      ) : null}
      <CtaBand
        cta={{label: 'Neem contact op', href: `/contact/?about=${slug}`}}
      />
    </>
  );
}
