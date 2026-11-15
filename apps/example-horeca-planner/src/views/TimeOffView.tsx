import {useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack} from '@astryxdesign/core/HStack';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {Table, pixel, proportional} from '@astryxdesign/core/Table';
import {Text} from '@astryxdesign/core/Text';
import {Token} from '@astryxdesign/core/Token';
import {VStack} from '@astryxdesign/core/VStack';
import {DecisionDialog} from '../components/DecisionDialog';
import {PersonCell, useNotify} from '../components/shared';
import {TimeOffDialog} from '../components/TimeOffDialog';
import {useI18n} from '../i18n/I18nProvider';
import {daysInclusive, todayISO} from '../lib/dates';
import {leaveDays, shiftsInRange} from '../lib/rules';
import {usePlanner} from '../state/store';
import {type LeaveStatus, type Staff, type TimeOff} from '../types';

type Filter = LeaveStatus | 'all';
type Tab = 'requests' | 'balances';
const STATUS_DOT = {pending: 'warning', approved: 'success', denied: 'error'} as const;

interface RequestRow extends Record<string, unknown> {
  id: string;
  leave: TimeOff;
  staff: Staff;
}
interface BalanceRow extends Record<string, unknown> {
  id: string;
  staff: Staff;
}

export function TimeOffView() {
  const {data, viewer, isManager, dispatch} = usePlanner();
  const {t, tn, fmt, data: text, leaveType, status: statusName} = useI18n();
  const notify = useNotify();
  const [tab, setTab] = useState<Tab>('requests');
  const [filter, setFilter] = useState<Filter>(isManager ? 'pending' : 'all');
  const [creating, setCreating] = useState(false);
  const [deciding, setDeciding] = useState<{request: TimeOff; decision: 'approved' | 'denied'} | null>(null);
  const year = Number(todayISO().slice(0, 4));

  const visibleLeave = data.timeOff.filter((t) => isManager || t.staffId === viewer?.id);
  const pendingCount = data.timeOff.filter((t) => t.status === 'pending').length;
  const requestRows: RequestRow[] = visibleLeave
    .filter((t) => filter === 'all' || t.status === filter)
    .sort((a, b) => (a.status === 'pending' ? -1 : 0) - (b.status === 'pending' ? -1 : 0) || a.start.localeCompare(b.start))
    .flatMap((leave) => {
      const staff = data.staff.find((s) => s.id === leave.staffId);
      return staff ? [{id: leave.id, leave, staff}] : [];
    });
  const balanceRows: BalanceRow[] = data.staff.filter((s) => isManager || s.id === viewer?.id).map((staff) => ({id: staff.id, staff}));

  return (
    <VStack gap={4} padding={4}>
      <HStack hAlign="between" align="end" wrap="wrap" gap={3}>
        <VStack gap={1}>
          <Heading level={1}>{t('off.title')}</Heading>
          <Text type="large">{isManager ? (pendingCount > 0 ? tn('off.waiting', pendingCount) : t('off.noneWaiting')) : t('off.yourRequests')}</Text>
        </VStack>
        {(isManager || viewer) && <Button label={isManager ? t('leave.recordTitle') : t('leave.requestTitle')} variant="primary" onClick={() => setCreating(true)} />}
      </HStack>

      <HStack hAlign="between" wrap="wrap" gap={3}>
        <SegmentedControl size="lg" label={t('off.tabLabel')} value={tab} onChange={(v) => setTab(v as Tab)}>
          <SegmentedControlItem value="requests" label={t('off.tabRequests')} />
          <SegmentedControlItem value="balances" label={t('off.tabBalances')} />
        </SegmentedControl>
        {tab === 'requests' && (
          <SegmentedControl size="lg" label={t('common.status')} value={filter} onChange={(v) => setFilter(v as Filter)}>
            <SegmentedControlItem value="pending" label={statusName('pending')} />
            <SegmentedControlItem value="approved" label={statusName('approved')} />
            <SegmentedControlItem value="denied" label={statusName('denied')} />
            <SegmentedControlItem value="all" label={t('common.all')} />
          </SegmentedControl>
        )}
      </HStack>

      {!isManager && !viewer && <EmptyState title={t('off.guestTitle')} description={t('off.guestDesc')} />}

      {(isManager || viewer) && tab === 'requests' &&
        (requestRows.length === 0 ? (
          <EmptyState title={t('off.emptyTitle')} description={filter === 'pending' ? t('off.emptyPending') : t('off.emptyOther')} />
        ) : (
          <Table<RequestRow>
            data={requestRows}
            idKey="id"
            columns={[
              {key: 'who', header: t('common.who'), width: proportional(1, {minWidth: 170}), renderCell: ({staff}) => <PersonCell staff={staff} />},
              {key: 'type', header: t('common.type'), width: pixel(100), renderCell: ({leave}) => <Token size="sm" color={leave.type === 'sick' ? 'red' : leave.type === 'holiday' ? 'teal' : 'gray'} label={leaveType(leave.type)} />},
              {
                key: 'dates',
                header: t('off.dates'),
                width: proportional(1, {minWidth: 150}),
                renderCell: ({leave}) => {
                  const days = daysInclusive(leave.start, leave.end);
                  return (
                    <VStack>
                      <Text weight="semibold">{fmt.range(leave.start, leave.end, t('common.to'))}</Text>
                      <Text type="supporting">{days} {tn('common.day', days)}</Text>
                    </VStack>
                  );
                },
              },
              {
                key: 'note',
                header: t('common.note'),
                width: proportional(2, {minWidth: 150}),
                renderCell: ({leave}) => (
                  <VStack>
                    <Text maxLines={2}>{leave.note ? text(leave.note) : t('common.noNote')}</Text>
                    {leave.decisionNote && <Text type="supporting" maxLines={2}>{t('off.managerNote', {note: text(leave.decisionNote)})}</Text>}
                  </VStack>
                ),
              },
              {
                key: 'status',
                header: t('common.status'),
                width: pixel(120),
                renderCell: ({leave, staff}) => {
                  const clashes = leave.status === 'pending' ? shiftsInRange(staff.id, leave.start, leave.end, data.shifts).length : 0;
                  return (
                    <VStack gap={0.5}>
                      <HStack gap={1.5} align="center">
                        <StatusDot variant={STATUS_DOT[leave.status]} label={statusName(leave.status)} />
                        <Text>{statusName(leave.status)}</Text>
                      </HStack>
                      {clashes > 0 && <Text type="supporting">{tn('off.rostered', clashes)}</Text>}
                    </VStack>
                  );
                },
              },
              {
                key: 'actions',
                header: t('common.action'),
                width: pixel(180),
                align: 'end',
                renderCell: ({leave}) => {
                  if (leave.status !== 'pending') return isManager ? <Button label={t('common.remove')} size="sm" variant="ghost" onClick={() => dispatch({type: 'leave/delete', id: leave.id})} /> : null;
                  if (isManager) {
                    return (
                      <HStack gap={2} hAlign="end">
                        <Button label={t('off.decline')} size="sm" onClick={() => setDeciding({request: leave, decision: 'denied'})} />
                        <Button label={t('off.approve')} size="sm" variant="primary" onClick={() => setDeciding({request: leave, decision: 'approved'})} />
                      </HStack>
                    );
                  }
                  return (
                    <Button
                      label={t('off.withdraw')}
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        dispatch({type: 'leave/delete', id: leave.id});
                        notify.ok(t('off.withdrawn'));
                      }}
                    />
                  );
                },
              },
            ]}
          />
        ))}

      {(isManager || viewer) && tab === 'balances' && (
        <Table<BalanceRow>
          data={balanceRows}
          idKey="id"
          columns={[
            {key: 'who', header: t('common.who'), width: proportional(1, {minWidth: 190}), renderCell: ({staff}) => <PersonCell staff={staff} />},
            {key: 'allowance', header: t('off.allowance'), width: pixel(110), align: 'end', renderCell: ({staff}) => <Text hasTabularNumbers>{staff.leaveAllowance} {tn('common.day', staff.leaveAllowance)}</Text>},
            {key: 'taken', header: t('off.taken'), width: pixel(100), align: 'end', renderCell: ({staff}) => <Text hasTabularNumbers>{leaveDays(staff.id, data.timeOff, year, 'approved')}</Text>},
            {key: 'requested', header: t('off.requested'), width: pixel(110), align: 'end', renderCell: ({staff}) => <Text hasTabularNumbers>{leaveDays(staff.id, data.timeOff, year, 'pending')}</Text>},
            {
              key: 'left',
              header: t('off.left'),
              width: proportional(1, {minWidth: 200}),
              renderCell: ({staff}) => {
                const taken = leaveDays(staff.id, data.timeOff, year, 'approved');
                const requested = leaveDays(staff.id, data.timeOff, year, 'pending');
                const left = staff.leaveAllowance - taken - requested;
                return (
                  <VStack gap={1}>
                    <Text weight="semibold" hasTabularNumbers>{tn('off.daysLeft', left)}</Text>
                    <ProgressBar label={t('off.usedBy', {name: staff.name})} isLabelHidden value={taken + requested} max={Math.max(staff.leaveAllowance, 1)} variant={left < 0 ? 'error' : left <= 3 ? 'warning' : 'accent'} />
                  </VStack>
                );
              },
            },
          ]}
        />
      )}

      {creating && <TimeOffDialog staffId={viewer?.id} onClose={() => setCreating(false)} />}
      {deciding && <DecisionDialog request={deciding.request} decision={deciding.decision} onClose={() => setDeciding(null)} />}
    </VStack>
  );
}
