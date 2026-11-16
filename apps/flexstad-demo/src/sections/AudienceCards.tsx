// Copyright (c) Meta Platforms, Inc. and affiliates.

import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/Layout';
import {AUDIENCES} from '../content';
import {PageSection} from './PageSection';

export function AudienceCards() {
  return (
    <PageSection id="intro" variant="muted">
      <VStack gap={6}>
        <Heading level={2}>Ontdek kansen met Flexstad</Heading>
        <Grid columns={{minWidth: 240, repeat: 'fill'}} gap={4}>
          {AUDIENCES.map((audience, index) => (
            <ClickableCard
              key={audience.href}
              label={audience.title}
              href={audience.href}
              padding={5}
              elevation="low"
              variant={index % 2 === 0 ? 'default' : 'orange'}>
              <VStack gap={2} justify="between">
                <Text type="label" color="secondary">
                  0{index + 1}
                </Text>
                <Heading level={3}>{audience.title}</Heading>
              </VStack>
            </ClickableCard>
          ))}
        </Grid>
      </VStack>
    </PageSection>
  );
}
