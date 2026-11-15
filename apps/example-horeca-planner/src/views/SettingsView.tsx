import {useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {CheckboxList, CheckboxListItem} from '@astryxdesign/core/CheckboxList';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack} from '@astryxdesign/core/HStack';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {useNotify} from '../components/shared';
import {useI18n} from '../i18n/I18nProvider';
import {usePlanner} from '../state/store';
import {type Dept, type Settings} from '../types';

export function SettingsView() {
  const {data, dispatch} = usePlanner();
  const {t, fmt, dept: deptName} = useI18n();
  const notify = useNotify();
  const [draft, setDraft] = useState<Settings>(data.settings);
  const dirty = JSON.stringify(draft) !== JSON.stringify(data.settings);

  const setTarget = (dept: Dept, key: 'weekday' | 'weekend', value: number) =>
    setDraft((d) => ({...d, targets: {...d.targets, [dept]: {...d.targets[dept], [key]: Math.max(0, Math.round(value))}}}));

  return (
    <VStack gap={6} padding={4} maxWidth={720}>
      <VStack gap={1}>
        <Heading level={1}>{t('set.title')}</Heading>
        <Text type="large">{t('set.sub')}</Text>
      </VStack>

      <VStack gap={3}>
        <Heading level={2}>{t('set.workTime')}</Heading>
        <HStack gap={3} align="start" wrap="wrap">
          <NumberInput label={t('set.minRest')} value={draft.minRestHours} onChange={(v) => setDraft({...draft, minRestHours: Math.max(0, v)})} />
          <NumberInput label={t('set.maxWeek')} value={draft.maxWeeklyHours} onChange={(v) => setDraft({...draft, maxWeeklyHours: Math.max(0, v)})} />
          <NumberInput label={t('set.budget')} value={draft.weeklyBudget} onChange={(v) => setDraft({...draft, weeklyBudget: Math.max(0, v)})} />
        </HStack>
      </VStack>

      <VStack gap={3}>
        <Heading level={2}>{t('set.opening')}</Heading>
        <CheckboxList
          label={t('set.closedOn')}
          description={t('set.closedDesc')}
          value={draft.closedDays.map(String)}
          onChange={(v) => setDraft({...draft, closedDays: v.map(Number).sort()})}
          density="compact">
          {Array.from({length: 7}, (_, i) => (
            <CheckboxListItem key={i} value={String(i)} label={fmt.weekdayName(i)} />
          ))}
        </CheckboxList>
      </VStack>

      <VStack gap={3}>
        <Heading level={2}>{t('set.minPeople')}</Heading>
        <Text type="supporting">{t('set.minPeopleDesc')}</Text>
        {(['kitchen', 'service', 'bar'] as Dept[]).map((d) => (
          <HStack key={d} gap={3} align="end" wrap="wrap">
            <NumberInput label={t('set.weekdayTarget', {dept: deptName(d)})} value={draft.targets[d].weekday} onChange={(v) => setTarget(d, 'weekday', v)} />
            <NumberInput label={t('set.weekendTarget', {dept: deptName(d)})} value={draft.targets[d].weekend} onChange={(v) => setTarget(d, 'weekend', v)} />
          </HStack>
        ))}
      </VStack>

      <HStack gap={2} hAlign="between" wrap="wrap">
        <Button
          label={t('set.reset')}
          variant="destructive"
          onClick={() => {
            dispatch({type: 'reset'});
            window.location.hash = '#/roster';
            notify.ok(t('set.resetToast'));
          }}
        />
        <HStack gap={2}>
          <Button label={t('set.discard')} onClick={() => setDraft(data.settings)} isDisabled={!dirty} />
          <Button
            label={t('set.save')}
            variant="primary"
            isDisabled={!dirty}
            onClick={() => {
              dispatch({type: 'settings/save', settings: draft});
              notify.ok(t('set.saved'));
            }}
          />
        </HStack>
      </HStack>
    </VStack>
  );
}
