// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {useState, type ReactNode} from 'react';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Link} from '@astryxdesign/core/Link';
import {Text} from '@astryxdesign/core/Text';
import {CONTACT} from '../content';

const styles = stylex.create({
  // One card: the raised surface, the container radius, no shadow.
  card: {
    padding: {default: 20, '@media (min-width: 900px)': 32},
    borderRadius: 'var(--radius-container)',
    backgroundColor: 'var(--color-background-surface)',
    minWidth: 0,
  },
  facts: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 700px)': 'repeat(2, minmax(0, 1fr))',
    },
    columnGap: 48,
    margin: 0,
  },
  fact: {
    display: 'grid',
    gap: 4,
    paddingBlock: 14,
    margin: 0,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border)',
  },
  factValue: {margin: 0},
  rows: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border-emphasized)',
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 24,
    rowGap: 8,
    paddingBlock: 16,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border-emphasized)',
  },
  rowText: {flexGrow: 1, flexBasis: 240, minWidth: 0},
  // Ghost buttons carry inline padding inside their hit area; pulled back so
  // the label sits on the column edge.
  ghostEdge: {marginInlineEnd: 'calc(-1 * var(--spacing-3))'},
  // Block titles sit a step under the page's section head: they head a card.
  blockTitle: {
    fontSize: 'clamp(22px, 14px + 1vw, 28px)',
    lineHeight: 1.2,
  },
  // Tables scroll inside their own box and never widen the page.
  scroll: {maxWidth: '100%', overflowX: 'auto'},
});

/** The raised sheet every portal block sits on. */
export function Card({children}: {children: ReactNode}) {
  return <div {...stylex.props(styles.card)}>{children}</div>;
}

/** The title of a card or tab panel. */
export function BlockTitle({children}: {children: ReactNode}) {
  return (
    <Heading level={2} xstyle={styles.blockTitle}>
      {children}
    </Heading>
  );
}

/** Label and value pairs as hairline rows, two columns from 700px. */
export function Facts({
  items,
}: {
  items: ReadonlyArray<{label: string; value: ReactNode}>;
}) {
  return (
    <dl {...stylex.props(styles.facts)}>
      {items.map(item => (
        <div key={item.label} {...stylex.props(styles.fact)}>
          <dt {...stylex.props(styles.factValue)}>
            <Text type="supporting" color="secondary">
              {item.label}
            </Text>
          </dt>
          <dd {...stylex.props(styles.factValue)}>
            <Text type="large">{item.value}</Text>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Hairline list: `ul` of rows with free content. */
export function RuledList({children}: {children: ReactNode}) {
  return <ul {...stylex.props(styles.rows)}>{children}</ul>;
}

export function RuledRow({children}: {children: ReactNode}) {
  return <li {...stylex.props(styles.row)}>{children}</li>;
}

export function RowText({children}: {children: ReactNode}) {
  return <div {...stylex.props(styles.rowText)}>{children}</div>;
}

/** Wraps a table so it scrolls inside its own box on narrow screens. */
export function ScrollBox({children}: {children: ReactNode}) {
  return <div {...stylex.props(styles.scroll)}>{children}</div>;
}

/**
 * "Download (demo)": nothing is downloaded. Pressing it shows a small notice
 * that says so, so the button is honest instead of disabled.
 */
export function DemoDownload({name}: {name: string}) {
  const [isShown, setIsShown] = useState(false);
  return (
    <VStack gap={2} align="start">
      <div {...stylex.props(styles.ghostEdge)}>
        <Button
          label="Download (demo)"
          variant="ghost"
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
    <Card>
      <VStack gap={3} align="start">
        <BlockTitle>Contact</BlockTitle>
        <Text color="secondary">Vragen? Neem contact op met Flexstad.</Text>
        <HStack gap={5} wrap="wrap">
          <Link href={CONTACT.phoneHref}>{CONTACT.phone}</Link>
          <Link href={`mailto:${CONTACT.email}`}>{CONTACT.email}</Link>
        </HStack>
      </VStack>
    </Card>
  );
}
