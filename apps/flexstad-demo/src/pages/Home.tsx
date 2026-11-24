// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {Button} from '@astryxdesign/core/Button';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {ABOUT, AUDIENCES, AUDIENCE_PAGES, HOME_COPY} from '../content';
import {PHOTOS, type Photo} from '../photos';
import {BeforeAfter} from '../sections/BeforeAfter';
import {Faq} from '../sections/Faq';
import {ListingBento} from '../sections/ListingBento';
import {PageSection} from '../sections/PageSection';
import {RiseHero} from '../sections/RiseHero';
import {CtaBand, firstSentence, PhotoImage} from '../sections/ui';

const WIDE = '@media (min-width: 900px)';

const styles = stylex.create({
  head: {
    fontSize: 'clamp(40px, 12px + 4vw, 76px)',
    lineHeight: 1,
    letterSpacing: '-0.035em',
  },
  headLine: {display: 'block'},
  heroLine: {maxWidth: '44ch'},

  // The band continues under the block: the figure, the statement, the reasons.
  band: {
    backgroundColor: 'var(--color-background-body)',
    paddingBlock: 'clamp(56px, 8vw, 128px)',
    paddingInline: 16,
  },
  bandInner: {maxWidth: 1200, marginInline: 'auto'},
  intro: {
    display: 'grid',
    columnGap: 64,
    rowGap: 40,
    alignItems: 'start',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      [WIDE]: 'minmax(0, 5fr) minmax(0, 7fr)',
    },
  },
  statRow: {gridColumn: '1 / -1'},
  // The client's own figure, set as the largest thing below the hero: the
  // number of people Flexstad has housed is the proof, so it carries the band.
  stat: {
    display: 'block',
    fontSize: 'clamp(5.5rem, 2rem + 16.5vw, 19.5rem)',
    fontWeight: 700,
    lineHeight: 0.82,
    letterSpacing: '-0.06em',
    whiteSpace: 'nowrap',
    color: 'var(--color-text-primary)',
    marginInlineStart: '-0.04em',
  },
  // Only the plus takes the logo orange: the figure is ink, the growth is
  // the brand's.
  plus: {color: 'var(--flex-orange)'},
  statLine: {
    maxWidth: '18ch',
    fontSize: 'clamp(22px, 0.9vw + 16px, 30px)',
    lineHeight: 1.3,
    fontWeight: 600,
    letterSpacing: '-0.015em',
  },
  story: {maxWidth: '52ch'},
  reasonsHead: {
    marginTop: 'clamp(64px, 8vw, 120px)',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border)',
  },
  reasons: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    display: 'grid',
    columnGap: 40,
    rowGap: 36,
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 640px)': 'repeat(2, minmax(0, 1fr))',
      [WIDE]: 'repeat(6, minmax(0, 1fr))',
    },
  },
  reason: {
    display: 'grid',
    gridTemplateColumns: '28px minmax(0, 1fr)',
    columnGap: 14,
    alignItems: 'baseline',
    minWidth: 0,
  },
  reasonThird: {gridColumn: {default: 'auto', [WIDE]: 'span 2'}},
  reasonHalf: {gridColumn: {default: 'auto', [WIDE]: 'span 3'}},
  // One bar of the logo, cut on its slant, marks each reason.
  bar: {
    display: 'block',
    width: 28,
    height: 10,
    backgroundColor: 'var(--flex-orange)',
    clipPath: 'polygon(5px 0, 100% 0, 100% 100%, 0 100%)',
    transform: 'translateY(-0.2em)',
  },
  reasonText: {
    fontSize: 'clamp(20px, 0.8vw + 14px, 26px)',
    lineHeight: 1.3,
    fontWeight: 600,
    letterSpacing: '-0.01em',
  },

  // Voor wie: an index of four audiences, each a full-width row.
  indexHead: {
    display: 'grid',
    columnGap: 64,
    rowGap: 20,
    alignItems: 'end',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      [WIDE]: 'minmax(0, 5fr) minmax(0, 7fr)',
    },
  },
  discover: {maxWidth: '60ch'},
  indexTitle: {
    fontSize: 'clamp(56px, 16px + 7vw, 120px)',
    lineHeight: 0.9,
    letterSpacing: '-0.045em',
  },
  index: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    borderTopWidth: 2,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-text-primary)',
  },
  indexItem: {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border-emphasized)',
  },
  row: {
    position: 'relative',
    display: 'grid',
    alignItems: 'center',
    columnGap: 64,
    rowGap: 12,
    paddingBlock: {default: 24, [WIDE]: 28},
    paddingInline: {default: 0, [WIDE]: 16},
    color: 'var(--color-text-primary)',
    textDecoration: 'none',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr) 96px',
      [WIDE]: 'minmax(0, 6fr) minmax(0, 4fr) 192px',
    },
    gridTemplateAreas: {
      default: '"title pic" "line pic"',
      [WIDE]: '"title line pic"',
    },
    backgroundColor: {
      default: 'transparent',
      ':hover': 'var(--color-background-muted)',
    },
    transitionProperty: 'background-color',
    transitionDuration: '0.3s',
    transitionTimingFunction: 'var(--flex-ease)',
  },
  rowTitle: {
    gridArea: 'title',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    fontSize: 'clamp(34px, 12px + 3.6vw, 68px)',
    lineHeight: 1,
    fontWeight: 700,
    letterSpacing: '-0.035em',
    minWidth: 0,
    overflowWrap: 'break-word',
  },
  rowBar: {
    display: {default: 'none', [WIDE]: 'block'},
    position: 'absolute',
    insetInlineStart: 16,
    top: 'calc(50% - 7px)',
    width: 40,
    height: 14,
    backgroundColor: 'var(--flex-orange)',
    clipPath: 'polygon(7px 0, 100% 0, 100% 100%, 0 100%)',
    opacity: 0,
    transform: 'translateX(-16px)',
    transitionProperty: 'opacity, transform',
    transitionDuration: '0.35s',
    transitionTimingFunction: 'var(--flex-ease)',
  },
  rowTitleText: {
    transitionProperty: 'transform',
    transitionDuration: '0.35s',
    transitionTimingFunction: 'var(--flex-ease)',
  },
  rowLine: {gridArea: 'line', maxWidth: '44ch'},
  rowPic: {
    gridArea: 'pic',
    position: 'relative',
    width: '100%',
    aspectRatio: '4 / 5',
    alignSelf: 'center',
    transitionProperty: 'transform',
    transitionDuration: '0.5s',
    transitionTimingFunction: 'var(--flex-ease)',
  },

  // Van leegstand naar meerwaarde: the statement beside the arched window.
  valueLayout: {
    display: 'grid',
    columnGap: 80,
    rowGap: 48,
    alignItems: 'center',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      [WIDE]: 'minmax(0, 6fr) minmax(0, 6fr)',
    },
  },
  statement: {
    maxWidth: '24ch',
    minWidth: 0,
    overflowWrap: 'break-word',
    fontSize: 'clamp(26px, 1.6vw + 16px, 40px)',
    lineHeight: 1.12,
    fontWeight: 700,
    letterSpacing: '-0.025em',
  },
  statementRest: {maxWidth: '58ch'},
  // The orange arch sits behind the photograph, offset by one bar, so the
  // window casts the brand colour.
  window: {
    width: '100%',
    maxWidth: 560,
    justifySelf: {default: 'stretch', [WIDE]: 'end'},
  },
  // The row is an Astryx ClickableCard: flat, square, no lift of its own,
  // so the row's own hover (the bar, the title, the window) carries it.
  card: {
    borderRadius: 0,
    backgroundColor: 'transparent',
    transform: 'none',
  },
});

