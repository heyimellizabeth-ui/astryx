// Copyright (c) Meta Platforms, Inc. and affiliates.

import {
  TopNav,
  TopNavHeading,
  TopNavItem,
  TopNavMenu,
} from '@astryxdesign/core/TopNav';
import {Button} from '@astryxdesign/core/Button';
import {IconButton} from '@astryxdesign/core/IconButton';
import {NAV_ABOUT, NAV_FOR_WHO} from '../content';

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

export function SiteHeader() {
  return (
    <TopNav
      label="Hoofdnavigatie"
      heading={<TopNavHeading heading="Flexstad" headingHref="/" />}
      startContent={
        <>
          <TopNavItem label="Aanbod" href="/aanbod/" />
          <TopNavMenu label="Voor wie" items={NAV_FOR_WHO} />
          <TopNavMenu label="Flexstad" items={NAV_ABOUT} />
        </>
      }
      endContent={
        <>
          <TopNavItem label="Contact" href="/contact/" />
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
