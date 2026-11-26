// Copyright (c) Meta Platforms, Inc. and affiliates.

import {useSyncExternalStore} from 'react';

/** True below the width where the desktop top bar no longer fits. */
export function useIsNarrow(maxWidth = 900): boolean {
  return useSyncExternalStore(
    listener => {
      const query = window.matchMedia(`(max-width: ${maxWidth}px)`);
      query.addEventListener('change', listener);
      return () => query.removeEventListener('change', listener);
    },
    () => window.matchMedia(`(max-width: ${maxWidth}px)`).matches,
    () => false,
  );
}
