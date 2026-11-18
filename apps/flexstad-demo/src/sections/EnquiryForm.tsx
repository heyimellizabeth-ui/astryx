// Copyright (c) Meta Platforms, Inc. and affiliates.

import {useState, type ComponentProps, type FormEvent} from 'react';
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
import {NotConnectedNotice} from './Forms';
import {PageSection} from './PageSection';

type Use = 'wonen' | 'werken' | '';
type IsoDate = ComponentProps<typeof DateInput>['value'];

/**
 * "Reageren" form on a listing page. Field labels and order match the live
 * form. Nothing is sent: submitting only shows a notice that the form is
 * not connected.
 */
export function EnquiryForm({listingName}: {listingName?: string}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [use, setUse] = useState<Use>('');
  const [budget, setBudget] = useState<string | undefined>();
  const [start, setStart] = useState<IsoDate>();
  const [end, setEnd] = useState<IsoDate>();
  const [notes, setNotes] = useState('');
  const [isSent, setIsSent] = useState(false);

  const isInvalid = use === '' || !start;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isInvalid) {
      setIsSent(true);
    }
  }

  return (
    <PageSection id="reageren" maxWidth={720}>
      <form onSubmit={handleSubmit} noValidate>
        <VStack gap={6}>
          <Heading level={2}>Reageren</Heading>
          {isSent ? <NotConnectedNotice /> : null}
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
              htmlName="use">
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
              isDisabled={isInvalid}
            />
          </div>
        </VStack>
      </form>
    </PageSection>
  );
}
