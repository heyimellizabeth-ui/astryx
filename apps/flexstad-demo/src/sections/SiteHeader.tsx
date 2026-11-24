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
import {BrandMark} from './BrandMark';

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
  // The bar stays with the reader: paper, a little see-through, over a blur,
  // with one hairline under it once the page moves beneath.
  sticky: {
    position: 'sticky',
    top: 0,
    zIndex: 20,
    backgroundColor:
      'color-mix(in oklch, var(--color-background-body) 88%, transparent)',
    backdropFilter: 'saturate(1.4) blur(14px)',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border)',
  },
  phoneLogo: {display: 'flex', alignItems: 'center', minHeight: 44},
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
          logo={<BrandMark width={136} />}
          logoLabel="Flexstad, naar de homepage"
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
        <Link href="/" hasUnderline={false} xstyle={styles.phoneLogo}>
          <BrandMark width={112} />
        </Link>
        <HStack gap={2} align="center">
          <Button
            label="Inschrijven"
            variant="primary"
            href="/inschrijven/"
            size="lg"
          />
          <IconButton
            label="Menu"
            icon={<Icon icon="menu" />}
            variant="ghost"
            size="lg"
            onClick={() => setIsOpen(true)}
          />
        </HStack>
      </HStack>
      <MobileNav
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        label="Menu"
        side="end"
        header={<BrandMark width={112} />}>
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
  return (
    <header {...stylex.props(styles.sticky)}>
      {isNarrow ? <PhoneHeader /> : <DesktopHeader />}
    </header>
  );
}
