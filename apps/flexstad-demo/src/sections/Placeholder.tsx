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

/** A data-URI image, for components that need a `src` (Lightbox). */
export function placeholderSrc(label: string, seed = 0) {
  const hue = HUES[Math.abs(seed) % HUES.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1067" viewBox="0 0 1600 1067"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="oklch(0.78 0.14 ${hue})"/><stop offset="1" stop-color="oklch(0.46 0.12 312)"/></linearGradient></defs><rect width="1600" height="1067" fill="url(#g)"/><text x="60" y="1000" font-family="sans-serif" font-size="40" fill="#2a1038">Foto volgt: ${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
