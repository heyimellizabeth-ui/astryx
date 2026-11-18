// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import type {ReactNode} from 'react';
import {Breadcrumbs, BreadcrumbItem} from '@astryxdesign/core/Breadcrumbs';
import {Button} from '@astryxdesign/core/Button';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {CONTACT, type Cta} from '../content';
import {PageSection} from './PageSection';
import {Placeholder} from './Placeholder';

const enter = stylex.keyframes({
  from: {opacity: 0, transform: 'translateY(16px)'},
  to: {opacity: 1, transform: 'translateY(0)'},
});

const styles = stylex.create({
  reveal: {
    animationName: {
      default: 'none',
      '@media (prefers-reduced-motion: no-preference)': enter,
    },
    animationDuration: '0.6s',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    animationFillMode: 'both',
  },
  list: {
    margin: 0,
    paddingInlineStart: 20,
    listStyleType: 'disc',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
  },
  prose: {maxWidth: '65ch'},
  rows: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border-emphasized)',
  },
  row: {
    paddingBlock: 16,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border-emphasized)',
  },
  rowsLayout: {
    display: 'grid',
    gap: 24,
    alignItems: 'start',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'minmax(0, 5fr) minmax(0, 7fr)',
    },
  },
  bandTop: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 32,
  },
  bandLinks: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'color-mix(in oklch, var(--flex-on-band) 28%, transparent)',
  },
  measure: {maxWidth: '55ch'},
  columns: {
    columnGap: 64,
    columnCount: {default: 1, '@media (min-width: 900px)': 2},
  },
  columnItem: {breakInside: 'avoid', marginBottom: 24},
  lead: {
    maxWidth: '24em',
    fontSize: 'var(--text-heading-2-size)',
    lineHeight: 'var(--text-heading-2-leading)',
  },
  prose2: {maxWidth: '65ch'},
  photo: {
    borderRadius: 'var(--radius-container)',
    overflow: 'hidden',
  },
  photoFill: {display: 'flex', height: '100%'},
});

/** Reveals content once on load; static under reduced motion. */
export function Reveal({children}: {children: ReactNode}) {
  return <div {...stylex.props(styles.reveal)}>{children}</div>;
}

export function Paragraphs({items}: {items: ReadonlyArray<string>}) {
  return (
    <VStack gap={3} xstyle={styles.prose}>
      {items.map(text => (
        <Text key={text} color="secondary">
          {text}
        </Text>
      ))}
    </VStack>
  );
}

