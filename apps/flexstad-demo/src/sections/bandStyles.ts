// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';

/** Flips the text tokens to light values for content on the aubergine band. */
export const bandStyles = stylex.create({
  onBand: {
    '--color-text-primary': 'var(--flex-on-band)',
    '--color-text-secondary': 'var(--flex-on-band-muted)',
    '--focus-outline-color': 'var(--flex-on-band)',
    color: 'var(--flex-on-band)',
  },
});
