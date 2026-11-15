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
import {daysInclusive, formatRange, todayISO} from '../lib/dates';
import {leaveDays, shiftsInRange} from '../lib/rules';
import {usePlanner} from '../state/store';
import {LEAVE_LABEL, type LeaveStatus, type Staff, type TimeOff} from '../types';

type Filter = LeaveStatus | 'all';
type Tab = 'requests' | 'balances';
const STATUS_DOT = {pending: 'warning', approved: 'success', denied: 'error'} as const;
const STATUS_LABEL = {pending: 'Pending', approved: 'Approved', denied: 'Declined'} as const;

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
          <Heading level={1}>Time off</Heading>
          <Text type="large">{isManager ? (pendingCount > 0 ? `${pendingCount} ${pendingCount === 1 ? 'request is' : 'requests are'} waiting for you` : 'No requests waiting') : 'Your requests and holiday balance'}</Text>
        </VStack>
        {(isManager || viewer) && <Button label={isManager ? 'Record time off' : 'Request time off'} variant="primary" onClick={() => setCreating(true)} />}
      </HStack>

      <HStack hAlign="between" wrap="wrap" gap={3}>
        <SegmentedControl label="Time off view" value={tab} onChange={(v) => setTab(v as Tab)}>
          <SegmentedControlItem value="requests" label="Requests" />
          <SegmentedControlItem value="balances" label="Holiday balances" />
        </SegmentedControl>
        {tab === 'requests' && (
          <SegmentedControl label="Status" value={filter} onChange={(v) => setFilter(v as Filter)}>
            <SegmentedControlItem value="pending" label="Pending" />
            <SegmentedControlItem value="approved" label="Approved" />
            <SegmentedControlItem value="denied" label="Declined" />
            <SegmentedControlItem value="all" label="All" />
          </SegmentedControl>
        )}
      </HStack>

      {tab === 'requests' &&
        (requestRows.length === 0 ? (
          <EmptyState title="Nothing here" description={filter === 'pending' ? 'All requests have been dealt with.' : 'No time off matches this filter.'} />
        ) : (
          <Table<RequestRow>
            data={requestRows}
            idKey="id"
            columns={[
              {key: 'who', header: 'Who', width: proportional(1, {minWidth: 170}), renderCell: ({staff}) => <PersonCell staff={staff} />},
              {key: 'type', header: 'Type', width: pixel(100), renderCell: ({leave}) => <Token size="sm" color={leave.type === 'sick' ? 'red' : leave.type === 'holiday' ? 'teal' : 'gray'} label={LEAVE_LABEL[leave.type]} />},
              {
                key: 'dates',
                header: 'Dates',
                width: proportional(1, {minWidth: 150}),
                renderCell: ({leave}) => {
                  const days = daysInclusive(leave.start, leave.end);
                  return (
                    <VStack>
                      <Text weight="semibold">{formatRange(leave.start, leave.end)}</Text>
                      <Text type="supporting">{days} {days === 1 ? 'day' : 'days'}</Text>
                    </VStack>
                  );
                },
              },
              {
                key: 'note',
                header: 'Note',
                width: proportional(2, {minWidth: 150}),
                renderCell: ({leave}) => (
                  <VStack>
                    <Text maxLines={2}>{leave.note || 'No note'}</Text>
                    {leave.decisionNote && <Text type="supporting" maxLines={2}>Manager: {leave.decisionNote}</Text>}
                  </VStack>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                width: pixel(120),
                renderCell: ({leave, staff}) => {
                  const clashes = leave.status === 'pending' ? shiftsInRange(staff.id, leave.start, leave.end, data.shifts).length : 0;
                  return (
                    <VStack gap={0.5}>
                      <HStack gap={1.5} align="center">
                        <StatusDot variant={STATUS_DOT[leave.status]} label={STATUS_LABEL[leave.status]} />
                        <Text>{STATUS_LABEL[leave.status]}</Text>
                      </HStack>
                      {clashes > 0 && <Text type="supporting">{clashes} rostered {clashes === 1 ? 'shift' : 'shifts'}</Text>}
                    </VStack>
                  );
                },
              },
              {
                key: 'actions',
                header: 'Action',
                width: pixel(180),
                align: 'end',
                renderCell: ({leave}) => {
                  if (leave.status !== 'pending') return isManager ? <Button label="Remove" size="sm" variant="ghost" onClick={() => dispatch({type: 'leave/delete', id: leave.id})} /> : null;
                  if (isManager) {
                    return (
                      <HStack gap={2} hAlign="end">
                        <Button label="Decline" size="sm" onClick={() => setDeciding({request: leave, decision: 'denied'})} />
                        <Button label="Approve" size="sm" variant="primary" onClick={() => setDeciding({request: leave, decision: 'approved'})} />
                      </HStack>
                    );
                  }
                  return (
                    <Button
                      label="Withdraw"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        dispatch({type: 'leave/delete', id: leave.id});
                        notify.ok('Request withdrawn');
                      }}
                    />
                  );
                },
              },
            ]}
          />
        ))}

      {tab === 'balances' && (
        <Table<BalanceRow>
          data={balanceRows}
          idKey="id"
          columns={[
            {key: 'who', header: 'Who', width: proportional(1, {minWidth: 190}), renderCell: ({staff}) => <PersonCell staff={staff} />},
            {key: 'allowance', header: 'Allowance', width: pixel(110), align: 'end', renderCell: ({staff}) => <Text hasTabularNumbers>{staff.leaveAllowance} days</Text>},
            {key: 'taken', header: 'Taken', width: pixel(100), align: 'end', renderCell: ({staff}) => <Text hasTabularNumbers>{leaveDays(staff.id, data.timeOff, year, 'approved')}</Text>},
            {key: 'requested', header: 'Requested', width: pixel(110), align: 'end', renderCell: ({staff}) => <Text hasTabularNumbers>{leaveDays(staff.id, data.timeOff, year, 'pending')}</Text>},
            {
              key: 'left',
              header: 'Left',
              width: proportional(1, {minWidth: 200}),
              renderCell: ({staff}) => {
                const taken = leaveDays(staff.id, data.timeOff, year, 'approved');
                const requested = leaveDays(staff.id, data.timeOff, year, 'pending');
                const left = staff.leaveAllowance - taken - requested;
                return (
                  <VStack gap={1}>
                    <Text weight="semibold" hasTabularNumbers>{left} days left</Text>
                    <ProgressBar label={`${staff.name} holiday used`} isLabelHidden value={taken + requested} max={Math.max(staff.leaveAllowance, 1)} variant={left < 0 ? 'error' : left <= 3 ? 'warning' : 'accent'} />
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
