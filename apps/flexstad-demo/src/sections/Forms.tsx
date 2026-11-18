// Copyright (c) Meta Platforms, Inc. and affiliates.

import {useState, type FormEvent, type ReactNode} from 'react';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {FormLayout} from '@astryxdesign/core/FormLayout';
import {VStack} from '@astryxdesign/core/Layout';
import {Selector} from '@astryxdesign/core/Selector';
import {TextArea} from '@astryxdesign/core/TextArea';
import {TextInput} from '@astryxdesign/core/TextInput';
import {CONTACT, SIGNUP} from '../content';

const toOptions = (values: ReadonlyArray<string>) =>
  values.map(value => ({value, label: value}));

/** Shown after a valid submit: no request is made, so it says so. */
export function NotConnectedNotice() {
  return (
    <Banner status="warning" title="Er is niets verstuurd" collapsible={false}>
      Dit formulier is nog niet gekoppeld. Mail naar {CONTACT.email} of bel{' '}
      {CONTACT.phone}.
    </Banner>
  );
}

/**
 * Wrapper shared by the page forms. Nothing is sent anywhere yet: a valid
 * submit only shows a notice that the form is not connected.
 */
function FormShell({
  isValid,
  submitLabel,
  children,
}: {
  isValid: boolean;
  submitLabel: string;
  children: ReactNode;
}) {
  const [isSent, setIsSent] = useState(false);
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isValid) {
      setIsSent(true);
    }
  }
  return (
    <form onSubmit={handleSubmit} noValidate>
      <VStack gap={6}>
        {isSent ? <NotConnectedNotice /> : null}
        <FormLayout>{children}</FormLayout>
        <div>
          <Button
            label={submitLabel}
            type="submit"
            variant="primary"
            size="lg"
            isDisabled={!isValid}
          />
        </div>
      </VStack>
    </form>
  );
}

/** "Inschrijven": fields and options match the live sign-up form. */
export function SignupForm() {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [start, setStart] = useState<string | undefined>();
  const [region, setRegion] = useState('');
  const [seeks, setSeeks] = useState<string | undefined>();
  const [budget, setBudget] = useState<string | undefined>();
  const [who, setWho] = useState<string | undefined>();
  const [persons, setPersons] = useState<string | undefined>();
  const [company, setCompany] = useState('');
  const [sector, setSector] = useState('');
  const [staff, setStaff] = useState('');
  const [notes, setNotes] = useState('');

  const isParticulier = who === 'Particulier';
  const isBusiness = who === "ZZP'er" || who === 'Bedrijf';
  const isValid =
    first.trim() !== '' &&
    last.trim() !== '' &&
    email.includes('@') &&
    phone.trim() !== '' &&
    !!start &&
    region.trim() !== '' &&
    !!seeks &&
    !!budget &&
    !!who &&
    (isParticulier
      ? !!persons
      : isBusiness
        ? company.trim() !== '' && sector.trim() !== '' && staff.trim() !== ''
        : false);

  return (
    <FormShell isValid={isValid} submitLabel="Inschrijven">
      <TextInput
        label="Voornaam"
        value={first}
        onChange={setFirst}
        isRequired
        htmlName="first-name"
      />
      <TextInput
        label="Achternaam"
        value={last}
        onChange={setLast}
        isRequired
        htmlName="last-name"
      />
      <TextInput
        label="E-mailadres"
        type="email"
        value={email}
        onChange={setEmail}
        isRequired
        htmlName="email"
      />
      <TextInput
        label="Telefoonnummer"
        type="tel"
        value={phone}
        onChange={setPhone}
        isRequired
        htmlName="phone"
      />
      <Selector
        label="Gewenste startdatum"
        options={toOptions(SIGNUP.starts)}
        value={start}
        onChange={setStart}
        isRequired
        htmlName="start"
      />
      <TextInput
        label="Gewenste regio / plaats"
        value={region}
        onChange={setRegion}
        isRequired
        htmlName="region"
      />
      <Selector
        label="Ik zoek"
        options={toOptions(SIGNUP.seeks)}
        value={seeks}
        onChange={setSeeks}
        isRequired
        htmlName="seeks"
      />
      <Selector
        label="Budget (per maand)"
        options={toOptions(SIGNUP.budgets)}
        value={budget}
        onChange={setBudget}
        isRequired
        htmlName="budget"
      />
      <Selector
        label="Ik ben"
        options={toOptions(SIGNUP.who)}
        value={who}
        onChange={setWho}
        isRequired
        htmlName="who"
      />
      {isParticulier ? (
        <Selector
          label="Aantal personen"
          options={toOptions(SIGNUP.persons)}
          value={persons}
          onChange={setPersons}
          isRequired
          htmlName="persons"
        />
      ) : null}
      {isBusiness ? (
        <>
          <TextInput
            label="Bedrijfsnaam"
            value={company}
            onChange={setCompany}
            isRequired
            htmlName="company"
          />
          <TextInput
            label="Branche"
            value={sector}
            onChange={setSector}
            isRequired
            htmlName="sector"
          />
          <TextInput
            label="Aantal medewerkers"
            value={staff}
            onChange={setStaff}
            isRequired
            htmlName="staff"
          />
        </>
      ) : null}
      <TextArea
        label="Extra toelichting"
        value={notes}
        onChange={setNotes}
        rows={4}
        isOptional
      />
    </FormShell>
  );
}

/** "Contact": Naam, Emailadres, Onderwerp, Bericht. */
export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const isValid =
    name.trim() !== '' && email.includes('@') && message.trim() !== '';
  return (
    <FormShell isValid={isValid} submitLabel="Verstuur bericht">
      <TextInput
        label="Naam"
        value={name}
        onChange={setName}
        isRequired
        htmlName="name"
      />
      <TextInput
        label="Emailadres"
        type="email"
        value={email}
        onChange={setEmail}
        isRequired
        htmlName="email"
      />
      <TextInput
        label="Onderwerp"
        value={subject}
        onChange={setSubject}
        isOptional
        htmlName="subject"
      />
      <TextArea
        label="Bericht"
        value={message}
        onChange={setMessage}
        rows={6}
        isRequired
      />
    </FormShell>
  );
}

/** "Aanmelden": the live form is script-rendered, so only an e-mail field is assumed. */
export function SubscribeForm() {
  const [email, setEmail] = useState('');
  return (
    <FormShell isValid={email.includes('@')} submitLabel="Aanmelden">
      <TextInput
        label="E-mailadres"
        type="email"
        value={email}
        onChange={setEmail}
        isRequired
        htmlName="email"
      />
    </FormShell>
  );
}
