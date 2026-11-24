// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {useState} from 'react';
import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {Heading} from '@astryxdesign/core/Heading';
import {VStack} from '@astryxdesign/core/Layout';
import {Lightbox} from '@astryxdesign/core/Lightbox';
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList';
import {Text} from '@astryxdesign/core/Text';
import {
  LISTINGS,
  LISTING_ADDRESS,
  ROEMER_DETAIL,
  listingFeatures,
  listingUses,
  type Listing,
} from '../content';
import {EnquiryForm} from '../sections/EnquiryForm';
import {statusLabel} from '../sections/ListingCard';
import {PageSection} from '../sections/PageSection';
import {RiseHero} from '../sections/RiseHero';
import {LISTING_PHOTOS, srcSetFor} from '../photos';
import {BulletList, Crumbs, CtaBand, Paragraphs} from '../sections/ui';
import {NotFound} from './NotFound';

const styles = stylex.create({
  // The head: the street name, its address and status on the left, the facts
  // as the lead under a hairline, with the one action at the end of the row.
  factsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    columnGap: 48,
    rowGap: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border-emphasized)',
  },
  factValue: {
    fontSize: 'clamp(22px, 14px + 1.1vw, 30px)',
    lineHeight: 1.15,
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  // The building's own photographs: the cover large on the left, four
  // smaller tiles beside it, the last one counting the photographs the
  // Lightbox holds beyond them. Two across on phones.
  gallery: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: {
      default: 'repeat(2, minmax(0, 1fr))',
      '@media (min-width: 900px)': 'repeat(4, minmax(0, 1fr))',
    },
    gridAutoRows: {default: 150, '@media (min-width: 900px)': 220},
  },
  lead: {
    gridColumn: 'span 2',
    gridRow: {default: 'span 1', '@media (min-width: 900px)': 'span 2'},
  },
  tile: {position: 'relative', overflow: 'hidden', minWidth: 0},
  tileImage: {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 'var(--radius-container)',
  },
  // "+8 foto's" sits on a solid aubergine plate (the overlay rule).
  more: {
    position: 'absolute',
    insetInlineEnd: 12,
    bottom: 12,
    paddingBlock: 8,
    paddingInline: 14,
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--flex-band)',
    color: 'var(--flex-on-band)',
    fontWeight: 600,
  },
  shot: {
    display: 'block',
    width: '100%',
    height: '100%',
    minWidth: 0,
    padding: 0,
    borderWidth: 0,
    borderRadius: 'var(--radius-container)',
    backgroundColor: 'transparent',
    color: 'inherit',
    font: 'inherit',
    cursor: 'zoom-in',
    transitionProperty: 'opacity',
    transitionDuration: '0.15s',
    opacity: {default: 1, ':hover': 0.85, ':active': 0.75},
    outlineStyle: {default: 'none', ':focus-visible': 'solid'},
    outlineWidth: 'var(--focus-outline-width)',
    outlineColor: 'var(--focus-outline-color)',
    outlineOffset: 'var(--focus-outline-offset)',
  },
  // Roemer Visscherstraat: the text at a reading measure on the left, the
  // facts and the action held in view on the right from 900px.
  body: {
    display: 'grid',
    gap: {default: 40, '@media (min-width: 900px)': 64},
    alignItems: 'start',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'minmax(0, 1fr) 320px',
    },
    marginBottom: 40,
  },
  text: {maxWidth: '65ch'},
  headline: {maxWidth: '22em'},
  lede: {
    fontSize: 20,
    lineHeight: 1.5,
    maxWidth: '40em',
  },
  // At least twice the space above each section head as under it.
  part: {paddingTop: 48},
  // Sub-heads in the long Roemer Visscherstraat text, a clear step above it.
  subhead: {fontSize: 24, lineHeight: 1.2},
  panel: {
    padding: 24,
    boxSizing: 'border-box',
    borderRadius: 'var(--radius-container)',
    backgroundColor: 'var(--color-background-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    position: {default: 'static', '@media (min-width: 900px)': 'sticky'},
    top: 24,
  },
  // Under "Reageren": what the visitor reacts to, as a framed recap.
  recap: {
    padding: 24,
    boxSizing: 'border-box',
    borderRadius: 'var(--radius-container)',
    backgroundColor: 'var(--color-background-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
  },
  recapName: {
    fontSize: 'clamp(22px, 1vw + 14px, 28px)',
    lineHeight: 1.15,
    fontWeight: 700,
  },
});

/** Tiles the mosaic shows; the rest open from the last tile in the Lightbox. */
const MOSAIC_COUNT = 5;

function Facts({
  listing,
  isLarge = false,
}: {
  listing: Listing;
  isLarge?: boolean;
}) {
  return (
    <MetadataList
      orientation={isLarge ? 'horizontal' : 'vertical'}
      label={isLarge ? undefined : {position: 'start'}}>
      {listing.facts.map(fact => (
        <MetadataListItem key={fact.label} label={fact.label}>
          {isLarge ? (
            <Text xstyle={styles.factValue}>{fact.value}</Text>
          ) : (
            fact.value
          )}
        </MetadataListItem>
      ))}
    </MetadataList>
  );
}

function Features({listing}: {listing: Listing}) {
  const features = listingFeatures(listing);
  if (features.length === 0) {
    return null;
  }
  return (
    <VStack gap={1}>
      {features.map(line => (
        <Text key={line} as="p" color="secondary">
          {line}
        </Text>
      ))}
    </VStack>
  );
}

function StatusBadge({listing}: {listing: Listing}) {
  return (
    <Badge
      variant={listing.status === 'available' ? 'success' : 'neutral'}
      label={statusLabel(listing.status)}
    />
  );
}

