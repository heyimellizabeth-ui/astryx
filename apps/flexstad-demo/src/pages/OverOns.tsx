// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {ABOUT} from '../content';
import {bandStyles} from '../sections/bandStyles';
import {PageSection} from '../sections/PageSection';
import {CtaBand, PageHero, Photo, RowsSection} from '../sections/ui';

const styles = stylex.create({
  // The statement is a text object at the section token, ten columns wide.
  statement: {maxWidth: '22em'},
  panel: {
    padding: 32,
    borderRadius: 'var(--radius-container)',
    backgroundColor: 'var(--color-background-muted)',
  },
  band: {
    padding: 32,
    borderRadius: 'var(--radius-container)',
    backgroundColor: 'var(--flex-band)',
  },
});

export function OverOns() {
  return (
    <>
      <PageHero
        title="Over Flexstad"
        trail={[{title: 'Home', href: '/'}, {title: 'Over ons'}]}
      />
      <PageSection isWashed paddingBlock={6}>
        <Photo label="Het Flexstad-team" seed={3} ratio="21 / 8" />
      </PageSection>
      <PageSection paddingBlock={10}>
        <VStack gap={8}>
          <div {...stylex.props(styles.statement)}>
            <Heading level={2}>{ABOUT.heading}</Heading>
          </div>
          <Grid columns={{minWidth: 280, repeat: 'fit'}} gap={8} align="start">
            {ABOUT.story.map(text => (
              <Text key={text} color="secondary">
                {text}
              </Text>
            ))}
          </Grid>
        </VStack>
      </PageSection>
      <PageSection isWashed>
        <Grid columns={{minWidth: 300, repeat: 'fit'}} gap={6} align="stretch">
          <div {...stylex.props(styles.panel)}>
            <VStack gap={3}>
              <Heading level={3}>{ABOUT.mission.title}</Heading>
              <Text color="secondary">{ABOUT.mission.body}</Text>
            </VStack>
          </div>
          <div {...stylex.props(styles.band, bandStyles.onBand)}>
            <VStack gap={3}>
              <Heading level={3}>{ABOUT.vision.title}</Heading>
              <Text color="secondary">{ABOUT.vision.body}</Text>
            </VStack>
          </div>
        </Grid>
      </PageSection>
      <PageSection>
        <RowsSection title={ABOUT.reasonsTitle} items={ABOUT.reasons} />
      </PageSection>
      <CtaBand title={ABOUT.meetTitle} body={ABOUT.meet} />
    </>
  );
}
