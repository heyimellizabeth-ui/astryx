// Copyright (c) Meta Platforms, Inc. and affiliates.

import {useState, type ComponentProps, type FormEvent} from 'react';
import {Banner} from '@astryxdesign/core/Banner';
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
import {PageSection} from './PageSection';

type Use = 'wonen' | 'werken' | '';
type IsoDate = ComponentProps<typeof DateInput>['value'];

export function EnquiryForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [use, setUse] = useState<Use>('');
  const [budget, setBudget] = useState<string | undefined>();
  const [start, setStart] = useState<IsoDate>();
  const [end, setEnd] = useState<IsoDate>();
  const [notes, setNotes] = useState('');
  const [isSent, setIsSent] = useState(false);

  const isInvalid =
    name.trim() === '' || email.trim() === '' || use === '' || !start;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isInvalid) {
      setIsSent(true);
    }
  }

  return (
    <PageSection id="reageren">
      <form onSubmit={handleSubmit} noValidate>
        <VStack gap={6}>
          <Heading level={2}>Reageren</Heading>
          {isSent ? (
            <Banner
              status="success"
              title="Bericht verstuurd"
              collapsible={false}>
              Bedankt! We nemen binnen enkele werkdagen contact met je op.
            </Banner>
          ) : null}
          <FormLayout>
            <TextInput
              label="Volledige naam"
              value={name}
              onChange={setName}
              isRequired
              htmlName="name"
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
            <Selector
              label="Mijn budget per maand"
              options={BUDGETS}
              value={budget}
              onChange={setBudget}
              isOptional
              htmlName="budget"
            />
            <DateInput
              label="Startdatum"
              value={start}
              onChange={setStart}
              isRequired
            />
            <DateInput
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
