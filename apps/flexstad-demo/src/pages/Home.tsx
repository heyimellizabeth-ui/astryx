// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {Button} from '@astryxdesign/core/Button';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {ABOUT, AUDIENCES, AUDIENCE_PAGES, HOME_COPY} from '../content';
import {PHOTOS} from '../photos';
import {Faq} from '../sections/Faq';
import {ListingGrid} from '../sections/ListingGrid';
import {PageSection} from '../sections/PageSection';
import {CtaBand, firstSentence, PhotoImage, Reveal} from '../sections/ui';

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
  // Air between the photograph's headline block and the statement.
  introLead: {paddingTop: 24},
  // The five reasons: ruled, large, three across over two across, so the set
  // fills six columns with no empty cell.
  reasons: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    display: 'grid',
    columnGap: 32,
    rowGap: 32,
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'repeat(6, minmax(0, 1fr))',
    },
  },
  reason: {
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-text-primary)',
    minWidth: 0,
  },
  reasonThird: {
    gridColumn: {default: 'auto', '@media (min-width: 900px)': 'span 2'},
  },
  reasonHalf: {
    gridColumn: {default: 'auto', '@media (min-width: 900px)': 'span 3'},
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
  // Four audience tiles on six columns, 4 and 2 over 2 and 4, no empty cell:
  // the two photograph tiles are the wide ones, the type-led tiles the narrow.
  bento: {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'repeat(6, minmax(0, 1fr))',
    },
  },
  wide: {
    gridColumn: {default: 'auto', '@media (min-width: 900px)': 'span 4'},
  },
  narrow: {
    gridColumn: {default: 'auto', '@media (min-width: 900px)': 'span 2'},
  },
  cell: {display: 'flex'},
  card: {flexGrow: 1},
  tileMuted: {backgroundColor: 'var(--color-background-muted)'},
  // A wide tile: the photograph beside the words on desktop, above them on
  // phones. The photograph fills its half edge to edge.
  tileSplit: {
    display: 'grid',
    height: '100%',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'minmax(0, 1fr) minmax(0, 1fr)',
    },
  },
  tileSlot: {
    position: 'relative',
    minHeight: {default: 200, '@media (min-width: 900px)': 300},
  },
  slotFirst: {order: {default: 0, '@media (min-width: 900px)': 0}},
  slotLast: {order: {default: 0, '@media (min-width: 900px)': 1}},
  tileBody: {
    height: '100%',
    boxSizing: 'border-box',
    padding: 28,
  },
  // Type-led tiles: the audience's own title is the largest thing on them.
  tileTitle: {
    fontSize: 'clamp(24px, 1vw + 16px, 32px)',
    lineHeight: 1.12,
    fontWeight: 700,
  },
  // "Van leegstand naar meerwaarde": the first paragraph as a statement.
  valueLayout: {
    display: 'grid',
    columnGap: 64,
    rowGap: 32,
    alignItems: 'center',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'minmax(0, 7fr) minmax(0, 5fr)',
    },
  },
  valuePhoto: {
    position: 'relative',
    height: {default: 240, '@media (min-width: 900px)': 480},
  },
  // The head leads: the first paragraph is set a size below it.
  statement: {
    maxWidth: '32ch',
    minWidth: 0,
    overflowWrap: 'break-word',
    fontSize: 'clamp(22px, 1vw + 14px, 28px)',
    lineHeight: 1.25,
    fontWeight: 700,
  },
  statementRest: {maxWidth: '65ch'},
});

// Order on the page: owners (photograph) and municipalities, developers and
// entrepreneurs (photograph). Municipalities have no photograph and developers'
// timber shell is too weak a mood to earn a place, so both are type-led.
const TILES = [
  {index: 0, span: styles.wide, photo: PHOTOS.ownersEntrance, tone: undefined},
  {index: 2, span: styles.narrow, photo: undefined, tone: styles.tileMuted},
  {index: 3, span: styles.narrow, photo: undefined, tone: styles.tileMuted},
  {
    index: 1,
    span: styles.wide,
    photo: PHOTOS.makersAtticStudio,
    tone: undefined,
  },
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

      <PageSection id="intro" paddingBlock={10}>
        <VStack gap={10} xstyle={styles.introLead}>
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
          <VStack gap={6}>
            <Heading level={2}>{ABOUT.reasonsTitle}</Heading>
            <ul {...stylex.props(styles.reasons)}>
              {ABOUT.reasons.slice(1).map((reason, index) => (
                <li
                  key={reason}
                  {...stylex.props(
                    styles.reason,
                    index < 3 ? styles.reasonThird : styles.reasonHalf,
                  )}>
                  <Text type="large" weight="bold" color="primary">
                    {reason}
                  </Text>
                </li>
              ))}
            </ul>
          </VStack>
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
            {TILES.map(tile => {
              const audience = AUDIENCES[tile.index];
              const sentence = firstSentence(
                AUDIENCE_PAGES[AUDIENCE_SLUGS[tile.index]].intro[0],
              );
              const words = (
                <VStack
                  gap={3}
                  align="start"
                  justify={tile.photo ? 'center' : 'end'}
                  xstyle={styles.tileBody}>
                  <Heading level={3} xstyle={styles.tileTitle}>
                    {audience.title}
                  </Heading>
                  <Text color="secondary">{sentence}</Text>
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
                        tile.photo ? styles.tileSplit : undefined,
                      )}>
                      {tile.photo ? (
                        <div
                          {...stylex.props(
                            styles.tileSlot,
                            tile.index === 1
                              ? styles.slotLast
                              : styles.slotFirst,
                          )}>
                          <PhotoImage photo={tile.photo} isBleed isFilled />
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
        <div {...stylex.props(styles.valueLayout)}>
          <VStack gap={6} align="start">
            <Heading level={2}>{HOME_COPY.valueTitle}</Heading>
            <Text as="p" xstyle={styles.statement}>
              {HOME_COPY.value[0]}
            </Text>
            <Text as="p" color="secondary" xstyle={styles.statementRest}>
              {HOME_COPY.value[1]}
            </Text>
          </VStack>
          <div {...stylex.props(styles.valuePhoto)}>
            <PhotoImage photo={PHOTOS.aboutWindowsill} isFilled />
          </div>
        </div>
      </PageSection>

      <Faq />
      <CtaBand body={HOME_COPY.interest} />
    </>
  );
}
