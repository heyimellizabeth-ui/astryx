import {useState} from 'react';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {DateInput} from '@astryxdesign/core/DateInput';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {HStack} from '@astryxdesign/core/HStack';
import {Layout, LayoutContent, LayoutFooter} from '@astryxdesign/core/Layout';
import {Selector} from '@astryxdesign/core/Selector';
import {Text} from '@astryxdesign/core/Text';
import {TextArea} from '@astryxdesign/core/TextArea';
import {VStack} from '@astryxdesign/core/VStack';
import {asDateValue} from '../lib/astryxDates';
import {daysInclusive, formatRange, isISODate, startOfWeek, todayISO} from '../lib/dates';
import {leaveDays, shiftsInRange} from '../lib/rules';
import {newId, usePlanner} from '../state/store';
import {LEAVE_LABEL, type LeaveType} from '../types';
import {useNotify} from './shared';

interface Props {
  /** Pre-select a person, for example the viewer. */
  staffId?: string;
  onClose: () => void;
}

export function TimeOffDialog({staffId: initialStaff, onClose}: Props) {
  const {data, isManager, viewerId, dispatch} = usePlanner();
  const notify = useNotify();
  const today = todayISO();

  const [staffId, setStaffId] = useState(initialStaff ?? (isManager ? data.staff[0]?.id : viewerId) ?? '');
  const [type, setType] = useState<LeaveType>('holiday');
  const [start, setStart] = useState(startOfWeek(today));
  const [end, setEnd] = useState(startOfWeek(today));
  const [note, setNote] = useState('');

  const person = data.staff.find((s) => s.id === staffId);
  const days = isISODate(start) && isISODate(end) ? daysInclusive(start, end) : 0;
  const valid = Boolean(person) && days > 0;
  const year = Number(start.slice(0, 4));
  const used = person ? leaveDays(person.id, data.timeOff, year, 'approved') : 0;
  const booked = person ? leaveDays(person.id, data.timeOff, year, 'pending') : 0;
  const left = person ? person.leaveAllowance - used - booked : 0;
  const clashes = valid && person ? shiftsInRange(person.id, start, end, data.shifts).length : 0;

  function submit() {
    if (!valid || !person) return;
    dispatch({
      type: 'leave/save',
      leave: {
        id: newId('to'),
        staffId: person.id,
        type,
        start,
        end,
        note: note.trim(),
        // A manager recording time off books it directly; a request from staff waits for a decision.
        status: isManager ? 'approved' : 'pending',
        createdAt: today,
      },
    });
    notify.ok(isManager ? 'Time off recorded' : 'Request sent to your manager');
    onClose();
  }

  return (
    <Dialog isOpen onOpenChange={(open) => !open && onClose()} purpose="form" width={500}>
      <Layout
        header={<DialogHeader title={isManager ? 'Record time off' : 'Request time off'} subtitle={valid ? `${formatRange(start, end)} · ${days} ${days === 1 ? 'day' : 'days'}` : undefined} onOpenChange={() => onClose()} />}
        content={
          <LayoutContent>
            <VStack gap={4}>
              {isManager ? (
                <Selector label="Who" options={data.staff.map((s) => ({value: s.id, label: s.name}))} value={staffId} onChange={setStaffId} hasSearch />
              ) : (
                <Text>Requesting as {person?.name ?? 'a team member'}</Text>
              )}
              <Selector
                label="Type"
                options={(Object.keys(LEAVE_LABEL) as LeaveType[]).map((t) => ({value: t, label: LEAVE_LABEL[t]}))}
                value={type}
                onChange={(v) => setType(v as LeaveType)}
              />
              <HStack gap={3} align="start">
                <DateInput
                  label="From"
                  value={asDateValue(start)}
                  onChange={(v) => {
                    if (!v) return;
                    setStart(v);
                    if (end < v) setEnd(v);
                  }}
                  isRequired
                />
                <DateInput label="Until and including" value={asDateValue(end)} min={asDateValue(start)} onChange={(v) => v && setEnd(v)} isRequired />
              </HStack>
              <TextArea label="Note" value={note} onChange={setNote} rows={2} isOptional placeholder="Anything your manager should know" />
              {type === 'holiday' && person && valid && (
                <Banner
                  status={days > left ? 'warning' : 'info'}
                  title={days > left ? `Over the allowance by ${days - left} days` : `${left - days} of ${person.leaveAllowance} holiday days left after this`}
                  description={`${used} taken and ${booked} requested in ${year}.`}
                  collapsible={false}
                />
              )}
              {clashes > 0 && person && (
                <Banner
                  status="warning"
                  title={`${clashes} rostered ${clashes === 1 ? 'shift falls' : 'shifts fall'} in this period`}
                  description={isManager ? 'You can release them to the open board when you approve.' : 'Your manager will need to cover them before approving.'}
                  collapsible={false}
                />
              )}
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <HStack gap={2} hAlign="end">
              <Button label="Cancel" onClick={onClose} />
              <Button label={isManager ? 'Record time off' : 'Send request'} variant="primary" onClick={submit} isDisabled={!valid} />
            </HStack>
          </LayoutFooter>
        }
      />
    </Dialog>
  );
}
