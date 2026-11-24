// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import type {ReactNode} from 'react';
import type {Photo} from '../photos';
import {bandStyles} from './bandStyles';
import {PhotoImage} from './ui';

const rise = stylex.keyframes({
  from: {opacity: 0, transform: 'translateY(56px)'},
  to: {opacity: 1, transform: 'translateY(0)'},
});

const settle = stylex.keyframes({
  from: {transform: 'scale(1.08)'},
  to: {transform: 'scale(1)'},
});

const MOTION = '@media (prefers-reduced-motion: no-preference)';
const WIDE = '@media (min-width: 900px)';

const styles = stylex.create({
  hero: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    height: {default: 'auto', [WIDE]: 'calc(100dvh - 73px)'},
    minHeight: {default: 0, [WIDE]: 620},
    maxHeight: {default: 'none', [WIDE]: 940},
  },
  photo: {
    position: {default: 'relative', [WIDE]: 'absolute'},
    inset: 0,
    height: {default: 'clamp(260px, 66vw, 460px)', [WIDE]: 'auto'},
    overflow: 'hidden',
    animationName: {default: 'none', [MOTION]: settle},
    animationDuration: '1.8s',
    animationTimingFunction: 'var(--flex-ease)',
    animationFillMode: 'both',
    // A light aubergine tint draws the photograph toward the brand; words
    // never sit on the photograph itself, only on the block.
    '::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      backgroundColor: 'var(--flex-band)',
      opacity: 0.14,
      mixBlendMode: 'multiply',
      pointerEvents: 'none',
    },
  },
  column: {
    position: 'relative',
    boxSizing: 'border-box',
    width: {default: '100%', [WIDE]: 'min(100% - 32px, 1200px)'},
    marginInline: 'auto',
  },
  block: {
    boxSizing: 'border-box',
    width: {default: '100%', [WIDE]: 'min(100%, 900px)'},
    backgroundColor: 'var(--flex-band)',
    borderStartStartRadius: {default: 0, [WIDE]: 'var(--radius-container)'},
    borderStartEndRadius: {default: 0, [WIDE]: 'var(--radius-container)'},
    paddingInline: 'clamp(16px, 4vw, 56px)',
    paddingTop: 'clamp(32px, 4.4vw, 60px)',
    paddingBottom: 'clamp(32px, 3.4vw, 48px)',
    animationName: {default: 'none', [MOTION]: rise},
    animationDuration: '1.1s',
    animationDelay: '0.15s',
    animationTimingFunction: 'var(--flex-ease)',
    animationFillMode: 'both',
  },
});

/**
 * The Rise: a photograph fills the first screen and an aubergine block rises
 * out of the band below into it, carrying the page's head, its sentence or
 * facts, and its action. Put an aubergine band (or nothing) directly after it
 * so block and band read as one. The photograph is the route's LCP.
 */
export function RiseHero({
  photo,
  label,
  children,
}: {
  photo: Photo;
  /** Accessible name of the section. */
  label: string;
  /** The block's content: head, sentence or facts, actions. */
  children: ReactNode;
}) {
  return (
    <section aria-label={label} {...stylex.props(styles.hero)}>
      <div {...stylex.props(styles.photo)}>
        <PhotoImage photo={photo} isPriority isBleed isFilled />
      </div>
      <div {...stylex.props(styles.column)}>
        <div {...stylex.props(styles.block, bandStyles.onBand)}>{children}</div>
      </div>
    </section>
  );
}