export function ListingDetail({slug}: {slug: string}) {
  const listing = LISTINGS.find(item => item.slug === slug);
  const [lightbox, setLightbox] = useState<number | null>(null);
  if (!listing) {
    return <NotFound />;
  }
  const address = LISTING_ADDRESS[listing.slug];
  const photos = LISTING_PHOTOS[listing.slug]?.gallery ?? [];
  const cover = LISTING_PHOTOS[listing.slug]?.cover;
  const media = photos.map(photo => ({src: photo.src, alt: photo.alt}));
  // The cover carries the hero; the mosaic starts at the next photograph and
  // the Lightbox still holds them all, the cover first.
  const shown = photos
    .slice(1, MOSAIC_COUNT + 1)
    .map((photo, offset) => ({photo, index: offset + 1}));
  const extra = photos.length - 1 - shown.length;
  const detail = slug === 'roemer-visscherstraat' ? ROEMER_DETAIL : null;

  const gallery =
    shown.length > 0 ? (
      <PageSection isBand paddingBlock={8}>
        <div {...stylex.props(styles.gallery)}>
          {shown.map(({photo, index}) => (
            <button
              key={photo.src}
              type="button"
              aria-label={`Open foto ${index + 1} van ${media.length}: ${photo.alt}`}
              onClick={() => setLightbox(index)}
              {...stylex.props(
                styles.shot,
                styles.tile,
                index === 1 ? styles.lead : undefined,
              )}>
              <img
                src={photo.src}
                srcSet={srcSetFor(photo)}
                sizes={
                  index === 1
                    ? '(min-width: 900px) 600px, 100vw'
                    : '(min-width: 900px) 300px, 50vw'
                }
                width={photo.width}
                height={photo.height}
                alt=""
                loading="lazy"
                decoding="async"
                {...stylex.props(styles.tileImage)}
                style={{objectPosition: photo.objectPosition}}
              />
              {index === shown.length && extra > 0 ? (
                <span {...stylex.props(styles.more)}>+{extra} foto&apos;s</span>
              ) : null}
            </button>
          ))}
        </div>
      </PageSection>
    ) : null;

  return (
    <>
      <RiseHero photo={cover ?? photos[0]} label={listing.name}>
        <VStack gap={6}>
          <VStack gap={5}>
            <Crumbs
              trail={[
                {title: 'Home', href: '/'},
                {title: 'Aanbod', href: '/aanbod/'},
                {title: listing.name},
              ]}
            />
            <VStack gap={3} align="start">
              <StatusBadge listing={listing} />
              <Heading level={1} type="display-2">
                {listing.name}
              </Heading>
              <Text type="large" color="secondary">
                {address}
              </Text>
            </VStack>
          </VStack>
          <div {...stylex.props(styles.factsRow)}>
            <VStack gap={3}>
              <Facts listing={listing} isLarge />
              <Features listing={listing} />
            </VStack>
            <Button
              label="Ik heb interesse!"
              href="#reageren"
              variant="primary"
              size="lg"
            />
          </div>
        </VStack>
      </RiseHero>

      {gallery}

      {detail ? (
        <PageSection paddingBlock={10}>
          <div {...stylex.props(styles.body)}>
            <article {...stylex.props(styles.text)}>
              <VStack gap={5}>
                <Heading level={2} xstyle={styles.headline}>
                  {detail.headline}
                </Heading>
                <Text as="p" xstyle={styles.lede}>
                  {detail.lead}
                </Text>
                <Paragraphs items={detail.intro} />
              </VStack>
              {detail.sections.map(section => (
                <VStack key={section.title} gap={3} xstyle={styles.part}>
                  <Heading level={3} xstyle={styles.subhead}>
                    {section.title}
                  </Heading>
                  <Paragraphs items={section.body} />
                  {'list' in section && section.list ? (
                    <VStack gap={2}>
                      {section.listTitle ? (
                        <Text weight="medium">{section.listTitle}</Text>
                      ) : null}
                      <BulletList items={section.list} />
                    </VStack>
                  ) : null}
                  {'after' in section && section.after ? (
                    <Paragraphs items={[section.after]} />
                  ) : null}
                </VStack>
              ))}
            </article>
            <aside {...stylex.props(styles.panel)}>
              <VStack gap={5}>
                <VStack gap={1}>
                  <Text weight="bold">{listing.name}</Text>
                  <Text type="supporting">{address}</Text>
                </VStack>
                <Facts listing={listing} />
                <Button
                  label="Ik heb interesse!"
                  href="#reageren"
                  variant="primary"
                  size="lg"
                />
              </VStack>
            </aside>
          </div>
        </PageSection>
      ) : null}

      <EnquiryForm
        listingName={listing.name}
        uses={listingUses(listing)}
        aside={
          <div {...stylex.props(styles.recap)}>
            <VStack gap={4} align="start">
              <StatusBadge listing={listing} />
              <VStack gap={1}>
                <Text xstyle={styles.recapName}>{listing.name}</Text>
                <Text color="secondary">{address}</Text>
              </VStack>
              {detail ? null : (
                <>
                  <Facts listing={listing} />
                  <Features listing={listing} />
                </>
              )}
            </VStack>
          </div>
        }
      />
      <CtaBand
        cta={{
          label: 'Neem contact op',
          href: `/contact/?about=${listing.slug}`,
        }}
      />
      <Lightbox
        isOpen={lightbox !== null}
        onOpenChange={open => setLightbox(open ? (lightbox ?? 0) : null)}
        media={media}
        index={lightbox ?? 0}
        onIndexChange={setLightbox}
      />
    </>
  );
}
