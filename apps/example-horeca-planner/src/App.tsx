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
import {useState} from 'react';
import {hrefFor, useRoute, type View} from './lib/route';
import {SignInDialog} from './components/SignInDialog';
import {GUEST} from './lib/seed';
import {PlannerProvider, usePlanner} from './state/store';
import {I18nProvider, useI18n} from './i18n/I18nProvider';
import {LANGS, type Lang} from './i18n/format';
import {OpenShiftsView} from './views/OpenShiftsView';
import {RosterView} from './views/RosterView';
import {SettingsView} from './views/SettingsView';
import {TeamView} from './views/TeamView';
import {TimeOffView} from './views/TimeOffView';

function Navigation({view}: {view: View}) {
  const {data, viewerId, viewer, isManager, unlocked, dispatch} = usePlanner();
  const {t, lang, setLang} = useI18n();
  const [signingIn, setSigningIn] = useState<string | null>(null);
  const pending = data.timeOff.filter((t) => t.status === 'pending').length;
  const open = upcomingOnBoard(data.shifts, todayISO()).length;
  const viewerOptions = [
    {value: GUEST, label: t('viewer.guest'), description: t('viewer.guestDesc')},
    ...[...data.staff]
    .sort((a, b) => Number(b.role === 'admin') - Number(a.role === 'admin') || a.name.localeCompare(b.name))
    .map((s) => ({value: s.id, label: s.name, description: t(`role.${s.role}`)})),
  ];
  const viewerNote = isManager ? t('viewer.descManager') : viewer ? t('viewer.descStaff') : t('viewer.descGuest');

  function chooseViewer(value: string) {
    const target = data.staff.find((s) => s.id === value);
    // An administrator needs the password, unless this session is already signed in.
    if (target?.role === 'admin' && !unlocked) setSigningIn(value);
    else dispatch({type: 'viewer/set', viewerId: value});
  }

  return (
    <>
    <SideNav
      aria-label={t('nav.label')}
      collapsible
      header={<SideNavHeading heading={t('app.name')} subheading={t('app.tagline')} icon={<Icon icon={RectangleGroupIcon} />} />}
      footer={
        <VStack padding={2} gap={3}>
          <Selector label={t('lang.label')} options={LANGS.map((l) => ({value: l.code, label: l.name}))} value={lang} onChange={(value) => setLang(value as Lang)} />
          <Selector
            label={t('viewer.label')}
            description={viewerNote}
            options={viewerOptions}
            value={viewerId}
            hasSearch
            onChange={chooseViewer}
          />
        </VStack>
      }>
      <SideNavSection title={t('nav.plan')}>
        <SideNavItem label={t('nav.roster')} href={hrefFor('roster')} icon={CalendarDaysIcon} selectedIcon={CalendarDaysSolid} isSelected={view === 'roster'} />
        <SideNavItem
          label={t('nav.timeOff')}
          href={hrefFor('time-off')}
          icon={ClockIcon}
          selectedIcon={ClockSolid}
          isSelected={view === 'time-off'}
          endContent={pending > 0 ? <Badge variant="warning" label={String(pending)} /> : undefined}
        />
        <SideNavItem
          label={t('nav.openShifts')}
          href={hrefFor('open-shifts')}
          icon={HandRaisedIcon}
          selectedIcon={HandRaisedSolid}
          isSelected={view === 'open-shifts'}
          endContent={open > 0 ? <Badge variant="info" label={String(open)} /> : undefined}
        />
      </SideNavSection>
      <SideNavSection title={t('nav.restaurant')}>
        <SideNavItem label={t('nav.team')} href={hrefFor('team')} icon={UsersIcon} selectedIcon={UsersSolid} isSelected={view === 'team'} />
        {isManager && (
          <SideNavItem label={t('nav.settings')} href={hrefFor('settings')} icon={Cog6ToothIcon} selectedIcon={Cog6ToothSolid} isSelected={view === 'settings'} />
        )}
      </SideNavSection>
    </SideNav>
    {signingIn && <SignInDialog adminId={signingIn} onClose={() => setSigningIn(null)} />}
    </>
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
    <I18nProvider>
      <PlannerProvider>
        <Screen />
      </PlannerProvider>
    </I18nProvider>
  );
}
