// Copyright (c) Meta Platforms, Inc. and affiliates.

import {Button} from '@astryxdesign/core/Button';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {VStack} from '@astryxdesign/core/Layout';
import {AUDIENCE_PAGES} from '../content';
import {PageSection} from '../sections/PageSection';
import {BulletList, CtaBand, PageHero} from '../sections/ui';

export function VoorWie() {
  const owners = AUDIENCE_PAGES.vastgoedeigenaren;
  return (
    <>
      <PageHero
        title="Voor wie"
        trail={[{title: 'Home', href: '/'}, {title: 'Voor wie'}]}
      />
      <PageSection>
        <Grid columns={{minWidth: 300, repeat: 'fit'}} gap={8} align="start">
          <VStack gap={4} align="start">
            <Heading level={2}>{owners.navTitle}</Heading>
            <Button
              label="Bespreek de mogelijkheden"
              href="/vastgoedeigenaren/"
              variant="primary"
            />
          </VStack>
          <BulletList items={owners.bullets ?? []} />
        </Grid>
      </PageSection>
      <PageSection isWashed>
        <Grid columns={{minWidth: 300, repeat: 'fit'}} gap={4}>
          {[AUDIENCE_PAGES.gemeenten, AUDIENCE_PAGES.ondernemers].map(page => (
            <ClickableCard
              key={page.slug}
              label={page.navTitle}
              href={`/${page.slug}/`}
              padding={5}>
              <VStack gap={3} align="start">
                <Heading level={3}>{page.navTitle}</Heading>
                <Button
                  label={page.cta.label}
                  href={page.cta.href}
                  variant="secondary"
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