// Each audience with its first sentence and the photograph that is its mood.
const ROWS: ReadonlyArray<{slug: string; index: number; photo: Photo}> = [
  {slug: 'vastgoedeigenaren', index: 0, photo: PHOTOS.ownersApartmentFacade},
  {slug: 'ondernemers', index: 1, photo: PHOTOS.makersClothingRail},
  {slug: 'gemeenten', index: 2, photo: PHOTOS.municipalitiesOfficeFloor},
  {slug: 'ontwikkelaars', index: 3, photo: PHOTOS.developersDesk},
];

function Hero() {
  return (
    <RiseHero photo={PHOTOS.homeMakerAtelier} label="Introductie">
      <VStack gap={5} align="start">
        <Heading level={1} type="display-1" xstyle={styles.head}>
          <span {...stylex.props(styles.headLine)}>Leegstaand vastgoed?</span>{' '}
          <span {...stylex.props(styles.headLine)}>
            Wij activeren, beheren en exploiteren
          </span>
        </Heading>
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
      </VStack>
    </RiseHero>
  );
}

function Proof() {
  return (
    <section
      id="intro"
      aria-label="Over Flexstad"
      {...stylex.props(styles.band)}>
      <div {...stylex.props(styles.bandInner)}>
        <div {...stylex.props(styles.intro)}>
          <span {...stylex.props(styles.stat, styles.statRow)}>
            2.000<span {...stylex.props(styles.plus)}>+</span>
          </span>
          <Text type="large" xstyle={styles.statLine}>
            bewoners en ondernemers geplaatst in leegstaande panden
          </Text>
          <VStack gap={5} xstyle={styles.story}>
            <Heading level={2}>{ABOUT.heading}</Heading>
            <Text color="secondary">{ABOUT.story[2]}</Text>
          </VStack>
        </div>
        <VStack gap={8} xstyle={styles.reasonsHead}>
          <Heading level={2}>{ABOUT.reasonsTitle}</Heading>
          <ul {...stylex.props(styles.reasons)}>
            {ABOUT.reasons.slice(1).map((reason, index) => (
              <li
                key={reason}
                data-reveal=""
                {...stylex.props(
                  styles.reason,
                  index < 3 ? styles.reasonThird : styles.reasonHalf,
                )}>
                <span aria-hidden="true" {...stylex.props(styles.bar)} />
                <span {...stylex.props(styles.reasonText)}>{reason}</span>
              </li>
            ))}
          </ul>
        </VStack>
      </div>
    </section>
  );
}

