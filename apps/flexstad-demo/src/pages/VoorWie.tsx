// Copyright (c) Meta Platforms, Inc. and affiliates.

import {HOME_COPY} from '../content';
import {AudienceIndexList} from '../sections/AudienceIndexList';
import {PageSection} from '../sections/PageSection';
import {CtaBand, PageHero} from '../sections/ui';

/**
 * Voor wie: the four audiences as the same photo rows the home page uses,
 * each with equal weight. A row links to the audience's own page, where that
 * audience's action lives; the closing band offers contact to everyone.
 */
export function VoorWie() {
  return (
    <>
      <PageHero
        title="Voor wie"
        intro={HOME_COPY.discover}
        trail={[{title: 'Home', href: '/'}, {title: 'Voor wie'}]}
      />
      <PageSection paddingBlock={8}>
        <AudienceIndexList />
      </PageSection>
      <CtaBand />
    </>
  );
}
