import {useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack} from '@astryxdesign/core/HStack';
import {Table, pixel, proportional} from '@astryxdesign/core/Table';
import {Text} from '@astryxdesign/core/Text';
import {Token} from '@astryxdesign/core/Token';
import {VStack} from '@astryxdesign/core/VStack';
import {DEPT_COLOR, PersonCell} from '../components/shared';
import {useI18n} from '../i18n/I18nProvider';
import {StaffDialog} from '../components/StaffDialog';
import {startOfWeek, todayISO, addDays} from '../lib/dates';
import {leaveDays, staffWeekMinutes} from '../lib/rules';
import {usePlanner} from '../state/store';
import {type Staff} from '../types';

interface Row extends Record<string, unknown> {
  id: string;
  staff: Staff;
}

export function TeamView() {
  const {data, isManager} = usePlanner();
  const {t, tn, fmt, hours, dept: deptName} = useI18n();
  const [editing, setEditing] = useState<Staff | 'new' | null>(null);
  const today = todayISO();
  const week = startOfWeek(today);
  const year = Number(today.slice(0, 4));
  const rows: Row[] = [...data.staff].sort((a, b) => a.dept.localeCompare(b.dept) || a.name.localeCompare(b.name)).map((staff) => ({id: staff.id, staff}));

  return (
    <VStack gap={4} padding={4}>
      <HStack hAlign="between" align="end" wrap="wrap" gap={3}>
        <VStack gap={1}>
          <Heading level={1}>{t('team.title')}</Heading>
          <Text type="large">{t('team.count', {n: data.staff.length})}</Text>
        </VStack>
        {isManager && <Button label={t('team.add')} variant="primary" onClick={() => setEditing('new')} />}
      </HStack>

      <Table<Row>
        data={rows}
        idKey="id"
        columns={[
          {key: 'who', header: t('common.name'), width: proportional(1, {minWidth: 200}), renderCell: ({staff}) => <PersonCell staff={staff} />},
          {key: 'dept', header: t('common.department'), width: pixel(120), renderCell: ({staff}) => <Token size="sm" color={DEPT_COLOR[staff.dept]} label={deptName(staff.dept)} />},
          {key: 'role', header: t('team.role'), width: pixel(140), renderCell: ({staff}) => (staff.role === 'admin' ? <Token size="sm" color="teal" label={t('role.admin')} /> : <Text type="supporting">{t('role.employee')}</Text>)},
          {
            key: 'hours',
            header: t('team.thisWeek'),
            width: pixel(150),
            align: 'end',
            renderCell: ({staff}) => (
              <Text hasTabularNumbers>
                {hours(staffWeekMinutes(staff.id, data.shifts, week))} <Text type="supporting">{t('table.ofContract', {hours: hours(staff.contractHours * 60)})}</Text>
              </Text>
            ),
          },
          ...(isManager ? [{key: 'rate', header: t('team.rate'), width: pixel(120), align: 'end' as const, renderCell: ({staff}: Row) => <Text hasTabularNumbers>{fmt.eur2(staff.hourlyRate)}</Text>}] : []),
          {
            key: 'leave',
            header: t('team.holidayLeft'),
            width: pixel(120),
            align: 'end',
            renderCell: ({staff}) => {
              const left = staff.leaveAllowance - leaveDays(staff.id, data.timeOff, year, 'approved') - leaveDays(staff.id, data.timeOff, year, 'pending');
              return <Text hasTabularNumbers>{left} {tn('common.day', left)}</Text>;
            },
          },
          {
            key: 'unavailable',
            header: t('team.cannotWork'),
            width: proportional(1, {minWidth: 160}),
            renderCell: ({staff}) =>
              staff.unavailable.length === 0 ? (
                <Text type="supporting">{t('team.always')}</Text>
              ) : (
                <HStack gap={1} wrap="wrap">
                  {staff.unavailable.map((d) => (
                    <Token key={d} size="sm" label={fmt.weekdayShort(addDays('2024-01-01', d))} />
                  ))}
                </HStack>
              ),
          },
          ...(isManager ? [{key: 'edit', header: t('common.action'), width: pixel(90), align: 'end' as const, renderCell: ({staff}: Row) => <Button label={t('common.edit')} size="sm" variant="ghost" onClick={() => setEditing(staff)} />}] : []),
        ]}
      />
      {editing && <StaffDialog staff={editing === 'new' ? undefined : editing} onClose={() => setEditing(null)} />}
    </VStack>
  );
}
