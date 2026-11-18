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
import {LISTINGS, LISTING_ADDRESS, ROEMER_DETAIL} from '../content';
import {EnquiryForm} from '../sections/EnquiryForm';
import {statusLabel} from '../sections/ListingCard';
import {PageSection} from '../sections/PageSection';
import {placeholderSrc} from '../sections/Placeholder';
import {Photo} from '../sections/ui';
import {BulletList, Crumbs, CtaBand, Paragraphs} from '../sections/ui';
import {NotFound} from './NotFound';

const styles = stylex.create({
  // One large slot and three smaller ones: two tracks from 900px with the
  // small slots stacked beside the large one, a single column on phones.
  gallery: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'minmax(0, 2fr) minmax(0, 1fr)',
    },
    gridTemplateRows: {
      default: 'none',
      '@media (min-width: 900px)': 'repeat(3, minmax(0, 1fr))',
    },
  },
  lead: {
    gridRow: {default: 'auto', '@media (min-width: 900px)': '1 / span 3'},
  },
  shot: {
    display: 'block',
    width: '100%',
    height: '100%',
    cursor: 'zoom-in',
    borderWidth: 0,
    padding: 0,
    backgroundColor: 'transparent',
    // The lightbox button needs a visible ring around the photo frame.
    borderRadius: 'var(--radius-container)',
  },
  // Phones: one column in reading order. Desktop: text left, panel right.
  body: {
    display: 'grid',
    gap: {default: 32, '@media (min-width: 900px)': 48},
    alignItems: 'start',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'minmax(0, 1fr) 360px',
    },
  },
  head: {
    gridColumn: {default: 'auto', '@media (min-width: 900px)': '1'},
    gridRow: {default: 'auto', '@media (min-width: 900px)': '1'},
  },
  text: {
    gridColumn: {default: 'auto', '@media (min-width: 900px)': '1'},
    gridRow: {default: 'auto', '@media (min-width: 900px)': '2'},
    maxWidth: '65ch',
  },
  panel: {
    gridColumn: {default: 'auto', '@media (min-width: 900px)': '2'},
    gridRow: {default: 'auto', '@media (min-width: 900px)': '1 / span 2'},
    padding: 24,
    borderRadius: 'var(--radius-container)',
    backgroundColor: 'var(--color-background-card)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border-emphasized)',
    // Facts and the call to action stay in view while the text scrolls.
    position: {default: 'static', '@media (min-width: 900px)': 'sticky'},
    top: 24,
  },
});

const GALLERY_LABELS = ['Voorgevel', 'Ontvangstruimte', 'Werkruimte', 'Tuin'];

export function ListingDetail({slug}: {slug: string}) {
  const listing = LISTINGS.find(item => item.slug === slug);
  const [lightbox, setLightbox] = useState<number | null>(null);
  if (!listing) {
    return <NotFound />;
  }
  const seed = LISTINGS.indexOf(listing);
  const media = GALLERY_LABELS.map((label, index) => ({
    src: placeholderSrc(`${listing.name}, ${label}`, seed + index),
    alt: `Fotoplaats: ${listing.name}, ${label}`,
  }));
  const detail = slug === 'roemer-visscherstraat' ? ROEMER_DETAIL : null;

  const rest = media.slice(1);

  function shot(index: number) {
    return (
      <button
        key={media[index].alt}
        type="button"
        aria-label={`Open foto ${index + 1} van ${media.length}`}
        onClick={() => setLightbox(index)}
        {...stylex.props(styles.shot, index === 0 ? styles.lead : undefined)}>
        <Photo
          label={GALLERY_LABELS[index]}
          seed={seed + index}
          ratio={index === 0 ? '16 / 10' : '16 / 7'}
          isFilled={index !== 0}
        />
      </button>
    );
  }

  return (
    <>
      <PageSection paddingBlock={8}>
        <VStack gap={6}>
          <Crumbs
            trail={[
              {title: 'Home', href: '/'},
              {title: 'Aanbod', href: '/aanbod/'},
              {title: listing.name},
            ]}
          />
          <div {...stylex.props(styles.gallery)}>
            {shot(0)}
            {rest.map((_, index) => shot(index + 1))}
          </div>
        </VStack>
      </PageSection>

      <PageSection isWashed paddingBlock={8}>
        <div {...stylex.props(styles.body)}>
          <div {...stylex.props(styles.head)}>
            <VStack gap={3} align="start">
              <Badge
                variant={listing.status === 'available' ? 'success' : 'neutral'}
                label={statusLabel(listing.status)}
              />
              <Heading level={1} type="display-2">
                {listing.name}
              </Heading>
              <Text color="secondary">{LISTING_ADDRESS[listing.slug]}</Text>
            </VStack>
          </div>
          <aside {...stylex.props(styles.panel)}>
            <VStack gap={5}>
              <MetadataList>
                {listing.facts.map(fact => (
                  <MetadataListItem key={fact.label} label={fact.label}>
                    {fact.value}
                  </MetadataListItem>
                ))}
              </MetadataList>
              <Button
                label="Ik heb interesse!"
                href="#reageren"
                variant="primary"
                size="lg"
              />
            </VStack>
          </aside>
          {detail ? (
            <div {...stylex.props(styles.text)}>
              <VStack gap={8}>
                <VStack gap={3}>
                  <Heading level={2}>{detail.headline}</Heading>
                  <Text color="secondary">{detail.lead}</Text>
                  <Paragraphs items={detail.intro} />
                </VStack>
                {detail.sections.map(section => (
                  <VStack key={section.title} gap={3}>
                    <Heading level={3}>{section.title}</Heading>
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
              </VStack>
            </div>
          ) : null}
        </div>
      </PageSection>

      <EnquiryForm listingName={listing.name} />
      <CtaBand />
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
