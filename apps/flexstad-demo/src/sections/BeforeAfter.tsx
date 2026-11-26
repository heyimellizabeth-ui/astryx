// Copyright (c) Meta Platforms, Inc. and affiliates.

import {useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {Badge} from '@astryxdesign/core/Badge';
import {VStack} from '@astryxdesign/core/Layout';
import {Slider} from '@astryxdesign/core/Slider';
import {srcSetFor, type Photo} from '../photos';

const styles = stylex.create({
  frame: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 'var(--radius-container)',
    backgroundColor: 'var(--color-background-muted)',
  },
  fill: {position: 'absolute', inset: 0},
  image: {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  // The "before" photograph lies on top and is cut back to the slider's
  // value, so dragging reveals the "after" photograph beneath it.
  before: (percent: number) => ({
    clipPath: `inset(0 ${100 - percent}% 0 0)`,
  }),
  // The seam: a light rule where the two photographs meet. It follows the
  // value directly (no transition), so nothing animates on its own.
  seam: (percent: number) => ({
    insetInlineStart: `${percent}%`,
  }),
  seamLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3,
    marginInlineStart: -1.5,
    backgroundColor: 'var(--flex-on-band)',
    pointerEvents: 'none',
  },
  // Labels sit on solid plates (the overlay rule): never bare on the photo.
  tags: {
    position: 'absolute',
    insetInline: 16,
    top: 16,
    display: 'flex',
    justifyContent: 'space-between',
    pointerEvents: 'none',
  },
});

/**
 * One space, before and after Flexstad filled it: the "before" photograph is
 * cut back to the Astryx Slider's value, so the slider (and its keyboard
 * steps) wipes between the empty shop and the shop in use.
 */
export function BeforeAfter({
  before,
  after,
  label,
}: {
  before: Photo;
  after: Photo;
  /** The slider's accessible and visible label. */
  label: string;
}) {
  const [percent, setPercent] = useState(50);
  return (
    <VStack gap={4}>
      <AspectRatio ratio={4 / 5} xstyle={styles.frame}>
        <div {...stylex.props(styles.fill)}>
          <img
            src={after.src}
            srcSet={srcSetFor(after)}
            sizes="(min-width: 900px) 560px, 100vw"
            width={after.width}
            height={after.height}
            alt={after.alt}
            loading="lazy"
            decoding="async"
            {...stylex.props(styles.fill, styles.image)}
            style={{objectPosition: after.objectPosition}}
          />
          <img
            src={before.src}
            srcSet={srcSetFor(before)}
            sizes="(min-width: 900px) 560px, 100vw"
            width={before.width}
            height={before.height}
            alt={before.alt}
            loading="lazy"
            decoding="async"
            {...stylex.props(styles.fill, styles.image, styles.before(percent))}
            style={{objectPosition: before.objectPosition}}
          />
          <span
            aria-hidden="true"
            {...stylex.props(styles.seamLine, styles.seam(percent))}
          />
          <div aria-hidden="true" {...stylex.props(styles.tags)}>
            <Badge label="Voor" variant="neutral" />
            <Badge label="Na" variant="neutral" />
          </div>
        </div>
      </AspectRatio>
      <Slider
        label={label}
        value={percent}
        onChange={(value: number) => setPercent(value)}
        min={0}
        max={100}
        step={1}
        valueDisplay="none"
        formatValue={(value: number) => `${value}% voor, ${100 - value}% na`}
      />
    </VStack>
  );
}
