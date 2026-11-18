// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {ABOUT} from '../content';
import {bandStyles} from '../sections/bandStyles';
import {PageSection} from '../sections/PageSection';
import {BulletList, CtaBand, PageHero, Paragraphs} from '../sections/ui';

const styles = stylex.create({
  // The whole story sits in one reading measure under the tagline.
  measure: {maxWidth: '65ch'},
  panel: {
    padding: 28,
    borderRadius: 'var(--radius-container)',
    backgroundColor: 'var(--color-background-muted)',
  },
  band: {
    padding: 28,
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
        photoLabel="Het Flexstad-team"
        seed={3}
      />
      <PageSection paddingBlock={10}>
        <VStack gap={8}>
          <Heading level={2} type="display-1">
            {ABOUT.heading}
          </Heading>
          <div {...stylex.props(styles.measure)}>
            <Paragraphs items={ABOUT.story} />
          </div>
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
        <Grid columns={{minWidth: 280, repeat: 'fit'}} gap={8} align="start">
          <Heading level={2}>{ABOUT.reasonsTitle}</Heading>
          <Grid columns={{minWidth: 220, repeat: 'fit'}} gap={6}>
            <BulletList items={ABOUT.reasons.slice(0, 3)} />
            <BulletList items={ABOUT.reasons.slice(3)} />
          </Grid>
        </Grid>
      </PageSection>
      <CtaBand title={ABOUT.meetTitle} body={ABOUT.meet} />
    </>
  );
}
