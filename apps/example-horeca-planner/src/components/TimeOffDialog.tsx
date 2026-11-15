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
import {useI18n} from '../i18n/I18nProvider';
import {daysInclusive, isISODate, startOfWeek, todayISO} from '../lib/dates';
import {leaveDays, shiftsInRange} from '../lib/rules';
import {newId, usePlanner} from '../state/store';
import {type LeaveType} from '../types';
import {useNotify} from './shared';

interface Props {
  /** Pre-select a person, for example the viewer. */
  staffId?: string;
  onClose: () => void;
}

export function TimeOffDialog({staffId: initialStaff, onClose}: Props) {
  const {data, isManager, viewerId, dispatch} = usePlanner();
  const {t, tn, fmt, leaveType} = useI18n();
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
    notify.ok(isManager ? t('leave.recorded') : t('leave.sent'));
    onClose();
  }

  return (
    <Dialog isOpen onOpenChange={(open) => !open && onClose()} purpose="form" width={500}>
      <Layout
        header={<DialogHeader title={isManager ? t('leave.recordTitle') : t('leave.requestTitle')} subtitle={valid ? `${fmt.range(start, end, t('common.to'))} · ${tn('common.day', days)}` : undefined} onOpenChange={() => onClose()} />}
        content={
          <LayoutContent>
            <VStack gap={4}>
              {isManager ? (
                <Selector label={t('common.who')} options={data.staff.map((s) => ({value: s.id, label: s.name}))} value={staffId} onChange={setStaffId} hasSearch />
              ) : (
                <Text>{t('leave.requestingAs', {name: person?.name ?? ''})}</Text>
              )}
              <Selector
                label={t('common.type')}
                options={((['holiday', 'sick', 'unpaid', 'other']) as LeaveType[]).map((k) => ({value: k, label: leaveType(k)}))}
                value={type}
                onChange={(v) => setType(v as LeaveType)}
              />
              <HStack gap={3} align="start">
                <DateInput
                  label={t('leave.from')}
                  value={asDateValue(start)}
                  onChange={(v) => {
                    if (!v) return;
                    setStart(v);
                    if (end < v) setEnd(v);
                  }}
                  isRequired
                />
                <DateInput label={t('leave.until')} value={asDateValue(end)} min={asDateValue(start)} onChange={(v) => v && setEnd(v)} isRequired />
              </HStack>
              <TextArea label={t('common.note')} value={note} onChange={setNote} rows={2} isOptional placeholder={t('leave.notePlaceholder')} />
              {type === 'holiday' && person && valid && (
                <Banner
                  status={days > left ? 'warning' : 'info'}
                  title={days > left ? tn('leave.over', days - left) : t('leave.leftAfter', {left: left - days, total: person.leaveAllowance})}
                  description={t('leave.takenRequested', {used, booked, year})}
                  collapsible={false}
                />
              )}
              {clashes > 0 && person && (
                <Banner
                  status="warning"
                  title={tn('leave.clash', clashes)}
                  description={isManager ? t('leave.clashManager') : t('leave.clashStaff')}
                  collapsible={false}
                />
              )}
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <HStack gap={2} hAlign="end">
              <Button label={t('common.cancel')} onClick={onClose} />
              <Button label={isManager ? t('leave.record') : t('leave.send')} variant="primary" onClick={submit} isDisabled={!valid} />
            </HStack>
          </LayoutFooter>
        }
      />
    </Dialog>
  );
}
