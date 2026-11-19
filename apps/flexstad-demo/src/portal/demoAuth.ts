// Copyright (c) Meta Platforms, Inc. and affiliates.

import {useSyncExternalStore} from 'react';

/**
 * The demo login. It runs in the browser only, against one published test
 * account, and collects nothing: the typed values live in React state in the
 * login form and are never written to storage, the address, the console or
 * the network. The only things stored are the session flag and the view
 * choice below, both in sessionStorage (gone when the tab closes).
 */

export const DEMO_USERNAME = 'KEESFLEX';
export const DEMO_PASSWORD = '12345678';

export const SESSION_KEY = 'flexstad-demo-session';
export const VIEW_KEY = 'flexstad-demo-view';

export const LOGIN_PATH = '/mijnflexstad/';
export const OVERVIEW_PATH = '/mijnflexstad/overzicht/';

export type DemoView = 'huurder' | 'eigenaar';

/** Username ignores case and outer spaces, the password is exact. */
export function checkDemoLogin(user: string, pass: string): boolean {
  return (
    user.trim().toLowerCase() === DEMO_USERNAME.toLowerCase() &&
    pass === DEMO_PASSWORD
  );
}

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// When sessionStorage is blocked (some private windows), the same two values
// are kept in memory, so the demo still works for as long as the page lives.
const memory: {session: boolean; view: DemoView} = {
  session: false,
  view: 'huurder',
};

function readSession(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1' || memory.session;
  } catch {
    return memory.session;
  }
}

function readView(): DemoView {
  try {
    const value = window.sessionStorage.getItem(VIEW_KEY);
    if (value === 'huurder' || value === 'eigenaar') {
      return value;
    }
  } catch {
    // Falls through to the in-memory value.
  }
  return memory.view;
}

export function startDemoSession() {
  memory.session = true;
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    // Blocked storage: the in-memory flag carries the session.
  }
  emit();
}

export function endDemoSession() {
  memory.session = false;
  memory.view = 'huurder';
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
    window.sessionStorage.removeItem(VIEW_KEY);
  } catch {
    // Nothing to clear when storage is blocked.
  }
  emit();
}

/** True while the demo session flag is set. Reads on every render, no flash. */
export function useDemoSession(): boolean {
  return useSyncExternalStore(subscribe, readSession, () => false);
}

/** The chosen portal view (Huurder or Eigenaar) and its setter. */
export function useDemoView(): [DemoView, (view: DemoView) => void] {
  const view = useSyncExternalStore(
    subscribe,
    readView,
    () => 'huurder' as const,
  );
  function setView(next: DemoView) {
    memory.view = next;
    try {
      window.sessionStorage.setItem(VIEW_KEY, next);
    } catch {
      // Blocked storage: the in-memory choice carries the view.
    }
    emit();
  }
  return [view, setView];
}
