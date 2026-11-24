// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {Button} from '@astryxdesign/core/Button';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {LISTINGS, TAGS} from '../content';
import {ListingCard} from './ListingCard';
import {PageSection} from './PageSection';

const styles = stylex.create({
  // Four whole cards side by side from 1100px; below that a snap rail whose
  // next card is cut by the edge. Equal heights come from the grid row.
  rail: {
    display: 'grid',
    gridAutoFlow: 'column',
    gap: 16,
    gridAutoColumns: {
      default: 'minmax(250px, 78%)',
      '@media (min-width: 640px)': 'minmax(260px, 42%)',
      '@media (min-width: 1100px)': 'minmax(0, 1fr)',
    },
    overflowX: {default: 'auto', '@media (min-width: 1100px)': 'visible'},
    scrollSnapType: {
      default: 'x mandatory',
      '@media (min-width: 1100px)': 'none',
    },
    // Room for the hover lift and the card shadow inside the scroller.
    paddingBlock: 8,
    marginBlock: -8,
  },
  slide: {scrollSnapAlign: 'start', display: 'flex'},
});

/** Homepage listings: all four cards in a row, a snap rail on phones. */
export function ListingGrid({isBare = false}: {isBare?: boolean}) {
  const content = (
    <VStack gap={6}>
      <HStack justify="between" align="end" wrap="wrap" gap={4}>
        <VStack gap={3}>
          <Heading level={2}>Actueel aanbod</Heading>
          <Text color="secondary">
            {TAGS.map(
              (tag, index) =>
                (index === 0 ? tag : tag.toLowerCase()) +
                (index < TAGS.length - 1 ? ', ' : '.'),
            )}
          </Text>
        </VStack>
        <Button
          label="Bekijk alles"
          variant="ghost"
          href="/aanbod/"
          size="lg"
        />
      </HStack>
      <div data-reveal="block">
        <div
          role="group"
          aria-label="Actueel aanbod"
          {...stylex.props(styles.rail)}>
          {LISTINGS.map(listing => (
            <div key={listing.slug} {...stylex.props(styles.slide)}>
              <ListingCard listing={listing} isRail />
            </div>
          ))}
        </div>
      </div>
    </VStack>
  );
  // Bare: the caller supplies the section (the home page sets it on a well).
  return isBare ? content : <PageSection>{content}</PageSection>;
}
