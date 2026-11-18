// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * Dutch copy for the site. Page text is copied from the public flexstad.com
 * pages (read from their HTML). Only typography changes: the old site's long
 * dashes are written as hyphens, and numbered headings lose their numbers.
 */

export type ListingStatus = 'available' | 'soon' | 'unavailable';

export interface Listing {
  slug: string;
  /** Feature lines the live homepage cards carry under the facts. */
  features?: ReadonlyArray<string>;
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
    features: ['Meerdere units beschikbaar'],
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
    features: ['Meerdere units beschikbaar', 'Volledige invulling mogelijk'],
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

export const CONTACT = {
  phone: '+31 (0)85 060 35 39',
  phoneHref: 'tel:+31850603539',
  email: 'info@flexstad.com',
  linkedin: 'https://www.linkedin.com/company/flexstad-com',
  address: 'Winkelwaard 494, 1824 HX Alkmaar',
  kvk: 'KVK: 97494828',
} as const;

export interface FaqGroup {
  id: string;
  title: string;
  items: ReadonlyArray<{question: string; answer: string}>;
}

export const FAQ: FaqGroup[] = [
  {
    id: 'zoekers',
    title: 'Ruimtezoekende',
    items: [
      {
        question: 'Hoe kan ik mij inschrijven?',
        answer:
          'U kunt zich eenvoudig inschrijven via ons inschrijfformulier. Zodra er een ruimte beschikbaar komt die aansluit bij uw wensen, nemen wij contact met u op.',
      },
      {
        question: 'Welke soorten ruimtes biedt Flexstad aan?',
        answer:
          'Wij bieden onder andere werkruimtes, ateliers, kantoorruimtes, opslagruimtes, bedrijfsruimtes en soms woonruimtes. Het aanbod wisselt regelmatig.',
      },
      {
        question: 'Zijn de ruimtes tijdelijk beschikbaar?',
        answer:
          'Ja. Flexstad werkt voornamelijk met tijdelijke gebruiksovereenkomsten. De beschikbare periode verschilt per locatie.',
      },
      {
        question: 'Kan ik meerdere locaties of ruimtes opgeven?',
        answer:
          'Ja, tijdens uw inschrijving kunt u aangeven waarnaar u op zoek bent. Zo kunnen wij u beter matchen met beschikbaar aanbod.',
      },
      {
        question: 'Wat kost een ruimte?',
        answer:
          'De kosten verschillen per locatie en type ruimte. Op de aanbodpagina vindt u per object de actuele prijs en voorwaarden.',
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
          'Wij activeren leegstaand vastgoed door het tijdelijk beschikbaar te stellen aan zorgvuldig geselecteerde gebruikers. Zo blijft uw pand in gebruik, wordt het beter beveiligd en kan het rendement opleveren.',
      },
      {
        question: 'Met wat voor gebruikers werkt Flexstad?',
        answer:
          'Afhankelijk van het pand plaatsen wij onder andere ondernemers, creatieve makers, maatschappelijke organisaties en andere passende gebruikers.',
      },
      {
        question: 'Zit ik vast aan langdurige huurcontracten?',
        answer:
          'Nee. Flexstad werkt met flexibele gebruiksovereenkomsten, zodat u uw vastgoed kunt terugnemen wanneer dat nodig is, bijvoorbeeld voor verkoop, renovatie of herontwikkeling.',
      },
      {
        question: 'Verzorgt Flexstad ook het beheer?',
        answer:
          'Ja. Wij kunnen zowel het technisch als sociaal beheer verzorgen en zijn het aanspreekpunt voor de gebruikers gedurende de gebruiksperiode.',
      },
      {
        question: 'Kan Flexstad ook complete opvanglocaties realiseren?',
        answer:
          'Ja. Flexstad heeft ervaring met het transformeren en inrichten van gebouwen voor tijdelijke opvang. Daarnaast kunnen wij het technisch en sociaal beheer van deze locaties verzorgen.',
      },
      {
        question: 'Welke soorten vastgoed beheren jullie?',
        answer:
          'Wij werken onder andere met kantoren, bedrijfsgebouwen, maatschappelijk vastgoed, scholen, zorgvastgoed en andere leegstaande objecten.',
      },
    ],
  },
  {
    id: 'algemeen',
    title: 'Algemeen',
    items: [
      {
        question: 'In welke regio is Flexstad actief?',
        answer:
          'Flexstad is actief op meerdere locaties in Nederland. Ons aanbod wordt continu uitgebreid.',
      },
      {
        question: 'Hoe snel kan een pand in gebruik worden genomen?',
        answer:
          'Dat hangt af van de locatie en de gewenste invulling. In veel gevallen kunnen wij binnen korte tijd geschikte gebruikers plaatsen.',
      },
      {
        question: 'Waarom kiezen voor Flexstad?',
        answer:
          'Wij combineren leegstandsbeheer met tijdelijke exploitatie. Hierdoor blijft vastgoed veilig en actief in gebruik, terwijl eigenaren profiteren van flexibiliteit, professioneel beheer en een passende invulling.',
      },
    ],
  },
];

export interface Cta {
  label: string;
  href: string;
}

export interface AudiencePageData {
  slug: string;
  navTitle: string;
  heading: string;
  intro: string[];
  sections?: ReadonlyArray<{title: string; body: string[]}>;
  bulletsTitle?: string;
  bullets?: string[];
  closing?: {title: string; body: string[]};
  cta: Cta;
}

const CONTACT_CTA: Cta = {label: 'Neem contact op', href: '/contact/'};

export const AUDIENCE_PAGES: Record<string, AudiencePageData> = {
  vastgoedeigenaren: {
    slug: 'vastgoedeigenaren',
    navTitle: 'Vastgoedeigenaren',
    heading: 'Leegstand brengt risico’s met zich mee',
    intro: [
      'Kraak, vandalisme, verloedering en oplopende beheerkosten; Flexstad helpt vastgoedeigenaren om leegstaand vastgoed tijdelijk en verantwoord in gebruik te geven.',
      'Door ondernemers, creatieve makers, maatschappelijke organisaties en andere passende gebruikers in uw pand te plaatsen, ontstaat er weer activiteit. Een levendig pand is beter beveiligd, wordt beter onderhouden én kan een aantrekkelijk rendement opleveren tijdens de leegstandsperiode.',
      'Wij werken met flexibele gebruiksovereenkomsten, waardoor u altijd de vrijheid behoudt om uw vastgoed beschikbaar te maken voor verkoop, renovatie, herontwikkeling of eigen gebruik. Zo profiteert u van een actieve invulling, zonder langdurige verplichtingen.',
      'Van de werving en selectie van gebruikers tot het technisch en sociaal beheer: Flexstad verzorgt het volledige traject en ontzorgt u van A tot Z.',
    ],
    bulletsTitle: 'Waarom kiezen voor Flexstad?',
    bullets: [
      'Activering van leegstaand vastgoed',
      'Flexibele gebruiksovereenkomsten zonder langdurige verplichtingen',
      'Minder risico op kraak, vandalisme en verloedering',
      'Tijdelijke inkomsten tijdens leegstand',
      'Technisch én sociaal beheer',
      'Eén aanspreekpunt voor beheer, exploitatie en begeleiding',
    ],
    cta: CONTACT_CTA,
  },
  ondernemers: {
    slug: 'ondernemers',
    navTitle: 'Ondernemers',
    heading: 'Ruimte voor ondernemen, zonder langdurige verplichtingen',
    intro: [
      'Zoekt u een betaalbare werk-, opslag- of bedrijfsruimte? Flexstad helpt ondernemers aan beschikbare ruimtes in leegstaand vastgoed. Van kantoorruimte en ateliers tot opslag- en bedrijfsunits: wij denken mee en zoeken een passende oplossing.',
      'Met tijdelijke verhuur profiteert u van flexibiliteit, lagere kosten en een snelle beschikbaarheid. Ideaal voor startende ondernemers, groeiende bedrijven of tijdelijke projecten.',
    ],
    cta: {label: 'Bekijk ons aanbod', href: '/aanbod/'},
  },
  gemeenten: {
    slug: 'gemeenten',
    navTitle: 'Gemeenten',
    heading: 'Van leegstand naar maatschappelijke meerwaarde',
    intro: [
      'Flexstad ondersteunt gemeenten bij het tijdelijk beheren, transformeren en invullen van leegstaand vastgoed. Door gebouwen actief te benutten, worden risico’s zoals vandalisme, kraak en achteruitgang beperkt, terwijl vastgoed zijn waarde behoudt.',
      'Daarnaast heeft Flexstad ruime ervaring met het realiseren van tijdelijke opvanglocaties. Wij begeleiden het volledige traject: van de transformatie en inrichting van panden tot het technisch en sociaal beheer tijdens de gebruiksperiode. Hierdoor kunnen gemeenten snel beschikken over veilige, functionele en professioneel beheerde locaties.',
      'Of het nu gaat om leegstandsbeheer, tijdelijke huisvesting of maatschappelijke opvang; wij denken mee over een passende oplossing en nemen de uitvoering uit handen.',
    ],
    cta: CONTACT_CTA,
  },
  ontwikkelaars: {
    slug: 'ontwikkelaars',
    navTitle: 'Ontwikkelaars',
    heading: 'Ik zoek ontwikkelkansen',
    intro: [
      'Projectontwikkelaars hebben regelmatig te maken met locaties die nog niet direct ontwikkeld kunnen worden. In de tussentijd kan leegstand risico’s en kosten met zich meebrengen.',
      'Flexstad helpt projectontwikkelaars met tijdelijke exploitatie, maatschappelijk gebruik en professioneel beheer van vastgoed in de periode vóór verkoop, renovatie of herontwikkeling.',
    ],
    sections: [
      {
        title: 'Tijdelijke invulling met toekomstwaarde',
        body: [
          'Wij zorgen ervoor dat locaties actief en representatief blijven terwijl toekomstige plannen worden voorbereid. Door tijdelijke invulling met ondernemers, maatschappelijke initiatieven of opvangfuncties blijft vastgoed in gebruik en kan het rendement opleveren.',
          'Daarnaast komt Flexstad door haar werkzaamheden in leegstandsbeheer regelmatig locaties tegen met ontwikkelpotentie. Daardoor kunnen wij ook meedenken over nieuwe kansen en samenwerkingen.',
        ],
      },
      {
        title: 'Ook voor opvanglocaties en maatschappelijke invulling',
        body: [
          'Flexstad heeft ervaring met het opzetten van tijdelijke opvanglocaties. Wij kunnen ondersteunen bij transformatie, inrichting, technisch beheer en sociaal beheer.',
          'Door onze contacten met gemeenten kunnen wij een verbindende rol spelen tussen ontwikkelaars, vastgoedeigenaren en publieke partijen.',
        ],
      },
    ],
    bulletsTitle: 'Waarom samenwerken met Flexstad?',
    bullets: [
      'Tijdelijke exploitatie van locaties in aanloop naar ontwikkeling',
      'Beheer en invulling tijdens planvorming of vergunningstrajecten',
      'Maatschappelijke invulling van vastgoed',
      'Ervaring met opvanglocaties',
      'Netwerk bij gemeenten en vastgoedeigenaren',
      'Signalering van mogelijke ontwikkellocaties',
      'Samenwerking op basis van wederzijdse kansen',
    ],
    closing: {
      title: 'Op zoek naar ontwikkellocaties?',
      body: [
        'Schrijf u in en geef aan naar welk type locaties u zoekt. Denk aan transformatielocaties, woonlocaties, zorgvastgoed, maatschappelijk vastgoed, bedrijfslocaties of andere kansrijke objecten.',
        'Na inschrijving nemen wij persoonlijk contact met u op om de mogelijkheden te bespreken.',
      ],
    },
    cta: CONTACT_CTA,
  },
};

export const ABOUT = {
  heading: 'Flexstad houdt leegstand actief, veilig en van waarde.',
  story: [
    'Flexstad is ontstaan vanuit de overtuiging dat leegstand geen probleem hoeft te zijn, maar een kans. Veel eigenaren krijgen te maken met risico’s, kosten en onzekerheid wanneer vastgoed tijdelijk leegstaat. Flexstad biedt een praktische oplossing: wij activeren leegstaand vastgoed met passende gebruikers, professioneel beheer en flexibele afspraken.',
    'De afgelopen jaren hebben wij meer dan 2.000 bewoners en ondernemers een plek gegeven in leegstaande panden. Daarbij werkten wij ook met maatschappelijke doelgroepen, zoals Oekraïense vluchtelingen, statushouders en ouderen. Zo krijgen gebouwen tijdelijk een waardevolle bestemming en blijven ze veilig, beheerd en van betekenis voor de omgeving.',
    'Wij geloven dat vastgoed niet stil hoeft te staan. Door tijdelijke invulling met ondernemers, makers, maatschappelijke initiatieven of tijdelijke huisvesting blijft een pand in gebruik. Dat beperkt risico’s zoals kraak, vandalisme en verloedering, terwijl eigenaren profiteren van flexibiliteit, beheer en waar mogelijk rendement.',
    'Voor gemeenten en projectontwikkelaars denken wij bovendien mee over maatschappelijke invulling, opvanglocaties en tijdelijke exploitatie in de periode voorafgaand aan verkoop, renovatie of herontwikkeling.',
  ],
  mission: {
    title: 'Onze Missie',
    body: 'Wij zetten leegstaand vastgoed om in waarde. Dat doen we door panden professioneel te beheren, risico’s te beperken en tijdelijke invulling mogelijk te maken. Zo blijft vastgoed niet onbenut, maar levert het rendement en draagt het bij aan een veilige en leefbare omgeving.',
  },
  vision: {
    title: 'Onze visie',
    body: 'Wij geloven in steden waar leegstand geen gaten in de wijk vormt, maar kansen creëert. Of het nu gaat om tijdelijke huisvesting, een pop-up store of het beschermen van een kantoorpand, FlexStad zorgt dat gebouwen een betekenisvolle rol blijven spelen. Daarmee creëren we waarde voor eigenaren én voor de samenleving.',
  },
  reasonsTitle: 'Waarom Flexstad?',
  reasons: [
    'Meer dan 2.000 bewoners en ondernemers geplaatst',
    'Ervaring met leegstandsbeheer, tijdelijke verhuur en opvanglocaties',
    'Technisch en sociaal beheer',
    'Flexibele overeenkomsten',
    'Netwerk met gemeenten, eigenaren en ontwikkelaars',
    'Praktische, ondernemende aanpak',
  ],
  meetTitle: 'Kennismaken?',
  meet: 'Heeft u leegstaand vastgoed, zoekt u tijdelijke ruimte of wilt u sparren over maatschappelijke invulling of ontwikkelkansen?',
};

export const VACANCY = {
  title: 'Vacature: Allround klusjesman / onderhoudsmedewerker',
  meta: 'Regio Houten | 2 tot 3 dagen per week | Mogelijkheid tot uitbreiding',
  intro: [
    'Flexstad zoekt een zelfstandige en veelzijdige klusjesman voor het onderhouden en gebruiksklaar maken van verschillende panden en ruimtes. De werkzaamheden vinden voornamelijk plaats in Houten en omgeving.',
    'Geen werkdag is hetzelfde. De ene dag plaats je een keuken of douche-unit, de andere dag verhelp je een lekkende kraan, hang je verlichting op of plaats je een tussenwand. We zoeken iemand die praktisch is ingesteld, netjes werkt en zelfstandig oplossingen kan bedenken.',
    'Je start voor 2 tot 3 vaste dagen per week. Wanneer de samenwerking goed verloopt en de werkzaamheden toenemen, bestaat de mogelijkheid om dit later uit te breiden.',
  ],
  blocks: [
    {
      title: 'Wat ga je doen?',
      lead: 'Je houdt je onder andere bezig met:',
      items: [
        'Plaatsen en monteren van keukens;',
        'Installeren van douche-units;',
        'Plaatsen en afwerken van tussenwanden;',
        'Ophangen en aansluiten van lampen;',
        'Verhelpen van lekkende kranen en kleine lekkages;',
        'Uitvoeren van timmer-, montage- en herstelwerkzaamheden;',
        'Onderhouden en gebruiksklaar maken van ruimtes;',
        'Signaleren en uitvoeren van noodzakelijk onderhoud.',
      ],
      after:
        'Je werkt op verschillende locaties en krijgt veel vrijheid om je werkzaamheden zelfstandig uit te voeren.',
    },
    {
      title: 'Wie zoeken wij?',
      lead: 'We zoeken iemand die:',
      items: [
        'Ervaring heeft met onderhouds-, montage- en kluswerkzaamheden;',
        'Breed inzetbaar en technisch handig is;',
        'Zelfstandig en oplossingsgericht kan werken;',
        'Betrouwbaar is en afspraken nakomt;',
        'Netjes en zorgvuldig werkt;',
        'Bij voorkeur in Houten of omgeving woont;',
        'Beschikbaar is voor 2 tot 3 dagen per week;',
        'Ervoor openstaat om in de toekomst eventueel meer dagen te werken.',
      ],
      after:
        'Een rijbewijs is belangrijk. Het is fijn wanneer je beschikt over een eigen auto of werkbus. Eigen basisgereedschap is een pré.',
    },
    {
      title: 'Wat bieden wij?',
      items: [
        'Afwisselende werkzaamheden op verschillende locaties;',
        'In eerste instantie 2 tot 3 vaste werkdagen per week;',
        'Mogelijkheid om het aantal werkdagen later uit te breiden;',
        'Veel zelfstandigheid en verantwoordelijkheid;',
        'Korte lijnen binnen een praktische en ondernemende organisatie;',
        'Werk waarbij je direct zichtbaar resultaat behaalt;',
        'Een passende vergoeding en verdere voorwaarden in overleg.',
      ],
    },
  ],
  about: {
    title: 'Over Flexstad',
    body: [
      'Flexstad is een ondernemende leegstandsbeheerder die vastgoed actief en veilig in gebruik houdt, leegstandsrisico’s beperkt en bijdraagt aan het behoud van de waarde van het vastgoed.',
      'Wij verbinden vastgoedeigenaren, ondernemers, gemeenten en projectontwikkelaars. Met tijdelijke invulling en flexibele overeenkomsten zorgen we ervoor dat panden niet langdurig leegstaan. Ondernemers, bewoners en maatschappelijke initiatieven krijgen tijdelijk passende ruimte, terwijl vastgoedeigenaren de risico’s van leegstand beperken.',
      'Als klusjesman speel je hierin een belangrijke rol. Dankzij jouw werk kunnen ruimtes snel, veilig en netjes in gebruik worden genomen en blijven onze locaties goed onderhouden.',
    ],
  },
  apply: {
    title: 'Interesse?',
    body: [
      'Ben jij de praktische en betrouwbare klusjesman die wij zoeken? Stuur ons dan een korte reactie met informatie over je ervaring, beschikbaarheid en de werkzaamheden die je eerder hebt uitgevoerd.',
      'Foto’s of voorbeelden van eerder werk zijn welkom. We maken graag kennis met je.',
    ],
  },
};

export const SERVICES: Record<
  string,
  {
    slug: string;
    title: string;
    heading: string;
    body: string;
    bulletsTitle: string;
    bulletsIntro: string;
    bullets: string[];
    closing: string;
  }
> = {
  leegstandsbeheer: {
    slug: 'leegstandsbeheer',
    title: 'Leegstandsbeheer',
    heading: 'Vanaf de eerste stap',
    body: 'Ben je projectontwikkelaar en zoek je een locatie, maar twijfel je over de haalbaarheid? Wij denken vanaf de eerste stap mee. Dankzij ons netwerk binnen gemeenten en vastgoedeigenaren signaleren wij kansen vroegtijdig. Zo kunnen we helpen bij het vinden van geschikte locaties én het verzorgen van flexibele exploitatie, zodat je direct rendement genereert in plaats van een kostenpost.',
    bulletsTitle: 'Beveiliging en rendement',
    bulletsIntro:
      'Leegstand brengt risico’s met zich mee: inbraak, vandalisme, kraak of verval. FlexStad biedt professioneel leegstandsbeheer dat uw vastgoed veilig, verzorgd en rendabel houdt, met anti kraak oplossingen die de leegstaande panden beschermen.',
    bullets: [
      'Bescherming van leegstaande panden',
      'Toezicht en regelmatige controles',
      'Behoud van waarde en uitstraling',
    ],
    closing:
      'Met FlexStad kiest u voor zekerheid en een betrouwbare partner die leegstand omzet in kansen, zodat u flexibel wonen en werken mogelijk maakt.',
  },
  projectontwikkeling: {
    slug: 'projectontwikkeling',
    title: 'Projectontwikkeling',
    heading: 'Vanaf de eerste stap',
    body: 'Ben je projectontwikkelaar en zoek je een locatie, maar twijfel je over de haalbaarheid? Wij denken vanaf de eerste stap mee. Dankzij ons netwerk binnen gemeenten en vastgoedeigenaren signaleren wij kansen vroegtijdig. Zo kunnen we helpen bij het vinden van geschikte locaties én het verzorgen van flexibele exploitatie, zodat je direct rendement genereert in plaats van een kostenpost.',
    bulletsTitle: 'Beveiliging en rendement',
    bulletsIntro:
      'Leegstand brengt risico’s met zich mee: inbraak, vandalisme, kraak of verval. FlexStad biedt professioneel leegstandsbeheer dat uw vastgoed veilig, verzorgd en rendabel houdt, met anti kraak oplossingen die de leegstaande panden beschermen.',
    bullets: [
      'Bescherming van leegstaande panden',
      'Toezicht en regelmatige controles',
      'Behoud van waarde en uitstraling',
    ],
    closing:
      'Met FlexStad kiest u voor zekerheid en een betrouwbare partner die leegstand omzet in kansen, zodat u flexibel wonen en werken mogelijk maakt.',
  },
};

/** Long description of the Roemer Visscherstraat listing. */
export const ROEMER_DETAIL = {
  address: 'Roemer Visscherstraat 24, Amsterdam',
  headline:
    'Karakteristieke kantoor-, opslag- en praktijkruimtes vanaf €500 p/m, nabij het Vondelpark',
  lead: 'Een eigen werkplek op een bijzondere locatie in Amsterdam, met de mogelijkheid om flexibel gebruik te maken van een exclusieve ontvangstruimte met tuin.',
  intro: [
    'Aan de Roemer Visscherstraat 24, op steenworp afstand van het Vondelpark, biedt FlexStad de laatste compacte kantoor- en praktijkruimtes aan.',
    'In dit karakteristieke pand uit 1894 combineren we de charme van een klassiek Amsterdams herenhuis met de flexibiliteit die moderne ondernemers zoeken.',
    'De hoge plafonds, grote raampartijen, authentieke details en rustige uitstraling maken het pand bijzonder geschikt voor zelfstandige professionals die waarde hechten aan een inspirerende en representatieve werkomgeving.',
  ],
  sections: [
    {
      title: 'Jouw eigen kantoor- of praktijkruimte, circa 12 m²',
      body: [
        'Ben je zelfstandig ondernemer en zoek je een prettige, professionele werkplek zonder hoge vaste lasten?',
        'De laatste beschikbare ruimtes hebben een oppervlakte van circa 12 m² en zijn ideaal voor ondernemers die voornamelijk zelfstandig werken.',
        'Vanaf €500 per maand, inclusief servicekosten en gas, water en elektra bij normaal gebruik, exclusief btw.',
      ],
      listTitle: 'De ruimtes zijn onder andere geschikt voor:',
      list: [
        'Coaches, therapeuten en andere gesprekgerichte professionals',
        'Consultants en zakelijke adviseurs',
        'Creatieve ondernemers en ontwerpers',
        'Freelancers en zelfstandige dienstverleners',
        'Startende ondernemers die een professioneel vestigingsadres zoeken.',
      ],
      after:
        'De ruimtes worden standaard leeg aangeboden, zodat je deze naar eigen wens kunt inrichten. Daarnaast is het in overleg mogelijk om de kantoor- of praktijkruimte gemeubileerd aan te bieden, waarbij we samen afspraken maken over de inrichting en eventuele bijkomende kosten.',
    },
    {
      title:
        'Het beste van twee werelden: een eigen kantoor én een exclusieve tuinruimte',
      body: [
        'Wat deze locatie bijzonder maakt, is dat je als huurder niet beperkt bent tot je eigen werkruimte.',
        'Op de begane grond bevindt zich een prachtige, representatieve ruimte met openslaande deuren naar een groene, beschutte stadstuin.',
        'Deze ruimte is bijzonder geschikt voor klantgesprekken, coachingsessies, zakelijke afspraken, vergaderingen en kleinschalige bijeenkomsten.',
      ],
      listTitle:
        'Als vaste huurder van een kantoorruimte profiteer je van een exclusief gereduceerd tarief:',
      list: [
        'Regulier tarief: €75 per uur',
        'Exclusief huurderstarief: €50 per uur',
        'Reserveringen per uur of dagdeel mogelijk',
        'Gebruik op basis van beschikbaarheid',
      ],
      after:
        'Hierdoor kun je bijvoorbeeld een eigen kantoor huren voor €600 per maand en alleen wanneer dat nodig is gebruikmaken van een grotere, luxe ontvangstruimte. Zo beschik je over de uitstraling en mogelijkheden van een veel groter kantoor, zonder de bijbehorende vaste lasten.',
    },
    {
      title: 'Liever twee vaste dagen per week gebruikmaken van de tuinruimte?',
      body: [
        'Voor ondernemers die regelmatig klanten ontvangen, bieden we daarnaast de mogelijkheid om de exclusieve ruimte met tuin op vaste dagen te gebruiken.',
        'Bijvoorbeeld twee vaste dagen per week voor €1.000 per maand, exclusief btw.',
        'Dit concept is bijzonder interessant voor coaches, therapeuten, consultants en andere professionals die een hoogwaardige praktijk- of ontvangstruimte zoeken, maar deze niet vijf dagen per week nodig hebben. Andere gebruiksfrequenties zijn in overleg mogelijk.',
      ],
    },
    {
      title: 'Een karakteristieke locatie naast het Vondelpark',
      body: [
        'De Roemer Visscherstraat behoort tot de aantrekkelijke en karakteristieke straten van Amsterdam, direct nabij het Vondelpark en op korte afstand van de Overtoom, het Leidseplein en het Museumkwartier.',
      ],
      listTitle: 'Het pand biedt onder meer:',
      list: [
        'Karakteristieke architectuur en authentieke details',
        'Hoge plafonds en grote ramen',
        'Gemeenschappelijke sanitaire voorzieningen',
        'Pantryvoorzieningen',
        'Een representatieve zakelijke omgeving',
        'Een exclusieve vergader- en ontvangstruimte met tuin die flexibel kan worden gereserveerd',
        'Een centrale locatie nabij het Vondelpark',
      ],
    },
    {
      title: 'Flexibele huurvoorwaarden',
      body: [
        'Bij FlexStad geloven we dat een professionele werkruimte toegankelijk en flexibel moet zijn.',
      ],
      listTitle: 'Daarom bieden we:',
      list: [
        'Een minimale huurperiode van slechts 3 maanden',
        'Daarna maandelijks opzegbaar met 1 maand opzegtermijn',
        'Een waarborgsom van één maand huur',
        'Huurprijzen inclusief servicekosten en nutsvoorzieningen bij normaal gebruik',
        'De mogelijkheid om aanvullende vergader- en ontvangstruimte flexibel te reserveren',
      ],
      after:
        'Alle genoemde tarieven zijn exclusief btw, voor zover van toepassing. De ruimtes zijn tijdelijk beschikbaar. Gedurende de verhuurperiode vinden gefaseerd onderhouds- en restauratiewerkzaamheden plaats aan onder andere de gevel en beglazing. Dit kan tijdelijk enige hinder veroorzaken. Kandidaten worden hierover vooraf geïnformeerd.',
    },
    {
      title: 'Plan een bezichtiging',
      body: [
        'Ben je op zoek naar een eigen kantoor of praktijkruimte op een bijzondere locatie in Amsterdam?',
        'Of spreekt ons flexibele concept met de exclusieve tuinruimte je aan?',
        'Neem gerust contact op voor meer informatie of plan een vrijblijvende bezichtiging.',
      ],
    },
  ],
};

export const LISTING_ADDRESS: Record<string, string> = {
  'roemer-visscherstraat': 'Roemer Visscherstraat 24, Amsterdam',
  'de-molen': 'De Molen 8, 3994 DB Houten',
  'winkelwaard-494': 'Winkelwaard 494, 1824 HX Alkmaar',
  linnaeusstraat: 'Linnaeusstraat 98-H, 1092 CP Amsterdam',
};

export const LOCATIONS = ['Alkmaar', 'Amsterdam', 'Houten'] as const;

export const STATUSES = [
  {value: 'available', label: 'Beschikbaar'},
  {value: 'soon', label: 'Binnenkort'},
  {value: 'unavailable', label: 'Niet beschikbaar'},
] as const;

export const BUDGETS = [
  {value: '250-500', label: '€250 - €500'},
  {value: '500-750', label: '€500 - €750'},
  {value: '750-1000', label: '€750 - €1000'},
  {value: '1000-1500', label: '€1000 - €1500'},
  {value: '1500+', label: '€1500 of meer'},
];

export const SIGNUP = {
  starts: [
    'Zo snel mogelijk',
    'Binnen 1 maand',
    'Binnen 3 maanden',
    'Flexibel',
  ],
  seeks: ['Woonruimte', 'Werkruimte', 'Beide'],
  budgets: ['€500 - €750', '€750 - €1000', '€1000 - €1500', '€1500 of meer'],
  who: ['Particulier', "ZZP'er", 'Bedrijf'],
  persons: ['1', '2', '3', '4+'],
};

/** Homepage texts from the live flexstad.com, kept word for word. */
export const HOME_COPY = {
  hero: 'Flexstad activeert leegstaand vastgoed met flexibele invulling door ondernemers, makers en maatschappelijke initiatieven.',
  discoverTitle: 'Ontdek kansen met Flexstad',
  discover:
    'Flexstad signaleert, activeert en beheert leegstaand vastgoed met oog voor veiligheid, rendement en maatschappelijke waarde. Door professioneel beheer, tijdelijke invulling en flexibele overeenkomsten, blijft vastgoed veilig en in gebruik. Dat levert niet alleen direct rendement, maar ontzorgt eigenaren, biedt kansen voor ontwikkelaars en creëert maatschappelijke meerwaarde voor locaties én hun omgeving.',
  valueTitle: 'Van leegstand naar meerwaarde',
  value: [
    'Flexstad is de ondernemende leegstandsbeheerder die vastgoed actief, veilig en van waarde houdt. Wij verbinden vastgoedeigenaren, ondernemers, gemeenten en projectontwikkelaars.',
    'Met tijdelijke invulling zorgen wij dat panden niet stil komen te staan. Ondernemers en maatschappelijke initiatieven krijgen ruimte om te groeien, eigenaren beperken risico’s en gemeenten krijgen oplossingen voor actuele huisvestingsvraagstukken.',
  ],
  interest:
    'Benieuwd wat Flexstad voor uw pand, locatie of ruimtebehoefte kan betekenen? Wij denken graag mee over tijdelijke invulling, beheer en ontwikkelkansen.',
  footerLine:
    'Flexstad houdt leegstaand vastgoed actief, veilig en van waarde.',
  copyright: 'Copyright © 2026 Flexstad',
} as const;
