// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {Button} from '@astryxdesign/core/Button';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {ABOUT, HOME_COPY} from '../content';
import {PHOTOS} from '../photos';
import {AudienceIndexList} from '../sections/AudienceIndexList';
import {BeforeAfter} from '../sections/BeforeAfter';
import {Faq} from '../sections/Faq';
import {ListingBento} from '../sections/ListingBento';
import {PageSection} from '../sections/PageSection';
import {RiseHero} from '../sections/RiseHero';
import {CtaBand} from '../sections/ui';

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
    paddingBlock: 'clamp(48px, 6vw, 96px)',
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
    marginTop: 'clamp(48px, 6vw, 88px)',
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
});

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
        <AudienceIndexList />
      </VStack>
    </PageSection>
  );
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
      <CtaBand about="home" body={HOME_COPY.interest} />
    </>
  );
}
