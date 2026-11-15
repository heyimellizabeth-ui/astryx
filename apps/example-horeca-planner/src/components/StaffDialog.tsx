import {useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {CheckboxList, CheckboxListItem} from '@astryxdesign/core/CheckboxList';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {HStack} from '@astryxdesign/core/HStack';
import {Layout, LayoutContent, LayoutFooter} from '@astryxdesign/core/Layout';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {Selector} from '@astryxdesign/core/Selector';
import {TextInput} from '@astryxdesign/core/TextInput';
import {VStack} from '@astryxdesign/core/VStack';
import {weekdayName} from '../lib/dates';
import {newId, usePlanner} from '../state/store';
import {DEPT_LABEL, type Dept, type Staff} from '../types';
import {useNotify} from './shared';

export function StaffDialog({staff, onClose}: {staff?: Staff; onClose: () => void}) {
  const {dispatch} = usePlanner();
  const notify = useNotify();
  const [name, setName] = useState(staff?.name ?? '');
  const [position, setPosition] = useState(staff?.position ?? '');
  const [dept, setDept] = useState<Dept>(staff?.dept ?? 'service');
  const [contractHours, setContractHours] = useState(staff?.contractHours ?? 24);
  const [hourlyRate, setHourlyRate] = useState(staff?.hourlyRate ?? 15);
  const [leaveAllowance, setLeaveAllowance] = useState(staff?.leaveAllowance ?? 20);
  const [unavailable, setUnavailable] = useState<string[]>((staff?.unavailable ?? []).map(String));
  const [confirmRemove, setConfirmRemove] = useState(false);
  const valid = name.trim().length > 0 && position.trim().length > 0;

  function save() {
    if (!valid) return;
    dispatch({
      type: 'staff/save',
      staff: {
        id: staff?.id ?? newId('st'),
        name: name.trim(),
        position: position.trim(),
        dept,
        contractHours,
        hourlyRate,
        leaveAllowance,
        unavailable: unavailable.map(Number).sort(),
      },
    });
    notify.ok(staff ? 'Profile saved' : `${name.trim()} added to the team`);
    onClose();
  }

  function remove() {
    if (!staff) return;
    dispatch({type: 'staff/delete', id: staff.id});
    notify.ok(`${staff.name} removed. Their shifts are now open.`);
    onClose();
  }

  return (
    <Dialog isOpen onOpenChange={(open) => !open && onClose()} purpose="form" width={520}>
      <Layout
        header={<DialogHeader title={staff ? staff.name : 'Add team member'} subtitle={staff?.position} onOpenChange={() => onClose()} />}
        content={
          <LayoutContent>
            <VStack gap={4}>
              <TextInput label="Name" value={name} onChange={setName} isRequired />
              <HStack gap={3} align="start">
                <TextInput label="Position" value={position} onChange={setPosition} placeholder="Server, Sous chef…" isRequired />
                <Selector
                  label="Department"
                  options={(Object.keys(DEPT_LABEL) as Dept[]).map((d) => ({value: d, label: DEPT_LABEL[d]}))}
                  value={dept}
                  onChange={(v) => setDept(v as Dept)}
                />
              </HStack>
              <HStack gap={3} align="start">
                <NumberInput label="Contract hours / week" value={contractHours} onChange={(v) => setContractHours(Math.max(0, v))} />
                <NumberInput label="Hourly cost (€)" value={hourlyRate} onChange={(v) => setHourlyRate(Math.max(0, v))} />
                <NumberInput label="Holiday days / year" value={leaveAllowance} onChange={(v) => setLeaveAllowance(Math.max(0, v))} />
              </HStack>
              <CheckboxList label="Cannot work on" description="Recurring unavailability. The roster warns when you schedule over it." value={unavailable} onChange={setUnavailable} density="compact">
                {Array.from({length: 7}, (_, i) => (
                  <CheckboxListItem key={i} value={String(i)} label={weekdayName(i)} />
                ))}
              </CheckboxList>
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <HStack gap={2} hAlign="between">
              {staff ? (
                <Button label={confirmRemove ? 'Confirm remove' : 'Remove from team'} variant="destructive" onClick={() => (confirmRemove ? remove() : setConfirmRemove(true))} />
              ) : (
                <VStack />
              )}
              <HStack gap={2}>
                <Button label="Cancel" onClick={onClose} />
                <Button label={staff ? 'Save changes' : 'Add to team'} variant="primary" onClick={save} isDisabled={!valid} />
              </HStack>
            </HStack>
          </LayoutFooter>
        }
      />
    </Dialog>
  );
}
