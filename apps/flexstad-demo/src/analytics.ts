// Copyright (c) Meta Platforms, Inc. and affiliates.

import {useSyncExternalStore} from 'react';

/**
 * Cookie consent and Google Analytics 4 (Consent Mode v2).
 *
 * Paste the GA4 measurement id (`G-XXXXXXXXXX`) here to switch it on. While it
 * is empty nothing in this file runs: no script loads, no cookie is set and
 * the consent banner stays away, so the site behaves exactly as before.
 *
 * Once it is set, Google's script is not even requested until the visitor
 * accepts. Accepting grants the four Consent Mode v2 signals (analytics
 * storage, ad storage, ad user data, ad personalisation) and loads the tag;
 * declining or withdrawing consent keeps the script away and removes the
 * `_ga` cookies. The choice is kept in this browser only
 * (`localStorage`, key below) and can be changed from the footer.
 */
export const GA_MEASUREMENT_ID = '';

const STORAGE_KEY = 'flexstad-cookie-consent';

export type Consent = 'granted' | 'denied';

/** True when a measurement id is set; false means analytics is off entirely. */
export const isAnalyticsEnabled = GA_MEASUREMENT_ID !== '';

declare global {
  interface Window {
    dataLayer?: unknown[];
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

interface ConsentState {
  consent: Consent | null;
  /** True while the visitor reopened the choice from the footer. */
  isSettingsOpen: boolean;
}

function readStoredConsent(): Consent | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    // Storage can be blocked (private mode, strict settings): ask each visit.
    return null;
  }
}

function storeConsent(consent: Consent) {
  try {
    window.localStorage.setItem(STORAGE_KEY, consent);
  } catch {
    // Not stored; the choice still holds for this visit.
  }
}

let state: ConsentState = {consent: readStoredConsent(), isSettingsOpen: false};
const listeners = new Set<() => void>();

function setState(next: ConsentState) {
  state = next;
  listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

const CONSENT_SIGNALS = [
  'ad_storage',
  'analytics_storage',
  'ad_user_data',
  'ad_personalization',
] as const;

function signals(value: 'granted' | 'denied') {
  return Object.fromEntries(CONSENT_SIGNALS.map(name => [name, value]));
}

function gtag(..._args: unknown[]) {
  window.dataLayer = window.dataLayer ?? [];
  // gtag.js reads queued commands as `arguments` objects, not as arrays.
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

let isTagLoaded = false;

function loadGoogleTag() {
  if (!isAnalyticsEnabled || isTagLoaded) {
    return;
  }
  isTagLoaded = true;
  delete window[`ga-disable-${GA_MEASUREMENT_ID}`];
  // Default denied, then granted: the order Consent Mode v2 expects.
  gtag('consent', 'default', signals('denied'));
  gtag('consent', 'update', signals('granted'));
  gtag('js', new Date());
  // Page views are sent by `trackPageView`, because the site routes on the
  // client and a page load happens only once.
  gtag('config', GA_MEASUREMENT_ID, {send_page_view: false});
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);
}

function removeAnalyticsCookies() {
  const host = window.location.hostname;
  document.cookie.split(';').forEach(part => {
    const name = part.split('=')[0].trim();
    if (name === '_ga' || name.startsWith('_ga_')) {
      for (const domain of ['', `; domain=${host}`, `; domain=.${host}`]) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
      }
    }
  });
}

/** Call once at start: a visitor who accepted earlier gets the tag again. */
export function initAnalytics() {
  if (isAnalyticsEnabled && state.consent === 'granted') {
    loadGoogleTag();
  }
}

/** Records the visitor's choice and applies it at once. */
export function setConsent(consent: Consent) {
  storeConsent(consent);
  setState({consent, isSettingsOpen: false});
  if (!isAnalyticsEnabled) {
    return;
  }
  if (consent === 'granted') {
    loadGoogleTag();
    trackPageView(window.location.pathname);
  } else {
    window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
    if (isTagLoaded) {
      gtag('consent', 'update', signals('denied'));
    }
    removeAnalyticsCookies();
  }
}

/** Shows the choice again (the footer link). */
export function openConsentSettings() {
  setState({...state, isSettingsOpen: true});
}

/** A page view, sent only after consent. */
export function trackPageView(path: string) {
  if (isTagLoaded && state.consent === 'granted') {
    gtag('event', 'page_view', {page_path: path, page_title: document.title});
  }
}

/** A conversion or other event, sent only after consent. */
export function trackEvent(
  name: string,
  params: Record<string, string | number> = {},
) {
  if (isTagLoaded && state.consent === 'granted') {
    gtag('event', name, params);
  }
}

/** What the banner and the footer need: whether to show, and the choice. */
export function useConsent() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    consent: current.consent,
    isBannerVisible:
      isAnalyticsEnabled &&
      (current.consent === null || current.isSettingsOpen),
  };
}
