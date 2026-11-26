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
import {useI18n} from '../i18n/I18nProvider';
import {todayISO} from '../lib/dates';
import {candidatesFor, paidMinutes, shiftIssues, upcomingOnBoard} from '../lib/rules';
import {usePlanner} from '../state/store';
import {type Shift} from '../types';

interface Row extends Record<string, unknown> {
  id: string;
  shift: Shift;
}

export function OpenShiftsView() {
  const {data, viewer, isManager, dispatch} = usePlanner();
  const {t, tn, fmt, hours, data: text, dept: deptName, issue: describe} = useI18n();
  const notify = useNotify();
  const [editing, setEditing] = useState<Shift | {date: string} | null>(null);
  const today = todayISO();

  const rows: Row[] = upcomingOnBoard(data.shifts, today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start))
    .map((shift) => ({id: shift.id, shift}));

  function take(shift: Shift) {
    if (!viewer) return;
    dispatch({type: 'shift/assign', id: shift.id, staffId: viewer.id});
    notify.ok(t('open.takeToast', {day: fmt.dayLong(shift.date), time: shiftTime(shift)}));
  }

  return (
    <VStack gap={4} padding={4}>
      <HStack hAlign="between" align="end" wrap="wrap" gap={3}>
        <VStack gap={1}>
          <Heading level={1}>{t('open.title')}</Heading>
          <Text type="large">{rows.length === 0 ? t('open.covered') : tn('open.needs', rows.length)}</Text>
        </VStack>
        {isManager && <Button label={t('open.add')} variant="primary" onClick={() => setEditing({date: today})} />}
      </HStack>

      {rows.length === 0 ? (
        <EmptyState title={t('open.emptyTitle')} description={t('open.emptyDesc')} />
      ) : (
        <Table<Row>
          data={rows}
          idKey="id"
          dividers="rows"
          columns={[
            {
              key: 'when',
              header: t('open.when'),
              width: proportional(1, {minWidth: 150}),
              renderCell: ({shift}) => (
                <VStack>
                  <Text weight="semibold">{fmt.dayLong(shift.date)}</Text>
                  <Text type="supporting" hasTabularNumbers>
                    {t('open.paid', {time: shiftTime(shift), hours: hours(paidMinutes(shift))})}
                  </Text>
                </VStack>
              ),
            },
            {
              key: 'role',
              header: t('open.role'),
              width: proportional(1, {minWidth: 150}),
              renderCell: ({shift}) => (
                <HStack gap={2} align="center">
                  <Token size="sm" color={DEPT_COLOR[shift.dept]} label={deptName(shift.dept)} />
                  <Text>{text(shift.position)}</Text>
                </HStack>
              ),
            },
            {
              key: 'why',
              header: t('open.background'),
              width: proportional(2, {minWidth: 180}),
              renderCell: ({shift}) => {
                const offeredBy = shift.offered ? data.staff.find((s) => s.id === shift.staffId)?.name : undefined;
                return <Text type="supporting">{offeredBy ? t('open.offeredBy', {name: offeredBy}) : shift.note ? text(shift.note) : t('open.unfilled')}</Text>;
              },
            },
            {
              key: 'eligible',
              header: t('open.couldTake'),
              width: pixel(120),
              renderCell: ({shift}) => <Text hasTabularNumbers>{(() => {
                const n = candidatesFor(shift, data).filter((c) => !c.blocked && c.staff.dept === shift.dept).length;
                return `${n} ${tn('common.person', n)}`;
              })()}</Text>,
            },
            {
              key: 'actions',
              header: t('common.action'),
              width: pixel(isManager ? 220 : 140),
              align: 'end',
              renderCell: ({shift}) => {
                if (!isManager) {
                  if (!viewer) return null;
                  const mine = shift.staffId === viewer.id;
                  const clash = shiftIssues({...shift, staffId: viewer.id, offered: false}, {...data, shifts: data.shifts.filter((s) => s.id !== shift.id)}).find((i) => i.severity === 'error');
                  return mine ? (
                    <Text type="supporting">{t('open.yours')}</Text>
                  ) : (
                    <Button label={t('open.take')} variant="primary" size="sm" onClick={() => take(shift)} isDisabled={Boolean(clash)} tooltip={clash ? describe(clash) : undefined} />
                  );
                }
                return (
                  <HStack gap={2} hAlign="end">
                    <DropdownMenu
                      button={{label: t('open.assign'), size: 'sm'}}
                      menuMaxHeight={320}
                      items={candidatesFor(shift, data).map((c) => ({
                        label: c.staff.name,
                        description: c.issues[0] ? describe(c.issues[0]) : text(c.staff.position),
                        isDisabled: c.blocked,
                        onClick: () => {
                          dispatch({type: 'shift/assign', id: shift.id, staffId: c.staff.id});
                          notify.ok(t('open.assignToast', {name: c.staff.name, day: fmt.dayLong(shift.date)}));
                        },
                      }))}
                    />
                    <Button label={t('common.edit')} size="sm" variant="ghost" onClick={() => setEditing(shift)} />
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
