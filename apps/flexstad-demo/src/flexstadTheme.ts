// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * Flexstad theme (unofficial prototype).
 *
 * Extends the neutral theme with the brand colours measured on flexstad.com:
 * orange accent, aubergine ink, Geologica type and pill-shaped controls. The
 * upgrade keeps those anchors and calms the rest: a warm, light paper tinted
 * toward the aubergine, a surface one step above it (never pure white), tighter
 * neutrals, orange for actions and the focus ring only. Every text/surface pair
 * that this file changes is written with both colour modes.
 */

import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

const AUBERGINE = 'oklch(0.314 0.097 312.6)';
const AUBERGINE_DEEP = 'oklch(0.2 0.07 312)';
// The logo's own orange, #F6522A.
const ORANGE = 'oklch(0.66 0.21 34.6)';
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
    // The level inside a padded container (a picture in a card, a plate on a
    // picture): the container radius less its padding, never the same value.
    '--radius-inner': '8px',
    // Heading scale, one rung per role, set larger and tighter than the
    // neutral theme (see design.md, Type scale). Each clamp shrinks on
    // phones so Dutch compounds stay on the line.
    //   h2 (section head)            up to 56px
    //   display-2 (inner page head)  up to 84px
    //   display-1 (homepage head)    up to 84px; Home.tsx sets its own
    //                                76px cap so the head fits the block
    '--text-heading-2-size': 'clamp(32px, 14px + 2.6vw, 56px)',
    '--text-heading-2-leading': '1.06',
    '--text-display-2-size': 'clamp(36px, 12px + 4.6vw, 84px)',
    '--text-display-2-leading': '1.02',
    '--text-display-1-size': 'clamp(40px, 8px + 4.7vw, 84px)',
    '--text-display-1-leading': '1',
    // Large controls (hero and closing actions, form fields) stand 48px tall:
    // hallmark's marketing range is 44 to 52px (gate 39b).
    '--size-element-lg': '48px',
    '--color-accent': [ORANGE, 'oklch(0.74 0.17 40)'],
    '--color-on-accent': [AUBERGINE_DEEP, AUBERGINE_DEEP],
    '--color-text-accent': [ORANGE_TEXT, 'oklch(0.78 0.15 45)'],
    '--color-icon-accent': [ORANGE_TEXT, 'oklch(0.78 0.15 45)'],
    // Paper: L 0.975, chroma 0.006 toward a warm rose (hue 25), a little
    // lighter and warmer than the old lavender wash. Surface sits one step
    // above it, so a card is never a white block on tinted paper.
    '--color-background-body': [
      'oklch(0.975 0.006 25)',
      'oklch(0.17 0.012 310)',
    ],
    '--color-background-surface': [
      'oklch(0.992 0.003 25)',
      'oklch(0.21 0.014 310)',
    ],
    '--color-background-card': [
      'oklch(0.992 0.003 25)',
      'oklch(0.21 0.014 310)',
    ],
    '--color-background-popover': [
      'oklch(0.992 0.003 25)',
      'oklch(0.23 0.014 310)',
    ],
    // Tinted well: the one rung between paper and the aubergine band.
    '--color-background-muted': [
      'oklch(0.94 0.008 20)',
      'oklch(0.25 0.016 310)',
    ],
    '--color-text-primary': [AUBERGINE, 'oklch(0.95 0.008 25)'],
    '--color-text-secondary': ['oklch(0.42 0.025 310)', 'oklch(0.8 0.014 310)'],
    // Hairlines and field edges: one neutral family tinted toward the paper.
    // Field edges need 3:1 against both the paper and the surface.
    '--color-border': [
      'oklch(0.3 0.03 312 / 0.14)',
      'oklch(0.95 0.008 25 / 0.14)',
    ],
    '--color-border-emphasized': [
      'oklch(0.56 0.025 310)',
      'oklch(0.64 0.02 310)',
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
