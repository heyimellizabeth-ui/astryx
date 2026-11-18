// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {ABOUT, AUDIENCES} from '../content';
import {bandStyles} from '../sections/bandStyles';
import {Faq} from '../sections/Faq';
import {ListingGrid} from '../sections/ListingGrid';
import {PageSection} from '../sections/PageSection';
import {BulletList, CtaBand, PageHero, Photo} from '../sections/ui';

const styles = stylex.create({
  bento: {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: {
      default: '1fr',
      '@media (min-width: 768px)': 'repeat(6, 1fr)',
    },
  },
  wide: {
    gridColumn: {default: 'auto', '@media (min-width: 768px)': 'span 4'},
  },
  narrow: {
    gridColumn: {default: 'auto', '@media (min-width: 768px)': 'span 2'},
  },
  cell: {display: 'flex'},
  card: {flexGrow: 1, minHeight: 140},
  tileAccent: {backgroundColor: 'var(--color-accent)'},
  tileBand: {backgroundColor: 'var(--flex-band)'},
  tileMuted: {backgroundColor: 'var(--color-background-muted)'},
  stat: {
    fontSize: 'clamp(3.5rem, 9vw, 6rem)',
    fontWeight: 700,
    lineHeight: 1,
    color: 'var(--color-text-accent)',
  },
});

const TILES = [
  {span: styles.wide, tone: styles.tileAccent, withPhoto: true, onBand: false},
  {
    span: styles.narrow,
    tone: styles.tileMuted,
    withPhoto: false,
    onBand: false,
  },
  {span: styles.narrow, tone: styles.tileBand, withPhoto: false, onBand: true},
  {span: styles.wide, tone: styles.tileMuted, withPhoto: true, onBand: false},
];

export function Home() {
  return (
    <>
      <PageHero
        isHome
        title="Leegstaand vastgoed? Wij activeren, beheren en exploiteren"
        ctas={[
          {label: 'Bekijk ons aanbod', href: '/aanbod/'},
          {label: 'Ontdek onze mogelijkheden', href: '#intro'},
        ]}
        photoLabel="Een pand dat weer in gebruik is"
      />

      <PageSection id="intro" paddingBlock={10}>
        <Grid columns={{minWidth: 280, repeat: 'fit'}} gap={8} align="center">
          <VStack gap={4}>
            <Heading level={2} type="display-3">
              {ABOUT.heading}
            </Heading>
            <Text color="secondary">{ABOUT.story[2]}</Text>
          </VStack>
          <VStack gap={2}>
            <span {...stylex.props(styles.stat)}>2.000+</span>
            <Text color="secondary">
              bewoners en ondernemers geplaatst in leegstaande panden
            </Text>
          </VStack>
        </Grid>
      </PageSection>

      <PageSection isWashed>
        <VStack gap={6}>
          <Heading level={2}>Voor wie</Heading>
          <div {...stylex.props(styles.bento)}>
            {AUDIENCES.map((audience, index) => {
              const tile = TILES[index];
              return (
                <div
                  key={audience.href}
                  {...stylex.props(tile.span, styles.cell)}>
                  <ClickableCard
                    label={audience.title}
                    href={audience.href}
                    padding={0}
                    xstyle={[tile.tone, styles.card]}>
                    <VStack
                      gap={0}
                      xstyle={tile.onBand ? bandStyles.onBand : undefined}>
                      {tile.withPhoto ? (
                        <Photo
                          label={audience.title}
                          seed={index + 2}
                          ratio="16 / 7"
                        />
                      ) : null}
                      <VStack gap={2} padding={5}>
                        <Heading level={3}>{audience.title}</Heading>
                      </VStack>
                    </VStack>
                  </ClickableCard>
                </div>
              );
            })}
          </div>
        </VStack>
      </PageSection>

      <ListingGrid />

      <PageSection>
        <Grid columns={{minWidth: 280, repeat: 'fit'}} gap={8} align="start">
          <Heading level={2}>{ABOUT.reasonsTitle}</Heading>
          <Grid columns={{minWidth: 220, repeat: 'fit'}} gap={6}>
            <BulletList items={ABOUT.reasons.slice(0, 3)} />
            <BulletList items={ABOUT.reasons.slice(3)} />
          </Grid>
        </Grid>
      </PageSection>

      <Faq />
      <CtaBand />
    </>
  );
}
