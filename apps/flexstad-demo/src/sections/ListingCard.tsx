// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {Badge} from '@astryxdesign/core/Badge';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {Heading} from '@astryxdesign/core/Heading';
import {VStack} from '@astryxdesign/core/Layout';
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList';
import {Text} from '@astryxdesign/core/Text';
import {LISTINGS, STATUSES, type Listing} from '../content';
import {Placeholder} from './Placeholder';

const styles = stylex.create({
  fill: {flexGrow: 1},
  // Room for three fact rows, so a card with fewer facts is as tall as the rest.
  facts: {minHeight: '5.5rem'},
  media: {aspectRatio: '4 / 3'},
  // A featured card spans two columns at 900px and up; the wider ratio keeps
  // its image the same height as its neighbours.
  mediaFeatured: {
    aspectRatio: {default: '4 / 3', '@media (min-width: 900px)': '2.76 / 1'},
  },
});

export function statusLabel(status: Listing['status']) {
  return STATUSES.find(item => item.value === status)?.label ?? '';
}

export function ListingCard({
  listing,
  isFeatured = false,
}: {
  listing: Listing;
  isFeatured?: boolean;
}) {
  const seed = LISTINGS.findIndex(item => item.slug === listing.slug);
  return (
    <ClickableCard
      label={`${listing.name}, ${listing.city}`}
      href={`/aanbod/${listing.slug}/`}
      padding={0}
      xstyle={styles.fill}
      elevation="low">
      <VStack gap={0}>
        <div
          {...stylex.props(isFeatured ? styles.mediaFeatured : styles.media)}>
          <Placeholder label={listing.name} seed={seed} />
        </div>
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
          <div {...stylex.props(styles.facts)}>
            <MetadataList>
              {listing.facts.map(fact => (
                <MetadataListItem key={fact.label} label={fact.label}>
                  {fact.value}
                </MetadataListItem>
              ))}
            </MetadataList>
          </div>
        </VStack>
      </VStack>
    </ClickableCard>
  );
}
