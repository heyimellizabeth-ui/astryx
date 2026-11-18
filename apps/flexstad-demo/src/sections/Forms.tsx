// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {FormLayout} from '@astryxdesign/core/FormLayout';
import {VStack} from '@astryxdesign/core/Layout';
import {Selector} from '@astryxdesign/core/Selector';
import {TextArea} from '@astryxdesign/core/TextArea';
import {TextInput} from '@astryxdesign/core/TextInput';
import {CONTACT, SIGNUP} from '../content';

const styles = stylex.create({
  panel: {
    padding: {default: 20, '@media (min-width: 900px)': 40},
    borderRadius: 'var(--radius-container)',
    backgroundColor: 'var(--color-background-surface)',
  },
});

/** A raised sheet that holds a form, one step above the paper. */
export function FormPanel({children}: {children: ReactNode}) {
  return <div {...stylex.props(styles.panel)}>{children}</div>;
}

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

/** What a field shows when it is the one that failed. */
export type FieldError = string | undefined;

/**
 * Submit handling shared by every form. The submit button is never disabled:
 * pressing it validates, every failing field shows its message, and focus
 * moves to the first one. Nothing is sent anywhere yet: a valid submit only
 * shows a notice that the form is not connected.
 */
export function useFormSubmit(hasErrors: boolean): {
  formRef: RefObject<HTMLFormElement | null>;
  isSent: boolean;
  handleSubmit: (event: FormEvent) => void;
  /** The status prop for a field: its message once a submit was tried. */
  status: (message: FieldError) => {type: 'error'; message: string} | undefined;
} {
  const formRef = useRef<HTMLFormElement>(null);
  const [hasTried, setHasTried] = useState(false);
  const [tries, setTries] = useState(0);
  const [isSent, setIsSent] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setHasTried(true);
    if (hasErrors) {
      setIsSent(false);
      setTries(count => count + 1);
    } else {
      setIsSent(true);
    }
  }

  // The messages land on the render after the press, so focus moves here.
  useEffect(() => {
    if (tries === 0) {
      return;
    }
    const first = formRef.current?.querySelector<HTMLElement>(
      '[aria-invalid="true"]',
    );
    if (first) {
      first.focus();
    }
  }, [tries]);

  return {
    formRef,
    isSent,
    handleSubmit,
    status: message =>
      hasTried && message ? {type: 'error', message} : undefined,
  };
}

/** Wrapper shared by the page forms. */
function FormShell({
  form,
  submitLabel,
  children,
}: {
  form: ReturnType<typeof useFormSubmit>;
  submitLabel: string;
  children: ReactNode;
}) {
  return (
    <form ref={form.formRef} onSubmit={form.handleSubmit} noValidate>
      <VStack gap={6}>
        {form.isSent ? <NotConnectedNotice /> : null}
        <FormLayout>{children}</FormLayout>
        <div>
          <Button
            label={submitLabel}
            type="submit"
            variant="primary"
            size="lg"
          />
        </div>
      </VStack>
    </form>
  );
}

