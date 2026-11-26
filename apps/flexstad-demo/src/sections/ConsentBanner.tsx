// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {useEffect, useRef} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Link} from '@astryxdesign/core/Link';
import {Text} from '@astryxdesign/core/Text';
import {setConsent, useConsent} from '../analytics';

const styles = stylex.create({
  panel: {
    position: 'fixed',
    zIndex: 30,
    insetInline: 0,
    bottom: 16,
    boxSizing: 'border-box',
    width: 'min(100% - 32px, 720px)',
    marginInline: 'auto',
    padding: {default: 20, '@media (min-width: 640px)': 28},
    color: 'var(--color-text-primary)',
    backgroundColor: 'var(--color-background-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border-emphasized)',
    borderRadius: 'var(--radius-container)',
    boxShadow: 'var(--shadow-high)',
    ':focus': {outlineStyle: 'none'},
  },
  text: {maxWidth: '60ch'},
  // A banner title, not a page title: smaller than the theme's h2 size.
  title: {fontSize: 24, lineHeight: 1.2},
});

/**
 * The cookie choice. It only appears once a GA4 measurement id is set in
 * `analytics.ts`, and again when the visitor opens "Cookie-instellingen".
 * Declining is as easy and as prominent as accepting: the same button style,
 * the same size, side by side.
 */
export function ConsentBanner() {
  const {isBannerVisible, consent} = useConsent();
  const panelRef = useRef<HTMLElement>(null);
  // Reopened from the footer: bring the visitor to the choice. On a first
  // visit the banner does not take focus, so it never interrupts reading.
  const isReopened = isBannerVisible && consent !== null;
  useEffect(() => {
    if (isReopened) {
      panelRef.current?.focus();
    }
  }, [isReopened]);

  if (!isBannerVisible) {
    return null;
  }
  return (
    <section
      ref={panelRef}
      tabIndex={-1}
      aria-labelledby="cookie-title"
      {...stylex.props(styles.panel)}>
      <VStack gap={4} align="start">
        <Heading level={2} id="cookie-title" xstyle={styles.title}>
          Cookies en uw privacy
        </Heading>
        <Text xstyle={styles.text}>
          Wij meten graag hoe onze website wordt gebruikt en hoe onze
          advertenties presteren. Daarvoor gebruiken wij Google Analytics, maar
          alleen met uw toestemming. U kunt uw keuze altijd wijzigen via
          &lsquo;Cookie-instellingen&rsquo; onderaan de pagina. Lees meer in ons{' '}
          <Link href="/privacy/">privacy- en cookiebeleid</Link>.
        </Text>
        <HStack gap={3} wrap="wrap">
          <Button
            label="Alleen noodzakelijke cookies"
            variant="secondary"
            size="lg"
            onClick={() => setConsent('denied')}
          />
          <Button
            label="Alles accepteren"
            variant="secondary"
            size="lg"
            onClick={() => setConsent('granted')}
          />
        </HStack>
      </VStack>
    </section>
  );
}
