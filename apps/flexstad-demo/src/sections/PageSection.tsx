// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import type {ReactNode} from 'react';
import {Section} from '@astryxdesign/core/Section';
import {bandStyles} from './bandStyles';

const styles = stylex.create({
  centered: {
    marginInlineStart: 'auto',
    marginInlineEnd: 'auto',
    width: '100%',
  },
  // One vertical rhythm for every seam: about 112px at desktop, 80px on phones.
  rhythm: {paddingBlock: 'clamp(16px, 3vw, 32px)'},
  wash: {backgroundColor: 'var(--color-background-body)'},
  band: {backgroundColor: 'var(--flex-band)'},
});

interface PageSectionProps {
  id?: string;
  variant?: 'section' | 'transparent' | 'muted';
  /** Paints the theme's page wash (lavender) behind the band. */
  isWashed?: boolean;
  /** Paints the dark aubergine band and flips text tokens to light. */
  isBand?: boolean;
  paddingBlock?: 6 | 8 | 10;
  maxWidth?: number;
  /** Keeps the content to a reading measure, left-aligned on the column edge. */
  measure?: number;
  children: ReactNode;
}

/** A full-width band whose content stays inside a centred column. */
export function PageSection({
  id,
  variant = 'transparent',
  isWashed = false,
  isBand = false,
  paddingBlock = 6,
  maxWidth = 1200,
  measure,
  children,
}: PageSectionProps) {
  return (
    <Section
      variant={variant}
      padding={0}
      paddingBlock={paddingBlock}
      paddingInline={4}
      xstyle={
        isBand
          ? [styles.band, bandStyles.onBand]
          : isWashed
            ? styles.wash
            : undefined
      }>
      <div
        id={id}
        {...stylex.props(styles.centered, styles.rhythm)}
        style={{maxWidth}}>
        {measure ? <div style={{maxWidth: measure}}>{children}</div> : children}
      </div>
    </Section>
  );
}
