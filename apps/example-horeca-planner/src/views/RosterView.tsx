import {Icon} from '@astryxdesign/core/Icon';
import {useMemo, useState} from 'react';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {DropdownMenu} from '@astryxdesign/core/DropdownMenu';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack} from '@astryxdesign/core/HStack';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Layout, LayoutContent, LayoutFooter} from '@astryxdesign/core/Layout';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/20/solid';
import {RosterAgenda} from '../components/RosterAgenda';
import {RosterTable} from '../components/RosterTable';
import {ShiftDialog} from '../components/ShiftDialog';
import {eur, shiftTime, useNotify} from '../components/shared';
import {addDays, formatDay, formatDayLong, isISODate, startOfWeek, todayISO, weekDates} from '../lib/dates';
import type {Params, View} from '../lib/route';
import {useNarrow} from '../lib/useNarrow';
import {shiftIssues, summariseWeek, weekShifts} from '../lib/rules';
import {usePlanner} from '../state/store';
import {DEPT_LABEL, type Dept, type ISODate, type Shift, type Staff} from '../types';

type DeptFilter = Dept | 'all';

interface Props {
  params: URLSearchParams;
  navigate: (view: View, params?: Params) => void;
}

export function RosterView({params, navigate}: Props) {
  const {data, viewerId, isManager, dispatch} = usePlanner();
  const notify = useNotify();
  const thisWeek = startOfWeek(todayISO());
  const raw = params.get('week');
  const weekStart = raw && isISODate(raw) ? startOfWeek(raw) : thisWeek;
  const rawDept = params.get('dept');
  const dept: DeptFilter = rawDept === 'kitchen' || rawDept === 'service' || rawDept === 'bar' ? rawDept : 'all';
  const days = weekDates(weekStart);
  const narrow = useNarrow();
  const published = data.publishedWeeks.includes(weekStart);

  const [editing, setEditing] = useState<(Partial<Shift> & {date: ISODate}) | null>(null);
  const [offering, setOffering] = useState<Shift | null>(null);

  const go = (week: ISODate, d: DeptFilter = dept) => navigate('roster', {week: week === thisWeek ? undefined : week, dept: d === 'all' ? undefined : d});
  const summary = useMemo(() => summariseWeek(data, weekStart), [data, weekStart]);
  const issueLines = useMemo(
    () =>
      weekShifts(data.shifts, weekStart).flatMap((s) =>
        shiftIssues(s, data).map((issue) => ({
          key: `${s.id}-${issue.kind}-${issue.message}`,
          severity: issue.severity,
          text: `${data.staff.find((p) => p.id === s.staffId)?.name ?? 'Someone'} · ${formatDayLong(s.date)} ${shiftTime(s)} · ${issue.message}`,
        })),
      ),
    [data, weekStart],
  );

  function openShift(shift: Shift) {
    if (isManager) setEditing(shift);
    else setOffering(shift);
  }
  function add(date: ISODate, staff: Staff | null) {
    setEditing({date, staffId: staff?.id ?? null, dept: staff?.dept, position: staff?.position});
  }
  function copyLastWeek() {
    dispatch({type: 'week/copy', from: addDays(weekStart, -7), to: weekStart});
    notify.ok('Copied last week’s roster');
  }
  function togglePublish() {
    dispatch({type: 'week/publish', weekStart, published: !published});
    notify.ok(published ? 'Roster moved back to draft' : 'Roster published. Your team can see it now.');
  }

  const budgetPct = Math.round((summary.cost / data.settings.weeklyBudget) * 100);

  return (
    <VStack gap={4} padding={4}>
      <HStack hAlign="between" align="end" wrap="wrap" gap={3}>
        <VStack gap={1}>
          <Heading level={1}>Roster</Heading>
          <HStack gap={2} align="center">
            <Text type="large">
              {formatDay(days[0])} to {formatDay(days[6])} {days[6].slice(0, 4)}
            </Text>
            <StatusDot variant={published ? 'success' : 'neutral'} label={published ? 'Published' : 'Draft'} />
            <Text type="supporting">{published ? 'Published' : 'Draft'}</Text>
          </HStack>
        </VStack>
        <HStack gap={2} wrap="wrap" align="center">
          <IconButton label="Previous week" icon={<Icon icon={ChevronLeftIcon} />} onClick={() => go(addDays(weekStart, -7))} />
          <Button label="This week" onClick={() => go(thisWeek)} isDisabled={weekStart === thisWeek} />
          <IconButton label="Next week" icon={<Icon icon={ChevronRightIcon} />} onClick={() => go(addDays(weekStart, 7))} />
          {isManager && (
            <>
              <Button label="Add shift" onClick={() => setEditing({date: weekStart === thisWeek ? todayISO() : weekStart})} />
              <Button
                label={published ? 'Unpublish' : 'Publish week'}
                variant={published ? 'secondary' : 'primary'}
                onClick={togglePublish}
                isDisabled={!published && summary.conflicts > 0}
                tooltip={!published && summary.conflicts > 0 ? `Fix ${summary.conflicts} conflict${summary.conflicts === 1 ? '' : 's'} before publishing` : undefined}
              />
              <DropdownMenu
                button={{label: 'More', variant: 'ghost'}}
                items={[
                  {label: 'Copy last week’s roster here', onClick: copyLastWeek},
                  {label: 'Clear this week', variant: 'destructive', onClick: () => dispatch({type: 'week/clear', weekStart})},
                ]}
              />
            </>
          )}
        </HStack>
      </HStack>

      <HStack hAlign="between" align="center" wrap="wrap" gap={3}>
        <SegmentedControl label="Department" value={dept} onChange={(v) => go(weekStart, v as DeptFilter)}>
          <SegmentedControlItem value="all" label="Everyone" />
          {(Object.keys(DEPT_LABEL) as Dept[]).map((d) => (
            <SegmentedControlItem key={d} value={d} label={DEPT_LABEL[d]} />
          ))}
        </SegmentedControl>
        <HStack gap={6} wrap="wrap" align="end">
          <Stat label="Paid hours" value={`${summary.hours.toFixed(0)}h`} />
          <VStack gap={1} width={220}>
            <HStack hAlign="between">
              <Text type="supporting">Labour cost</Text>
              <Text weight="semibold" hasTabularNumbers>
                {eur.format(summary.cost)} <Text type="supporting">of {eur.format(data.settings.weeklyBudget)}</Text>
              </Text>
            </HStack>
            <ProgressBar label="Labour cost against weekly budget" isLabelHidden value={Math.min(budgetPct, 100)} variant={budgetPct > 100 ? 'error' : budgetPct > 90 ? 'warning' : 'accent'} />
          </VStack>
          <Stat label="Open shifts" value={String(summary.openShifts)} />
          <Stat label="Coverage gaps" value={String(summary.gaps)} />
        </HStack>
      </HStack>

      {!isManager && !published && <Banner status="info" title="This week is still a draft" description="Shifts can change until your manager publishes the roster." collapsible={false} />}
      {isManager && issueLines.length > 0 && (
        <Banner
          status={summary.conflicts > 0 ? 'error' : 'warning'}
          title={`${summary.conflicts} ${summary.conflicts === 1 ? 'conflict' : 'conflicts'} and ${summary.warnings} ${summary.warnings === 1 ? 'warning' : 'warnings'} this week`}
          description={summary.conflicts > 0 ? 'Resolve conflicts before you publish.' : 'Review before you publish.'}>
          <VStack gap={1}>
            {issueLines.map((l) => (
              <Text key={l.key}>{l.text}</Text>
            ))}
          </VStack>
        </Banner>
      )}

      {narrow ? (
        <RosterAgenda data={data} days={days} dept={dept} isManager={isManager} viewerId={viewerId} onAdd={add} onOpenShift={openShift} />
      ) : (
        <RosterTable data={data} days={days} weekStart={weekStart} dept={dept} isManager={isManager} viewerId={viewerId} onAdd={add} onOpenShift={openShift} />
      )}

      {editing && <ShiftDialog initial={editing} onClose={() => setEditing(null)} />}
      {offering && (
        <Dialog isOpen onOpenChange={(o) => !o && setOffering(null)} width={440}>
          <Layout
            header={<DialogHeader title="Your shift" subtitle={`${formatDayLong(offering.date)} · ${shiftTime(offering)}`} onOpenChange={() => setOffering(null)} />}
            content={
              <LayoutContent>
                <Text>
                  {offering.offered
                    ? 'This shift is on the open board. You stay on it until a colleague takes it.'
                    : 'Can’t make it? Offer this shift to the open board and a colleague can pick it up. You stay on it until someone does.'}
                </Text>
              </LayoutContent>
            }
            footer={
              <LayoutFooter>
                <HStack gap={2} hAlign="end">
                  <Button label="Close" onClick={() => setOffering(null)} />
                  <Button
                    label={offering.offered ? 'Take it back' : 'Offer to open board'}
                    variant="primary"
                    onClick={() => {
                      dispatch({type: 'shift/save', shift: {...offering, offered: !offering.offered}});
                      notify.ok(offering.offered ? 'Shift taken off the open board' : 'Shift offered to the open board');
                      setOffering(null);
                    }}
                  />
                </HStack>
              </LayoutFooter>
            }
          />
        </Dialog>
      )}
    </VStack>
  );
}

function Stat({label, value}: {label: string; value: string}) {
  return (
    <VStack>
      <Text type="supporting">{label}</Text>
      <Text type="large" weight="semibold" hasTabularNumbers>
        {value}
      </Text>
    </VStack>
  );
}
