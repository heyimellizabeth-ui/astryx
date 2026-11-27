// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {ABOUT} from '../content';
import {PHOTOS} from '../photos';
import {PageSection} from '../sections/PageSection';
import {CtaBand, PageHero, PhotoImage, Paragraphs} from '../sections/ui';

const styles = stylex.create({
  // The statement on the left, the whole story in one measure on the right.
  story: {
    display: 'grid',
    columnGap: 64,
    rowGap: 32,
    alignItems: 'start',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'minmax(0, 5fr) minmax(0, 7fr)',
    },
  },
  panel: {
    padding: 40,
    borderRadius: 'var(--radius-container)',
    backgroundColor: 'var(--color-background-muted)',
  },
  // The six reasons: ruled, three across over three across.
  reasons: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    display: 'grid',
    columnGap: 32,
    rowGap: 32,
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'repeat(3, minmax(0, 1fr))',
    },
  },
  reason: {
    paddingTop: 16,
    minWidth: 0,
    borderTopWidth: 2,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-text-primary)',
  },
});

export function OverOns() {
  return (
    <>
      <PageHero
        title="Over Flexstad"
        trail={[{title: 'Home', href: '/'}, {title: 'Over ons'}]}
        paddingBlock={6}
      />
      <PageSection paddingBlock={6}>
        <PhotoImage photo={PHOTOS.aboutOfficeFloor} ratio="wide" isPriority />
      </PageSection>
      <PageSection paddingBlock={8}>
        <div {...stylex.props(styles.story)}>
          <Heading level={2}>{ABOUT.heading}</Heading>
          <Paragraphs items={ABOUT.story} />
        </div>
      </PageSection>
      <PageSection isWashed>
        <Grid columns={{minWidth: 300, repeat: 'fit'}} gap={6} align="stretch">
          <div {...stylex.props(styles.panel)}>
            <VStack gap={3}>
              <Heading level={3}>{ABOUT.mission.title}</Heading>
              <Text color="secondary">{ABOUT.mission.body}</Text>
            </VStack>
          </div>
          <div {...stylex.props(styles.panel)}>
            <VStack gap={3}>
              <Heading level={3}>{ABOUT.vision.title}</Heading>
              <Text color="secondary">{ABOUT.vision.body}</Text>
            </VStack>
          </div>
        </Grid>
      </PageSection>
      <PageSection>
        <VStack gap={8}>
          <Heading level={2}>{ABOUT.reasonsTitle}</Heading>
          <ul {...stylex.props(styles.reasons)}>
            {ABOUT.reasons.map(reason => (
              <li key={reason} {...stylex.props(styles.reason)}>
                <Text type="large" weight="bold" color="primary">
                  {reason}
                </Text>
              </li>
            ))}
          </ul>
        </VStack>
      </PageSection>
      <CtaBand about="over-ons" title={ABOUT.meetTitle} body={ABOUT.meet} />
    </>
  );
}
