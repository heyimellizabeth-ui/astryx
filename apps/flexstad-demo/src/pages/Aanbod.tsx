// Copyright (c) Meta Platforms, Inc. and affiliates.

import {useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {CheckboxList, CheckboxListItem} from '@astryxdesign/core/CheckboxList';
import {Drawer} from '@astryxdesign/core/Drawer';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {LISTINGS, LOCATIONS, STATUSES} from '../content';
import {useIsNarrow} from '../hooks';
import {replaceSearch, useSearch} from '../router';
import {ListingCard} from '../sections/ListingCard';
import {PageSection} from '../sections/PageSection';
import {CtaBand, PageHero} from '../sections/ui';

function Filters({
  locations,
  statuses,
  onChange,
}: {
  locations: string[];
  statuses: string[];
  onChange: (key: 'locatie' | 'status', values: string[]) => void;
}) {
  return (
    <VStack gap={5}>
      <CheckboxList
        label="Locatie"
        value={locations}
        onChange={values => onChange('locatie', values)}>
        {LOCATIONS.map(location => (
          <CheckboxListItem key={location} value={location} label={location} />
        ))}
      </CheckboxList>
      <CheckboxList
        label="Status"
        value={statuses}
        onChange={values => onChange('status', values)}>
        {STATUSES.map(status => (
          <CheckboxListItem
            key={status.value}
            value={status.value}
            label={status.label}
          />
        ))}
      </CheckboxList>
    </VStack>
  );
}

/** Listings with filters. Filter state lives in the URL (?locatie=&status=). */
export function Aanbod() {
  const search = useSearch();
  const isNarrow = useIsNarrow(768);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const locations = search.getAll('locatie');
  const statuses = search.getAll('status');

  function setFilter(key: 'locatie' | 'status', values: string[]) {
    const next = new URLSearchParams(search);
    next.delete(key);
    values.forEach(value => next.append(key, value));
    replaceSearch(next);
  }

  const visible = LISTINGS.filter(
    listing =>
      (locations.length === 0 || locations.includes(listing.city)) &&
      (statuses.length === 0 || statuses.includes(listing.status)),
  );
  const hasFilters = locations.length + statuses.length > 0;
  const filters = (
    <Filters locations={locations} statuses={statuses} onChange={setFilter} />
  );

  return (
    <>
      <PageHero
        title="Actueel aanbod"
        trail={[{title: 'Home', href: '/'}, {title: 'Aanbod'}]}
        ctas={[{label: 'Schrijf je nu in!', href: '/inschrijven/'}]}
      />
      <PageSection>
        <div
          style={{
            display: 'grid',
            gap: 32,
            alignItems: 'start',
            gridTemplateColumns: isNarrow ? '1fr' : '260px 1fr',
          }}>
          {isNarrow ? null : <VStack gap={4}>{filters}</VStack>}
          <VStack gap={4}>
            <HStack justify="between" align="center" gap={3}>
              <Text color="secondary" role="status">
                {visible.length === 1
                  ? '1 resultaat'
                  : `${visible.length} resultaten`}
              </Text>
              {isNarrow ? (
                <Button
                  label="Filters"
                  variant="secondary"
                  onClick={() => setIsDrawerOpen(true)}
                />
              ) : null}
            </HStack>
            {visible.length > 0 ? (
              <Grid columns={{minWidth: 260, repeat: 'fill'}} gap={4}>
                {visible.map(listing => (
                  <ListingCard key={listing.slug} listing={listing} />
                ))}
              </Grid>
            ) : (
              <VStack gap={3} align="start">
                <Heading level={3}>Geen aanbod gevonden</Heading>
                <Text color="secondary">
                  Pas de filters aan of schrijf je in, dan laten we het weten
                  als er iets beschikbaar komt.
                </Text>
                {hasFilters ? (
                  <Button
                    label="Wis filters"
                    variant="secondary"
                    onClick={() => replaceSearch(new URLSearchParams())}
                  />
                ) : null}
              </VStack>
            )}
          </VStack>
        </div>
      </PageSection>
      <Drawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        label="Filters"
        side="start"
        padding={4}>
        {filters}
      </Drawer>
      <CtaBand />
    </>
  );
}
