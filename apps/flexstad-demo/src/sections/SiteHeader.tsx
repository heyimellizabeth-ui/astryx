// Copyright (c) Meta Platforms, Inc. and affiliates.

import {useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {IconButton} from '@astryxdesign/core/IconButton';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {MobileNav} from '@astryxdesign/core/MobileNav';
import {Link} from '@astryxdesign/core/Link';
import {Text} from '@astryxdesign/core/Text';
import {
  TopNav,
  TopNavHeading,
  TopNavItem,
  TopNavMenu,
} from '@astryxdesign/core/TopNav';
import {useIsNarrow} from '../hooks';
import {usePath} from '../router';
import {NAV_ABOUT, NAV_FOR_WHO} from '../content';

const styles = stylex.create({
  // Three-part bar on the content column: the wordmark starts where the page
  // content starts and the action ends where it ends (one left axis).
  bar: {
    boxSizing: 'border-box',
    width: 'min(100% - 32px, 1200px)',
    minHeight: 72,
    marginInline: 'auto',
    paddingInline: 0,
  },
  wordmark: {paddingInlineStart: 0},
});

function PortalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

function DesktopHeader() {
  const path = usePath();
  return (
    <TopNav
      label="Hoofdnavigatie"
      xstyle={styles.bar}
      heading={
        <TopNavHeading
          heading="Flexstad"
          headingHref="/"
          xstyle={styles.wordmark}
        />
      }
      centerContent={
        <>
          <TopNavItem
            label="Aanbod"
            href="/aanbod/"
            isSelected={path.startsWith('/aanbod/')}
          />
          <TopNavMenu label="Voor wie" items={NAV_FOR_WHO} />
          <TopNavMenu label="Flexstad" items={NAV_ABOUT} />
        </>
      }
      endContent={
        <>
          <TopNavItem
            label="Contact"
            href="/contact/"
            isSelected={path === '/contact/'}
          />
          <IconButton
            label="Mijn Flexstad"
            icon={<PortalIcon />}
            variant="ghost"
            href="/mijnflexstad/"
          />
          <Button label="Inschrijven" variant="primary" href="/inschrijven/" />
        </>
      }
    />
  );
}

function NavGroup({title, links}: {title: string; links: typeof NAV_FOR_WHO}) {
  return (
    <VStack gap={2}>
      <Text type="supporting" color="secondary">
        {title}
      </Text>
      {links.map(link => (
        <Link key={link.href} href={link.href}>
          {link.title}
        </Link>
      ))}
    </VStack>
  );
}

/** Phone header: one 56px bar and a drawer, so nothing wraps. */
function PhoneHeader() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <HStack
        justify="between"
        align="center"
        paddingInline={4}
        paddingBlock={2}
        gap={2}>
        <Link href="/" hasUnderline={false}>
          <Text type="large" weight="bold">
            Flexstad
          </Text>
        </Link>
        <HStack gap={2} align="center">
          <Button label="Inschrijven" variant="primary" href="/inschrijven/" />
          <IconButton
            label="Menu"
            icon={<Icon icon="menu" />}
            variant="ghost"
            onClick={() => setIsOpen(true)}
          />
        </HStack>
      </HStack>
      <MobileNav
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        label="Menu"
        side="end"
        header={
          <Text type="large" weight="bold">
            Flexstad
          </Text>
        }>
        <VStack
          gap={5}
          padding={4}
          onClick={event => {
            // Links navigate client-side, so close the drawer ourselves.
            if ((event.target as Element).closest('a')) {
              setIsOpen(false);
            }
          }}>
          <Link href="/aanbod/">Aanbod</Link>
          <NavGroup title="Voor wie" links={NAV_FOR_WHO} />
          <NavGroup title="Flexstad" links={NAV_ABOUT} />
          <Link href="/contact/">Contact</Link>
          <Link href="/mijnflexstad/">Mijn Flexstad</Link>
        </VStack>
      </MobileNav>
    </>
  );
}

export function SiteHeader() {
  const isNarrow = useIsNarrow(900);
  return isNarrow ? <PhoneHeader /> : <DesktopHeader />;
}
