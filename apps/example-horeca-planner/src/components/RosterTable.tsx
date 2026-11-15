import {useMemo} from 'react';
import {Icon} from '@astryxdesign/core/Icon';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Table, pixel, proportional} from '@astryxdesign/core/Table';
import {Text} from '@astryxdesign/core/Text';
import {Token} from '@astryxdesign/core/Token';
import {VStack} from '@astryxdesign/core/VStack';
import {PlusIcon} from '@heroicons/react/16/solid';
import {formatDayLong, formatHours, weekdayShort} from '../lib/dates';
import {coverageFor, leaveCovering, paidMinutes, requiredFor, staffWeekMinutes} from '../lib/rules';
import {DEPT_LABEL, type Dept, type ISODate, type PlannerData, type Shift, type Staff} from '../types';
import {PersonCell, eur} from './shared';
import {ShiftToken} from './ShiftToken';

interface RosterRow extends Record<string, unknown> {
  id: string;
  kind: 'coverage' | 'open' | 'staff';
  staff?: Staff;
}

interface Props {
  data: PlannerData;
  days: ISODate[];
  weekStart: ISODate;
  dept: Dept | 'all';
  isManager: boolean;
  viewerId: string;
  onAdd: (date: ISODate, staff: Staff | null) => void;
  onOpenShift: (shift: Shift) => void;
}

const DEPT_ORDER: Dept[] = ['kitchen', 'service', 'bar'];

export function RosterTable({data, days, weekStart, dept, isManager, viewerId, onAdd, onOpenShift}: Props) {
  const visibleDepts = dept === 'all' ? DEPT_ORDER : [dept];

  const rows = useMemo<RosterRow[]>(() => {
    const people = data.staff
      .filter((s) => dept === 'all' || s.dept === dept)
      .sort((a, b) => DEPT_ORDER.indexOf(a.dept) - DEPT_ORDER.indexOf(b.dept) || a.name.localeCompare(b.name));
    return [
      {id: 'coverage', kind: 'coverage'},
      {id: 'open', kind: 'open'},
      ...people.map<RosterRow>((s) => ({id: s.id, kind: 'staff', staff: s})),
    ];
  }, [data.staff, dept]);

  const shiftsOn = (date: ISODate, staffId: string | null) =>
    data.shifts
      .filter((s) => s.date === date && s.staffId === staffId && (dept === 'all' || s.dept === dept))
      .sort((a, b) => a.start.localeCompare(b.start));

  const dayColumns = days.map((date, i) => ({
    key: `day${i}`,
    header: `${weekdayShort(date)} ${Number(date.slice(8))}`,
    width: proportional(1, {minWidth: 108}),
    renderCell: (row: RosterRow) => {
      if (row.kind === 'coverage') {
        if (data.settings.closedDays.includes(i)) return <Text type="supporting">Closed</Text>;
        return (
          <VStack gap={0.5} hAlign="start">
            {visibleDepts.map((d) => {
              const have = coverageFor(d, date, data);
              const need = requiredFor(d, date, data.settings);
              const short = have < need;
              return (
                <Token
                  key={d}
                  size="sm"
                  color={short ? 'red' : 'green'}
                  icon={short ? <Icon icon="warning" /> : <Icon icon="check" />}
                  label={`${DEPT_LABEL[d]} ${have}/${need}`}
                />
              );
            })}
          </VStack>
        );
      }
      if (row.kind === 'open') {
        const open = shiftsOn(date, null);
        return (
          <VStack gap={1} hAlign="start">
            {open.map((s) => (
              <ShiftToken key={s.id} shift={s} data={data} onOpen={onOpenShift} canOpen={isManager} />
            ))}
            {isManager && <IconButton label={`Add open shift on ${formatDayLong(date)}`} icon={<Icon icon={PlusIcon} />} size="sm" variant="ghost" onClick={() => onAdd(date, null)} />}
          </VStack>
        );
      }
      const staff = row.staff as Staff;
      const approved = leaveCovering(staff.id, date, data.timeOff, 'approved');
      const pending = approved ? undefined : leaveCovering(staff.id, date, data.timeOff, 'pending');
      return (
        <VStack gap={1} hAlign="start">
          {approved && <Token size="sm" color="gray" label={approved.type === 'sick' ? 'Sick' : 'Off'} description={`Approved ${approved.type} leave`} />}
          {pending && <Token size="sm" color="yellow" label="Requested off" description="Leave request waiting for a decision" />}
          {shiftsOn(date, staff.id).map((s) => (
            <ShiftToken key={s.id} shift={s} data={data} onOpen={onOpenShift} canOpen={isManager || staff.id === viewerId} />
          ))}
          {isManager && <IconButton label={`Add shift for ${staff.name} on ${formatDayLong(date)}`} icon={<Icon icon={PlusIcon} />} size="sm" variant="ghost" onClick={() => onAdd(date, staff)} />}
        </VStack>
      );
    },
  }));

  const weekRows = data.shifts.filter((s) => days.includes(s.date));

  return (
    <Table<RosterRow>
      data={rows}
      idKey="id"
      density="balanced"
      dividers="grid"
      verticalAlign="top"
      columns={[
        {
          key: 'who',
          header: 'Team',
          width: proportional(1, {minWidth: 150}),
          renderCell: (row) => {
            if (row.kind === 'coverage') return <Text weight="semibold">Coverage</Text>;
            if (row.kind === 'open') return <PersonCellOpen />;
            return <PersonCell staff={row.staff as Staff} />;
          },
        },
        ...dayColumns,
        {
          key: 'total',
          header: 'Week',
          width: pixel(92),
          align: 'end',
          renderCell: (row) => {
            if (row.kind === 'coverage') {
              const cost = data.shifts.filter((s) => days.includes(s.date) && s.staffId).reduce((sum, s) => sum + (paidMinutes(s) / 60) * (data.staff.find((p) => p.id === s.staffId)?.hourlyRate ?? 0), 0);
              return (
                <VStack hAlign="end">
                  <Text weight="semibold" hasTabularNumbers>{eur.format(cost)}</Text>
                  <Text type="supporting">labour</Text>
                </VStack>
              );
            }
            if (row.kind === 'open') {
              const mins = weekRows.filter((s) => !s.staffId).reduce((sum, s) => sum + paidMinutes(s), 0);
              return <Text type="supporting" hasTabularNumbers>{mins ? formatHours(mins) : 'None'}</Text>;
            }
            const staff = row.staff as Staff;
            const mins = staffWeekMinutes(staff.id, data.shifts, weekStart);
            const over = mins / 60 > data.settings.maxWeeklyHours;
            return (
              <VStack hAlign="end" gap={0.5}>
                <Text weight="semibold" hasTabularNumbers>{formatHours(mins)}</Text>
                <Text type="supporting" hasTabularNumbers>of {staff.contractHours}h</Text>
                {over && <Token size="sm" color="red" label="Over limit" />}
              </VStack>
            );
          },
        },
      ]}
    />
  );
}

function PersonCellOpen() {
  return (
    <VStack>
      <Text weight="semibold">Open shifts</Text>
      <Text type="supporting">Nobody assigned yet</Text>
    </VStack>
  );
}
