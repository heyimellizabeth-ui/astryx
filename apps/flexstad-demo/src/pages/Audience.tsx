// Copyright (c) Meta Platforms, Inc. and affiliates.

import {Text} from '@astryxdesign/core/Text';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {VStack} from '@astryxdesign/core/Layout';
import {AUDIENCE_PAGES} from '../content';
import {PageSection} from '../sections/PageSection';
import {CtaBand, PageHero, Paragraphs, RowsSection} from '../sections/ui';
import {NotFound} from './NotFound';

/** One template for the four audience pages; the copy comes from content.ts. */
export function Audience({slug}: {slug: string}) {
  const page = AUDIENCE_PAGES[slug];
  if (!page) {
    return <NotFound />;
  }
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
      />
      <PageSection>
        <Grid columns={{minWidth: 280, repeat: 'fit'}} gap={8} align="start">
          {page.intro.map(text => (
            <Text key={text} color="secondary">
              {text}
            </Text>
          ))}
        </Grid>
      </PageSection>
      {page.bullets ? (
        <PageSection isWashed>
          <RowsSection title={page.bulletsTitle ?? ''} items={page.bullets} />
        </PageSection>
      ) : null}
      {page.sections ? (
        <PageSection>
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
        <PageSection isWashed>
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
