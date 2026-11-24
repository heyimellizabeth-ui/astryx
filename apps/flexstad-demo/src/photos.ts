// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * Flexstad's own photographs, taken from the public flexstad.com pages and
 * served locally from /public/photos/flexstad as WebP. Every listing shows
 * photographs of that property; mood images that the live site presents as a
 * furnished impression are named "Sfeerimpressie" in their alt text, as the
 * live site does.
 */
export interface Photo {
  src: string;
  width: number;
  height: number;
  alt: string;
  objectPosition: string;
}

export const PHOTOS = {
  homeMakerAtelier: {
    src: '/photos/flexstad/home-maker-atelier.webp',
    width: 2560,
    height: 1707,
    alt: 'Een maakster aan het werk in haar atelier, tussen verf, kwasten en kleurstalen bij het raam',
    objectPosition: '70% 40%',
  },
  ownersApartmentFacade: {
    src: '/photos/flexstad/owners-apartment-facade.webp',
    width: 975,
    height: 1300,
    alt: 'Gevel van een modern woongebouw van baksteen en glas tegen een blauwe lucht',
    objectPosition: '50% 40%',
  },
  makersClothingRail: {
    src: '/photos/flexstad/makers-clothing-rail.webp',
    width: 1400,
    height: 934,
    alt: 'Een ondernemer hangt kleding aan een rek in haar winkel vol planten en stoffen',
    objectPosition: '50% 50%',
  },
  municipalitiesOfficeFloor: {
    src: '/photos/flexstad/municipalities-office-floor.webp',
    width: 1400,
    height: 1028,
    alt: 'Lichte, lege kantoorvloer met witte tafels en grote ramen',
    objectPosition: '50% 50%',
  },
  developersDesk: {
    src: '/photos/flexstad/developers-desk.webp',
    width: 1400,
    height: 934,
    alt: 'Een ondernemer werkt aan een bureau met laptop en papieren',
    objectPosition: '50% 50%',
  },
  roemerStaircase: {
    src: '/photos/flexstad/roemer-staircase.webp',
    width: 975,
    height: 1300,
    alt: 'Het trappenhuis aan de Roemer Visscherstraat van bovenaf, met rode loper en witte balustrade',
    objectPosition: '50% 50%',
  },
  roemerFacade: {
    src: '/photos/flexstad/roemer-facade.webp',
    width: 1050,
    height: 1400,
    alt: 'De gevel van het pand aan de Roemer Visscherstraat in Amsterdam, met rode en gele baksteen en een houten erker',
    objectPosition: '50% 35%',
  },
  roemerGarden: {
    src: '/photos/flexstad/roemer-garden.webp',
    width: 965,
    height: 1300,
    alt: 'De groene tuin achter het pand aan de Roemer Visscherstraat',
    objectPosition: '50% 50%',
  },
  roemerRoomPurple: {
    src: '/photos/flexstad/roemer-room-purple.webp',
    width: 975,
    height: 1300,
    alt: 'Een lege ruimte met paarse vloer en een hoog raam, aan de Roemer Visscherstraat',
    objectPosition: '50% 50%',
  },
  roemerRoomPink: {
    src: '/photos/flexstad/roemer-room-pink.webp',
    width: 975,
    height: 1300,
    alt: 'Een lege ruimte met roze vloer en een hoog raam, aan de Roemer Visscherstraat',
    objectPosition: '50% 50%',
  },
  roemerMoodStudio: {
    src: '/photos/flexstad/roemer-mood-studio.webp',
    width: 975,
    height: 1300,
    alt: 'Sfeerimpressie: een studio met bureau, planten en boekenplanken aan de Roemer Visscherstraat',
    objectPosition: '50% 50%',
  },
  roemerMood1: {
    src: '/photos/flexstad/roemer-mood-1.webp',
    width: 940,
    height: 1178,
    alt: 'Sfeerimpressie: een praktijkruimte met bureau en twee stoelen',
    objectPosition: '50% 50%',
  },
  roemerMood2: {
    src: '/photos/flexstad/roemer-mood-2.webp',
    width: 876,
    height: 1168,
    alt: 'Sfeerimpressie: een vergaderruimte met ovale tafel bij openslaande tuindeuren',
    objectPosition: '50% 50%',
  },
  roemerMood3: {
    src: '/photos/flexstad/roemer-mood-3.webp',
    width: 1500,
    height: 1111,
    alt: 'Sfeerimpressie: een team in overleg aan tafel in een lichte kamer',
    objectPosition: '50% 50%',
  },
  roemerMood4: {
    src: '/photos/flexstad/roemer-mood-4.webp',
    width: 904,
    height: 1182,
    alt: 'Sfeerimpressie: de entree met Moorse bogen en de trap',
    objectPosition: '50% 50%',
  },
  roemerMood5: {
    src: '/photos/flexstad/roemer-mood-5.webp',
    width: 938,
    height: 1172,
    alt: 'Sfeerimpressie: een spreekkamer met ronde tafel en paarse vloer',
    objectPosition: '50% 50%',
  },
  molenExterior: {
    src: '/photos/flexstad/molen-exterior.webp',
    width: 1500,
    height: 998,
    alt: 'Het kantoorgebouw De Molen in Houten, met bloemen in het gras ervoor',
    objectPosition: '50% 60%',
  },
  molenHall: {
    src: '/photos/flexstad/molen-hall.webp',
    width: 973,
    height: 1300,
    alt: 'Een lange ruimte met yogamatten in De Molen',
    objectPosition: '50% 50%',
  },
  molenLounge: {
    src: '/photos/flexstad/molen-lounge.webp',
    width: 1400,
    height: 1050,
    alt: 'Een ruimte met zithoek en werkplekken in De Molen',
    objectPosition: '50% 50%',
  },
  molenMood1: {
    src: '/photos/flexstad/molen-mood-1.webp',
    width: 1400,
    height: 1050,
    alt: 'Sfeerimpressie: een werkruimte met bureaus en blauwe vloer in De Molen',
    objectPosition: '50% 50%',
  },
  molenMood2: {
    src: '/photos/flexstad/molen-mood-2.webp',
    width: 1400,
    height: 1050,
    alt: 'Sfeerimpressie: een kantoor met zithoek en vergadertafel in De Molen',
    objectPosition: '50% 50%',
  },
  molenMood3: {
    src: '/photos/flexstad/molen-mood-3.webp',
    width: 1400,
    height: 1050,
    alt: 'Sfeerimpressie: een privékantoor met bureau in De Molen',
    objectPosition: '50% 50%',
  },
  molenMood4: {
    src: '/photos/flexstad/molen-mood-4.webp',
    width: 1400,
    height: 1050,
    alt: 'Sfeerimpressie: een open werkruimte met lange tafel in De Molen',
    objectPosition: '50% 50%',
  },
  molenRoom1: {
    src: '/photos/flexstad/molen-room-1.webp',
    width: 1400,
    height: 1050,
    alt: 'Een praktijkruimte met bureau en stoelen in De Molen',
    objectPosition: '50% 50%',
  },
  molenRoom2: {
    src: '/photos/flexstad/molen-room-2.webp',
    width: 1400,
    height: 1050,
    alt: 'Een kantoorvloer met werkplekken en een keuken in De Molen',
    objectPosition: '50% 50%',
  },
  molenOffice1: {
    src: '/photos/flexstad/molen-office-1.webp',
    width: 1600,
    height: 1065,
    alt: 'Een kantoorruimte met oranje vloer en werkplekken in De Molen',
    objectPosition: '50% 50%',
  },
  molenOffice2: {
    src: '/photos/flexstad/molen-office-2.webp',
    width: 1600,
    height: 1065,
    alt: 'Een open kantoorruimte met blauwe vloer in De Molen',
    objectPosition: '50% 50%',
  },
  molenOffice3: {
    src: '/photos/flexstad/molen-office-3.webp',
    width: 1600,
    height: 1065,
    alt: 'Een kantoorruimte met vergadertafel en blauwe vloer in De Molen',
    objectPosition: '50% 50%',
  },
  winkelwaardExterior: {
    src: '/photos/flexstad/winkelwaard-exterior.webp',
    width: 1537,
    height: 1023,
    alt: 'Het kantoorgebouw aan de Winkelwaard in Alkmaar, met het Flexstad-bord bij de ingang',
    objectPosition: '40% 60%',
  },
  winkelwaard1: {
    src: '/photos/flexstad/winkelwaard-1.webp',
    width: 1600,
    height: 1067,
    alt: 'Een gang met kantoordeuren aan de Winkelwaard',
    objectPosition: '50% 50%',
  },
  winkelwaard2: {
    src: '/photos/flexstad/winkelwaard-2.webp',
    width: 1600,
    height: 1067,
    alt: 'Een hoekruimte met ramen aan de Winkelwaard',
    objectPosition: '50% 50%',
  },
  winkelwaard3: {
    src: '/photos/flexstad/winkelwaard-3.webp',
    width: 1600,
    height: 1067,
    alt: 'Een gang met glazen wanden aan de Winkelwaard',
    objectPosition: '50% 50%',
  },
  winkelwaard4: {
    src: '/photos/flexstad/winkelwaard-4.webp',
    width: 1600,
    height: 1067,
    alt: 'Een lege kantoorruimte met blauwe vloer aan de Winkelwaard',
    objectPosition: '50% 50%',
  },
  winkelwaard5: {
    src: '/photos/flexstad/winkelwaard-5.webp',
    width: 1600,
    height: 1067,
    alt: 'Een lege kantoorruimte met uitzicht op de straat aan de Winkelwaard',
    objectPosition: '50% 50%',
  },
  winkelwaardMood1: {
    src: '/photos/flexstad/winkelwaard-mood-1.webp',
    width: 1400,
    height: 1050,
    alt: 'Sfeerimpressie: een kantoor met bureau en planten aan de Winkelwaard',
    objectPosition: '50% 50%',
  },
  winkelwaardMood2: {
    src: '/photos/flexstad/winkelwaard-mood-2.webp',
    width: 1400,
    height: 1050,
    alt: 'Sfeerimpressie: een open kantoor met keuken en vergadertafel aan de Winkelwaard',
    objectPosition: '50% 50%',
  },
  winkelwaardMood3: {
    src: '/photos/flexstad/winkelwaard-mood-3.webp',
    width: 1400,
    height: 1050,
    alt: 'Sfeerimpressie: een kantoor met werkplekken en een zithoek aan de Winkelwaard',
    objectPosition: '50% 50%',
  },
  winkelwaardYoga: {
    src: '/photos/flexstad/winkelwaard-yoga.webp',
    width: 1500,
    height: 1000,
    alt: 'Sfeerimpressie: een yogaruimte met matten aan de Winkelwaard',
    objectPosition: '50% 50%',
  },
  linnaeusStorefront: {
    src: '/photos/flexstad/linnaeus-storefront.webp',
    width: 1050,
    height: 1400,
    alt: 'De winkelpui aan de Linnaeusstraat, met kleding in de etalage',
    objectPosition: '45% 40%',
  },
  linnaeusBefore: {
    src: '/photos/flexstad/linnaeus-before.webp',
    width: 1600,
    height: 1200,
    alt: 'De lege winkelruimte aan de Linnaeusstraat, voor de invulling',
    objectPosition: '50% 50%',
  },
  linnaeusBefore2: {
    src: '/photos/flexstad/linnaeus-before-2.webp',
    width: 1600,
    height: 1200,
    alt: 'De lege winkelruimte aan de Linnaeusstraat met de pui op de achtergrond',
    objectPosition: '50% 50%',
  },
  linnaeusBefore3: {
    src: '/photos/flexstad/linnaeus-before-3.webp',
    width: 1500,
    height: 1000,
    alt: 'De lege winkelruimte aan de Linnaeusstraat, kale wanden en houten vloer',
    objectPosition: '50% 50%',
  },
  linnaeusAfter: {
    src: '/photos/flexstad/linnaeus-after.webp',
    width: 1050,
    height: 1400,
    alt: 'Dezelfde winkelruimte als African fashion store, met kleding, paspoppen en planten',
    objectPosition: '45% 50%',
  },
  linnaeusAfter2: {
    src: '/photos/flexstad/linnaeus-after-2.webp',
    width: 1050,
    height: 1400,
    alt: 'De African fashion store aan de Linnaeusstraat, met een tafel vol sieraden',
    objectPosition: '50% 50%',
  },
  linnaeusAfter3: {
    src: '/photos/flexstad/linnaeus-after-3.webp',
    width: 1050,
    height: 1400,
    alt: 'Kleding en planten in de African fashion store',
    objectPosition: '50% 50%',
  },
  linnaeusAfter4: {
    src: '/photos/flexstad/linnaeus-after-4.webp',
    width: 1050,
    height: 1400,
    alt: 'De toonbank en kledingrekken in de African fashion store',
    objectPosition: '50% 50%',
  },
  linnaeusAfter5: {
    src: '/photos/flexstad/linnaeus-after-5.webp',
    width: 1050,
    height: 1400,
    alt: 'Kleding en planten in de African fashion store, met de pui achterin',
    objectPosition: '50% 50%',
  },
  linnaeusAfter6: {
    src: '/photos/flexstad/linnaeus-after-6.webp',
    width: 1050,
    height: 1400,
    alt: 'Een paspop met jurk naast de tafel in de African fashion store',
    objectPosition: '50% 50%',
  },
  linnaeusAfter7: {
    src: '/photos/flexstad/linnaeus-after-7.webp',
    width: 1050,
    height: 1400,
    alt: 'Kledingrekken en de pui van de African fashion store',
    objectPosition: '50% 50%',
  },
  linnaeusAfter8: {
    src: '/photos/flexstad/linnaeus-after-8.webp',
    width: 1050,
    height: 1400,
    alt: 'Schappen en paspoppen in de African fashion store',
    objectPosition: '50% 50%',
  },
  aboutWindowLight: {
    src: '/photos/flexstad/about-window-light.webp',
    width: 1440,
    height: 730,
    alt: 'Een lege ruimte met zonlicht door de lamellen en een plant bij het raam',
    objectPosition: '50% 50%',
  },
  aboutOfficeFloor: {
    src: '/photos/flexstad/about-office-floor.webp',
    width: 1800,
    height: 1201,
    alt: 'Een lichte, lege kantoorvloer met glazen gevel en uitzicht op bomen',
    objectPosition: '50% 50%',
  },
} satisfies Record<string, Photo>;

