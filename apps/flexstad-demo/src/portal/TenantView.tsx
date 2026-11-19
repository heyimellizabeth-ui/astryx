// Copyright (c) Meta Platforms, Inc. and affiliates.

import {useState} from 'react';
import {Badge} from '@astryxdesign/core/Badge';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {FormLayout} from '@astryxdesign/core/FormLayout';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {List, ListItem} from '@astryxdesign/core/List';
import {Selector} from '@astryxdesign/core/Selector';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {Table, proportional} from '@astryxdesign/core/Table';
import {Tab, TabList} from '@astryxdesign/core/TabList';
import {Text} from '@astryxdesign/core/Text';
import {TextArea} from '@astryxdesign/core/TextArea';
import {useFormSubmit} from '../sections/Forms';
import {
  BlockTitle,
  ContactCard,
  DemoDownload,
  Facts,
  PortalCard,
} from './Parts';
import {
  REPORT_CATEGORIES,
  TENANT_INVOICES,
  TENANT_MESSAGES,
  TENANT_SPACE,
  type Invoice,
} from './sampleData';

const PANEL_ID = 'huurder-paneel';

type Section = 'ruimte' | 'kosten' | 'melding' | 'berichten';

function SpaceCard() {
  const space = TENANT_SPACE;
  return (
    <PortalCard>
      <VStack gap={4} align="stretch">
        <HStack gap={3} align="center" wrap="wrap">
          <BlockTitle>Mijn ruimte</BlockTitle>
          <HStack gap={2} align="center">
            <StatusDot variant="success" label="Actief" />
            <Badge variant="success" label={space.status} />
          </HStack>
        </HStack>
        <Facts
          items={[
            {label: 'Type', value: space.type},
            {label: 'Adres', value: space.address},
            {label: 'Oppervlakte', value: space.area},
            {label: 'Huurder sinds', value: space.since},
            {label: 'Contract tot', value: space.contractUntil},
          ]}
        />
      </VStack>
    </PortalCard>
  );
}

function InvoiceTable() {
  return (
      <Table<Invoice & Record<string, unknown>>
        aria-label="Facturen (voorbeelddata)"
        data={
          TENANT_INVOICES as unknown as Array<Invoice & Record<string, unknown>>
        }
        idKey="id"
        columns={[
          {
            key: 'number',
            header: 'Factuurnummer',
            width: proportional(2, {minWidth: 140}),
          },
          {
            key: 'date',
            header: 'Datum',
            width: proportional(2, {minWidth: 160}),
          },
          {
            key: 'amount',
            header: 'Bedrag',
            width: proportional(1, {minWidth: 100}),
          },
          {
            key: 'status',
            header: 'Status',
            width: proportional(1, {minWidth: 100}),
            renderCell: item => (
              <Badge
                variant={item.status === 'betaald' ? 'success' : 'warning'}
                label={item.status === 'betaald' ? 'Betaald' : 'Open'}
              />
            ),
          },
          {
            key: 'download',
            header: 'Factuur',
            width: proportional(2, {minWidth: 190}),
            renderCell: item => <DemoDownload name={item.number} />,
          },
        ]}
      />
  );
}

function CostsCard() {
  return (
    <PortalCard>
      <VStack gap={5} align="stretch">
        <BlockTitle>Kosten</BlockTitle>
        <Facts
          items={[
            {label: 'Maandbedrag', value: TENANT_SPACE.monthly},
            {label: 'Volgende betaling', value: TENANT_SPACE.nextPayment},
          ]}
        />
        <InvoiceTable />
      </VStack>
    </PortalCard>
  );
}

/** Same honest pattern as the site's forms: validates, then says nothing was sent. */
function ReportCard() {
  const [category, setCategory] = useState<string | undefined>();
  const [description, setDescription] = useState('');
  const errors = {
    category: category ? undefined : 'Kies een categorie.',
    description:
      description.trim() === '' ? 'Vul een omschrijving in.' : undefined,
  };
  const form = useFormSubmit(Object.values(errors).some(Boolean));
  return (
    <PortalCard>
      <form
        ref={form.formRef}
        onSubmit={form.handleSubmit}
        noValidate
        autoComplete="off">
        <VStack gap={5} align="stretch">
          <BlockTitle>Melding maken</BlockTitle>
          {form.isSent ? (
            <Banner
              status="warning"
              title="Demo: je melding is niet verstuurd."
              collapsible={false}>
              Dit is een testomgeving. Er is niets verstuurd.
            </Banner>
          ) : null}
          <FormLayout>
            <Selector
              size="lg"
              label="Categorie"
              options={REPORT_CATEGORIES.map(value => ({value, label: value}))}
              value={category}
              onChange={setCategory}
              isRequired
              status={form.status(errors.category)}
            />
            <TextArea
              label="Omschrijving"
              value={description}
              onChange={setDescription}
              rows={5}
              isRequired
              status={form.status(errors.description)}
            />
          </FormLayout>
          <div>
            <Button
              label="Melding versturen"
              type="submit"
              variant="primary"
              size="lg"
            />
          </div>
        </VStack>
      </form>
    </PortalCard>
  );
}

function MessagesCard() {
  return (
    <PortalCard>
      <VStack gap={4} align="stretch">
        <BlockTitle>Berichten</BlockTitle>
        <List hasDividers edge="flush">
          {TENANT_MESSAGES.map(message => (
            <ListItem
              key={message.id}
              label={message.title}
              description={<Text color="secondary">{message.body}</Text>}
              endContent={
                <Text type="supporting" color="secondary">
                  {message.date}
                </Text>
              }
            />
          ))}
        </List>
      </VStack>
    </PortalCard>
  );
}

/** Huurder: the space, the costs, a report form and messages. */
export function TenantView() {
  const [section, setSection] = useState<Section>('ruimte');
  return (
    <VStack gap={6} align="stretch">
      <TabList
        role="tablist"
        aria-label="Onderdelen voor huurders"
        value={section}
        onChange={value => setSection(value as Section)}
        hasDivider
        size="lg">
        <Tab value="ruimte" label="Mijn ruimte" panelId={PANEL_ID} />
        <Tab value="kosten" label="Kosten" panelId={PANEL_ID} />
        <Tab value="melding" label="Melding maken" panelId={PANEL_ID} />
        <Tab value="berichten" label="Berichten" panelId={PANEL_ID} />
      </TabList>
      <div role="tabpanel" id={PANEL_ID}>
        {section === 'ruimte' ? <SpaceCard /> : null}
        {section === 'kosten' ? <CostsCard /> : null}
        {section === 'melding' ? <ReportCard /> : null}
        {section === 'berichten' ? <MessagesCard /> : null}
      </div>
      <ContactCard />
    </VStack>
  );
}
