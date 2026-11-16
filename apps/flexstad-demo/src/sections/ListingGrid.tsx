// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList';
import {Text} from '@astryxdesign/core/Text';
import {Token} from '@astryxdesign/core/Token';
import {LISTINGS, TAGS, type Listing} from '../content';
import {PageSection} from './PageSection';

const styles = stylex.create({
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundImage:
      'linear-gradient(135deg, var(--color-accent), var(--color-background-muted))',
  },
});

function ListingCard({listing}: {listing: Listing}) {
  const isAvailable = listing.status === 'available';
  return (
    <ClickableCard
      label={`${listing.name}, ${listing.city}`}
      href={`/aanbod/${listing.slug}/`}
      padding={0}
      elevation="low">
      <VStack gap={0}>
        <AspectRatio ratio={4 / 3}>
          <div {...stylex.props(styles.imagePlaceholder)} />
        </AspectRatio>
        <VStack gap={3} padding={4}>
          <VStack gap={2} align="start">
            <Badge
              variant={isAvailable ? 'success' : 'neutral'}
              label={isAvailable ? 'Beschikbaar' : 'Niet beschikbaar'}
            />
            <VStack gap={0.5}>
              <Heading level={3}>{listing.name}</Heading>
              <Text type="supporting" color="secondary">
                {listing.city}
              </Text>
            </VStack>
          </VStack>
          <MetadataList>
            {listing.facts.map(fact => (
              <MetadataListItem key={fact.label} label={fact.label}>
                {fact.value}
              </MetadataListItem>
            ))}
          </MetadataList>
        </VStack>
      </VStack>
    </ClickableCard>
  );
}

export function ListingGrid() {
  return (
    <PageSection>
      <VStack gap={6}>
        <HStack justify="between" align="end" wrap="wrap" gap={4}>
          <VStack gap={3}>
            <Heading level={2}>Actueel aanbod</Heading>
            <HStack gap={2} wrap="wrap">
              {TAGS.map(tag => (
                <Token key={tag} label={tag} />
              ))}
            </HStack>
          </VStack>
          <Button label="Bekijk alles" variant="ghost" href="/aanbod/" />
        </HStack>
        <Grid columns={{minWidth: 260, repeat: 'fill'}} gap={4}>
          {LISTINGS.map(listing => (
            <ListingCard key={listing.slug} listing={listing} />
          ))}
        </Grid>
      </VStack>
    </PageSection>
  );
}
