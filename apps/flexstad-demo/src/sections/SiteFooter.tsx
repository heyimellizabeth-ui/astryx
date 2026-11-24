// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {Divider} from '@astryxdesign/core/Divider';
import {Heading} from '@astryxdesign/core/Heading';
import {Link} from '@astryxdesign/core/Link';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/Layout';
import {CONTACT, HOME_COPY, NAV_ABOUT, NAV_FOR_WHO} from '../content';
import {PHOTO_CREDITS_LINE} from '../photos';
import {bandStyles} from './bandStyles';
import {BrandMark, BrandStripes} from './BrandMark';

const styles = stylex.create({
  // The footer is the aubergine ground the page stands on: the stripe from
  // the logo across its top edge, the line and four hairline rows of links,
  // then the wordmark set as wide as the content column.
  foot: {
    backgroundColor: 'var(--flex-band-deep)',
    paddingBottom: 'clamp(24px, 3vw, 40px)',
  },
  inner: {
    boxSizing: 'border-box',
    width: 'min(100% - 32px, 1200px)',
    marginInline: 'auto',
    paddingTop: 'clamp(56px, 7vw, 96px)',
  },
  giant: {
    marginTop: 'clamp(48px, 7vw, 96px)',
    color: 'var(--flex-on-band)',
  },
  row: {
    display: 'grid',
    gap: 12,
    alignItems: 'baseline',
    paddingBlock: 16,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'color-mix(in oklch, var(--flex-on-band) 22%, transparent)',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'minmax(0, 3fr) minmax(0, 9fr)',
    },
  },
  links: {display: 'flex', flexWrap: 'wrap', columnGap: 24, rowGap: 0},
  // Each link stands in a 44px row, so a thumb can hit it on a phone.
  nowrap: {
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 44,
  },
  lead: {
    maxWidth: '22ch',
    fontSize: 'clamp(24px, 1.4vw + 16px, 36px)',
    lineHeight: 1.15,
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
});

export function SiteFooter() {
  return (
    <footer {...stylex.props(styles.foot, bandStyles.onBand)}>
      <BrandStripes ends={['100%', '64%', '38%']} />
      <div {...stylex.props(styles.inner)}>
        <VStack gap={8}>
          <Text type="large" xstyle={styles.lead}>
            {HOME_COPY.footerLine}
          </Text>
          <div>
            <div {...stylex.props(styles.row)}>
              <Heading level={3}>Voor wie</Heading>
              <div {...stylex.props(styles.links)}>
                {NAV_FOR_WHO.map(link => (
                  <span key={link.href} {...stylex.props(styles.nowrap)}>
                    <Link href={link.href}>{link.title}</Link>
                  </span>
                ))}
              </div>
            </div>
            <div {...stylex.props(styles.row)}>
              <Heading level={3}>Flexstad</Heading>
              <div {...stylex.props(styles.links)}>
                {NAV_ABOUT.map(link => (
                  <span key={link.href} {...stylex.props(styles.nowrap)}>
                    <Link href={link.href}>{link.title}</Link>
                  </span>
                ))}
                <span {...stylex.props(styles.nowrap)}>
                  <Link href="/aanbod/">Aanbod</Link>
                </span>
                <span {...stylex.props(styles.nowrap)}>
                  <Link href="/inschrijven/">Inschrijven</Link>
                </span>
              </div>
            </div>
            <div {...stylex.props(styles.row)}>
              <Heading level={3}>Kantoor</Heading>
              <Text color="secondary">
                {CONTACT.address}. {CONTACT.kvk}.
              </Text>
            </div>
            <div {...stylex.props(styles.row)}>
              <Heading level={3}>Contact</Heading>
              <div {...stylex.props(styles.links)}>
                <span {...stylex.props(styles.nowrap)}>
                  <Link href={CONTACT.phoneHref}>{CONTACT.phone}</Link>
                </span>
                <span {...stylex.props(styles.nowrap)}>
                  <Link href={`mailto:${CONTACT.email}`}>{CONTACT.email}</Link>
                </span>
                <span {...stylex.props(styles.nowrap)}>
                  <Link href={CONTACT.linkedin} isExternalLink>
                    LinkedIn
                  </Link>
                </span>
              </div>
            </div>
          </div>
          <Divider />
          <VStack gap={2}>
            <Text type="supporting" color="secondary">
              Onofficiële herbouw van de openbare site flexstad.com met Astryx.{' '}
              {HOME_COPY.copyright}
            </Text>
            <Text type="supporting" color="secondary" data-credits="">
              {PHOTO_CREDITS_LINE}
            </Text>
          </VStack>
        </VStack>
        <div {...stylex.props(styles.giant)}>
          <BrandMark width="100%" />
        </div>
      </div>
    </footer>
  );
}
