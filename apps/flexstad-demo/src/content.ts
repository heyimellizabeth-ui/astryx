// Copyright (c) Meta Platforms, Inc. and affiliates.

/** Dutch copy for the prototype, taken from the public flexstad.com homepage. */

export type ListingStatus = 'available' | 'unavailable';

export interface Listing {
  slug: string;
  name: string;
  city: string;
  status: ListingStatus;
  facts: ReadonlyArray<{label: string; value: string}>;
}

export interface NavLink {
  title: string;
  href: string;
}

export const NAV_FOR_WHO: NavLink[] = [
  {title: 'Vastgoedeigenaren', href: '/vastgoedeigenaren/'},
  {title: 'Ondernemers', href: '/ondernemers/'},
  {title: 'Gemeenten', href: '/gemeenten/'},
  {title: 'Ontwikkelaars', href: '/ontwikkelaars/'},
];

export const NAV_ABOUT: NavLink[] = [
  {title: 'Over ons', href: '/over-ons/'},
  {title: 'Vacatures', href: '/vacatures/'},
];

export const AUDIENCES: NavLink[] = [
  {title: 'Ik heb leegstaand vastgoed', href: '/vastgoedeigenaren/'},
  {title: 'Ik zoek tijdelijke ruimte', href: '/ondernemers/'},
  {title: 'Ik zoek een maatschappelijke oplossing', href: '/gemeenten/'},
  {title: 'Ik zoek ontwikkelkansen', href: '/ontwikkelaars/'},
];

export const TAGS = ['Tijdelijk', 'Flexibel', 'Betaalbaar'] as const;

export const LISTINGS: Listing[] = [
  {
    slug: 'roemer-visscherstraat',
    name: 'Roemer Visscherstraat',
    city: 'Amsterdam',
    status: 'available',
    facts: [
      {label: 'Ruimtes', value: 'vanaf 12 m²'},
      {label: 'Prijs', value: 'vanaf €500 p/m'},
      {label: 'Totaal', value: '321 m²'},
    ],
  },
  {
    slug: 'de-molen',
    name: 'De Molen',
    city: 'Houten',
    status: 'available',
    facts: [
      {label: 'Ruimtes', value: 'vanaf 18 m²'},
      {label: 'Prijs', value: 'vanaf €250 p/m'},
      {label: 'Totaal', value: '1045 m²'},
    ],
  },
  {
    slug: 'winkelwaard-494',
    name: 'Winkelwaard',
    city: 'Alkmaar',
    status: 'available',
    facts: [
      {label: 'Ruimtes', value: 'vanaf 10 m²'},
      {label: 'Prijs', value: 'vanaf €250 p/m'},
      {label: 'Totaal', value: '1371 m²'},
    ],
  },
  {
    slug: 'linnaeusstraat',
    name: 'Linnaeusstraat',
    city: 'Amsterdam',
    status: 'unavailable',
    facts: [{label: 'Totaal', value: '100 m²'}],
  },
];

export interface FaqGroup {
  id: string;
  title: string;
  items: ReadonlyArray<{question: string; answer: string}>;
}

/** Shortened: the live site lists 14 questions in three groups. */
export const FAQ: FaqGroup[] = [
  {
    id: 'zoekers',
    title: 'Ruimtezoekenden',
    items: [
      {
        question: 'Hoe schrijf ik me in?',
        answer:
          'Via de inschrijfpagina laat je weten welke ruimte je zoekt. Wij nemen contact met je op zodra er iets past.',
      },
      {
        question: 'Voor hoe lang is een ruimte beschikbaar?',
        answer:
          'Tijdelijk en flexibel: de looptijd hangt af van het pand en de plannen van de eigenaar.',
      },
    ],
  },
  {
    id: 'eigenaren',
    title: 'Vastgoedeigenaren',
    items: [
      {
        question: 'Hoe helpt Flexstad bij leegstand?',
        answer:
          'Wij activeren, beheren en exploiteren het pand met tijdelijke gebruikers, zodat het actief, veilig en van waarde blijft.',
      },
      {
        question: 'Welke gebruikers komen in mijn pand?',
        answer:
          'Ondernemers, makers en maatschappelijke initiatieven, passend bij het pand.',
      },
    ],
  },
  {
    id: 'algemeen',
    title: 'Algemeen',
    items: [
      {
        question: 'In welke regio werkt Flexstad?',
        answer: 'Op dit moment in Amsterdam, Alkmaar en Houten.',
      },
    ],
  },
];

export const BUDGETS = [
  {value: '250-500', label: '€250 – €500'},
  {value: '500-750', label: '€500 – €750'},
  {value: '750-1000', label: '€750 – €1000'},
  {value: '1000-1500', label: '€1000 – €1500'},
  {value: '1500+', label: '€1500 of meer'},
];
