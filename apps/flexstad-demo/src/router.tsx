// Copyright (c) Meta Platforms, Inc. and affiliates.

import {useEffect, useSyncExternalStore, type ReactNode} from 'react';

/**
 * A minimal History API router. Routes mirror the paths of the live
 * flexstad.com site, which end in a slash. Plain `<a href>` links work
 * unchanged: the provider turns same-origin clicks into client navigation.
 */

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('popstate', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('popstate', listener);
  };
}

function normalize(pathname: string) {
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

export function usePath(): string {
  return normalize(
    useSyncExternalStore(
      subscribe,
      () => window.location.pathname,
      () => '/',
    ),
  );
}

export function useSearch(): URLSearchParams {
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => '',
  );
  return new URLSearchParams(search);
}

export function navigate(href: string, options?: {replace?: boolean}) {
  if (options?.replace) {
    window.history.replaceState(null, '', href);
  } else {
    window.history.pushState(null, '', href);
  }
  window.scrollTo(0, 0);
  emit();
}

/** Updates the query string in place (used for filter state). */
export function replaceSearch(params: URLSearchParams) {
  const query = params.toString();
  window.history.replaceState(
    null,
    '',
    `${window.location.pathname}${query ? `?${query}` : ''}`,
  );
  emit();
}

export function RouterProvider({children}: {children: ReactNode}) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = (event.target as Element | null)?.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }
      if (anchor.target && anchor.target !== '_self') {
        return;
      }
      if (anchor.hasAttribute('download')) {
        return;
      }
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) {
        return;
      }
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        url.hash !== ''
      ) {
        return; // in-page anchor
      }
      event.preventDefault();
      navigate(`${url.pathname}${url.search}${url.hash}`);
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
  return <>{children}</>;
}
