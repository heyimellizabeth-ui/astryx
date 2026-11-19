// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * FICTIONAL SAMPLE DATA for the demo portal. Nothing here is real: Kees, the
 * addresses, the dates, the amounts and the messages are invented for the
 * test environment and do not describe any Flexstad listing, tenant, owner or
 * price. Keep it that way: never paste a real address, person or price here.
 */

export const SAMPLE_USER = 'Kees';

export interface TenantSpace {
  type: string;
  address: string;
  area: string;
  since: string;
  contractUntil: string;
  status: string;
  monthly: string;
  nextPayment: string;
}

export const TENANT_SPACE: TenantSpace = {
  type: 'Atelier',
  address: 'Voorbeeldstraat 12, Alkmaar',
  area: '48 m²',
  since: '1 maart 2025',
  contractUntil: '28 februari 2027',
  status: 'Actief',
  monthly: '€ 385,00',
  nextPayment: '1 december 2026',
};

export interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: string;
  status: 'betaald' | 'open';
}

export const TENANT_INVOICES: ReadonlyArray<Invoice> = [
  {
    id: 'f4',
    number: 'VB-2026-011',
    date: '1 november 2026',
    amount: '€ 385,00',
    status: 'open',
  },
  {
    id: 'f3',
    number: 'VB-2026-010',
    date: '1 oktober 2026',
    amount: '€ 385,00',
    status: 'betaald',
  },
  {
    id: 'f2',
    number: 'VB-2026-009',
    date: '1 september 2026',
    amount: '€ 385,00',
    status: 'betaald',
  },
  {
    id: 'f1',
    number: 'VB-2026-008',
    date: '1 augustus 2026',
    amount: '€ 385,00',
    status: 'betaald',
  },
];

export const REPORT_CATEGORIES = [
  'Onderhoud',
  'Schoonmaak',
  'Sleutels en toegang',
  'Overig',
] as const;

export interface SampleMessage {
  id: string;
  date: string;
  title: string;
  body: string;
}

export const TENANT_MESSAGES: ReadonlyArray<SampleMessage> = [
  {
    id: 'm1',
    date: '12 november 2026',
    title: 'Planning onderhoud',
    body: 'Voorbeeldbericht: volgende week donderdag wordt de verwarming in het gebouw gecontroleerd.',
  },
  {
    id: 'm2',
    date: '29 oktober 2026',
    title: 'Je melding is opgelost',
    body: 'Voorbeeldbericht: de lamp in de gang is vervangen. Laat het weten als het weer misgaat.',
  },
  {
    id: 'm3',
    date: '2 oktober 2026',
    title: 'Welkom in de demo',
    body: 'Voorbeeldbericht: dit is een testomgeving met verzonnen gegevens.',
  },
];

export type ObjectStatus = 'bezet' | 'leeg' | 'in voorbereiding';

export interface OwnerObject {
  id: string;
  address: string;
  type: string;
  status: ObjectStatus;
  occupantSince: string;
  lastInspection: string;
}

export const OWNER_OBJECTS: ReadonlyArray<OwnerObject> = [
  {
    id: 'o1',
    address: 'Voorbeeldstraat 12, Alkmaar',
    type: 'Kantoor',
    status: 'bezet',
    occupantSince: '1 maart 2025',
    lastInspection: '14 oktober 2026',
  },
  {
    id: 'o2',
    address: 'Proefplein 3, Alkmaar',
    type: 'Winkelruimte',
    status: 'bezet',
    occupantSince: '1 juni 2025',
    lastInspection: '14 oktober 2026',
  },
  {
    id: 'o3',
    address: 'Testlaan 40, Alkmaar',
    type: 'Praktijkruimte',
    status: 'leeg',
    occupantSince: 'Niet van toepassing',
    lastInspection: '2 september 2026',
  },
  {
    id: 'o4',
    address: 'Demokade 7, Alkmaar',
    type: 'Opslag',
    status: 'in voorbereiding',
    occupantSince: 'Niet van toepassing',
    lastInspection: '20 augustus 2026',
  },
];

export interface Inspection {
  id: string;
  date: string;
  address: string;
  result: 'goedgekeurd' | 'aandachtspunt';
  note: string;
}

export const OWNER_INSPECTIONS: ReadonlyArray<Inspection> = [
  {
    id: 'i1',
    date: '14 oktober 2026',
    address: 'Voorbeeldstraat 12, Alkmaar',
    result: 'goedgekeurd',
    note: 'Voorbeeld: geen bijzonderheden.',
  },
  {
    id: 'i2',
    date: '14 oktober 2026',
    address: 'Proefplein 3, Alkmaar',
    result: 'aandachtspunt',
    note: 'Voorbeeld: een deurscharnier moet worden nagekeken.',
  },
  {
    id: 'i3',
    date: '2 september 2026',
    address: 'Testlaan 40, Alkmaar',
    result: 'goedgekeurd',
    note: 'Voorbeeld: de ruimte is leeg en schoon.',
  },
];

export interface SampleDocument {
  id: string;
  title: string;
  detail: string;
}

export const OWNER_DOCUMENTS: ReadonlyArray<SampleDocument> = [
  {
    id: 'd1',
    title: 'Gebruiksovereenkomst Voorbeeldstraat 12',
    detail: 'Voorbeelddocument, PDF',
  },
  {
    id: 'd2',
    title: 'Inspectierapport oktober 2026',
    detail: 'Voorbeelddocument, PDF',
  },
  {
    id: 'd3',
    title: 'Overzicht van de kosten, derde kwartaal',
    detail: 'Voorbeelddocument, PDF',
  },
];