function AudienceIndex() {
  return (
    <PageSection paddingBlock={10}>
      <VStack gap={10}>
        <div {...stylex.props(styles.indexHead)}>
          <Heading level={2} xstyle={styles.indexTitle}>
            Voor wie
          </Heading>
          <VStack gap={2} xstyle={styles.discover}>
            <Heading level={3}>{HOME_COPY.discoverTitle}</Heading>
            <Text color="secondary">{HOME_COPY.discover}</Text>
          </VStack>
        </div>
        <ul {...stylex.props(styles.index)}>
          {ROWS.map(row => {
            const audience = AUDIENCES[row.index];
            const sentence = firstSentence(AUDIENCE_PAGES[row.slug].intro[0]);
            return (
              <li key={row.slug} {...stylex.props(styles.indexItem)}>
                <AudienceRow
                  href={audience.href}
                  title={audience.title}
                  sentence={sentence}
                  photo={row.photo}
                />
              </li>
            );
          })}
        </ul>
      </VStack>
    </PageSection>
  );
}

function AudienceRow({
  href,
  title,
  sentence,
  photo,
}: {
  href: string;
  title: string;
  sentence: string;
  photo: Photo;
}) {
  return (
    <ClickableCard
      label={title}
      href={href}
      padding={0}
      variant="transparent"
      xstyle={styles.card}>
      <div {...withClass('flex-index-row', styles.row)}>
        <h3 {...stylex.props(styles.rowTitle)}>
          <span
            aria-hidden="true"
            {...withClass('flex-index-bar', styles.rowBar)}
          />
          <span {...withClass('flex-index-title', styles.rowTitleText)}>
            {title}
          </span>
        </h3>
        <Text color="secondary" xstyle={styles.rowLine}>
          {sentence}
        </Text>
        <span {...withClass('flex-index-pic', styles.rowPic)}>
          <PhotoImage
            photo={photo}
            isFilled
            isArch
            sizes="(min-width: 900px) 192px, 96px"
          />
        </span>
      </div>
    </ClickableCard>
  );
}

/**
 * StyleX props plus one plain class: the row's hover and focus move its
 * children, which `index.css` keys on these classes (`.flex-index-*`).
 */
function withClass(name: string, style: stylex.StyleXStyles) {
  const props = stylex.props(style);
  return {...props, className: `${name} ${props.className ?? ''}`.trim()};
}

function Value() {
  return (
    <PageSection paddingBlock={10}>
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
        <VStack gap={4} xstyle={styles.window}>
          <BeforeAfter
            before={PHOTOS.linnaeusBefore}
            after={PHOTOS.linnaeusAfter}
            label="Schuif tussen voor en na"
          />
          <Heading level={3}>Linnaeusstraat</Heading>
          <Text type="supporting" color="secondary">
            Van leegstaande winkelruimte naar African fashion store:
            winkelruimte van circa 100 m² aan de Linnaeusstraat in Amsterdam.
          </Text>
          <div>
            <Button
              label="Bekijk de Linnaeusstraat"
              href="/aanbod/linnaeusstraat/"
              variant="secondary"
              size="lg"
            />
          </div>
        </VStack>
      </div>
    </PageSection>
  );
}

export function Home() {
  return (
    <>
      <Hero />
      <ListingBento />
      <Proof />
      <AudienceIndex />
      <Value />
      <Faq />
      <CtaBand body={HOME_COPY.interest} />
    </>
  );
}
