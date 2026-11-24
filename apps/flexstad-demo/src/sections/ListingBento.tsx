// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {gebruikLine, LISTINGS, TAGS, type Listing} from '../content';
import {LISTING_PHOTOS} from '../photos';
import {bandStyles} from './bandStyles';
import {statusLabel} from './ListingCard';
import {PhotoImage} from './ui';

const WIDE = '@media (min-width: 900px)';

const styles = stylex.create({
  // The aubergine band the hero's block rises out of: the listings are the
  // first thing the page shows after its head.
  band: {
    backgroundColor: 'var(--flex-band)',
    paddingInline: 16,
    paddingTop: 'clamp(40px, 5vw, 72px)',
    paddingBottom: 'clamp(64px, 8vw, 120px)',
  },
  inner: {maxWidth: 1200, marginInline: 'auto'},
  head: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 24,
  },
  // Bento on twelve columns: the lead listing tall on seven, the next two
  // stacked on five. One column on phones, the lead first.
  bento: {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      [WIDE]: 'minmax(0, 7fr) minmax(0, 5fr)',
    },
    gridAutoRows: {default: 'auto', [WIDE]: 'clamp(280px, 24vw, 340px)'},
  },
  lead: {gridRow: {default: 'auto', [WIDE]: 'span 2'}},
  cell: {display: 'flex', minWidth: 0},
  tile: {
    position: 'relative',
    flexGrow: 1,
    overflow: 'hidden',
    borderRadius: 'var(--radius-container)',
    minHeight: {default: 320, [WIDE]: 0},
  },
  tileLead: {minHeight: {default: 440, [WIDE]: 0}},
  // The plate: name and facts on solid aubergine (the overlay rule), at the
  // tile's lower left, inset by the inner radius' padding.
  plate: {
    position: 'absolute',
    insetInlineStart: 12,
    insetInlineEnd: {default: 12, [WIDE]: 'auto'},
    bottom: 12,
    maxWidth: {default: 'none', [WIDE]: 'calc(100% - 24px)'},
    boxSizing: 'border-box',
    padding: 'clamp(16px, 1.6vw, 24px)',
    borderRadius: 'var(--radius-inner)',
    backgroundColor: 'var(--flex-band)',
  },
  name: {
    fontSize: 'clamp(26px, 1.4vw + 16px, 40px)',
    lineHeight: 1.02,
    fontWeight: 700,
    letterSpacing: '-0.03em',
  },
  nameLead: {fontSize: 'clamp(30px, 2.4vw + 16px, 56px)'},
  facts: {display: 'flex', flexWrap: 'wrap', columnGap: 20, rowGap: 4},
});

function factValue(listing: Listing, label: string) {
  return listing.facts.find(fact => fact.label === label)?.value;
}

function Tile({listing, isLead}: {listing: Listing; isLead: boolean}) {
  const photo = LISTING_PHOTOS[listing.slug].cover;
  const price = factValue(listing, 'Prijs');
  const total = factValue(listing, 'Totaal');
  const line = gebruikLine(listing);
  return (
    <ClickableCard
      label={`${listing.name}, ${listing.city}`}
      href={`/aanbod/${listing.slug}/`}
      padding={0}
      variant="transparent"
      className="flex-tile"
      xstyle={[styles.tile, isLead ? styles.tileLead : undefined]}>
      <PhotoImage
        photo={photo}
        isBleed
        isFilled
        sizes={
          isLead
            ? '(min-width: 900px) 700px, 100vw'
            : '(min-width: 900px) 500px, 100vw'
        }
      />
      <div {...stylex.props(styles.plate, bandStyles.onBand)}>
        <VStack gap={2} align="start">
          <Badge
            variant={listing.status === 'available' ? 'success' : 'neutral'}
            label={statusLabel(listing.status)}
          />
          <Heading
            level={3}
            xstyle={[styles.name, isLead ? styles.nameLead : undefined]}>
            {listing.name}
          </Heading>
          <div {...stylex.props(styles.facts)}>
            <Text color="secondary">{listing.city}</Text>
            {price ? <Text color="secondary">{price}</Text> : null}
            {total ? <Text color="secondary">{total}</Text> : null}
          </div>
          {line ? <Text type="supporting">{line}</Text> : null}
        </VStack>
      </div>
    </ClickableCard>
  );
}

/**
 * Homepage listings as a bento on the aubergine band: the available listings,
 * the first as the tall lead, each tile its building's own photograph with
 * the name and facts on a solid plate.
 */
export function ListingBento() {
  const available = LISTINGS.filter(item => item.status === 'available');
  return (
    <section
      aria-label="Actueel aanbod"
      {...stylex.props(styles.band, bandStyles.onBand)}>
      <VStack gap={8} xstyle={styles.inner}>
        <div {...stylex.props(styles.head)}>
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
          <HStack gap={3}>
            <Button
              label="Bekijk alles"
              variant="primary"
              href="/aanbod/"
              size="lg"
            />
          </HStack>
        </div>
        <div {...stylex.props(styles.bento)}>
          {available.map((listing, index) => (
            <div
              key={listing.slug}
              data-reveal=""
              {...stylex.props(styles.cell, index === 0 ? styles.lead : null)}>
              <Tile listing={listing} isLead={index === 0} />
            </div>
          ))}
        </div>
      </VStack>
    </section>
  );
}
