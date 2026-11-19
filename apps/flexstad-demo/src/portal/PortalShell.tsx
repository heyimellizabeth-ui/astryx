// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {useEffect} from 'react';
import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import {Text} from '@astryxdesign/core/Text';
import {navigate} from '../router';
import {PageSection} from '../sections/PageSection';
import {Crumbs} from '../sections/ui';
import {
  endDemoSession,
  LOGIN_PATH,
  useDemoSession,
  useDemoView,
  type DemoView,
} from './demoAuth';
import {OwnerView} from './OwnerView';
import {SAMPLE_USER} from './sampleData';
import {TenantView} from './TenantView';

const styles = stylex.create({
  // A quieter head than the inner pages: a step under the display size.
  title: {
    fontSize: 'var(--text-heading-2-size)',
    lineHeight: 'var(--text-heading-2-leading)',
  },
  bar: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 24,
    rowGap: 16,
  },
});

/**
 * The demo portal: a head with the Demo badge, the welcome, the view switch
 * and Uitloggen, then the chosen view. Logged out it renders nothing and
 * sends the visitor to the login, so no portal content ever flashes.
 */
export function PortalShell() {
  const hasSession = useDemoSession();
  const [view, setView] = useDemoView();

  useEffect(() => {
    if (!hasSession) {
      navigate(LOGIN_PATH, {replace: true});
    }
  }, [hasSession]);

  if (!hasSession) {
    return null;
  }

  function logout() {
    endDemoSession();
    navigate(LOGIN_PATH);
  }

  return (
    <>
      <PageSection isWashed paddingBlock={6}>
        <VStack gap={5} align="stretch">
          <Crumbs
            trail={[{title: 'Home', href: '/'}, {title: 'MijnFlexstad'}]}
          />
          <div {...stylex.props(styles.bar)}>
            <VStack gap={2} align="start">
              <HStack gap={3} align="center" wrap="wrap">
                <Heading level={1} xstyle={styles.title}>
                  MijnFlexstad
                </Heading>
                <Badge variant="info" label="Demo" />
              </HStack>
              <Text type="large">Welkom, {SAMPLE_USER}</Text>
              <Text type="supporting" color="secondary">
                Alle gegevens op deze pagina zijn voorbeelddata.
              </Text>
            </VStack>
            <HStack gap={3} align="center" wrap="wrap">
              <SegmentedControl
                label="Weergave"
                size="lg"
                value={view}
                onChange={value => setView(value as DemoView)}>
                <SegmentedControlItem value="huurder" label="Huurder" />
                <SegmentedControlItem value="eigenaar" label="Eigenaar" />
              </SegmentedControl>
              <Button
                label="Uitloggen"
                variant="secondary"
                size="lg"
                onClick={logout}
              />
            </HStack>
          </div>
        </VStack>
      </PageSection>
      <PageSection paddingBlock={6}>
        {view === 'eigenaar' ? <OwnerView /> : <TenantView />}
      </PageSection>
    </>
  );
}
