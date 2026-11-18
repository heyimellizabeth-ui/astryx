// Copyright (c) Meta Platforms, Inc. and affiliates.

import {PageHero} from '../sections/ui';

export function NotFound() {
  return (
    <PageHero
      title="Pagina niet gevonden"
      intro="Deze pagina bestaat niet (meer). Ga terug naar de homepage of bekijk ons aanbod."
      ctas={[
        {label: 'Naar de homepage', href: '/'},
        {label: 'Bekijk ons aanbod', href: '/aanbod/'},
      ]}
    />
  );
}
