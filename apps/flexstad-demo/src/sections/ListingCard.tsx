// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {Badge} from '@astryxdesign/core/Badge';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {Heading} from '@astryxdesign/core/Heading';
import {VStack} from '@astryxdesign/core/Layout';
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList';
import {Text} from '@astryxdesign/core/Text';
import {LISTINGS, STATUSES, type Listing} from '../content';
import {Placeholder} from './Placeholder';

const styles = stylex.create({fill: {flexGrow: 1}});

export function statusLabel(status: Listing['status']) {
  return STATUSES.find(item => item.value === status)?.label ?? '';
}

export function ListingCard({listing}: {listing: Listing}) {
  const seed = LISTINGS.findIndex(item => item.slug === listing.slug);
  return (
    <ClickableCard
      label={`${listing.name}, ${listing.city}`}
      href={`/aanbod/${listing.slug}/`}
      padding={0}
      xstyle={styles.fill}
      elevation="low">
      <VStack gap={0}>
        <AspectRatio ratio={4 / 3}>
          <Placeholder label={listing.name} seed={seed} />
        </AspectRatio>
        <VStack gap={3} padding={4}>
          <VStack gap={2} align="start">
            <Badge
              variant={listing.status === 'available' ? 'success' : 'neutral'}
              label={statusLabel(listing.status)}
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
