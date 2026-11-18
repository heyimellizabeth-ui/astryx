// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {Button} from '@astryxdesign/core/Button';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Token} from '@astryxdesign/core/Token';
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
        <div data-reveal="block">
          <div
            role="group"
            aria-label="Actueel aanbod"
            {...stylex.props(styles.rail)}>
            {LISTINGS.map(listing => (
              <div key={listing.slug} {...stylex.props(styles.slide)}>
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        </div>
      </VStack>
    </PageSection>
  );
}
