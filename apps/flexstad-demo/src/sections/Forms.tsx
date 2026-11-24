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
import {Link} from '@astryxdesign/core/Link';
import {VStack} from '@astryxdesign/core/Layout';
import {Selector} from '@astryxdesign/core/Selector';
import {TextArea} from '@astryxdesign/core/TextArea';
import {TextInput} from '@astryxdesign/core/TextInput';
import {CONTACT, SIGNUP} from '../content';
import {FORMSPREE_ENDPOINT} from '../enquiryConfig';
import {useEnquiryContext} from './enquiryContext';
import {
  sendToAsana,
  sendToFormspree,
  type FormKind,
  type SendResult,
} from './sendToAsana';

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

/** Shown after a successful send. */
export function SentNotice() {
  return (
    <Banner status="success" title="Bedankt!" collapsible={false}>
      Bedankt! We hebben je aanvraag ontvangen.
    </Banner>
  );
}

/** Shown when the request failed. */
export function SendErrorNotice() {
  return (
    <Banner status="error" title="Versturen lukte niet" collapsible={false}>
      Versturen lukte niet. Probeer het later opnieuw of bel {CONTACT.phone}.
    </Banner>
  );
}

/** The notice for whatever the last send came back with. */
export function SendNotice({state}: {state: SendState}) {
  if (state === 'sent') {
    return <SentNotice />;
  }
  if (state === 'error') {
    return <SendErrorNotice />;
  }
  return state === 'not-connected' ? <NotConnectedNotice /> : null;
}

/** Visually hidden trap for bots; people never see or reach it. */
export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: -10000,
        width: 1,
        height: 1,
        overflow: 'hidden',
      }}>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={event => onChange(event.target.value)}
      />
    </div>
  );
}

/** What a field shows when it is the one that failed. */
export type FieldError = string | undefined;

export type SendState = 'idle' | 'sending' | SendResult;

/**
 * Submit handling shared by every form. The submit button is never disabled:
 * pressing it validates, every failing field shows its message, and focus
 * moves to the first one. A valid submit is sent to Asana through the site's
 * endpoint; `state` says how that went.
 */
export function useFormSubmit(
  hasErrors: boolean,
  kind?: FormKind,
  getFields?: () => Record<string, string>,
): {
  formRef: RefObject<HTMLFormElement | null>;
  state: SendState;
  /** True once the form is done: sent, or (demo forms) accepted locally. */
  isSent: boolean;
  website: string;
  setWebsite: (value: string) => void;
  handleSubmit: (event: FormEvent) => void;
  /** The status prop for a field: its message once a submit was tried. */
  status: (message: FieldError) => {type: 'error'; message: string} | undefined;
} {
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef(Date.now());
  const [hasTried, setHasTried] = useState(false);
  const [tries, setTries] = useState(0);
  const [state, setState] = useState<SendState>('idle');
  const [website, setWebsite] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (state === 'sending') {
      return;
    }
    setHasTried(true);
    if (hasErrors) {
      setState('idle');
      setTries(count => count + 1);
      return;
    }
    if (!kind || !getFields) {
      // Demo forms (the portal) never make a request.
      setState('sent');
      return;
    }
    setState('sending');
    const fields = getFields();
    const toAsana = sendToAsana(kind, fields, {
      startedAt: startedAt.current,
      website,
    });
    // The contact form also goes to Formspree (the e-mail copy) when its
    // address is set in enquiryConfig.ts. Sent when either one took it.
    const toFormspree =
      kind === 'contact' && FORMSPREE_ENDPOINT !== ''
        ? sendToFormspree(FORMSPREE_ENDPOINT, fields, website)
        : null;
    void Promise.all([toAsana, toFormspree]).then(([asana, formspree]) =>
      setState(formspree === 'sent' ? 'sent' : asana),
    );
  }

  // The messages land on the render after the press, so focus moves here.
  useEffect(() => {
    if (tries === 0) {
      return;
    }
    // The first failing control: a radio group carries aria-invalid on its
    // wrapper, which cannot take focus, so only real controls are matched.
    const first = formRef.current?.querySelector<HTMLElement>(
      ':is(input, textarea, select, button, [tabindex])[aria-invalid="true"]',
    );
    if (first) {
      first.focus();
    }
  }, [tries]);

  return {
    formRef,
    state,
    isSent: state === 'sent',
    website,
    setWebsite,
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
        <SendNotice state={form.state} />
        <FormLayout>{children}</FormLayout>
        <div>
          <Button
            label={submitLabel}
            type="submit"
            variant="primary"
            size="lg"
            isLoading={form.state === 'sending'}
          />
        </div>
        <Honeypot value={form.website} onChange={form.setWebsite} />
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
  const form = useFormSubmit(
    Object.values(errors).some(Boolean),
    'inschrijving',
    () => ({
      first,
      last,
      email,
      phone,
      start: start ?? '',
      region,
      seeks: seeks ?? '',
      budget: budget ?? '',
      who: who ?? '',
      persons: isParticulier ? (persons ?? '') : '',
      company: isBusiness ? company : '',
      sector: isBusiness ? sector : '',
      staff: isBusiness ? staff : '',
      notes,
    }),
  );

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
  // ?about=<key> (the enquiry-context plugin): the subject and the first
  // sentence start filled in; nothing the visitor types is overwritten.
  const about = useEnquiryContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(about?.subject ?? '');
  const [message, setMessage] = useState(about?.message ?? '');
  const errors = {
    name: name.trim() === '' ? 'Vul je naam in.' : undefined,
    email: emailError(email),
    message: message.trim() === '' ? 'Vul je bericht in.' : undefined,
  };
  const form = useFormSubmit(
    Object.values(errors).some(Boolean),
    'contact',
    () => ({
      name,
      email,
      subject,
      message,
      ...(about ? {about: about.key, _subject: about.subject} : {}),
    }),
  );
  // As the plugin does: with a known key, the visitor lands in the first
  // field still empty (the name), the banner and the pre-filled text in view.
  const aboutKey = about?.key;
  useEffect(() => {
    if (!aboutKey) {
      return;
    }
    const first = form.formRef.current?.querySelector<HTMLElement>(
      'input:not([type="hidden"]):not([tabindex="-1"])',
    );
    first?.focus();
  }, [aboutKey, form.formRef]);
  return (
    <FormShell form={form} submitLabel="Verstuur bericht">
      {about ? (
        <EnquiryBanner text={about.text} href={about.changeHref} />
      ) : null}
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

/**
 * "Je vraagt naar: …" above the contact form, with a link back to where the
 * visitor chose. The item goes in as text, never as markup.
 */
const enquiryStyles = stylex.create({
  // The ink on the info banner's tint clears 4.5:1; the accent text did not.
  change: {color: 'var(--color-text-primary)'},
});

function EnquiryBanner({text, href}: {text: string; href: string}) {
  return (
    <Banner
      status="info"
      title="Je vraagt naar"
      description={text}
      endContent={
        <Link href={href} xstyle={enquiryStyles.change}>
          Wijzig
        </Link>
      }
    />
  );
}

/** "Aanmelden": the live form is script-rendered, so only an e-mail field is assumed. */
export function SubscribeForm() {
  const [email, setEmail] = useState('');
  const error = emailError(email);
  const form = useFormSubmit(error !== undefined, 'aanmelding', () => ({
    email,
  }));
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
