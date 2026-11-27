// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {useEffect, useState, type RefObject} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {trackEvent} from '../analytics';
import {useIsNarrow} from '../hooks';

const styles = stylex.create({
  // Fixed to the bottom of a phone screen, above the browser's own bar.
  bar: {
    position: 'fixed',
    insetInline: 0,
    bottom: 0,
    zIndex: 20,
    boxSizing: 'border-box',
    paddingTop: 12,
    paddingInline: 16,
    paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
    backgroundColor: 'var(--color-background-surface)',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border)',
  },
});

/**
 * One button that stays in reach on phones. It appears once the hero button has
 * scrolled away and goes again when the form comes into view or has been
 * passed, so it never covers the form or the footer. The link stays a plain
 * `#reageren` anchor, so it works without JavaScript too.
 */
export function StickyInterestBar({
  heroCta,
  listingSlug,
}: {
  /** The wrapper around the hero's "Ik heb interesse!" button. */
  heroCta: RefObject<HTMLElement | null>;
  listingSlug: string;
}) {
  const isNarrow = useIsNarrow(900);
  // Start hidden, so the bar never flashes before the observers have reported.
  const [heroInView, setHeroInView] = useState(true);
  const [formBelow, setFormBelow] = useState(false);

  useEffect(() => {
    const hero = heroCta.current;
    const form = document.getElementById('reageren');
    if (!isNarrow || !hero || !form) {
      return;
    }
    const heroObserver = new IntersectionObserver(([entry]) =>
      setHeroInView(entry.isIntersecting),
    );
    // The form is "below" only while it has not been reached yet.
    const formObserver = new IntersectionObserver(([entry]) =>
      setFormBelow(
        !entry.isIntersecting && entry.boundingClientRect.top > 0,
      ),
    );
    heroObserver.observe(hero);
    formObserver.observe(form);
    return () => {
      heroObserver.disconnect();
      formObserver.disconnect();
    };
  }, [isNarrow, heroCta]);

  if (!isNarrow || heroInView || !formBelow) {
    return null;
  }
  return (
    <div {...stylex.props(styles.bar)}>
      <Button
        label="Ik heb interesse!"
        href="#reageren"
        variant="primary"
        size="lg"
        width="100%"
        onClick={() =>
          trackEvent('interest_click', {
            listing: listingSlug,
            source: 'sticky_bar',
          })
        }
      />
    </div>
  );
}
