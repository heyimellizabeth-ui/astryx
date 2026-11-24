// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';

/** Flips the text tokens to light values for content on the aubergine band. */
export const bandStyles = stylex.create({
  onBand: {
    '--color-text-primary': 'var(--flex-on-band)',
    '--color-text-secondary': 'var(--flex-on-band-muted)',
    '--color-text-accent': 'var(--flex-on-band)',
    '--color-icon-accent': 'var(--flex-on-band)',
    '--color-border':
      'color-mix(in oklch, var(--flex-on-band) 22%, transparent)',
    '--color-border-emphasized':
      'color-mix(in oklch, var(--flex-on-band) 55%, transparent)',
    '--focus-outline-color': 'var(--flex-on-band)',
    color: 'var(--flex-on-band)',
  },
});

/**
 * The orange band (the closing "Interesse?"): deep aubergine ink on the logo
 * orange, and the primary action turns aubergine so it still stands apart.
 */
export const orangeStyles = stylex.create({
  onOrange: {
    backgroundColor: 'var(--flex-orange)',
    '--color-text-primary': 'var(--flex-on-orange)',
    '--color-text-secondary': 'var(--flex-on-orange)',
    '--color-text-accent': 'var(--flex-on-orange)',
    '--color-accent': 'var(--flex-on-orange)',
    '--color-on-accent': 'var(--flex-on-band)',
    '--color-border':
      'color-mix(in oklch, var(--flex-on-orange) 30%, transparent)',
    '--focus-outline-color': 'var(--flex-on-orange)',
    color: 'var(--flex-on-orange)',
  },
});
