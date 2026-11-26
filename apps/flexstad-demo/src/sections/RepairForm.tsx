// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {useEffect, useRef, useState, type FormEvent} from 'react';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {FileInput} from '@astryxdesign/core/FileInput';
import {FormLayout} from '@astryxdesign/core/FormLayout';
import {VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {TextArea} from '@astryxdesign/core/TextArea';
import {TextInput} from '@astryxdesign/core/TextInput';
import {trackEvent} from '../analytics';
import {CONTACT} from '../content';
import {Honeypot, NotConnectedNotice, SendErrorNotice} from './Forms';
import {
  MAX_ORIGINAL_BYTES,
  MAX_REPAIR_PHOTOS,
  preparePhotos,
  UnreadablePhotoError,
} from './repairPhotos';
import {sendRepair, type RepairResult} from './sendToAsana';

type State = 'idle' | 'sending' | 'sent' | 'error' | 'not-connected';
type Sent = Extract<RepairResult, {status: 'sent'}>;

const styles = stylex.create({
  // The confirmation takes focus when it appears, so a screen reader reads it.
  done: {':focus': {outlineStyle: 'none'}},
  reference: {
    fontSize: 'clamp(24px, 1.4vw + 16px, 32px)',
    fontWeight: 700,
    letterSpacing: '0.02em',
  },
});

/**
 * "Reparatie melden": a tenant reports something broken, with photos. It goes
 * to the site's own endpoint (`/api/aanvraag.php`, kind `reparatie`), which
 * makes an Asana task and attaches the photos. The tenant gets a reference
 * code on screen to quote if they call.
 */
export function RepairForm() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [website, setWebsite] = useState('');
  const [state, setState] = useState<State>('idle');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [photoProblem, setPhotoProblem] = useState<string | undefined>();
  const [sent, setSent] = useState<Sent | null>(null);
  const [hasTried, setHasTried] = useState(false);
  const [tries, setTries] = useState(0);
  const startedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  const errors = {
    name: name.trim() === '' ? 'Vul uw naam in.' : undefined,
    address:
      address.trim() === ''
        ? 'Vul het adres of de naam van het pand in.'
        : undefined,
    description:
      description.trim() === ''
        ? 'Beschrijf wat er kapot of beschadigd is.'
        : undefined,
  };
  const hasErrors = Object.values(errors).some(Boolean);
  const show = (message: string | undefined) =>
    hasTried && message ? ({type: 'error', message} as const) : undefined;

  // The messages land on the render after the press, so focus moves here: the
  // first control that failed.
  useEffect(() => {
    if (tries === 0) {
      return;
    }
    formRef.current
      ?.querySelector<HTMLElement>(
        ':is(input, textarea, select, button, [tabindex])[aria-invalid="true"]',
      )
      ?.focus();
  }, [tries]);

  useEffect(() => {
    if (state === 'sent') {
      doneRef.current?.focus();
    }
  }, [state]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (state === 'sending') {
      return;
    }
    setHasTried(true);
    if (hasErrors) {
      setTries(count => count + 1);
      return;
    }
    setState('sending');
    setErrorMessage(undefined);
    setPhotoProblem(undefined);
    let prepared: File[];
    try {
      prepared = await preparePhotos(photos);
    } catch (error) {
      setPhotoProblem(
        error instanceof UnreadablePhotoError
          ? `De foto "${error.fileName}" kon niet worden gelezen. Kies een JPG-, PNG- of WebP-bestand.`
          : "De foto's konden niet worden voorbereid. Probeer het opnieuw.",
      );
      setState('idle');
      setTries(count => count + 1);
      return;
    }
    const outcome = await sendRepair(
      {
        name,
        address,
        description,
        ...(contact.trim() === '' ? {} : {contact}),
      },
      prepared,
      {startedAt: startedAt.current, website},
    );
    if (outcome.status === 'sent') {
      setSent(outcome);
      setState('sent');
      // Counted only when the visitor accepted analytics (see analytics.ts).
      trackEvent('repair_report', {form_kind: 'reparatie'});
    } else if (outcome.status === 'not-connected') {
      setState('not-connected');
    } else {
      setErrorMessage(outcome.message);
      setState('error');
    }
  }

  function startAnother() {
    setAddress('');
    setDescription('');
    setPhotos([]);
    setSent(null);
    setHasTried(false);
    setState('idle');
    startedAt.current = Date.now();
  }

  if (state === 'sent' && sent) {
    return (
      <div ref={doneRef} tabIndex={-1} {...stylex.props(styles.done)}>
        <VStack gap={5} align="start">
          <Banner
            status="success"
            title="Uw melding is ontvangen"
            collapsible={false}>
            Wij hebben uw melding doorgegeven aan ons team.
          </Banner>
          {sent.reference !== '' ? (
            <VStack gap={1} align="start">
              <Text type="supporting" color="secondary">
                Uw referentie (noem die als u ons belt of mailt)
              </Text>
              <Text xstyle={styles.reference}>{sent.reference}</Text>
            </VStack>
          ) : null}
          <Text color="secondary">
            Adres of pand: {address}. Foto&rsquo;s meegestuurd:{' '}
            {sent.photos - sent.photosFailed} van {sent.photos}.
          </Text>
          {sent.photosFailed > 0 ? (
            <Banner
              status="warning"
              title="Niet alle foto’s zijn aangekomen"
              collapsible={false}>
              Uw melding is wel ontvangen. Mail de foto&rsquo;s gerust naar{' '}
              {CONTACT.email}
              {sent.reference !== ''
                ? ` met de referentie ${sent.reference}`
                : ''}
              .
            </Banner>
          ) : null}
          <Button
            label="Nog een melding doen"
            variant="secondary"
            size="lg"
            onClick={startAnother}
          />
        </VStack>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <VStack gap={6}>
        {state === 'not-connected' ? <NotConnectedNotice /> : null}
        {state === 'error' ? (
          errorMessage ? (
            <Banner
              status="error"
              title="Versturen lukte niet"
              collapsible={false}>
              {errorMessage}
            </Banner>
          ) : (
            <SendErrorNotice />
          )
        ) : null}
        <FormLayout>
          <TextInput
            size="lg"
            label="Naam"
            value={name}
            onChange={setName}
            isRequired
            htmlName="name"
            autoComplete="name"
            status={show(errors.name)}
          />
          <TextInput
            size="lg"
            label="Adres of pand"
            description="Bijvoorbeeld: Roemer Visscherstraat 12, kamer 3."
            value={address}
            onChange={setAddress}
            isRequired
            htmlName="address"
            autoComplete="street-address"
            status={show(errors.address)}
          />
          <TextArea
            label="Omschrijving"
            description="Wat is er kapot of beschadigd, en sinds wanneer?"
            value={description}
            onChange={setDescription}
            rows={6}
            isRequired
            status={show(errors.description)}
          />
          <FileInput
            label="Foto’s"
            description={`Maximaal ${MAX_REPAIR_PHOTOS} foto’s. Wij verkleinen ze en verwijderen de locatiegegevens.`}
            placeholder="Kies foto’s"
            accept="image/*"
            isMultiple
            maxFiles={MAX_REPAIR_PHOTOS}
            maxSize={MAX_ORIGINAL_BYTES}
            isOptional
            value={photos}
            onChange={files => {
              setPhotos(Array.isArray(files) ? files : files ? [files] : []);
              setPhotoProblem(undefined);
            }}
            status={
              photoProblem ? {type: 'error', message: photoProblem} : undefined
            }
          />
          <TextInput
            size="lg"
            label="Telefoon of e-mailadres"
            description="Zodat wij u kunnen bereiken als wij een vraag hebben."
            value={contact}
            onChange={setContact}
            isOptional
            htmlName="contact"
            autoComplete="tel"
          />
        </FormLayout>
        <div>
          <Button
            label="Melding versturen"
            type="submit"
            variant="primary"
            size="lg"
            isLoading={state === 'sending'}
          />
        </div>
        <Honeypot value={website} onChange={setWebsite} />
      </VStack>
    </form>
  );
}
