// Copyright (c) Meta Platforms, Inc. and affiliates.

import {Button} from '@astryxdesign/core/Button';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {PageSection} from './PageSection';

export function Hero() {
  return (
    <PageSection isWashed>
      <VStack gap={6} align="start">
        <Heading level={1} type="display-2">
          Leegstaand vastgoed? Wij activeren, beheren en exploiteren
        </Heading>
        <Text type="large" color="secondary">
          Flexstad geeft leegstaande panden tijdelijk een nieuwe bestemming voor
          ondernemers, makers en maatschappelijke initiatieven.
        </Text>
        <HStack gap={3} wrap="wrap">
          <Button
            label="Bekijk ons aanbod"
            variant="primary"
            size="lg"
            href="/aanbod/"
          />
          <Button
            label="Ontdek onze mogelijkheden"
            variant="secondary"
            size="lg"
            href="#intro"
          />
        </HStack>
      </VStack>
    </PageSection>
  );
}
