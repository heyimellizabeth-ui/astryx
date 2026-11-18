// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * Flexstad theme (unofficial prototype).
 *
 * Extends the neutral theme with the brand colours measured on flexstad.com:
 * orange accent, aubergine headings, lavender page wash, Geologica type and
 * pill-shaped controls. Every text/surface pair that this file changes is
 * written with both colour modes.
 */

import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

const AUBERGINE = 'oklch(0.314 0.097 312.6)';
const AUBERGINE_DEEP = 'oklch(0.2 0.07 312)';
const ORANGE = 'oklch(0.7 0.19 38)';
const ORANGE_TEXT = 'oklch(0.5 0.17 34)';

export const flexstadTheme = defineTheme({
  name: 'flexstad',
  extends: neutralTheme,
  typography: {
    scale: {base: 17, ratio: 1.25},
    body: {
      family: 'Geologica',
      fallbacks: '-apple-system, system-ui, "Segoe UI", sans-serif',
    },
    heading: {
      family: 'Geologica',
      fallbacks: '-apple-system, system-ui, "Segoe UI", sans-serif',
      weight: 'bold',
      weights: {1: 'bold', 2: 'bold'},
    },
  },
  radius: {base: 6, multiplier: 1.5},
  tokens: {
    // One 16px corner for every card, tile, panel and photo frame.
    '--radius-container': '16px',
    // Heading scale, one rung per role (hallmark gate 78: section heads at
    // 40px or more at 1440). Each clamp lands on the rung's 1440px size and
    // shrinks on phones so Dutch compounds stay on the line.
    //   h2 (section head)            44px at 1440, 48px cap
    //   display-2 (inner page head)  64px at 1440, 68px cap
    //   display-1 (homepage head)    83px at 1440, 88px cap
    '--text-heading-2-size': 'clamp(30px, 16px + 1.95vw, 48px)',
    '--text-heading-2-leading': '1.15',
    '--text-display-2-size': 'clamp(36px, 14px + 3.5vw, 68px)',
    '--text-display-2-leading': '1.1',
    '--text-display-1-size': 'clamp(40px, 8px + 5.2vw, 88px)',
    '--text-display-1-leading': '1.08',
    // Large controls (hero and closing actions, form fields) stand 48px tall:
    // hallmark's marketing range is 44 to 52px (gate 39b).
    '--size-element-lg': '48px',
    '--color-accent': [ORANGE, 'oklch(0.74 0.17 40)'],
    '--color-on-accent': [AUBERGINE_DEEP, AUBERGINE_DEEP],
    '--color-text-accent': [ORANGE_TEXT, 'oklch(0.78 0.15 45)'],
    '--color-icon-accent': [ORANGE_TEXT, 'oklch(0.78 0.15 45)'],
    '--color-background-body': [
      'oklch(0.953 0.009 280)',
      'oklch(0.2 0.03 310)',
    ],
    '--color-background-surface': ['#FFFFFF', 'oklch(0.25 0.04 310)'],
    '--color-background-card': ['#FFFFFF', 'oklch(0.25 0.04 310)'],
    '--color-text-primary': [AUBERGINE, 'oklch(0.94 0.012 300)'],
    '--color-text-secondary': ['oklch(0.45 0.03 305)', 'oklch(0.78 0.02 300)'],
    // Field edges need 3:1 against both the page wash and the white surface.
    '--color-border-emphasized': [
      'oklch(0.58 0.03 305)',
      'oklch(0.64 0.03 305)',
    ],
    '--focus-outline-color': [ORANGE_TEXT, 'oklch(0.78 0.15 45)'],
  },
  components: {
    button: {
      base: {
        borderRadius: 'var(--radius-full)',
        fontWeight: 'var(--font-weight-medium)',
      },
    },
    badge: {base: {borderRadius: 'var(--radius-full)'}},
    token: {base: {borderRadius: 'var(--radius-full)'}},
    'clickable-card': {
      base: {
        borderRadius: 'var(--radius-container)',
        ':hover': {transform: 'translateY(-2px)'},
      },
    },
  },
});