/** An e-mail field's message: empty, or no "@" in it. */
export function emailError(value: string): FieldError {
  if (value.trim() === '') {
    return 'Vul je e-mailadres in.';
  }
  return value.includes('@') ? undefined : 'Vul een geldig e-mailadres in.';
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
  const empty = (value: string, message: string): FieldError =>
    value.trim() === '' ? message : undefined;
  const errors = {
    first: empty(first, 'Vul je voornaam in.'),
    last: empty(last, 'Vul je achternaam in.'),
    email: emailError(email),
    phone: empty(phone, 'Vul je telefoonnummer in.'),
    start: start ? undefined : 'Kies een optie bij Gewenste startdatum.',
    region: empty(region, 'Vul je gewenste regio of plaats in.'),
    seeks: seeks ? undefined : 'Kies een optie bij Ik zoek.',
    budget: budget ? undefined : 'Kies een optie bij Budget (per maand).',
    who: who ? undefined : 'Kies een optie bij Ik ben.',
    persons:
      isParticulier && !persons
        ? 'Kies een optie bij Aantal personen.'
        : undefined,
    company: isBusiness ? empty(company, 'Vul je bedrijfsnaam in.') : undefined,
    sector: isBusiness ? empty(sector, 'Vul je branche in.') : undefined,
    staff: isBusiness
      ? empty(staff, 'Vul het aantal medewerkers in.')
      : undefined,
  };
  const form = useFormSubmit(Object.values(errors).some(Boolean));

  return (
    <FormShell form={form} submitLabel="Inschrijven">
      <TextInput
        size="lg"
        label="Voornaam"
        value={first}
        onChange={setFirst}
        isRequired
        htmlName="first-name"
        status={form.status(errors.first)}
      />
      <TextInput
        size="lg"
        label="Achternaam"
        value={last}
        onChange={setLast}
        isRequired
        htmlName="last-name"
        status={form.status(errors.last)}
      />
      <TextInput
        size="lg"
        label="E-mailadres"
        type="email"
        value={email}
        onChange={setEmail}
        isRequired
        htmlName="email"
        status={form.status(errors.email)}
      />
      <TextInput
        size="lg"
        label="Telefoonnummer"
        type="tel"
        value={phone}
        onChange={setPhone}
        isRequired
        htmlName="phone"
        status={form.status(errors.phone)}
      />
      <Selector
        size="lg"
        label="Gewenste startdatum"
        options={toOptions(SIGNUP.starts)}
        value={start}
        onChange={setStart}
        isRequired
        htmlName="start"
        status={form.status(errors.start)}
      />
      <TextInput
        size="lg"
        label="Gewenste regio / plaats"
        value={region}
        onChange={setRegion}
        isRequired
        htmlName="region"
        status={form.status(errors.region)}
      />
      <Selector
        size="lg"
        label="Ik zoek"
        options={toOptions(SIGNUP.seeks)}
        value={seeks}
        onChange={setSeeks}
        isRequired
        htmlName="seeks"
        status={form.status(errors.seeks)}
      />
      <Selector
        size="lg"
        label="Budget (per maand)"
        options={toOptions(SIGNUP.budgets)}
        value={budget}
        onChange={setBudget}
        isRequired
        htmlName="budget"
        status={form.status(errors.budget)}
      />
      <Selector
        size="lg"
        label="Ik ben"
        options={toOptions(SIGNUP.who)}
        value={who}
        onChange={setWho}
        isRequired
        htmlName="who"
        status={form.status(errors.who)}
      />
      {isParticulier ? (
        <Selector
          size="lg"
          label="Aantal personen"
          options={toOptions(SIGNUP.persons)}
          value={persons}
          onChange={setPersons}
          isRequired
          htmlName="persons"
          status={form.status(errors.persons)}
        />
      ) : null}
      {isBusiness ? (
        <>
          <TextInput
            size="lg"
            label="Bedrijfsnaam"
            value={company}
            onChange={setCompany}
            isRequired
            htmlName="company"
            status={form.status(errors.company)}
          />
          <TextInput
            size="lg"
            label="Branche"
            value={sector}
            onChange={setSector}
            isRequired
            htmlName="sector"
            status={form.status(errors.sector)}
          />
          <TextInput
            size="lg"
            label="Aantal medewerkers"
            value={staff}
            onChange={setStaff}
            isRequired
            htmlName="staff"
            status={form.status(errors.staff)}
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
  const errors = {
    name: name.trim() === '' ? 'Vul je naam in.' : undefined,
    email: emailError(email),
    message: message.trim() === '' ? 'Vul je bericht in.' : undefined,
  };
  const form = useFormSubmit(Object.values(errors).some(Boolean));
  return (
    <FormShell form={form} submitLabel="Verstuur bericht">
      <TextInput
        size="lg"
        label="Naam"
        value={name}
        onChange={setName}
        isRequired
        htmlName="name"
        status={form.status(errors.name)}
      />
      <TextInput
        size="lg"
        label="Emailadres"
        type="email"
        value={email}
        onChange={setEmail}
        isRequired
        htmlName="email"
        status={form.status(errors.email)}
      />
      <TextInput
        size="lg"
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
        status={form.status(errors.message)}
      />
    </FormShell>
  );
}

/** "Aanmelden": the live form is script-rendered, so only an e-mail field is assumed. */
export function SubscribeForm() {
  const [email, setEmail] = useState('');
  const error = emailError(email);
  const form = useFormSubmit(error !== undefined);
  return (
    <FormShell form={form} submitLabel="Aanmelden">
      <TextInput
        size="lg"
        label="E-mailadres"
        type="email"
        value={email}
        onChange={setEmail}
        isRequired
        htmlName="email"
        status={form.status(error)}
      />
    </FormShell>
  );
}
