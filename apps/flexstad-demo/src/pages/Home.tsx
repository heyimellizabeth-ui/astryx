// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {Button} from '@astryxdesign/core/Button';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {ABOUT, AUDIENCES, AUDIENCE_PAGES} from '../content';
import {bandStyles} from '../sections/bandStyles';
import {Faq} from '../sections/Faq';
import {ListingGrid} from '../sections/ListingGrid';
import {PageSection} from '../sections/PageSection';
import {
  CtaBand,
  firstSentence,
  Photo,
  Reveal,
  RowsSection,
} from '../sections/ui';

const styles = stylex.create({
  // Banner hero (about half the screen): the client's headline set at the
  // display size across the whole content column, then the two actions.
  hero: {backgroundColor: 'var(--color-background-body)'},
  heroInner: {
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    width: 'min(100% - 32px, 1200px)',
    minHeight: 'clamp(280px, 34dvh, 360px)',
    marginInline: 'auto',
    paddingBlock: 'clamp(24px, 3dvh, 40px)',
  },
  // The statement and the 2.000+ figure share one row, so the whole figure
  // sits on the first screen; the reasons follow as rows below it.
  intro: {
    display: 'grid',
    columnGap: 48,
    rowGap: 16,
    alignItems: 'start',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'minmax(0, 7fr) minmax(0, 5fr)',
    },
    gridTemplateAreas: {
      default: '"head" "stat" "story"',
      '@media (min-width: 900px)': '"head stat" "story stat"',
    },
  },
  introHead: {gridArea: 'head'},
  introStat: {gridArea: 'stat'},
  introStory: {gridArea: 'story', maxWidth: '65ch'},
  stat: {
    display: 'block',
    fontSize: 'clamp(4rem, 8.5vw, 7.5rem)',
    fontWeight: 700,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    color: 'var(--color-text-accent)',
    overflowWrap: 'break-word',
  },
  bento: {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 768px)': 'repeat(6, minmax(0, 1fr))',
    },
  },
  wide: {
    gridColumn: {default: 'auto', '@media (min-width: 768px)': 'span 4'},
  },
  narrow: {
    gridColumn: {default: 'auto', '@media (min-width: 768px)': 'span 2'},
  },
  cell: {display: 'flex'},
  card: {flexGrow: 1},
  tileAccent: {backgroundColor: 'var(--color-accent)'},
  // Text on the orange tile uses the on-accent colour in both colour modes.
  onAccent: {
    '--color-text-primary': 'var(--color-on-accent)',
    color: 'var(--color-on-accent)',
  },
  tileBand: {backgroundColor: 'var(--flex-band)'},
  tileMuted: {backgroundColor: 'var(--color-background-muted)'},
  // A wide tile: slot beside the words on desktop, above them on phones.
  tileSplit: {
    display: 'grid',
    height: '100%',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'minmax(0, 1fr) minmax(0, 1fr)',
    },
  },
  tileSlot: {minHeight: {default: 180, '@media (min-width: 900px)': 280}},
  tileBody: {
    height: '100%',
    boxSizing: 'border-box',
    padding: 28,
  },
});

// Two tiles carry a labelled photo slot, two carry the audience page's own
// first sentence on a plain surface; none is a title in an empty box.
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

const AUDIENCE_SLUGS = [
  'vastgoedeigenaren',
  'ondernemers',
  'gemeenten',
  'ontwikkelaars',
];

export function Home() {
  return (
    <>
      <section {...stylex.props(styles.hero)}>
        <div {...stylex.props(styles.heroInner)}>
          <Reveal>
            <VStack gap={5} align="start">
              <Heading level={1} type="display-1">
                Leegstaand vastgoed? Wij activeren, beheren en exploiteren
              </Heading>
              <HStack gap={3} wrap="wrap">
                <Button
                  label="Bekijk ons aanbod"
                  href="/aanbod/"
                  size="lg"
                  variant="primary"
                />
                <Button
                  label="Ontdek onze mogelijkheden"
                  href="#intro"
                  size="lg"
                  variant="ghost"
                />
              </HStack>
            </VStack>
          </Reveal>
        </div>
      </section>

      <PageSection id="intro" paddingBlock={6}>
        <VStack gap={10}>
          <div {...stylex.props(styles.intro)}>
            <div {...stylex.props(styles.introHead)}>
              <Heading level={2}>{ABOUT.heading}</Heading>
            </div>
            <VStack gap={2} xstyle={styles.introStat}>
              <span {...stylex.props(styles.stat)}>2.000+</span>
              <Text color="secondary">
                bewoners en ondernemers geplaatst in leegstaande panden
              </Text>
            </VStack>
            <div {...stylex.props(styles.introStory)}>
              <Text color="secondary">{ABOUT.story[2]}</Text>
            </div>
          </div>
          <RowsSection
            title={ABOUT.reasonsTitle}
            items={ABOUT.reasons.slice(1)}
          />
        </VStack>
      </PageSection>

      <PageSection isWashed>
        <VStack gap={6}>
          <Heading level={2}>Voor wie</Heading>
          <div {...stylex.props(styles.bento)}>
            {AUDIENCES.map((audience, index) => {
              const tile = TILES[index];
              const sentence = firstSentence(
                AUDIENCE_PAGES[AUDIENCE_SLUGS[index]].intro[0],
              );
              const words = (
                <VStack gap={3} align="start" xstyle={styles.tileBody}>
                  <Heading level={3}>{audience.title}</Heading>
                  <Text
                    color={
                      tile.tone === styles.tileMuted ? 'secondary' : 'primary'
                    }>
                    {sentence}
                  </Text>
                </VStack>
              );
              return (
                <div
                  key={audience.href}
                  data-reveal=""
                  {...stylex.props(tile.span, styles.cell)}>
                  <ClickableCard
                    label={audience.title}
                    href={audience.href}
                    padding={0}
                    xstyle={[tile.tone, styles.card]}>
                    <div
                      {...stylex.props(
                        tile.onBand
                          ? bandStyles.onBand
                          : tile.tone === styles.tileAccent
                            ? styles.onAccent
                            : undefined,
                        tile.withPhoto ? styles.tileSplit : undefined,
                      )}>
                      {tile.withPhoto ? (
                        <div {...stylex.props(styles.tileSlot)}>
                          <Photo
                            label={audience.title}
                            seed={index + 2}
                            isFilled
                          />
                        </div>
                      ) : null}
                      {words}
                    </div>
                  </ClickableCard>
                </div>
              );
            })}
          </div>
        </VStack>
      </PageSection>

      <ListingGrid />

      <Faq />
      <CtaBand />
    </>
  );
}
