// Copyright (c) Meta Platforms, Inc. and affiliates.

import {Divider} from '@astryxdesign/core/Divider';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Link} from '@astryxdesign/core/Link';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/Layout';
import {CONTACT, NAV_ABOUT, NAV_FOR_WHO} from '../content';
import {PageSection} from './PageSection';

export function SiteFooter() {
  return (
    <PageSection variant="section">
      <footer>
        <VStack gap={6}>
          <Grid columns={{minWidth: 200, repeat: 'fill'}} gap={6}>
            <VStack gap={2}>
              <Heading level={2}>Flexstad</Heading>
              <Text color="secondary">
                Flexstad houdt leegstand actief, veilig en van waarde.
              </Text>
            </VStack>
            <VStack gap={1}>
              <Heading level={3}>Voor wie</Heading>
              {NAV_FOR_WHO.map(link => (
                <Link key={link.href} href={link.href}>
                  {link.title}
                </Link>
              ))}
            </VStack>
            <VStack gap={1}>
              <Heading level={3}>Flexstad</Heading>
              {NAV_ABOUT.map(link => (
                <Link key={link.href} href={link.href}>
                  {link.title}
                </Link>
              ))}
              <Link href="/aanbod/">Aanbod</Link>
              <Link href="/inschrijven/">Inschrijven</Link>
            </VStack>
            <VStack gap={1}>
              <Heading level={3}>Contact</Heading>
              <Text color="secondary">{CONTACT.address}</Text>
              <Link href={CONTACT.phoneHref}>{CONTACT.phone}</Link>
              <Link href={`mailto:${CONTACT.email}`}>{CONTACT.email}</Link>
              <Link href={CONTACT.linkedin} isExternalLink>
                LinkedIn
              </Link>
            </VStack>
          </Grid>
          <Divider />
          <Text type="supporting" color="secondary">
            Onofficiële herbouw van de openbare site flexstad.com met Astryx.
            Foto’s zijn plaatshouders.
          </Text>
        </VStack>
      </footer>
    </PageSection>
  );
}
