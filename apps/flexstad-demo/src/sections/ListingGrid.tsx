// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {Button} from '@astryxdesign/core/Button';
import {Carousel} from '@astryxdesign/core/Carousel';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Token} from '@astryxdesign/core/Token';
import {LISTINGS, TAGS} from '../content';
import {ListingCard} from './ListingCard';
import {PageSection} from './PageSection';

const styles = stylex.create({
  slide: {width: 300, flexShrink: 0, display: 'flex', alignSelf: 'stretch'},
});

/** Homepage listings as a snap carousel (the full grid lives on /aanbod/). */
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
          <Carousel gap={4} hasButtons hasSnap>
            {LISTINGS.map(listing => (
              <div key={listing.slug} {...stylex.props(styles.slide)}>
                <ListingCard listing={listing} />
              </div>
            ))}
          </Carousel>
        </div>
      </VStack>
    </PageSection>
  );
}
