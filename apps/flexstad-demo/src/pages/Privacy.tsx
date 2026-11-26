// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {Button} from '@astryxdesign/core/Button';
import {Heading} from '@astryxdesign/core/Heading';
import {VStack} from '@astryxdesign/core/Layout';
import {Link} from '@astryxdesign/core/Link';
import {Text} from '@astryxdesign/core/Text';
import {
  isAnalyticsEnabled,
  openConsentSettings,
  useConsent,
} from '../analytics';
import {CONTACT} from '../content';
import {PageSection} from '../sections/PageSection';
import {BulletList, PageHero, Paragraphs} from '../sections/ui';

const styles = stylex.create({
  column: {maxWidth: 720, minWidth: 0},
});

const CHOICE_LABEL = {
  granted: 'U heeft toestemming gegeven voor analytische cookies.',
  denied: 'U heeft alleen noodzakelijke cookies toegestaan.',
  none: 'U heeft nog geen keuze gemaakt.',
} as const;

/**
 * Privacy and cookies. Written only from what the site does: the forms that
 * reach Asana, the hosting, and the optional Google Analytics behind the
 * consent banner. It must be read against the client's own situation before
 * it goes live (see the handoff notes).
 */
export function Privacy() {
  const {consent} = useConsent();
  const choice = CHOICE_LABEL[consent ?? 'none'];
  return (
    <>
      <PageHero
        title="Privacy en cookies"
        intro="Hoe Flexstad omgaat met uw gegevens en met cookies op deze website."
        trail={[{title: 'Home', href: '/'}, {title: 'Privacy en cookies'}]}
      />
      <PageSection paddingBlock={8}>
        <VStack gap={10} align="start" xstyle={styles.column}>
          <VStack gap={3} align="start">
            <Heading level={2}>Wie wij zijn</Heading>
            <Paragraphs
              items={[
                `Flexstad is verantwoordelijk voor de verwerking van uw persoonsgegevens via deze website. ${CONTACT.address}. ${CONTACT.kvk}.`,
              ]}
            />
            <Text>
              Vragen over privacy? Mail naar{' '}
              <Link href={`mailto:${CONTACT.email}`}>{CONTACT.email}</Link> of
              bel <Link href={CONTACT.phoneHref}>{CONTACT.phone}</Link>.
            </Text>
          </VStack>

          <VStack gap={3} align="start">
            <Heading level={2}>Welke gegevens wij verwerken</Heading>
            <Paragraphs
              items={[
                'Wij verwerken de gegevens die u zelf invult in onze formulieren, zoals uw naam, e-mailadres, telefoonnummer en uw bericht of aanvraag. Meer vragen wij niet.',
              ]}
            />
          </VStack>

          <VStack gap={3} align="start">
            <Heading level={2}>Waarom wij die gegevens gebruiken</Heading>
            <BulletList
              items={[
                'Om uw vraag of aanvraag te beantwoorden en op te volgen.',
                'Om u te informeren over het aanbod waarvoor u zich inschrijft of aanmeldt.',
                'Om te voldoen aan wettelijke verplichtingen.',
              ]}
            />
          </VStack>

          <VStack gap={3} align="start">
            <Heading level={2}>Met wie wij gegevens delen</Heading>
            <Paragraphs
              items={[
                'Een aanvraag die u via een formulier verstuurt, komt terecht in Asana, het systeem waarmee wij aanvragen opvolgen. Deze website wordt gehost door Hostinger. Wij delen uw gegevens niet met anderen voor hun eigen doeleinden.',
              ]}
            />
          </VStack>

          <VStack gap={3} align="start">
            <Heading level={2}>Cookies</Heading>
            <Paragraphs
              items={[
                'Zonder uw toestemming plaatsen wij geen cookies. Wij onthouden alleen uw keuze over cookies, in de opslag van uw eigen browser (sleutel flexstad-cookie-consent). Daarvoor is geen toestemming nodig.',
                'Meten wij hoe de website wordt gebruikt, dan gebeurt dat met Google Analytics 4 en alleen nadat u toestemming heeft gegeven. Google plaatst dan cookies met de namen _ga en _ga_*. Zonder toestemming wordt de code van Google niet eens geladen. Trekt u uw toestemming in, dan verwijderen wij deze cookies.',
              ]}
            />
            <Text weight="semibold">{choice}</Text>
            {isAnalyticsEnabled ? (
              <Button
                label="Cookie-instellingen wijzigen"
                variant="secondary"
                onClick={openConsentSettings}
              />
            ) : null}
          </VStack>

          <VStack gap={3} align="start">
            <Heading level={2}>Hoe lang wij gegevens bewaren</Heading>
            <Paragraphs
              items={[
                'Niet langer dan nodig is voor het doel waarvoor u ze ons gaf, of zolang de wet dat van ons vraagt.',
              ]}
            />
          </VStack>

          <VStack gap={3} align="start">
            <Heading level={2}>Uw rechten</Heading>
            <BulletList
              items={[
                'U kunt uw gegevens inzien, laten verbeteren of laten verwijderen.',
                'U kunt bezwaar maken tegen de verwerking of vragen die te beperken.',
                'U kunt uw gegevens in een bruikbaar formaat opvragen.',
                'U kunt uw toestemming op elk moment intrekken.',
              ]}
            />
            <Text>
              Stuur uw verzoek naar{' '}
              <Link href={`mailto:${CONTACT.email}`}>{CONTACT.email}</Link>. Wij
              reageren uiterlijk binnen een maand. Bent u het niet eens met hoe
              wij met uw gegevens omgaan, dan kunt u een klacht indienen bij de{' '}
              <Link href="https://autoriteitpersoonsgegevens.nl" isExternalLink>
                Autoriteit Persoonsgegevens
              </Link>
              .
            </Text>
          </VStack>

          <Text type="supporting" color="secondary">
            Laatst bijgewerkt: 26 november 2026.
          </Text>
        </VStack>
      </PageSection>
    </>
  );
}
