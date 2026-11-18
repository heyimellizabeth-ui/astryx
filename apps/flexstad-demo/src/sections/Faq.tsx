// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {Collapsible, CollapsibleGroup} from '@astryxdesign/core/Collapsible';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/Layout';
import {FAQ} from '../content';
import {PageSection} from './PageSection';

const styles = stylex.create({
  layout: {
    display: 'grid',
    gap: 32,
    alignItems: 'start',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'minmax(0, 5fr) minmax(0, 7fr)',
    },
  },
  // Each group opens with a firm rule, so the three read as three lists.
  group: {
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-text-primary)',
  },
});

/** All 14 questions in three groups; groups sit side by side on desktop. */
export function Faq() {
  return (
    <PageSection isWashed>
      <div {...stylex.props(styles.layout)}>
        <Heading level={2}>Veelgestelde vragen</Heading>
        <VStack gap={8}>
          {FAQ.map(group => (
            <VStack key={group.id} gap={3} xstyle={styles.group}>
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
        </VStack>
      </div>
    </PageSection>
  );
}
