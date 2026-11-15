import {useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack} from '@astryxdesign/core/HStack';
import {Table, pixel, proportional} from '@astryxdesign/core/Table';
import {Text} from '@astryxdesign/core/Text';
import {Token} from '@astryxdesign/core/Token';
import {VStack} from '@astryxdesign/core/VStack';
import {DEPT_COLOR, PersonCell, eur2} from '../components/shared';
import {StaffDialog} from '../components/StaffDialog';
import {formatHours, startOfWeek, todayISO, weekdayShort, addDays} from '../lib/dates';
import {leaveDays, staffWeekMinutes} from '../lib/rules';
import {usePlanner} from '../state/store';
import {DEPT_LABEL, type Staff} from '../types';

interface Row extends Record<string, unknown> {
  id: string;
  staff: Staff;
}

export function TeamView() {
  const {data, isManager} = usePlanner();
  const [editing, setEditing] = useState<Staff | 'new' | null>(null);
  const today = todayISO();
  const week = startOfWeek(today);
  const year = Number(today.slice(0, 4));
  const rows: Row[] = [...data.staff].sort((a, b) => a.dept.localeCompare(b.dept) || a.name.localeCompare(b.name)).map((staff) => ({id: staff.id, staff}));

  return (
    <VStack gap={4} padding={4}>
      <HStack hAlign="between" align="end" wrap="wrap" gap={3}>
        <VStack gap={1}>
          <Heading level={1}>Team</Heading>
          <Text type="large">{data.staff.length} people across kitchen, service and bar</Text>
        </VStack>
        {isManager && <Button label="Add team member" variant="primary" onClick={() => setEditing('new')} />}
      </HStack>

      <Table<Row>
        data={rows}
        idKey="id"
        columns={[
          {key: 'who', header: 'Name', width: proportional(1, {minWidth: 200}), renderCell: ({staff}) => <PersonCell staff={staff} />},
          {key: 'dept', header: 'Department', width: pixel(120), renderCell: ({staff}) => <Token size="sm" color={DEPT_COLOR[staff.dept]} label={DEPT_LABEL[staff.dept]} />},
          {
            key: 'hours',
            header: 'This week',
            width: pixel(150),
            align: 'end',
            renderCell: ({staff}) => (
              <Text hasTabularNumbers>
                {formatHours(staffWeekMinutes(staff.id, data.shifts, week))} <Text type="supporting">of {staff.contractHours}h</Text>
              </Text>
            ),
          },
          ...(isManager ? [{key: 'rate', header: 'Hourly cost', width: pixel(120), align: 'end' as const, renderCell: ({staff}: Row) => <Text hasTabularNumbers>{eur2.format(staff.hourlyRate)}</Text>}] : []),
          {
            key: 'leave',
            header: 'Holiday left',
            width: pixel(120),
            align: 'end',
            renderCell: ({staff}) => <Text hasTabularNumbers>{staff.leaveAllowance - leaveDays(staff.id, data.timeOff, year, 'approved') - leaveDays(staff.id, data.timeOff, year, 'pending')} days</Text>,
          },
          {
            key: 'unavailable',
            header: 'Cannot work',
            width: proportional(1, {minWidth: 160}),
            renderCell: ({staff}) =>
              staff.unavailable.length === 0 ? (
                <Text type="supporting">Always available</Text>
              ) : (
                <HStack gap={1} wrap="wrap">
                  {staff.unavailable.map((d) => (
                    <Token key={d} size="sm" label={weekdayShort(addDays('2024-01-01', d))} />
                  ))}
                </HStack>
              ),
          },
          ...(isManager ? [{key: 'edit', header: 'Action', width: pixel(90), align: 'end' as const, renderCell: ({staff}: Row) => <Button label="Edit" size="sm" variant="ghost" onClick={() => setEditing(staff)} />}] : []),
        ]}
      />
      {editing && <StaffDialog staff={editing === 'new' ? undefined : editing} onClose={() => setEditing(null)} />}
    </VStack>
  );
}
