import {Icon} from '@astryxdesign/core/Icon';
import {AppShell} from '@astryxdesign/core/AppShell';
import {Badge} from '@astryxdesign/core/Badge';
import {Selector} from '@astryxdesign/core/Selector';
import {SideNav, SideNavHeading, SideNavItem, SideNavSection} from '@astryxdesign/core/SideNav';
import {VStack} from '@astryxdesign/core/VStack';
import {
  CalendarDaysIcon,
  ClockIcon,
  Cog6ToothIcon,
  HandRaisedIcon,
  RectangleGroupIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import {
  CalendarDaysIcon as CalendarDaysSolid,
  ClockIcon as ClockSolid,
  Cog6ToothIcon as Cog6ToothSolid,
  HandRaisedIcon as HandRaisedSolid,
  UsersIcon as UsersSolid,
} from '@heroicons/react/24/solid';
import {todayISO} from './lib/dates';
import {upcomingOnBoard} from './lib/rules';
import {hrefFor, useRoute, type View} from './lib/route';
import {PlannerProvider, usePlanner} from './state/store';
import {MANAGER} from './types';
import {OpenShiftsView} from './views/OpenShiftsView';
import {RosterView} from './views/RosterView';
import {SettingsView} from './views/SettingsView';
import {TeamView} from './views/TeamView';
import {TimeOffView} from './views/TimeOffView';

function Navigation({view}: {view: View}) {
  const {data, viewerId, isManager, dispatch} = usePlanner();
  const pending = data.timeOff.filter((t) => t.status === 'pending').length;
  const open = upcomingOnBoard(data.shifts, todayISO()).length;
  const viewerOptions = [{value: MANAGER, label: 'Manager'}, ...data.staff.map((s) => ({value: s.id, label: s.name}))];

  return (
    <SideNav
      aria-label="Planner"
      collapsible
      header={<SideNavHeading heading="Mise" subheading="Horeca planner" icon={<Icon icon={RectangleGroupIcon} />} />}
      footer={
        <VStack padding={2}>
          <Selector
            label="Viewing as"
            description={isManager ? 'Approve requests and edit the roster' : 'Request time off and pick up shifts'}
            options={viewerOptions}
            value={viewerId}
            onChange={(value) => dispatch({type: 'viewer/set', viewerId: value})}
          />
        </VStack>
      }>
      <SideNavSection title="Plan">
        <SideNavItem label="Roster" href={hrefFor('roster')} icon={CalendarDaysIcon} selectedIcon={CalendarDaysSolid} isSelected={view === 'roster'} />
        <SideNavItem
          label="Time off"
          href={hrefFor('time-off')}
          icon={ClockIcon}
          selectedIcon={ClockSolid}
          isSelected={view === 'time-off'}
          endContent={pending > 0 ? <Badge variant="warning" label={String(pending)} /> : undefined}
        />
        <SideNavItem
          label="Open shifts"
          href={hrefFor('open-shifts')}
          icon={HandRaisedIcon}
          selectedIcon={HandRaisedSolid}
          isSelected={view === 'open-shifts'}
          endContent={open > 0 ? <Badge variant="info" label={String(open)} /> : undefined}
        />
      </SideNavSection>
      <SideNavSection title="Restaurant">
        <SideNavItem label="Team" href={hrefFor('team')} icon={UsersIcon} selectedIcon={UsersSolid} isSelected={view === 'team'} />
        {isManager && (
          <SideNavItem label="Settings" href={hrefFor('settings')} icon={Cog6ToothIcon} selectedIcon={Cog6ToothSolid} isSelected={view === 'settings'} />
        )}
      </SideNavSection>
    </SideNav>
  );
}

function Screen() {
  const {view, params, navigate} = useRoute();
  const {isManager} = usePlanner();
  const current: View = view === 'settings' && !isManager ? 'roster' : view;
  return (
    <AppShell sideNav={<Navigation view={current} />} contentPadding={0} height="fill">
      {current === 'roster' && <RosterView params={params} navigate={navigate} />}
      {current === 'time-off' && <TimeOffView />}
      {current === 'open-shifts' && <OpenShiftsView />}
      {current === 'team' && <TeamView />}
      {current === 'settings' && <SettingsView />}
    </AppShell>
  );
}

export default function App() {
  return (
    <PlannerProvider>
      <Screen />
    </PlannerProvider>
  );
}
