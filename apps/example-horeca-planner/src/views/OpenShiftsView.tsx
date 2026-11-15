import {useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {DropdownMenu} from '@astryxdesign/core/DropdownMenu';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack} from '@astryxdesign/core/HStack';
import {Table, pixel, proportional} from '@astryxdesign/core/Table';
import {Text} from '@astryxdesign/core/Text';
import {Token} from '@astryxdesign/core/Token';
import {VStack} from '@astryxdesign/core/VStack';
import {ShiftDialog} from '../components/ShiftDialog';
import {DEPT_COLOR, shiftTime, useNotify} from '../components/shared';
import {formatDayLong, formatHours, todayISO} from '../lib/dates';
import {candidatesFor, paidMinutes, shiftIssues, upcomingOnBoard} from '../lib/rules';
import {usePlanner} from '../state/store';
import {DEPT_LABEL, type Shift} from '../types';

interface Row extends Record<string, unknown> {
  id: string;
  shift: Shift;
}

export function OpenShiftsView() {
  const {data, viewer, isManager, dispatch} = usePlanner();
  const notify = useNotify();
  const [editing, setEditing] = useState<Shift | {date: string} | null>(null);
  const today = todayISO();

  const rows: Row[] = upcomingOnBoard(data.shifts, today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start))
    .map((shift) => ({id: shift.id, shift}));

  function take(shift: Shift) {
    if (!viewer) return;
    dispatch({type: 'shift/assign', id: shift.id, staffId: viewer.id});
    notify.ok(`You’re on ${formatDayLong(shift.date)}, ${shiftTime(shift)}`);
  }

  return (
    <VStack gap={4} padding={4}>
      <HStack hAlign="between" align="end" wrap="wrap" gap={3}>
        <VStack gap={1}>
          <Heading level={1}>Open shifts</Heading>
          <Text type="large">{rows.length === 0 ? 'Everything is covered' : `${rows.length} ${rows.length === 1 ? 'shift needs' : 'shifts need'} someone`}</Text>
        </VStack>
        {isManager && <Button label="Add open shift" variant="primary" onClick={() => setEditing({date: today})} />}
      </HStack>

      {rows.length === 0 ? (
        <EmptyState title="No open shifts" description="Released and unfilled shifts will show up here for the team to pick up." />
      ) : (
        <Table<Row>
          data={rows}
          idKey="id"
          dividers="rows"
          columns={[
            {
              key: 'when',
              header: 'When',
              width: proportional(1, {minWidth: 150}),
              renderCell: ({shift}) => (
                <VStack>
                  <Text weight="semibold">{formatDayLong(shift.date)}</Text>
                  <Text type="supporting" hasTabularNumbers>
                    {shiftTime(shift)} · {formatHours(paidMinutes(shift))} paid
                  </Text>
                </VStack>
              ),
            },
            {
              key: 'role',
              header: 'Role',
              width: proportional(1, {minWidth: 150}),
              renderCell: ({shift}) => (
                <HStack gap={2} align="center">
                  <Token size="sm" color={DEPT_COLOR[shift.dept]} label={DEPT_LABEL[shift.dept]} />
                  <Text>{shift.position}</Text>
                </HStack>
              ),
            },
            {
              key: 'why',
              header: 'Background',
              width: proportional(2, {minWidth: 180}),
              renderCell: ({shift}) => {
                const offeredBy = shift.offered ? data.staff.find((s) => s.id === shift.staffId)?.name : undefined;
                return <Text type="supporting">{offeredBy ? `Offered by ${offeredBy}` : (shift.note ?? 'Unfilled')}</Text>;
              },
            },
            {
              key: 'eligible',
              header: 'Could take it',
              width: pixel(120),
              renderCell: ({shift}) => <Text hasTabularNumbers>{candidatesFor(shift, data).filter((c) => !c.blocked && c.staff.dept === shift.dept).length} people</Text>,
            },
            {
              key: 'actions',
              header: 'Action',
              width: pixel(isManager ? 220 : 140),
              align: 'end',
              renderCell: ({shift}) => {
                if (!isManager) {
                  if (!viewer) return null;
                  const mine = shift.staffId === viewer.id;
                  const clash = shiftIssues({...shift, staffId: viewer.id, offered: false}, {...data, shifts: data.shifts.filter((s) => s.id !== shift.id)}).find((i) => i.severity === 'error');
                  return mine ? (
                    <Text type="supporting">Your shift</Text>
                  ) : (
                    <Button label="Take shift" variant="primary" size="sm" onClick={() => take(shift)} isDisabled={Boolean(clash)} tooltip={clash?.message} />
                  );
                }
                return (
                  <HStack gap={2} hAlign="end">
                    <DropdownMenu
                      button={{label: 'Assign', size: 'sm'}}
                      menuMaxHeight={320}
                      items={candidatesFor(shift, data).map((c) => ({
                        label: c.staff.name,
                        description: c.issues[0]?.message ?? c.staff.position,
                        isDisabled: c.blocked,
                        onClick: () => {
                          dispatch({type: 'shift/assign', id: shift.id, staffId: c.staff.id});
                          notify.ok(`${c.staff.name} assigned to ${formatDayLong(shift.date)}`);
                        },
                      }))}
                    />
                    <Button label="Edit" size="sm" variant="ghost" onClick={() => setEditing(shift)} />
                  </HStack>
                );
              },
            },
          ]}
        />
      )}
      {editing && <ShiftDialog initial={'id' in editing ? editing : {...editing, staffId: null}} onClose={() => setEditing(null)} />}
    </VStack>
  );
}