type PhotoKey = keyof typeof PHOTOS;

/** The cover and the gallery of each listing, in the order the page shows them. */
export const LISTING_PHOTOS: Record<
  string,
  {cover: Photo; gallery: ReadonlyArray<Photo>}
> = {
  'roemer-visscherstraat': {
    cover: PHOTOS.roemerFacade,
    gallery: (
      [
        'roemerFacade',
        'roemerStaircase',
        'roemerGarden',
        'roemerRoomPurple',
        'roemerRoomPink',
        'roemerMoodStudio',
        'roemerMood1',
        'roemerMood2',
        'roemerMood3',
        'roemerMood4',
        'roemerMood5',
      ] as PhotoKey[]
    ).map(name => PHOTOS[name]),
  },
  'de-molen': {
    cover: PHOTOS.molenExterior,
    gallery: (
      [
        'molenExterior',
        'molenLounge',
        'molenHall',
        'molenRoom1',
        'molenRoom2',
        'molenOffice1',
        'molenOffice2',
        'molenOffice3',
        'molenMood1',
        'molenMood2',
        'molenMood3',
        'molenMood4',
      ] as PhotoKey[]
    ).map(name => PHOTOS[name]),
  },
  'winkelwaard-494': {
    cover: PHOTOS.winkelwaardExterior,
    gallery: (
      [
        'winkelwaardExterior',
        'winkelwaard1',
        'winkelwaard2',
        'winkelwaard3',
        'winkelwaard4',
        'winkelwaard5',
        'winkelwaardMood1',
        'winkelwaardMood2',
        'winkelwaardMood3',
        'winkelwaardYoga',
      ] as PhotoKey[]
    ).map(name => PHOTOS[name]),
  },
  linnaeusstraat: {
    cover: PHOTOS.linnaeusStorefront,
    gallery: (
      [
        'linnaeusStorefront',
        'linnaeusAfter',
        'linnaeusAfter2',
        'linnaeusAfter3',
        'linnaeusAfter4',
        'linnaeusAfter5',
        'linnaeusAfter6',
        'linnaeusAfter7',
        'linnaeusAfter8',
        'linnaeusBefore',
        'linnaeusBefore2',
        'linnaeusBefore3',
      ] as PhotoKey[]
    ).map(name => PHOTOS[name]),
  },
};

/** Credit for the footer: every photograph is Flexstad's own. */
export const PHOTO_CREDITS_LINE = "Foto's: Flexstad.";

/** The narrower WebP files cut for each photograph (only where it is wider). */
const VARIANT_WIDTHS = [640, 1024] as const;

/**
 * A `srcSet` for a photograph: its 640 and 1024px cuts (made only when the
 * original is at least 15% wider) and the original, so a phone or a small
 * tile never downloads the full file. Pair it with a `sizes` for the layout.
 */
export function srcSetFor(photo: Photo): string {
  const base = photo.src.replace(/\.webp$/, '');
  const cuts = VARIANT_WIDTHS.filter(width => photo.width > width * 1.15).map(
    width => `${base}-${width}.webp ${width}w`,
  );
  return [...cuts, `${photo.src} ${photo.width}w`].join(', ');
}
