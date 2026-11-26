// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {Banner} from '@astryxdesign/core/Banner';
import {Heading} from '@astryxdesign/core/Heading';
import {VStack} from '@astryxdesign/core/Layout';
import {Link} from '@astryxdesign/core/Link';
import {CONTACT} from '../content';
import {FormPanel} from '../sections/Forms';
import {PageSection} from '../sections/PageSection';
import {RepairForm} from '../sections/RepairForm';
import {BulletList, PageHero} from '../sections/ui';

const styles = stylex.create({
  // The tips on the left, the form on the right (as on the contact page).
  split: {
    display: 'grid',
    columnGap: 64,
    rowGap: 32,
    alignItems: 'start',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'minmax(0, 5fr) minmax(0, 7fr)',
    },
  },
  sticky: {
    position: {default: 'static', '@media (min-width: 900px)': 'sticky'},
    top: 96,
  },
});

/** `/reparatie-melden/`: where a tenant reports something broken. */
export function Reparatie() {
  return (
    <>
      <PageHero
        title="Reparatie melden"
        intro="Is er iets kapot of beschadigd in uw pand? Meld het hier en voeg zo nodig foto’s toe."
        trail={[{title: 'Home', href: '/'}, {title: 'Reparatie melden'}]}
      />
      <PageSection>
        <div {...stylex.props(styles.split)}>
          <div {...stylex.props(styles.sticky)}>
            <VStack gap={6} align="stretch">
              <Banner
                status="warning"
                title="Acuut gevaar?"
                collapsible={false}>
                Bij brand, gaslucht of een andere levensgevaarlijke situatie
                belt u eerst 112. Is het dringend maar niet levensbedreigend,
                bel dan ons op{' '}
                <Link href={CONTACT.phoneHref}>{CONTACT.phone}</Link>.
              </Banner>
              <VStack gap={3} align="start">
                <Heading level={3}>Zo meldt u het goed</Heading>
                <BulletList
                  items={[
                    'Noem het adres of pand en, als dat kan, de kamer.',
                    'Beschrijf wat er kapot is en sinds wanneer.',
                    'Voeg een foto van het geheel toe en een van dichtbij.',
                  ]}
                />
              </VStack>
            </VStack>
          </div>
          <FormPanel>
            <RepairForm />
          </FormPanel>
        </div>
      </PageSection>
    </>
  );
}
