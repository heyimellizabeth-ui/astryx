// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {useState, type ReactNode} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Link} from '@astryxdesign/core/Link';
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList';
import {Text} from '@astryxdesign/core/Text';
import {CONTACT} from '../content';

const styles = stylex.create({
  // Block titles sit a step under the page's section head: they head a card.
  blockTitle: {
    fontSize: 'clamp(22px, 14px + 1vw, 28px)',
    lineHeight: 1.2,
  },
  // Ghost buttons carry inline padding inside their hit area; pulled back so
  // the label sits on the column edge.
  ghostEdge: {marginInlineStart: 'calc(-1 * var(--spacing-3))'},
});

/** The one card every portal block sits on: Astryx Card, one padding step. */
export function PortalCard({children}: {children: ReactNode}) {
  return <Card padding={5}>{children}</Card>;
}

/** The title of a card or tab panel. */
export function BlockTitle({children}: {children: ReactNode}) {
  return (
    <Heading level={2} xstyle={styles.blockTitle}>
      {children}
    </Heading>
  );
}

/** Label and value pairs: Astryx MetadataList, columns as the width allows. */
export function Facts({
  items,
}: {
  items: ReadonlyArray<{label: string; value: ReactNode}>;
}) {
  return (
    <MetadataList columns="multi">
      {items.map(item => (
        <MetadataListItem key={item.label} label={item.label}>
          {item.value}
        </MetadataListItem>
      ))}
    </MetadataList>
  );
}

/**
 * "Download (demo)": nothing is downloaded. Pressing it shows a small notice
 * that says so, so the button is honest instead of disabled.
 */
export function DemoDownload({name}: {name: string}) {
  const [isShown, setIsShown] = useState(false);
  return (
    <VStack gap={1} align="start">
      <div {...stylex.props(styles.ghostEdge)}>
        <Button
          label="Download (demo)"
          variant="ghost"
          size="lg"
          aria-label={`Download (demo), ${name}`}
          onClick={() => setIsShown(true)}
        />
      </div>
      {isShown ? (
        <Text type="supporting" color="secondary" role="status">
          Demo: er is niets gedownload.
        </Text>
      ) : null}
    </VStack>
  );
}

/** Flexstad's real contact details: the one real thing in the portal. */
export function ContactCard() {
  return (
    <PortalCard>
      <VStack gap={3} align="start">
        <BlockTitle>Contact</BlockTitle>
        <Text color="secondary">Vragen? Neem contact op met Flexstad.</Text>
        <HStack gap={5} wrap="wrap">
          <Link href={CONTACT.phoneHref}>{CONTACT.phone}</Link>
          <Link href={`mailto:${CONTACT.email}`}>{CONTACT.email}</Link>
        </HStack>
      </VStack>
    </PortalCard>
  );
}
