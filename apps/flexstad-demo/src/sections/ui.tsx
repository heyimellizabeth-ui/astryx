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
  heroGrid: {
    display: 'grid',
    gap: 48,
    alignItems: 'center',
    gridTemplateColumns: {
      default: '1fr',
      '@media (min-width: 900px)': '1.5fr 1fr',
    },
  },
  photo: {
    borderRadius: 'var(--radius-container)',
    overflow: 'hidden',
  },
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
}: {
  label: string;
  seed?: number;
  ratio?: string;
}) {
  return (
    <div {...stylex.props(styles.photo)}>
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
  photoLabel?: string;
  seed?: number;
  /** Larger display headline for the homepage. */
  isHome?: boolean;
}

/** Asymmetric split: text left, tall photo slot right. Collapses on phones. */
export function PageHero({
  trail,
  title,
  intro,
  ctas,
  photoLabel,
  seed = 0,
  isHome = false,
}: PageHeroProps) {
  return (
    <PageSection isWashed paddingBlock={isHome ? 10 : 8}>
      <VStack gap={5}>
        {trail ? <Crumbs trail={trail} /> : null}
        <div {...stylex.props(photoLabel ? styles.heroGrid : undefined)}>
          <Reveal>
            <VStack gap={5} align="start">
              <Heading level={1} type="display-2">
                {title}
              </Heading>
              {intro ? (
                <Text type="supporting" color="secondary">
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
                      variant={index === 0 ? 'primary' : 'secondary'}
                    />
                  ))}
                </HStack>
              ) : null}
            </VStack>
          </Reveal>
          {photoLabel ? (
            <Photo label={photoLabel} seed={seed} ratio="4 / 5" />
          ) : null}
        </div>
      </VStack>
    </PageSection>
  );
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
      <HStack justify="between" align="center" wrap="wrap" gap={6}>
        <VStack gap={2}>
          <Heading level={2}>{title}</Heading>
          {body ? <Text color="secondary">{body}</Text> : null}
          <HStack gap={2} wrap="wrap">
            <Button
              label={CONTACT.phone}
              href={CONTACT.phoneHref}
              variant="ghost"
            />
            <Button
              label={CONTACT.email}
              href={`mailto:${CONTACT.email}`}
              variant="ghost"
            />
            <Button label="LinkedIn" href={CONTACT.linkedin} variant="ghost" />
          </HStack>
        </VStack>
        <Button label={cta.label} href={cta.href} variant="primary" size="lg" />
      </HStack>
    </PageSection>
  );
}
