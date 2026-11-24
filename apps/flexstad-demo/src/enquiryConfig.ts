// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * ENQUIRY CONTEXT: the one file to edit (from the enquiry-context plugin 1.0.0).
 *
 * A link to the contact page can carry a key:  /contact/?about=de-molen
 * The contact page then shows "Je vraagt naar: De Molen, Houten (vanaf €250 p/m)",
 * fills the subject and the first sentence of the message, and sends the key
 * along with the form. An unknown key, or no key, changes nothing.
 *
 * kind 'package': something with a price (a listing).
 * kind 'inquiry': a question about something, no price (an audience).
 * The listings are read from content.ts, so their prices always match the
 * prices printed on the site. Add or change audiences below.
 */

import {LISTINGS} from './content';

/**
 * Formspree: paste the form's endpoint here, for example
 * 'https://formspree.io/f/abcdwxyz' (formspree.io → your form → Integration).
 * Leave it empty to send the contact form to Asana only.
 * The address is public by design; it is not a secret.
 */
export const FORMSPREE_ENDPOINT = '';

export interface EnquiryEntry {
  label: string;
  price: string;
  kind: 'package' | 'inquiry';
  /** Where the banner's "Wijzig" link goes back to. */
  changeHref: string;
}

export const ENQUIRY_WORDS = {
  package: 'Hoi, ik heb interesse in {item}. ',
  ask: 'Hoi, ik wil graag meer weten over {item}. ',
  subjectPackage: 'Interesse: ',
  subjectAsk: 'Vraag: ',
} as const;

function listingEntries(): Record<string, EnquiryEntry> {
  const entries: Record<string, EnquiryEntry> = {};
  for (const listing of LISTINGS) {
    const price = listing.facts.find(fact => fact.label === 'Prijs')?.value;
    entries[listing.slug] = {
      label: `${listing.name}, ${listing.city}`,
      price: price ?? '',
      kind: price ? 'package' : 'inquiry',
      changeHref: '/aanbod/',
    };
  }
  return entries;
}

export const ENQUIRY_ENTRIES: Record<string, EnquiryEntry> = {
  ...listingEntries(),
  vastgoedeigenaren: {
    label: 'Leegstaand vastgoed',
    price: '',
    kind: 'inquiry',
    changeHref: '/voor-wie/',
  },
  ondernemers: {
    label: 'Tijdelijke ruimte',
    price: '',
    kind: 'inquiry',
    changeHref: '/voor-wie/',
  },
  gemeenten: {
    label: 'Een maatschappelijke oplossing',
    price: '',
    kind: 'inquiry',
    changeHref: '/voor-wie/',
  },
  ontwikkelaars: {
    label: 'Ontwikkelkansen',
    price: '',
    kind: 'inquiry',
    changeHref: '/voor-wie/',
  },
};
