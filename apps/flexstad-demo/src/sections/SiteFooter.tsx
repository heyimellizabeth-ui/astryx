// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {Divider} from '@astryxdesign/core/Divider';
import {Heading} from '@astryxdesign/core/Heading';
import {Link} from '@astryxdesign/core/Link';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/Layout';
import {CONTACT, HOME_COPY, NAV_ABOUT, NAV_FOR_WHO} from '../content';
import {PageSection} from './PageSection';

const styles = stylex.create({
  // Colophon block: the wordmark and its line, then three hairline rows of
  // links and the address as one paragraph.
  row: {
    display: 'grid',
    gap: 12,
    alignItems: 'baseline',
    paddingBlock: 16,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border-emphasized)',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'minmax(0, 3fr) minmax(0, 9fr)',
    },
  },
  links: {display: 'flex', flexWrap: 'wrap', columnGap: 24, rowGap: 8},
  nowrap: {whiteSpace: 'nowrap'},
});

export function SiteFooter() {
  return (
    <PageSection variant="section" paddingBlock={8}>
      <footer>
        <VStack gap={8}>
          <VStack gap={2}>
            <Text size="3xl" weight="bold">
              Flexstad
            </Text>
            <Text color="secondary">{HOME_COPY.footerLine}</Text>
          </VStack>
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
              <Text color="secondary">
                <Link href={CONTACT.phoneHref}>{CONTACT.phone}</Link>,{' '}
                <Link href={`mailto:${CONTACT.email}`}>{CONTACT.email}</Link>,{' '}
                <Link href={CONTACT.linkedin} isExternalLink>
                  LinkedIn
                </Link>
                .
              </Text>
            </div>
          </div>
          <Divider />
          <Text type="supporting" color="secondary">
            Onofficiële herbouw van de openbare site flexstad.com met Astryx.
            Foto’s zijn plaatshouders. {HOME_COPY.copyright}
          </Text>
        </VStack>
      </footer>
    </PageSection>
  );
}
