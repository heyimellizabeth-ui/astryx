// Copyright (c) Meta Platforms, Inc. and affiliates.

import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Link} from '@astryxdesign/core/Link';
import {VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {CONTACT, SERVICES, VACANCY} from '../content';
import {ContactForm, SignupForm, SubscribeForm} from '../sections/Forms';
import {PageSection} from '../sections/PageSection';
import {BulletList, CtaBand, PageHero, Paragraphs} from '../sections/ui';
import {NotFound} from './NotFound';

const HOME = {title: 'Home', href: '/'};

export function Contact() {
  return (
    <>
      <PageHero title="Contact" trail={[HOME, {title: 'Contact'}]} />
      <PageSection>
        <Grid columns={{minWidth: 300, repeat: 'fit'}} gap={8} align="start">
          <VStack gap={3}>
            <Text type="large">
              <Link href={`mailto:${CONTACT.email}`}>{CONTACT.email}</Link>
            </Text>
            <Text type="large">
              <Link href={CONTACT.phoneHref}>{CONTACT.phone}</Link>
            </Text>
            <Text type="large">
              <Link href={CONTACT.linkedin} isExternalLink>
                LinkedIn
              </Link>
            </Text>
          </VStack>
          <ContactForm />
        </Grid>
      </PageSection>
    </>
  );
}

export function Inschrijven() {
  return (
    <>
      <PageHero title="Inschrijven" trail={[HOME, {title: 'Inschrijven'}]} />
      <PageSection>
        <Grid columns={{minWidth: 300, repeat: 'fit'}} gap={8} align="start">
          <Heading level={2}>Jouw gegevens</Heading>
          <SignupForm />
        </Grid>
      </PageSection>
      <CtaBand />
    </>
  );
}

export function Abonneren() {
  return (
    <>
      <PageHero title="Aanmelden" trail={[HOME, {title: 'Aanmelden'}]} />
      <PageSection measure={720}>
        <SubscribeForm />
      </PageSection>
    </>
  );
}

/** The portal login is not rebuilt: credentials are never collected here. */
export function MijnFlexstad() {
  return (
    <>
      <PageHero title="MijnFlexstad" trail={[HOME, {title: 'MijnFlexstad'}]} />
      <PageSection measure={720}>
        <VStack gap={4} align="start">
          <Banner status="info" title="Inloggen volgt" collapsible={false}>
            Het inlogscherm van het klantportaal wordt pas gekoppeld zodra
            Flexstad de koppeling heeft goedgekeurd.
          </Banner>
          <Button label="Inloggen" variant="primary" isDisabled />
        </VStack>
      </PageSection>
    </>
  );
}

export function Vacatures() {
  return (
    <>
      <PageHero title="Vacatures" trail={[HOME, {title: 'Vacatures'}]} />
      <PageSection measure={960}>
        <VStack gap={8}>
          <VStack gap={3}>
            <Heading level={2}>{VACANCY.title}</Heading>
            <Text weight="medium" color="secondary">
              {VACANCY.meta}
            </Text>
            <Paragraphs items={VACANCY.intro} />
          </VStack>
          <Grid columns={{minWidth: 300, repeat: 'fit'}} gap={8} align="start">
            {VACANCY.blocks.map(block => (
              <VStack key={block.title} gap={3}>
                <Heading level={3}>{block.title}</Heading>
                {block.lead ? (
                  <Text color="secondary">{block.lead}</Text>
                ) : null}
                <BulletList items={block.items} />
                {block.after ? (
                  <Text color="secondary">{block.after}</Text>
                ) : null}
              </VStack>
            ))}
          </Grid>
          <VStack gap={3}>
            <Heading level={3}>{VACANCY.about.title}</Heading>
            <Paragraphs items={VACANCY.about.body} />
          </VStack>
          <VStack gap={3}>
            <Heading level={3}>{VACANCY.apply.title}</Heading>
            <Paragraphs items={VACANCY.apply.body} />
            <div>
              <Button
                label="Neem contact op"
                href="/contact/"
                variant="primary"
              />
            </div>
          </VStack>
        </VStack>
      </PageSection>
      <CtaBand />
    </>
  );
}

export function Dienst({slug}: {slug: string}) {
  const service = SERVICES[slug];
  if (!service) {
    return <NotFound />;
  }
  return (
    <>
      <PageHero title={service.title} trail={[HOME, {title: service.title}]} />
      <PageSection>
        <Grid columns={{minWidth: 280, repeat: 'fit'}} gap={8} align="start">
          <VStack gap={3}>
            <Heading level={2}>{service.heading}</Heading>
            <Paragraphs items={[service.body]} />
          </VStack>
          <VStack gap={3}>
            <Heading level={2}>{service.bulletsTitle}</Heading>
            <Paragraphs items={[service.bulletsIntro]} />
            <BulletList items={service.bullets} />
            <Paragraphs items={[service.closing]} />
          </VStack>
        </Grid>
      </PageSection>
      <CtaBand />
    </>
  );
}
