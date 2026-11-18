// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {VStack} from '@astryxdesign/core/Layout';
import {AUDIENCE_PAGES} from '../content';
import {PageSection} from '../sections/PageSection';
import {BulletList, CtaBand, PageHero, Paragraphs} from '../sections/ui';
import {NotFound} from './NotFound';

const styles = stylex.create({
  panel: {
    padding: 24,
    borderRadius: 'var(--radius-container)',
    backgroundColor: 'var(--color-background-muted)',
  },
});

/** One template for the four audience pages; the copy comes from content.ts. */
export function Audience({slug}: {slug: string}) {
  const page = AUDIENCE_PAGES[slug];
  if (!page) {
    return <NotFound />;
  }
  const seed = Object.keys(AUDIENCE_PAGES).indexOf(slug);
  return (
    <>
      <PageHero
        title={page.heading}
        trail={[
          {title: 'Home', href: '/'},
          {title: 'Voor wie', href: '/voor-wie/'},
          {title: page.navTitle},
        ]}
        ctas={[page.cta]}
        photoLabel={page.navTitle}
        seed={seed + 1}
      />
      <PageSection>
        <Grid columns={{minWidth: 300, repeat: 'fit'}} gap={8} align="start">
          <Paragraphs items={page.intro} />
          {page.bullets ? (
            <div {...stylex.props(styles.panel)}>
              <VStack gap={4}>
                <Heading level={3}>{page.bulletsTitle}</Heading>
                <BulletList items={page.bullets} />
              </VStack>
            </div>
          ) : null}
        </Grid>
      </PageSection>
      {page.sections ? (
        <PageSection isWashed>
          <Grid columns={{minWidth: 300, repeat: 'fit'}} gap={8} align="start">
            {page.sections.map(section => (
              <VStack key={section.title} gap={3}>
                <Heading level={3}>{section.title}</Heading>
                <Paragraphs items={section.body} />
              </VStack>
            ))}
          </Grid>
        </PageSection>
      ) : null}
      {page.closing ? (
        <PageSection>
          <VStack gap={3}>
            <Heading level={3}>{page.closing.title}</Heading>
            <Paragraphs items={page.closing.body} />
          </VStack>
        </PageSection>
      ) : null}
      <CtaBand />
    </>
  );
}
