// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {useState} from 'react';
import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {Carousel} from '@astryxdesign/core/Carousel';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack, VStack} from '@astryxdesign/core/Layout';
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
  slide: {
    width: 'min(80vw, 420px)',
    flexShrink: 0,
    cursor: 'zoom-in',
    borderWidth: 0,
    padding: 0,
    backgroundColor: 'transparent',
  },
});

const GALLERY_LABELS = [
  'Voorgevel',
  'Ontvangstruimte',
  'Werkruimte',
  'Tuin',
  'Entree',
  'Pantry',
];

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
          <Grid columns={{minWidth: 300, repeat: 'fit'}} gap={6} align="end">
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
            <HStack gap={3} wrap="wrap" justify="end">
              <Button
                label="Ik heb interesse!"
                href="#reageren"
                variant="primary"
                size="lg"
              />
            </HStack>
          </Grid>
          <Carousel gap={3} hasButtons hasSnap>
            {media.map((item, index) => (
              <button
                key={item.alt}
                type="button"
                aria-label={`Open foto ${index + 1} van ${media.length}`}
                onClick={() => setLightbox(index)}
                {...stylex.props(styles.slide)}>
                <Photo
                  label={`${listing.name}, ${GALLERY_LABELS[index]}`}
                  seed={seed + index}
                  ratio="4 / 3"
                />
              </button>
            ))}
          </Carousel>
          <MetadataList>
            {listing.facts.map(fact => (
              <MetadataListItem key={fact.label} label={fact.label}>
                {fact.value}
              </MetadataListItem>
            ))}
          </MetadataList>
        </VStack>
      </PageSection>

      {detail ? (
        <PageSection isWashed maxWidth={860}>
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
        </PageSection>
      ) : null}

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
