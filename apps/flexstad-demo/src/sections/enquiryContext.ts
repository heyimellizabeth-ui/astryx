// Copyright (c) Meta Platforms, Inc. and affiliates.

import {ENQUIRY_ENTRIES, ENQUIRY_WORDS} from '../enquiryConfig';
import {useSearch} from '../router';

export interface EnquiryContext {
  /** The key from ?about=, lower case. */
  key: string;
  /** The banner's heading: "U vraagt naar" or "U reageert op". */
  title: string;
  /** True for a key that only records the page: no banner, nothing filled in. */
  isQuiet: boolean;
  /** The item as shown: its label, with its price for a package. */
  text: string;
  /** The first sentence for the message box. */
  message: string;
  /** The subject line (also sent to Formspree as `_subject`). */
  subject: string;
  changeHref: string;
}

function lowerFirst(value: string): string {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

/**
 * Reads ?about=<key> on the contact page (the enquiry-context plugin, ported
 * to React so the form's state holds the pre-filled text). Only keys in
 * `enquiryConfig.ts` do anything; anything else returns null.
 */
export function useEnquiryContext(): EnquiryContext | null {
  const raw = useSearch().get('about');
  if (!raw) {
    return null;
  }
  const key = raw.trim().toLowerCase();
  if (!Object.prototype.hasOwnProperty.call(ENQUIRY_ENTRIES, key)) {
    return null;
  }
  const entry = ENQUIRY_ENTRIES[key];
  const text = entry.price ? `${entry.label} (${entry.price})` : entry.label;
  if (entry.kind === 'source') {
    return {
      key,
      title: ENQUIRY_WORDS.titleAsk,
      isQuiet: true,
      text: '',
      message: '',
      subject: '',
      changeHref: entry.changeHref,
    };
  }
  const isPackage = entry.kind === 'package';
  const isVacancy = entry.kind === 'vacancy';
  const words = isVacancy
    ? ENQUIRY_WORDS.vacancy
    : isPackage
      ? ENQUIRY_WORDS.package
      : ENQUIRY_WORDS.ask;
  const subjectWords = isVacancy
    ? ENQUIRY_WORDS.subjectVacancy
    : isPackage
      ? ENQUIRY_WORDS.subjectPackage
      : ENQUIRY_WORDS.subjectAsk;
  return {
    key,
    title: isVacancy ? ENQUIRY_WORDS.titleVacancy : ENQUIRY_WORDS.titleAsk,
    isQuiet: false,
    text,
    message: words
      .split('{item}')
      .join(isPackage ? text : lowerFirst(entry.label)),
    subject: subjectWords + text,
    changeHref: entry.changeHref,
  };
}
