// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {Badge} from '@astryxdesign/core/Badge';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {Heading} from '@astryxdesign/core/Heading';
import {VStack} from '@astryxdesign/core/Layout';
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList';
import {Text} from '@astryxdesign/core/Text';
import {listingFeatures, STATUSES, type Listing} from '../content';
import {LISTING_PHOTOS, srcSetFor} from '../photos';

const styles = stylex.create({
  // The card is a column, so the body grows and the Bekijk row sits at the
  // foot of every card in a row, whatever lines sit above it.
  fill: {flexGrow: 1, display: 'flex', flexDirection: 'column'},
  // Flat on the well: a hairline frame, no shadow. Hover darkens the frame
  // to ink and lifts the card (the theme's lift).
  frame: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: {
      default: 'var(--color-border)',
      ':hover': 'var(--color-text-primary)',
    },
    boxShadow: 'none',
    transitionProperty: 'border-color, transform',
    transitionDuration: '0.3s',
  },
  body: {flexGrow: 1, boxSizing: 'border-box'},
  // The street name carries the card: set large, two lines of room so a long
  // name and a short one leave the facts on the same line across the row.
  name: {
    fontSize: 'clamp(26px, 1.2vw + 16px, 34px)',
    lineHeight: 1.04,
    fontWeight: 700,
    letterSpacing: '-0.03em',
  },
  nameRoom: {minHeight: '2.24em'},
  // The card foot: a hairline and the word that says the card opens.
  foot: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border)',
  },
  cue: {color: 'var(--color-text-accent)'},
  clip: {overflow: 'hidden'},
  cover: {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transitionProperty: 'transform',
    transitionDuration: '0.6s',
    transitionTimingFunction: 'var(--flex-ease)',
  },
  // The photograph zooms a little when the card is hovered (index.css keys
  // the hover on the card), never under reduced motion.
  coverWrap: {overflow: 'hidden'},
});

export function statusLabel(status: Listing['status']) {
  return STATUSES.find(item => item.value === status)?.label ?? '';
}

/**
 * A listing card: the building's own photograph on top, then the street name
 * as the largest text, the city, the status, the facts and the feature lines.
 */
export function ListingCard({
  listing,
  isRail = false,
}: {
  listing: Listing;
  /** Reserve two name lines so a row of cards lines up (the four-up row). */
  isRail?: boolean;
}) {
  const photo = LISTING_PHOTOS[listing.slug].cover;
  const features = listingFeatures(listing);
  const coverProps = stylex.props(styles.cover);
  return (
    <ClickableCard
      label={`${listing.name}, ${listing.city}`}
      href={`/aanbod/${listing.slug}/`}
      padding={0}
      xstyle={[styles.fill, styles.frame, styles.clip]}>
      <AspectRatio ratio={4 / 3} xstyle={styles.coverWrap}>
        <img
          src={photo.src}
          srcSet={srcSetFor(photo)}
          sizes="(min-width: 1100px) 300px, (min-width: 640px) 42vw, 78vw"
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          className={`flex-cover ${coverProps.className ?? ''}`}
          style={{objectPosition: photo.objectPosition}}
        />
      </AspectRatio>
      <VStack gap={5} padding={5} justify="between" xstyle={styles.body}>
        <VStack gap={3} align="start">
          <Badge
            variant={listing.status === 'available' ? 'success' : 'neutral'}
            label={statusLabel(listing.status)}
          />
          <VStack gap={1}>
            <Heading
              level={3}
              xstyle={[styles.name, isRail ? styles.nameRoom : undefined]}>
              {listing.name}
            </Heading>
            <Text color="secondary">{listing.city}</Text>
          </VStack>
        </VStack>
        <VStack gap={4}>
          <MetadataList>
            {listing.facts.map(fact => (
              <MetadataListItem key={fact.label} label={fact.label}>
                {fact.value}
              </MetadataListItem>
            ))}
          </MetadataList>
          {features.length > 0 ? (
            <VStack gap={1}>
              {features.map(line => (
                <Text key={line} as="p" type="supporting" color="secondary">
                  {line}
                </Text>
              ))}
            </VStack>
          ) : null}
          <div {...stylex.props(styles.foot)}>
            <Text weight="medium" xstyle={styles.cue}>
              Bekijk
            </Text>
          </div>
        </VStack>
      </VStack>
    </ClickableCard>
  );
}
