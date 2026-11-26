// Copyright (c) Meta Platforms, Inc. and affiliates.

import {useEffect, useRef} from 'react';

/**
 * The language picker (public/lang/): Dutch is the only real language, every
 * other language is translated by Google Translate after the visitor picks it.
 * Nothing from Google loads before that choice.
 *
 * The plugin builds its own DOM, once. The header swaps between a desktop and
 * a phone variant, which would destroy that DOM, so the picker lives in a
 * stash element on <body> and this component only parks it in the current host.
 */

const SCRIPT_ID = 'lp-script';
const STASH_ID = 'lp-stash';
let scriptLoading: Promise<void> | null = null;

function getStash(): HTMLElement {
  let stash = document.getElementById(STASH_ID);
  if (!stash) {
    stash = document.createElement('div');
    stash.id = STASH_ID;
    stash.hidden = true;
    document.body.appendChild(stash);
  }
  return stash;
}

function loadPicker(): Promise<void> {
  if (!scriptLoading) {
    scriptLoading = new Promise(resolve => {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = '/lang/lang-picker.js';
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.body.appendChild(script);
    });
  }
  return scriptLoading;
}

export function LanguagePicker() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return undefined;
    }
    let cancelled = false;
    const existing = document.querySelector<HTMLElement>('.lp-root');
    if (existing) {
      host.appendChild(existing);
    } else {
      loadPicker().then(() => {
        // The script builds the picker inside whichever host was current when
        // it ran; whichever host is still mounted now takes it over.
        const built = document.querySelector<HTMLElement>('.lp-root');
        if (!built) {
          return;
        }
        if (cancelled) {
          getStash().appendChild(built);
        } else {
          host.appendChild(built);
        }
      });
    }
    return () => {
      cancelled = true;
      const root = host.querySelector<HTMLElement>('.lp-root');
      if (root) {
        getStash().appendChild(root);
      }
    };
  }, []);

  return <div ref={hostRef} className="lp-host notranslate" translate="no" />;
}
