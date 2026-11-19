// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {useState} from 'react';
import {Badge} from '@astryxdesign/core/Badge';
import {VStack} from '@astryxdesign/core/Layout';
import {Table, proportional} from '@astryxdesign/core/Table';
import {Tab, TabList} from '@astryxdesign/core/TabList';
import {Text} from '@astryxdesign/core/Text';
import {
  BlockTitle,
  Card,
  ContactCard,
  DemoDownload,
  RowText,
  RuledList,
  RuledRow,
  ScrollBox,
} from './Parts';
import {
  OWNER_DOCUMENTS,
  OWNER_INSPECTIONS,
  OWNER_OBJECTS,
  type ObjectStatus,
  type OwnerObject,
} from './sampleData';

const PANEL_ID = 'eigenaar-paneel';

type Section = 'objecten' | 'inspecties' | 'documenten';

const styles = stylex.create({
  figures: {
    display: 'grid',
    gap: 16,
    margin: 0,
    padding: 0,
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  },
  figure: {
    display: 'grid',
    gap: 4,
    margin: 0,
    padding: {default: 16, '@media (min-width: 700px)': 24},
    borderRadius: 'var(--radius-container)',
    backgroundColor: 'var(--color-background-muted)',
  },
  figureValue: {
    margin: 0,
    fontSize: 'clamp(32px, 20px + 2.4vw, 56px)',
    lineHeight: 1,
    fontWeight: 700,
    color: 'var(--color-text-primary)',
  },
  figureLabel: {margin: 0},
});

const STATUS_VARIANT: Record<ObjectStatus, 'success' | 'neutral' | 'info'> = {
  bezet: 'success',
  leeg: 'neutral',
  'in voorbereiding': 'info',
};

const STATUS_LABEL: Record<ObjectStatus, string> = {
  bezet: 'Bezet',
  leeg: 'Leeg',
  'in voorbereiding': 'In voorbereiding',
};

/** Three figures, counted from the sample list so they always agree with it. */
function Summary() {
  const total = OWNER_OBJECTS.length;
  const occupied = OWNER_OBJECTS.filter(item => item.status === 'bezet').length;
  const empty = OWNER_OBJECTS.filter(item => item.status === 'leeg').length;
  const figures = [
    {label: 'Objecten', value: total},
    {label: 'Bezet', value: occupied},
    {label: 'Leeg', value: empty},
  ];
  return (
    <dl {...stylex.props(styles.figures)}>
      {figures.map(item => (
        <div key={item.label} {...stylex.props(styles.figure)}>
          <dd {...stylex.props(styles.figureValue)}>{item.value}</dd>
          <dt {...stylex.props(styles.figureLabel)}>
            <Text color="secondary">{item.label}</Text>
          </dt>
        </div>
      ))}
    </dl>
  );
}

function ObjectsCard() {
  return (
    <Card>
      <VStack gap={4} align="stretch">
        <BlockTitle>Mijn objecten</BlockTitle>
        <ScrollBox>
          <Table<OwnerObject & Record<string, unknown>>
            label="Objecten (voorbeelddata)"
            data={
              OWNER_OBJECTS as unknown as Array<
                OwnerObject & Record<string, unknown>
              >
            }
            idKey="id"
            columns={[
              {
                key: 'address',
                header: 'Adres',
                width: proportional(3, {minWidth: 220}),
              },
              {
                key: 'type',
                header: 'Type',
                width: proportional(2, {minWidth: 140}),
              },
              {
                key: 'status',
                header: 'Status',
                width: proportional(2, {minWidth: 160}),
                renderCell: item => (
                  <Badge
                    variant={STATUS_VARIANT[item.status]}
                    label={STATUS_LABEL[item.status]}
                  />
                ),
              },
              {
                key: 'occupantSince',
                header: 'Bewoner sinds',
                width: proportional(2, {minWidth: 170}),
              },
              {
                key: 'lastInspection',
                header: 'Laatste inspectie',
                width: proportional(2, {minWidth: 170}),
              },
            ]}
          />
        </ScrollBox>
      </VStack>
    </Card>
  );
}

function InspectionsCard() {
  return (
    <Card>
      <VStack gap={4} align="stretch">
        <BlockTitle>Inspecties</BlockTitle>
        <RuledList>
          {OWNER_INSPECTIONS.map(item => (
            <RuledRow key={item.id}>
              <RowText>
                <VStack gap={1} align="start">
                  <Text weight="medium">
                    {item.date}, {item.address}
                  </Text>
                  <Text color="secondary">{item.note}</Text>
                </VStack>
              </RowText>
              <Badge
                variant={item.result === 'goedgekeurd' ? 'success' : 'warning'}
                label={
                  item.result === 'goedgekeurd'
                    ? 'Goedgekeurd'
                    : 'Aandachtspunt'
                }
              />
            </RuledRow>
          ))}
        </RuledList>
      </VStack>
    </Card>
  );
}

function DocumentsCard() {
  return (
    <Card>
      <VStack gap={4} align="stretch">
        <BlockTitle>Documenten</BlockTitle>
        <RuledList>
          {OWNER_DOCUMENTS.map(item => (
            <RuledRow key={item.id}>
              <RowText>
                <VStack gap={1} align="start">
                  <Text weight="medium">{item.title}</Text>
                  <Text type="supporting" color="secondary">
                    {item.detail}
                  </Text>
                </VStack>
              </RowText>
              <DemoDownload name={item.title} />
            </RuledRow>
          ))}
        </RuledList>
      </VStack>
    </Card>
  );
}

/** Eigenaar: a summary, the objects, inspections and documents. */
export function OwnerView() {
  const [section, setSection] = useState<Section>('objecten');
  return (
    <VStack gap={6} align="stretch">
      <Summary />
      <TabList
        role="tablist"
        aria-label="Onderdelen voor eigenaren"
        value={section}
        onChange={value => setSection(value as Section)}
        hasDivider
        size="lg">
        <Tab value="objecten" label="Mijn objecten" panelId={PANEL_ID} />
        <Tab value="inspecties" label="Inspecties" panelId={PANEL_ID} />
        <Tab value="documenten" label="Documenten" panelId={PANEL_ID} />
      </TabList>
      <div role="tabpanel" id={PANEL_ID}>
        {section === 'objecten' ? <ObjectsCard /> : null}
        {section === 'inspecties' ? <InspectionsCard /> : null}
        {section === 'documenten' ? <DocumentsCard /> : null}
      </div>
      <ContactCard />
    </VStack>
  );
}
