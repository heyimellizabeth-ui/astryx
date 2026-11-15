import {useMemo, useState} from 'react';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {DateInput} from '@astryxdesign/core/DateInput';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {HStack} from '@astryxdesign/core/HStack';
import {Layout, LayoutContent, LayoutFooter} from '@astryxdesign/core/Layout';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {Selector} from '@astryxdesign/core/Selector';
import {Text} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {TimeInput} from '@astryxdesign/core/TimeInput';
import {VStack} from '@astryxdesign/core/VStack';
import {asDateValue, asTimeValue} from '../lib/astryxDates';
import {formatDayLong, formatHours, isHhmm, isISODate} from '../lib/dates';
import {paidMinutes, shiftIssues} from '../lib/rules';
import {newId, usePlanner} from '../state/store';
import {DEPT_LABEL, type Dept, type Shift} from '../types';
import {useNotify} from './shared';

const PRESETS = [
  {label: 'Opening', start: '09:00', end: '17:00'},
  {label: 'Lunch', start: '11:00', end: '17:00'},
  {label: 'Dinner', start: '16:00', end: '23:30'},
  {label: 'Close', start: '17:00', end: '00:30'},
] as const;

const OPEN = 'open';

/** Used when nobody is picked and no position is typed. */
const DEFAULT_POSITION: Record<Dept, string> = {kitchen: 'Line cook', service: 'Server', bar: 'Bartender'};

interface Props {
  /** An existing shift to edit, or the defaults for a new one. */
  initial: Partial<Shift> & {date: string};
  onClose: () => void;
}

export function ShiftDialog({initial, onClose}: Props) {
  const {data, dispatch} = usePlanner();
  const notify = useNotify();
  const isNew = !initial.id;

  const [staffId, setStaffId] = useState<string>(initial.staffId ?? OPEN);
  const [date, setDate] = useState(initial.date);
  const [start, setStart] = useState(initial.start ?? '16:00');
  const [end, setEnd] = useState(initial.end ?? '23:30');
  const [breakMin, setBreakMin] = useState(initial.breakMin ?? 30);
  const [dept, setDept] = useState<Dept>(initial.dept ?? 'service');
  const [position, setPosition] = useState(initial.position ?? '');
  const [note, setNote] = useState(initial.note ?? '');

  const person = data.staff.find((s) => s.id === staffId);
  const valid = isISODate(date) && isHhmm(start) && isHhmm(end) && start !== end;

  const draft: Shift = {
    id: initial.id ?? 'draft',
    date,
    start,
    end,
    breakMin,
    dept,
    position: position.trim() || DEFAULT_POSITION[dept],
    staffId: staffId === OPEN ? null : staffId,
    note: note.trim() || undefined,
  };
  const issues = useMemo(
    () => (valid ? shiftIssues(draft, {...data, shifts: data.shifts.filter((s) => s.id !== draft.id)}) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [valid, date, start, end, staffId, data],
  );

  function pickStaff(id: string) {
    setStaffId(id);
    const p = data.staff.find((s) => s.id === id);
    if (p) {
      setDept(p.dept);
      setPosition(p.position);
    }
  }

  function save() {
    if (!valid) return;
    dispatch({type: 'shift/save', shift: {...draft, id: initial.id ?? newId('sh')}});
    notify.ok(isNew ? 'Shift added' : 'Shift updated');
    onClose();
  }

  function remove() {
    if (!initial.id) return;
    dispatch({type: 'shift/delete', id: initial.id});
    notify.ok('Shift deleted');
    onClose();
  }

  const staffOptions = [
    {value: OPEN, label: 'Open shift (nobody yet)'},
    ...data.staff.map((s) => ({value: s.id, label: `${s.name} · ${s.position}`})),
  ];

  return (
    <Dialog isOpen onOpenChange={(open) => !open && onClose()} purpose="form" width={520}>
      <Layout
        header={<DialogHeader title={isNew ? 'Add shift' : 'Edit shift'} subtitle={isISODate(date) ? formatDayLong(date) : undefined} onOpenChange={() => onClose()} />}
        content={
          <LayoutContent>
            <VStack gap={4}>
              <Selector label="Who works" options={staffOptions} value={staffId} onChange={pickStaff} hasSearch />
              <DateInput label="Date" value={asDateValue(date)} onChange={(v) => v && setDate(v)} isRequired />
              <HStack gap={1} wrap="wrap" align="center">
                <Text type="supporting">Quick fill</Text>
                {PRESETS.map((p) => (
                  <Button
                    key={p.label}
                    label={`${p.label} ${p.start} to ${p.end}`}
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setStart(p.start);
                      setEnd(p.end);
                    }}
                  />
                ))}
              </HStack>
              <HStack gap={3} align="start">
                <TimeInput label="Starts" value={asTimeValue(start)} onChange={(v) => v && setStart(v)} hourFormat="24h" presentation="text-input" isRequired />
                <TimeInput label="Ends" value={asTimeValue(end)} onChange={(v) => v && setEnd(v)} hourFormat="24h" presentation="text-input" isRequired />
                <NumberInput label="Unpaid break (min)" value={breakMin} onChange={(v) => setBreakMin(Math.max(0, v))} />
              </HStack>
              <HStack gap={3} align="start">
                <Selector
                  label="Department"
                  options={(Object.keys(DEPT_LABEL) as Dept[]).map((d) => ({value: d, label: DEPT_LABEL[d]}))}
                  value={dept}
                  onChange={(v) => setDept(v as Dept)}
                />
                <TextInput label="Position" value={position} onChange={setPosition} placeholder={DEFAULT_POSITION[dept]} isOptional />
              </HStack>
              <TextInput label="Note" value={note} onChange={setNote} isOptional placeholder="Section, tasks, large booking…" />
              {valid && (
                <Text type="supporting">
                  {formatHours(paidMinutes(draft))} paid{person ? ` · ${(paidMinutes(draft) / 60 * person.hourlyRate).toFixed(0)} € labour` : ''}
                </Text>
              )}
              {issues.map((issue) => (
                <Banner key={issue.message} status={issue.severity === 'error' ? 'error' : 'warning'} title={issue.message} collapsible={false} />
              ))}
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <HStack gap={2} hAlign="between">
              {isNew ? <VStack /> : <Button label="Delete shift" variant="destructive" onClick={remove} />}
              <HStack gap={2}>
                <Button label="Cancel" onClick={onClose} />
                <Button label={isNew ? 'Add shift' : 'Save changes'} variant="primary" onClick={save} isDisabled={!valid} />
              </HStack>
            </HStack>
          </LayoutFooter>
        }
      />
    </Dialog>
  );
}
