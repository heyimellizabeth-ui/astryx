// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * Stand-in photographs (Hallmark library, Wikimedia Commons), served locally
 * from /public/photos. Mood images only: never on a listing, never standing
 * in for a customer or teammate. The client's own photos replace them later.
 */
export interface Photo {
  src: string;
  width: number;
  height: number;
  alt: string;
  objectPosition: string;
  credit: string;
  licence: string;
  sourceUrl: string;
  slot: string;
}

export const PHOTOS: Record<string, Photo> = {
  heroCanal: {
    src: '/photos/hero-amsterdam-canal-dusk.jpg',
    width: 1920,
    height: 1280,
    alt: 'Verlichte stenen bruggen over een Amsterdamse gracht in de schemering, met grachtenpanden op de achtergrond',
    objectPosition: '50% 55%',
    credit: 'Massimo Catarinella, CC BY-SA 3.0',
    licence: 'CC BY-SA 3.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:KeizersgrachtReguliersgrachtAmsterdam.jpg',
    slot: 'hero',
  },
  ownersEntrance: {
    src: '/photos/owners-brick-entrance-blue-doors.jpg',
    width: 1920,
    height: 1281,
    alt: 'Bakstenen woonblok in de avond met verlichte blauwe voordeuren, weerspiegeld in een plas',
    objectPosition: '55% 45%',
    credit: 'Tom Page, CC BY-SA 2.0',
    licence: 'CC BY-SA 2.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Appartment_building_from_Banner_Street_2024-01-11.jpg',
    slot: 'property-owners',
  },
  makersAtticStudio: {
    src: '/photos/makers-attic-studio-arched-window.jpg',
    width: 1920,
    height: 1080,
    alt: 'Lege zolderruimte met een boogvenster, een houten balk en een zonovergoten vloer',
    objectPosition: '70% 45%',
    credit: 'AlexDS05, CC0',
    licence: 'CC0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Interior_of_Camille_Pissarro_s_studio_at_%C3%89ragny-sur-Epte_-_2026.jpg',
    slot: 'entrepreneurs',
  },
  aboutWindowsill: {
    src: '/photos/about-brick-windowsill-daylight.jpg',
    width: 1920,
    height: 1282,
    alt: 'Groene glazen flessen op een bakstenen vensterbank in zacht daglicht, naast een zinken plantenbak',
    objectPosition: '35% 50%',
    credit: 'Dietmar Rabich, CC BY-SA 4.0',
    licence: 'CC BY-SA 4.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:D%C3%BClmen,_Alte_Brennerei_L%C3%B6hning_--_2015_--_8677-81.jpg',
    slot: 'about',
  },
  aboutStreet: {
    src: '/photos/street-quiet-street-blue-hour.jpg',
    width: 1920,
    height: 1300,
    alt: 'Lege oude straat in het blauwe uur met warme lantaarns en verlichte gevels',
    objectPosition: '50% 50%',
    credit: 'Pudelek, CC BY-SA 4.0',
    licence: 'CC BY-SA 4.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Esztergom_by_night_01_-_Simor_J%C3%A1nos_utca.jpg',
    slot: 'about-alt',
  },
  developersShell: {
    src: '/photos/developers-timber-shell-interior.jpg',
    width: 1920,
    height: 1440,
    alt: 'Kaal interieur van massief houten wanden met raamopeningen waar daglicht door valt',
    objectPosition: '60% 50%',
    credit: 'RoterRolf, CC0',
    licence: 'CC0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Brettsperrholzkonstruktion.jpg',
    slot: 'developers',
  },
};

export const PHOTO_CREDITS_LINE: string =
  "Foto's: " +
  Object.values(PHOTOS)
    .map(p => p.credit)
    .join('; ') +
  ' (Wikimedia Commons).';
