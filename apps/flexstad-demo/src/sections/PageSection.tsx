// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import type {ReactNode} from 'react';
import {Section} from '@astryxdesign/core/Section';

const styles = stylex.create({
  centered: {
    marginInlineStart: 'auto',
    marginInlineEnd: 'auto',
    width: '100%',
  },
  wash: {
    backgroundColor: 'var(--color-background-body)',
  },
});

interface PageSectionProps {
  id?: string;
  variant?: 'section' | 'transparent' | 'muted';
  /** Paints the theme's page wash (lavender) behind the band. */
  isWashed?: boolean;
  children: ReactNode;
}

/** A full-width band whose content stays inside a centred column. */
export function PageSection({
  id,
  variant = 'transparent',
  isWashed = false,
  children,
}: PageSectionProps) {
  return (
    <Section
      variant={variant}
      padding={0}
      paddingBlock={10}
      paddingInline={4}
      xstyle={isWashed ? styles.wash : undefined}>
      <div id={id} {...stylex.props(styles.centered)} style={{maxWidth: 1200}}>
        {children}
      </div>
    </Section>
  );
}
