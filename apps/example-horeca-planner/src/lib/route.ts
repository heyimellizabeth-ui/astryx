import {useCallback, useSyncExternalStore} from 'react';

export type View = 'roster' | 'time-off' | 'open-shifts' | 'team' | 'settings';
const VIEWS: readonly View[] = ['roster', 'time-off', 'open-shifts', 'team', 'settings'];

export type Params = Record<string, string | undefined>;

export function hrefFor(view: View, params: Params = {}): string {
  const query = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) query.set(k, v);
  const q = query.toString();
  return `#/${view}${q ? `?${q}` : ''}`;
}

export function parseHash(hash: string): {view: View; params: URLSearchParams} {
  const [path, query = ''] = hash.replace(/^#\/?/, '').split('?');
  const view = VIEWS.find((v) => v === path) ?? 'roster';
  return {view, params: new URLSearchParams(query)};
}

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

/** Shareable state lives in the URL hash: the view, the week and the filters. */
export function useRoute() {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash, () => '');
  const {view, params} = parseHash(hash);
  const navigate = useCallback((next: View, nextParams: Params = {}) => {
    window.location.hash = hrefFor(next, nextParams);
  }, []);
  return {view, params, navigate};
}
