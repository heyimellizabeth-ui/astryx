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
import {useI18n} from '../i18n/I18nProvider';
import {newId, usePlanner} from '../state/store';
import {type Dept, type Role, type Staff} from '../types';
import {useNotify} from './shared';

export function StaffDialog({staff, onClose}: {staff?: Staff; onClose: () => void}) {
  const {data, dispatch} = usePlanner();
  const {t, fmt, data: text, dept: deptName} = useI18n();
  const notify = useNotify();
  const [name, setName] = useState(staff?.name ?? '');
  const [position, setPosition] = useState(text(staff?.position));
  const [role, setRole] = useState<Role>(staff?.role ?? 'employee');
  const [dept, setDept] = useState<Dept>(staff?.dept ?? 'service');
  const [contractHours, setContractHours] = useState(staff?.contractHours ?? 24);
  const [hourlyRate, setHourlyRate] = useState(staff?.hourlyRate ?? 15);
  const [leaveAllowance, setLeaveAllowance] = useState(staff?.leaveAllowance ?? 20);
  const [unavailable, setUnavailable] = useState<string[]>((staff?.unavailable ?? []).map(String));
  const [confirmRemove, setConfirmRemove] = useState(false);
  const isLastAdmin = staff?.role === 'admin' && data.staff.filter((p) => p.role === 'admin').length <= 1;
  const valid = name.trim().length > 0 && position.trim().length > 0;

  function save() {
    if (!valid) return;
    dispatch({
      type: 'staff/save',
      staff: {
        id: staff?.id ?? newId('st'),
        name: name.trim(),
        role,
        position: position.trim(),
        dept,
        contractHours,
        hourlyRate,
        leaveAllowance,
        unavailable: unavailable.map(Number).sort(),
      },
    });
    notify.ok(staff ? t('staff.saved') : t('staff.added', {name: name.trim()}));
    onClose();
  }

  function remove() {
    if (!staff) return;
    dispatch({type: 'staff/delete', id: staff.id});
    notify.ok(t('staff.removed', {name: staff.name}));
    onClose();
  }

  return (
    <Dialog isOpen onOpenChange={(open) => !open && onClose()} purpose="form" width={520}>
      <Layout
        header={<DialogHeader title={staff ? staff.name : t('staff.addTitle')} subtitle={staff ? text(staff.position) : undefined} onOpenChange={() => onClose()} />}
        content={
          <LayoutContent>
            <VStack gap={4}>
              <TextInput label={t('common.name')} value={name} onChange={setName} isRequired />
              <HStack gap={3} align="start">
                <TextInput label={t('common.position')} value={position} onChange={setPosition} placeholder={t('staff.positionPlaceholder')} isRequired />
                <Selector
                  label={t('common.department')}
                  options={(['kitchen', 'service', 'bar'] as Dept[]).map((d) => ({value: d, label: deptName(d)}))}
                  value={dept}
                  onChange={(v) => setDept(v as Dept)}
                />
              </HStack>
              <Selector
                label={t('staff.role')}
                options={(['admin', 'employee'] as Role[]).map((r) => ({value: r, label: t(`role.${r}`)}))}
                value={role}
                onChange={(v) => setRole(v as Role)}
                isDisabled={isLastAdmin}
              />
              <HStack gap={3} align="start">
                <NumberInput label={t('staff.contract')} value={contractHours} onChange={(v) => setContractHours(Math.max(0, v))} />
                <NumberInput label={t('staff.rate')} value={hourlyRate} onChange={(v) => setHourlyRate(Math.max(0, v))} />
                <NumberInput label={t('staff.allowance')} value={leaveAllowance} onChange={(v) => setLeaveAllowance(Math.max(0, v))} />
              </HStack>
              <CheckboxList label={t('staff.cannotWork')} description={t('staff.cannotWorkDesc')} value={unavailable} onChange={setUnavailable} density="compact">
                {Array.from({length: 7}, (_, i) => (
                  <CheckboxListItem key={i} value={String(i)} label={fmt.weekdayName(i)} />
                ))}
              </CheckboxList>
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <HStack gap={2} hAlign="between">
              {staff && !isLastAdmin ? (
                <Button label={confirmRemove ? t('staff.confirmRemove') : t('staff.removeBtn')} variant="destructive" onClick={() => (confirmRemove ? remove() : setConfirmRemove(true))} />
              ) : (
                <VStack />
              )}
              <HStack gap={2}>
                <Button label={t('common.cancel')} onClick={onClose} />
                <Button label={staff ? t('common.saveChanges') : t('staff.addBtn')} variant="primary" onClick={save} isDisabled={!valid} />
              </HStack>
            </HStack>
          </LayoutFooter>
        }
      />
    </Dialog>
  );
}
