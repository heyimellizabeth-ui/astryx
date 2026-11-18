// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {CheckboxList, CheckboxListItem} from '@astryxdesign/core/CheckboxList';
import {Drawer} from '@astryxdesign/core/Drawer';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {Token} from '@astryxdesign/core/Token';
import {LISTINGS, LOCATIONS, STATUSES} from '../content';
import {useIsNarrow} from '../hooks';
import {replaceSearch, useSearch} from '../router';
import {ListingCard} from '../sections/ListingCard';
import {PageSection} from '../sections/PageSection';
import {CtaBand, PageHero} from '../sections/ui';

const styles = stylex.create({
  // Uniform cards: one column, two from 1000px, where the column beside the
  // filters is wide enough for two equal tracks.
  catalogue: {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 1000px)': 'repeat(2, minmax(0, 1fr))',
    },
  },
  cell: {display: 'flex'},
  chips: {display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center'},
  // The banner's index: each place the listings are in, with how many, as
  // hairline rows that set the filter. It anchors the head to the catalogue.
  index: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border-emphasized)',
  },
  indexRow: {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border-emphasized)',
  },
  indexLink: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 16,
    minHeight: 48,
    paddingBlock: 10,
    boxSizing: 'border-box',
    color: 'var(--color-text-primary)',
    textDecoration: 'none',
    fontSize: 20,
    fontWeight: 500,
    transitionProperty: 'color',
    transitionDuration: '0.15s',
    ':hover': {color: 'var(--color-text-accent)'},
  },
  indexCount: {
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 700,
  },
});

/** Each place with listings, and how many, as links that set the filter. */
function PlaceIndex() {
  const places = LOCATIONS.map(city => ({
    city,
    count: LISTINGS.filter(listing => listing.city === city).length,
  })).sort((a, b) => b.count - a.count);
  return (
    <nav aria-label="Aanbod per plaats">
      <ul {...stylex.props(styles.index)}>
        {places.map(({city, count}) => (
          <li key={city} {...stylex.props(styles.indexRow)}>
            <a
              href={`/aanbod/?locatie=${encodeURIComponent(city)}`}
              {...stylex.props(styles.indexLink)}>
              <span>{city}</span>
              <span {...stylex.props(styles.indexCount)}>{count}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

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
        paddingBlock={6}
        title="Actueel aanbod"
        trail={[{title: 'Home', href: '/'}, {title: 'Aanbod'}]}
        ctas={[{label: 'Schrijf je nu in!', href: '/inschrijven/'}]}
        aside={<PlaceIndex />}
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
            {hasFilters ? (
              <div {...stylex.props(styles.chips)}>
                {locations.map(value => (
                  <Token
                    key={`locatie-${value}`}
                    label={value}
                    onRemove={() =>
                      setFilter(
                        'locatie',
                        locations.filter(item => item !== value),
                      )
                    }
                  />
                ))}
                {statuses.map(value => (
                  <Token
                    key={`status-${value}`}
                    label={
                      STATUSES.find(item => item.value === value)?.label ??
                      value
                    }
                    onRemove={() =>
                      setFilter(
                        'status',
                        statuses.filter(item => item !== value),
                      )
                    }
                  />
                ))}
                {visible.length > 0 ? (
                  <Button
                    label="Wis filters"
                    variant="ghost"
                    onClick={() => replaceSearch(new URLSearchParams())}
                  />
                ) : null}
              </div>
            ) : null}
            {visible.length > 0 ? (
              <div {...stylex.props(styles.catalogue)}>
                {visible.map(listing => (
                  <div
                    key={listing.slug}
                    data-reveal=""
                    {...stylex.props(styles.cell)}>
                    <ListingCard listing={listing} />
                  </div>
                ))}
              </div>
            ) : (
              <VStack gap={3} align="start">
                <Heading level={3}>Geen aanbod gevonden</Heading>
                <Text color="secondary">
                  Er is geen aanbod met deze filters. Wis de filters om al het
                  aanbod te zien.
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
