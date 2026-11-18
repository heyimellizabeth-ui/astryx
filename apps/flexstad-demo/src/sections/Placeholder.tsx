// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  frame: {
    width: '100%',
    height: '100%',
    minHeight: 120,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    padding: 16,
    boxSizing: 'border-box',
    color: 'oklch(0.98 0.01 300)',
    fontSize: 13,
    // The caption is generated content: the slot already has its accessible
    // name, and the words are not button text when the slot sits in a button.
    '::after': {content: 'attr(data-caption)'},
  },
});

const HUES = [38, 312, 28, 330, 50, 295];

/**
 * Gradient for slot number `seed`; brand orange and aubergine, dark enough
 * for the light label on top of it (4.5:1 along the whole gradient).
 */
export function placeholderGradient(seed: number) {
  const hue = HUES[Math.abs(seed) % HUES.length];
  return `linear-gradient(145deg, oklch(0.54 0.14 ${hue}), oklch(0.32 0.1 312))`;
}

/** A labelled photo slot. Real photography replaces these once supplied. */
export function Placeholder({
  label,
  seed = 0,
  ratio,
}: {
  label: string;
  seed?: number;
  ratio?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Fotoplaats: ${label}`}
      data-caption={`Foto volgt: ${label}`}
      {...stylex.props(styles.frame)}
      style={{backgroundImage: placeholderGradient(seed), aspectRatio: ratio}}
    />
  );
}

/**
 * A data-URI image, for components that need a `src` (Lightbox). Flat and
 * quiet, the same treatment as `PendingPhoto`: the warm paper well, a hairline
 * frame and the caption, never a colour field pretending to be a photograph.
 */
export function placeholderSrc(label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1067" viewBox="0 0 1600 1067"><rect width="1600" height="1067" fill="oklch(0.94 0.008 20)"/><rect x="24" y="24" width="1552" height="1019" rx="16" fill="none" stroke="oklch(0.56 0.025 310)" stroke-opacity="0.35" stroke-width="2"/><text x="72" y="960" font-family="Geologica, sans-serif" font-size="44" font-weight="700" fill="oklch(0.314 0.097 312.6)">${label}</text><text x="72" y="1012" font-family="Geologica, sans-serif" font-size="32" fill="oklch(0.42 0.025 310)">Foto volgt</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * A photograph the client has not sent yet, drawn as what it is: the muted
 * paper well inside a hairline frame, with the room it will show and
 * "Foto volgt" as a two-line caption that never wraps. No gradient, no
 * stand-in picture. Fills the cell it sits in; `PHOTO_RATIOS` or the grid
 * decides its shape.
 */
export function PendingPhoto({label}: {label: string}) {
  return (
    <span
      data-room={label}
      data-note="Foto volgt"
      {...stylex.props(pending.frame)}
    />
  );
}

const pending = stylex.create({
  frame: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    gap: 2,
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    padding: 16,
    borderRadius: 'var(--radius-container)',
    backgroundColor: 'var(--color-background-muted)',
    outlineWidth: 1,
    outlineStyle: 'solid',
    outlineColor: 'var(--color-border)',
    outlineOffset: -1,
    textAlign: 'start',
    lineHeight: 1.3,
    whiteSpace: 'nowrap',
    // The caption is generated content: the slot is a button that already
    // has its accessible name ("Open foto N van M"), so the words are not
    // button text.
    '::before': {
      content: 'attr(data-room)',
      color: 'var(--color-text-primary)',
      fontSize: 15,
      fontWeight: 500,
    },
    '::after': {
      content: 'attr(data-note)',
      color: 'var(--color-text-secondary)',
      fontSize: 14,
    },
  },
});
