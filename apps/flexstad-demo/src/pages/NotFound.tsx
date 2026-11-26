// Copyright (c) Meta Platforms, Inc. and affiliates.

import {PageHero} from '../sections/ui';

/** A calm page: the head, the one line, the two ways back. */
export function NotFound() {
  return (
    <PageHero
      title="Pagina niet gevonden"
      intro="Deze pagina bestaat niet (meer). Ga terug naar de homepage of bekijk ons aanbod."
      paddingBlock={10}
      ctas={[
        {label: 'Naar de homepage', href: '/'},
        {label: 'Bekijk ons aanbod', href: '/aanbod/'},
      ]}
    />
  );
}