export function BulletList({items}: {items: ReadonlyArray<string>}) {
  return (
    <ul {...stylex.props(styles.list)}>
      {items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/** Photo slot with the shared rounded frame. */
export function Photo({
  label,
  seed,
  ratio,
  isFilled = false,
}: {
  label: string;
  seed?: number;
  ratio?: string;
  /** Stretch to the height of the cell the slot sits in. */
  isFilled?: boolean;
}) {
  return (
    <div
      {...stylex.props(styles.photo, isFilled ? styles.photoFill : undefined)}>
      <Placeholder label={label} seed={seed} ratio={ratio} />
    </div>
  );
}

export function Crumbs({
  trail,
}: {
  trail: ReadonlyArray<{title: string; href?: string}>;
}) {
  return (
    <Breadcrumbs label="Kruimelpad">
      {trail.map((item, index) => (
        <BreadcrumbItem
          key={item.title}
          href={item.href}
          isCurrent={index === trail.length - 1}>
          {item.title}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}

interface PageHeroProps {
  trail?: ReadonlyArray<{title: string; href?: string}>;
  title: string;
  intro?: string;
  ctas?: ReadonlyArray<Cta>;
}

/**
 * Inner-page hero, Banner posture: trail, the head at the display token, an
 * optional line and the actions, set across the content column. No picture
 * slot; pages that wait for photographs carry one as their first section.
 */
export function PageHero({trail, title, intro, ctas}: PageHeroProps) {
  return (
    <PageSection isWashed paddingBlock={8}>
      <VStack gap={5} align="start">
        {trail ? <Crumbs trail={trail} /> : null}
        <Reveal>
          <VStack gap={5} align="start">
            <Heading level={1} type="display-2">
              {title}
            </Heading>
            {intro ? (
              <Text type="supporting" color="secondary" xstyle={styles.prose2}>
                {intro}
              </Text>
            ) : null}
            {ctas && ctas.length > 0 ? (
              <HStack gap={3} wrap="wrap">
                {ctas.map((cta, index) => (
                  <Button
                    key={cta.label}
                    label={cta.label}
                    href={cta.href}
                    size="lg"
                    variant={index === 0 ? 'primary' : 'ghost'}
                  />
                ))}
              </HStack>
            ) : null}
          </VStack>
        </Reveal>
      </VStack>
    </PageSection>
  );
}

/** A title on the left and its items as hairline rows on the right. */
export function RowsSection({
  title,
  items,
  aside,
}: {
  title: string;
  items: ReadonlyArray<string>;
  aside?: ReactNode;
}) {
  return (
    <div {...stylex.props(styles.rowsLayout)}>
      <VStack gap={4} align="start">
        <Heading level={2}>{title}</Heading>
        {aside}
      </VStack>
      <ul {...stylex.props(styles.rows)}>
        {items.map(item => (
          <li key={item} {...stylex.props(styles.row)}>
            <Text type="large">{item}</Text>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** First sentence of a paragraph (existing copy, reused as a short lead). */
export function firstSentence(text: string) {
  return text.split(/(?<=[.?!])\s/)[0];
}

/** The "Interesse?" band that closes the page. */
export function CtaBand({
  title = 'Interesse?',
  body,
  cta = {label: 'Neem contact op', href: '/contact/'},
}: {
  title?: string;
  body?: string;
  cta?: Cta;
}) {
  return (
    <PageSection isBand paddingBlock={10}>
      <VStack gap={8}>
        <div {...stylex.props(styles.bandTop)}>
          <VStack gap={3} xstyle={styles.measure}>
            <Heading level={2}>{title}</Heading>
            {body ? <Text color="secondary">{body}</Text> : null}
          </VStack>
          <Button
            label={cta.label}
            href={cta.href}
            variant="primary"
            size="lg"
          />
        </div>
        <div {...stylex.props(styles.bandLinks)}>
          <HStack gap={2} wrap="wrap">
            <Button
              label={CONTACT.phone}
              href={CONTACT.phoneHref}
              variant="ghost"
              size="lg"
            />
            <Button
              label={CONTACT.email}
              href={`mailto:${CONTACT.email}`}
              variant="ghost"
              size="lg"
            />
            <Button
              label="LinkedIn"
              href={CONTACT.linkedin}
              variant="ghost"
              size="lg"
            />
          </HStack>
        </div>
      </VStack>
    </PageSection>
  );
}

/** Paragraphs in two balanced columns from 900px, one on phones. */
export function TextColumns({items}: {items: ReadonlyArray<string>}) {
  return (
    <div {...stylex.props(styles.columns)}>
      {items.map(text => (
        <Text key={text} as="p" color="secondary" xstyle={styles.columnItem}>
          {text}
        </Text>
      ))}
    </div>
  );
}

/**
 * An intro set as a statement: its first sentence at the section size, the
 * rest of the same text beneath in two columns. No word is added or dropped.
 */
export function LeadIntro({paragraphs}: {paragraphs: ReadonlyArray<string>}) {
  const [first, ...others] = paragraphs;
  const lead = firstSentence(first);
  const rest = first.slice(lead.length).trim();
  const items = rest ? [rest, ...others] : others;
  return (
    <VStack gap={8} align="start">
      <Text as="p" weight="bold" xstyle={styles.lead}>
        {lead}
      </Text>
      {items.length > 0 ? <TextColumns items={items} /> : null}
    </VStack>
  );
}
