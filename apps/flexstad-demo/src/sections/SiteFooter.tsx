// Copyright (c) Meta Platforms, Inc. and affiliates.

import {Divider} from '@astryxdesign/core/Divider';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Link} from '@astryxdesign/core/Link';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/Layout';
import {PageSection} from './PageSection';

export function SiteFooter() {
  return (
    <PageSection variant="section">
      <footer>
        <VStack gap={6}>
          <Grid columns={{minWidth: 240, repeat: 'fill'}} gap={6}>
            <VStack gap={2}>
              <Heading level={2}>Flexstad</Heading>
              <Text color="secondary">
                Flexstad houdt leegstaand vastgoed actief, veilig en van waarde.
              </Text>
            </VStack>
            <VStack gap={1}>
              <Heading level={3}>Kantoor</Heading>
              <Text color="secondary">Winkelwaard 494, 1824 HX Alkmaar</Text>
            </VStack>
            <VStack gap={1}>
              <Heading level={3}>Contact</Heading>
              <Link href="mailto:info@flexstad.com">info@flexstad.com</Link>
              <Link
                href="https://www.linkedin.com/company/flexstad-com"
                isExternalLink>
                LinkedIn
              </Link>
            </VStack>
          </Grid>
          <Divider />
          <Text type="supporting" color="secondary">
            Onofficieel migratieprototype. Tekst en gegevens komen van de
            openbare site flexstad.com.
          </Text>
        </VStack>
      </footer>
    </PageSection>
  );
}
