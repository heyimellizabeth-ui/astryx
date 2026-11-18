// Copyright (c) Meta Platforms, Inc. and affiliates.

import {Collapsible, CollapsibleGroup} from '@astryxdesign/core/Collapsible';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/Layout';
import {FAQ} from '../content';
import {PageSection} from './PageSection';

/** All 14 questions in three groups; groups sit side by side on desktop. */
export function Faq() {
  return (
    <PageSection isWashed>
      <VStack gap={6}>
        <Heading level={2}>Veelgestelde vragen</Heading>
        <Grid columns={{minWidth: 300, repeat: 'fit'}} gap={6} align="start">
          {FAQ.map(group => (
            <VStack key={group.id} gap={2}>
              <Heading level={3}>{group.title}</Heading>
              <CollapsibleGroup type="single" hasDividers>
                {group.items.map(item => (
                  <Collapsible
                    key={item.question}
                    value={item.question}
                    defaultIsOpen={false}
                    trigger={<Text weight="medium">{item.question}</Text>}>
                    <Text color="secondary">{item.answer}</Text>
                  </Collapsible>
                ))}
              </CollapsibleGroup>
            </VStack>
          ))}
        </Grid>
      </VStack>
    </PageSection>
  );
}
