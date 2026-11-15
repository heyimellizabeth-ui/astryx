import {useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {CheckboxList, CheckboxListItem} from '@astryxdesign/core/CheckboxList';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack} from '@astryxdesign/core/HStack';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {useNotify} from '../components/shared';
import {weekdayName} from '../lib/dates';
import {usePlanner} from '../state/store';
import {DEPT_LABEL, type Dept, type Settings} from '../types';

export function SettingsView() {
  const {data, dispatch} = usePlanner();
  const notify = useNotify();
  const [draft, setDraft] = useState<Settings>(data.settings);
  const dirty = JSON.stringify(draft) !== JSON.stringify(data.settings);

  const setTarget = (dept: Dept, key: 'weekday' | 'weekend', value: number) =>
    setDraft((d) => ({...d, targets: {...d.targets, [dept]: {...d.targets[dept], [key]: Math.max(0, Math.round(value))}}}));

  return (
    <VStack gap={6} padding={4} maxWidth={720}>
      <VStack gap={1}>
        <Heading level={1}>Settings</Heading>
        <Text type="large">The rules the roster checks against</Text>
      </VStack>

      <VStack gap={3}>
        <Heading level={2}>Working time</Heading>
        <HStack gap={3} align="start" wrap="wrap">
          <NumberInput label="Minimum rest between shifts (hours)" value={draft.minRestHours} onChange={(v) => setDraft({...draft, minRestHours: Math.max(0, v)})} />
          <NumberInput label="Maximum hours per week" value={draft.maxWeeklyHours} onChange={(v) => setDraft({...draft, maxWeeklyHours: Math.max(0, v)})} />
          <NumberInput label="Weekly labour budget (€)" value={draft.weeklyBudget} onChange={(v) => setDraft({...draft, weeklyBudget: Math.max(0, v)})} />
        </HStack>
      </VStack>

      <VStack gap={3}>
        <Heading level={2}>Opening days</Heading>
        <CheckboxList
          label="Closed on"
          description="Closed days need no coverage."
          value={draft.closedDays.map(String)}
          onChange={(v) => setDraft({...draft, closedDays: v.map(Number).sort()})}
          density="compact">
          {Array.from({length: 7}, (_, i) => (
            <CheckboxListItem key={i} value={String(i)} label={weekdayName(i)} />
          ))}
        </CheckboxList>
      </VStack>

      <VStack gap={3}>
        <Heading level={2}>Minimum people per department</Heading>
        <Text type="supporting">Weekend means Friday to Sunday. Days below the target show as coverage gaps on the roster.</Text>
        {(Object.keys(DEPT_LABEL) as Dept[]).map((d) => (
          <HStack key={d} gap={3} align="end" wrap="wrap">
            <NumberInput label={`${DEPT_LABEL[d]}, Monday to Thursday`} value={draft.targets[d].weekday} onChange={(v) => setTarget(d, 'weekday', v)} />
            <NumberInput label={`${DEPT_LABEL[d]}, Friday to Sunday`} value={draft.targets[d].weekend} onChange={(v) => setTarget(d, 'weekend', v)} />
          </HStack>
        ))}
      </VStack>

      <HStack gap={2} hAlign="between" wrap="wrap">
        <Button
          label="Reset demo data"
          variant="destructive"
          onClick={() => {
            dispatch({type: 'reset'});
            window.location.hash = '#/roster';
            notify.ok('Demo data restored');
          }}
        />
        <HStack gap={2}>
          <Button label="Discard" onClick={() => setDraft(data.settings)} isDisabled={!dirty} />
          <Button
            label="Save settings"
            variant="primary"
            isDisabled={!dirty}
            onClick={() => {
              dispatch({type: 'settings/save', settings: draft});
              notify.ok('Settings saved');
            }}
          />
        </HStack>
      </HStack>
    </VStack>
  );
}
