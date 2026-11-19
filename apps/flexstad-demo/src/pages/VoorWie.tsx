// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {Button} from '@astryxdesign/core/Button';
import {Heading} from '@astryxdesign/core/Heading';
import {VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {AUDIENCE_PAGES} from '../content';
import {PageSection} from '../sections/PageSection';
import {CtaBand, firstSentence, PageHero} from '../sections/ui';

/** The owners line exactly as the live /voor-wie/ page words it. */
const VOOR_WIE_OWNERS =
  'Leegstand brengt risico’s met zich mee, zoals kraak, vandalisme, verloedering en oplopende beheerkosten. Flexstad helpt vastgoedeigenaren om leegstaand vastgoed tijdelijk en verantwoord in gebruik te geven.';

const styles = stylex.create({
  // The banner's index: the four audiences as hairline rows, each a link.
  index: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border-emphasized)',
  },
  indexRow: {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border-emphasized)',
  },
  indexLink: {
    display: 'flex',
    alignItems: 'baseline',
    minHeight: 48,
    paddingBlock: 10,
    boxSizing: 'border-box',
    color: 'var(--color-text-primary)',
    textDecoration: 'none',
    fontSize: 20,
    fontWeight: 500,
    transitionProperty: 'color',
    transitionDuration: '0.15s',
    ':hover': {color: 'var(--color-text-accent)'},
  },
  // One audience: its name and action on the left, its sentence on the right.
  row: {
    display: 'grid',
    gap: 24,
    alignItems: 'start',
    paddingBlock: 48,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border-emphasized)',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'minmax(0, 5fr) minmax(0, 7fr)',
    },
  },
  rows: {margin: 0, padding: 0, listStyleType: 'none'},
  title: {
    color: 'var(--color-text-primary)',
    textDecoration: 'none',
    transitionProperty: 'color',
    transitionDuration: '0.15s',
    ':hover': {color: 'var(--color-text-accent)'},
  },
  sentence: {
    maxWidth: '32ch',
    fontSize: 'clamp(22px, 1vw + 14px, 28px)',
    lineHeight: 1.25,
    fontWeight: 700,
  },
  bullets: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border-emphasized)',
  },
  bullet: {
    paddingBlock: 14,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border-emphasized)',
  },
});

// Order of the site's own navigation, with the action each audience had on
// the live page (developers had none there: its page's own action is used).
const ROWS = [
  {slug: 'vastgoedeigenaren', cta: 'Bespreek de mogelijkheden'},
  {slug: 'ondernemers', cta: 'Bekijk het aanbod'},
  {slug: 'gemeenten', cta: undefined},
  {slug: 'ontwikkelaars', cta: undefined},
] as const;

export function VoorWie() {
  return (
    <>
      <PageHero
        title="Voor wie"
        trail={[{title: 'Home', href: '/'}, {title: 'Voor wie'}]}
        aside={
          <nav aria-label="Voor wie">
            <ul {...stylex.props(styles.index)}>
              {ROWS.map(({slug}) => (
                <li key={slug} {...stylex.props(styles.indexRow)}>
                  <a href={`/${slug}/`} {...stylex.props(styles.indexLink)}>
                    {AUDIENCE_PAGES[slug].navTitle}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        }
      />
      <PageSection paddingBlock={8}>
        <ul {...stylex.props(styles.rows)}>
          {ROWS.map(({slug, cta}) => {
            const page = AUDIENCE_PAGES[slug];
            const label = cta ?? page.cta.label;
            const href =
              slug === 'vastgoedeigenaren' ? `/${slug}/` : page.cta.href;
            return (
              <li key={slug} {...stylex.props(styles.row)}>
                <VStack gap={5} align="start">
                  <Heading level={2}>
                    <a href={`/${slug}/`} {...stylex.props(styles.title)}>
                      {page.navTitle}
                    </a>
                  </Heading>
                  <Button
                    label={label}
                    href={href}
                    variant={
                      slug === 'vastgoedeigenaren' ? 'primary' : 'secondary'
                    }
                    size="lg"
                  />
                </VStack>
                <VStack gap={6} align="stretch">
                  <Text as="p" xstyle={styles.sentence}>
                    {slug === 'vastgoedeigenaren'
                      ? VOOR_WIE_OWNERS
                      : firstSentence(page.intro[0])}
                  </Text>
                  {slug === 'vastgoedeigenaren' && page.bullets ? (
                    <ul {...stylex.props(styles.bullets)}>
                      {page.bullets.map(item => (
                        <li key={item} {...stylex.props(styles.bullet)}>
                          <Text type="large">{item}</Text>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </VStack>
              </li>
            );
          })}
        </ul>
      </PageSection>
      <CtaBand />
    </>
  );
}
