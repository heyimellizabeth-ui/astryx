// Copyright (c) Meta Platforms, Inc. and affiliates.

import {Button} from '@astryxdesign/core/Button';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {AUDIENCE_PAGES} from '../content';
import {PageSection} from '../sections/PageSection';
import {CtaBand, firstSentence, PageHero, RowsSection} from '../sections/ui';

export function VoorWie() {
  const owners = AUDIENCE_PAGES.vastgoedeigenaren;
  return (
    <>
      <PageHero
        title="Voor wie"
        trail={[{title: 'Home', href: '/'}, {title: 'Voor wie'}]}
      />
      <PageSection>
        <RowsSection
          title={owners.navTitle}
          items={owners.bullets ?? []}
          aside={
            <Button
              label="Bespreek de mogelijkheden"
              href="/vastgoedeigenaren/"
              variant="primary"
              size="lg"
            />
          }
        />
      </PageSection>
      <PageSection isWashed>
        <Grid columns={{minWidth: 300, repeat: 'fit'}} gap={6}>
          {[AUDIENCE_PAGES.gemeenten, AUDIENCE_PAGES.ondernemers].map(page => (
            <ClickableCard
              key={page.slug}
              label={page.navTitle}
              href={`/${page.slug}/`}
              padding={8}>
              <VStack gap={4} align="start">
                <Heading level={2}>{page.navTitle}</Heading>
                <Text color="secondary">{firstSentence(page.intro[0])}</Text>
                <Button
                  label={page.cta.label}
                  href={page.cta.href}
                  variant="secondary"
                  size="lg"
                />
              </VStack>
            </ClickableCard>
          ))}
        </Grid>
      </PageSection>
      <CtaBand />
    </>
  );
}
