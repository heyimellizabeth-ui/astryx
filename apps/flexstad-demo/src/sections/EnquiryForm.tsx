// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {useState, type ComponentProps, type ReactNode} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {DateInput} from '@astryxdesign/core/DateInput';
import {FormLayout} from '@astryxdesign/core/FormLayout';
import {Heading} from '@astryxdesign/core/Heading';
import {VStack} from '@astryxdesign/core/Layout';
import {RadioList, RadioListItem} from '@astryxdesign/core/RadioList';
import {Selector} from '@astryxdesign/core/Selector';
import {TextArea} from '@astryxdesign/core/TextArea';
import {TextInput} from '@astryxdesign/core/TextInput';
import {BUDGETS} from '../content';
import {NotConnectedNotice, useFormSubmit} from './Forms';
import {PageSection} from './PageSection';

const styles = stylex.create({
  // The head and what the visitor reacts to on the left (five of twelve
  // columns, held in view while the form scrolls), the form on the right.
  layout: {
    display: 'grid',
    gap: {default: 32, '@media (min-width: 900px)': 64},
    alignItems: 'start',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'minmax(0, 5fr) minmax(0, 7fr)',
    },
  },
  side: {
    position: {default: 'static', '@media (min-width: 900px)': 'sticky'},
    top: 24,
  },
});

type Use = 'wonen' | 'werken' | '';
type IsoDate = ComponentProps<typeof DateInput>['value'];

/**
 * "Reageren" form on a listing page. Field labels and order match the live
 * form. Nothing is sent: submitting only shows a notice that the form is
 * not connected.
 */
export function EnquiryForm({
  listingName,
  aside,
}: {
  listingName?: string;
  /** What the visitor reacts to, set under the head in the left column. */
  aside?: ReactNode;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [use, setUse] = useState<Use>('');
  const [budget, setBudget] = useState<string | undefined>();
  const [start, setStart] = useState<IsoDate>();
  const [end, setEnd] = useState<IsoDate>();
  const [notes, setNotes] = useState('');
  const errors = {
    use: use === '' ? 'Kies een optie bij Type gebruik.' : undefined,
    start: start ? undefined : 'Vul een startdatum in.',
  };
  const form = useFormSubmit(Object.values(errors).some(Boolean));

  return (
    <PageSection id="reageren" variant="muted">
      <form ref={form.formRef} onSubmit={form.handleSubmit} noValidate>
        <div {...stylex.props(styles.layout)}>
          <VStack gap={6} xstyle={styles.side}>
            <Heading level={2}>Reageren</Heading>
            {aside}
          </VStack>
          <VStack gap={6}>
            {form.isSent ? <NotConnectedNotice /> : null}
            <FormLayout>
              <TextInput
                size="lg"
                label="Volledige naam"
                value={name}
                onChange={setName}
                isOptional
                htmlName="name"
              />
              <TextInput
                size="lg"
                label="E-mailadres"
                type="email"
                value={email}
                onChange={setEmail}
                isOptional
                htmlName="email"
              />
              <TextInput
                size="lg"
                label="Telefoonnummer"
                type="tel"
                value={phone}
                onChange={setPhone}
                isOptional
                htmlName="phone"
              />
              <RadioList
                label="Type gebruik"
                value={use}
                onChange={value => setUse(value as Use)}
                orientation="horizontal"
                isRequired
                htmlName="use"
                status={form.status(errors.use)}>
                <RadioListItem value="wonen" label="Wonen" />
                <RadioListItem value="werken" label="Werken" />
              </RadioList>
              {listingName ? (
                <TextInput
                  size="lg"
                  label="Ik reageer op"
                  value={listingName}
                  isReadOnly
                  htmlName="listing"
                />
              ) : null}
              <Selector
                size="lg"
                label="Mijn budget"
                options={BUDGETS}
                value={budget}
                onChange={setBudget}
                isOptional
                htmlName="budget"
              />
              <DateInput
                size="lg"
                label="Startdatum"
                value={start}
                onChange={setStart}
                isRequired
                status={form.status(errors.start)}
              />
              <DateInput
                size="lg"
                label="Eventuele einddatum"
                value={end}
                onChange={setEnd}
                isOptional
                hasClear
              />
              <TextArea
                label="Eventuele opmerkingen"
                value={notes}
                onChange={setNotes}
                rows={4}
                isOptional
              />
            </FormLayout>
            <div>
              <Button
                label="Versturen"
                type="submit"
                variant="primary"
                size="lg"
              />
            </div>
          </VStack>
        </div>
      </form>
    </PageSection>
  );
}
