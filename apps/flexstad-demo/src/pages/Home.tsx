// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {Button} from '@astryxdesign/core/Button';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {ABOUT, AUDIENCES, AUDIENCE_PAGES, HOME_COPY} from '../content';
import {PHOTOS} from '../photos';
import {bandStyles} from '../sections/bandStyles';
import {Faq} from '../sections/Faq';
import {ListingGrid} from '../sections/ListingGrid';
import {PageSection} from '../sections/PageSection';
import {
  CtaBand,
  firstSentence,
  Photo,
  PhotoImage,
  Reveal,
  RowsSection,
} from '../sections/ui';

const styles = stylex.create({
  // Ledge hero: the photograph is a tall field across the whole screen and
  // the client's headline rests on paper beneath it. The photograph takes
  // whatever height the headline and actions leave, so nav, photograph,
  // headline, sentence and the primary action all sit on the first screen.
  hero: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--color-background-body)',
    minHeight: {
      default: 'auto',
      '@media (min-width: 900px)': 'calc(100dvh - 72px)',
    },
  },
  heroPhoto: {
    position: 'relative',
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 'auto',
    height: {
      default: 'clamp(240px, 62vw, 420px)',
      '@media (min-width: 900px)': 'auto',
    },
    minHeight: {default: 0, '@media (min-width: 900px)': 320},
    maxHeight: {default: 'none', '@media (min-width: 900px)': 760},
    // A light aubergine tint cools the lit canal toward the brand; no text
    // sits on the photograph, so this is colour only.
    '::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      backgroundColor: 'var(--flex-band)',
      opacity: 0.22,
      mixBlendMode: 'multiply',
      pointerEvents: 'none',
    },
  },
  heroInner: {
    boxSizing: 'border-box',
    width: 'min(100% - 32px, 1200px)',
    marginInline: 'auto',
    paddingBlock: 'clamp(20px, 3.4dvh, 36px)',
  },
  heroFoot: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    columnGap: 40,
    rowGap: 20,
  },
  // The question and its answer break onto their own lines.
  headLine: {display: 'block'},
  heroLine: {maxWidth: '46ch'},
  split: {
    display: 'grid',
    gap: 24,
    alignItems: 'start',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'minmax(0, 5fr) minmax(0, 7fr)',
    },
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
    color: 'var(--color-text-primary)',
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
        <div {...stylex.props(styles.heroPhoto)}>
          <PhotoImage photo={PHOTOS.heroCanal} isPriority isBleed isFilled />
        </div>
        <div {...stylex.props(styles.heroInner)}>
          <Reveal>
            <VStack gap={5} align="start">
              <Heading level={1} type="display-1">
                <span {...stylex.props(styles.headLine)}>
                  Leegstaand vastgoed?
                </span>{' '}
                <span {...stylex.props(styles.headLine)}>
                  Wij activeren, beheren en exploiteren
                </span>
              </Heading>
              <div {...stylex.props(styles.heroFoot)}>
                <Text
                  type="large"
                  weight="normal"
                  color="secondary"
                  xstyle={styles.heroLine}>
                  {HOME_COPY.hero}
                </Text>
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
              </div>
            </VStack>
          </Reveal>
        </div>
      </section>

      <PageSection id="intro" paddingBlock={8}>
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
          <div {...stylex.props(styles.split)}>
            <Heading level={3}>{HOME_COPY.discoverTitle}</Heading>
            <Text color="secondary">{HOME_COPY.discover}</Text>
          </div>
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

      <PageSection>
        <div {...stylex.props(styles.split)}>
          <Heading level={2}>{HOME_COPY.valueTitle}</Heading>
          <VStack gap={4}>
            {HOME_COPY.value.map(text => (
              <Text key={text} color="secondary">
                {text}
              </Text>
            ))}
          </VStack>
        </div>
      </PageSection>

      <Faq />
      <CtaBand body={HOME_COPY.interest} />
    </>
  );
}
