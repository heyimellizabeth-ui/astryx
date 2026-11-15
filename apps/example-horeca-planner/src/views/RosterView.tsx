import {Icon} from '@astryxdesign/core/Icon';
import {useMemo, useState} from 'react';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {DropdownMenu} from '@astryxdesign/core/DropdownMenu';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack} from '@astryxdesign/core/HStack';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Layout, LayoutContent, LayoutFooter} from '@astryxdesign/core/Layout';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/20/solid';
import {RosterAgenda} from '../components/RosterAgenda';
import {RosterTable} from '../components/RosterTable';
import {ShiftDialog} from '../components/ShiftDialog';
import {shiftTime, useNotify} from '../components/shared';
import {useI18n} from '../i18n/I18nProvider';
import {addDays, isISODate, startOfWeek, todayISO, weekDates} from '../lib/dates';
import type {Params, View} from '../lib/route';
import {useNarrow} from '../lib/useNarrow';
import {shiftIssues, summariseWeek, weekShifts} from '../lib/rules';
import {usePlanner} from '../state/store';
import {type Dept, type ISODate, type Shift, type Staff} from '../types';

type DeptFilter = Dept | 'all';

interface Props {
  params: URLSearchParams;
  navigate: (view: View, params?: Params) => void;
}

export function RosterView({params, navigate}: Props) {
  const {data, viewerId, isManager, dispatch} = usePlanner();
  const {t, tn, fmt, dept: deptName, issue: describe, hours: fmtHours} = useI18n();
  const notify = useNotify();
  const thisWeek = startOfWeek(todayISO());
  const raw = params.get('week');
  const weekStart = raw && isISODate(raw) ? startOfWeek(raw) : thisWeek;
  const rawDept = params.get('dept');
  const dept: DeptFilter = rawDept === 'kitchen' || rawDept === 'service' || rawDept === 'bar' ? rawDept : 'all';
  const days = weekDates(weekStart);
  const narrow = useNarrow();
  const published = data.publishedWeeks.includes(weekStart);

  const [editing, setEditing] = useState<(Partial<Shift> & {date: ISODate}) | null>(null);
  const [offering, setOffering] = useState<Shift | null>(null);

  const go = (week: ISODate, d: DeptFilter = dept) => navigate('roster', {week: week === thisWeek ? undefined : week, dept: d === 'all' ? undefined : d});
  const summary = useMemo(() => summariseWeek(data, weekStart), [data, weekStart]);
  const issueLines = useMemo(
    () =>
      weekShifts(data.shifts, weekStart).flatMap((s) =>
        shiftIssues(s, data).map((issue) => ({
          key: `${s.id}-${issue.kind}-${JSON.stringify(issue.params)}`,
          severity: issue.severity,
          text: `${data.staff.find((p) => p.id === s.staffId)?.name ?? t('roster.someone')} · ${fmt.dayLong(s.date)} ${shiftTime(s)} · ${describe(issue)}`,
        })),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, weekStart, t, fmt, describe],
  );

  function openShift(shift: Shift) {
    if (isManager) setEditing(shift);
    else setOffering(shift);
  }
  function add(date: ISODate, staff: Staff | null) {
    setEditing({date, staffId: staff?.id ?? null, dept: staff?.dept, position: staff?.position});
  }
  function copyLastWeek() {
    dispatch({type: 'week/copy', from: addDays(weekStart, -7), to: weekStart});
    notify.ok(t('roster.copied'));
  }
  function togglePublish() {
    dispatch({type: 'week/publish', weekStart, published: !published});
    notify.ok(published ? t('roster.unpublishedToast') : t('roster.publishedToast'));
  }

  const budgetPct = Math.round((summary.cost / data.settings.weeklyBudget) * 100);

  return (
    <VStack gap={4} padding={4}>
      <HStack hAlign="between" align="end" wrap="wrap" gap={3}>
        <VStack gap={1}>
          <Heading level={1}>{t('roster.title')}</Heading>
          <HStack gap={2} align="center">
            <Text type="large">
              {t('roster.range', {from: fmt.day(days[0]), to: fmt.day(days[6]), year: days[6].slice(0, 4)})}
            </Text>
            <StatusDot variant={published ? 'success' : 'neutral'} label={published ? t('common.published') : t('common.draft')} />
            <Text type="supporting">{published ? t('common.published') : t('common.draft')}</Text>
          </HStack>
        </VStack>
        <HStack gap={2} wrap="wrap" align="center">
          <IconButton label={t('roster.prevWeek')} icon={<Icon icon={ChevronLeftIcon} />} onClick={() => go(addDays(weekStart, -7))} />
          <Button label={t('roster.thisWeek')} onClick={() => go(thisWeek)} isDisabled={weekStart === thisWeek} />
          <IconButton label={t('roster.nextWeek')} icon={<Icon icon={ChevronRightIcon} />} onClick={() => go(addDays(weekStart, 7))} />
          {isManager && (
            <>
              <Button label={t('roster.addShift')} onClick={() => setEditing({date: weekStart === thisWeek ? todayISO() : weekStart})} />
              <Button
                label={published ? t('roster.unpublish') : t('roster.publish')}
                variant={published ? 'secondary' : 'primary'}
                onClick={togglePublish}
                isDisabled={!published && summary.conflicts > 0}
                tooltip={!published && summary.conflicts > 0 ? tn('roster.fixFirst', summary.conflicts) : undefined}
              />
              <DropdownMenu
                button={{label: t('roster.more'), variant: 'ghost'}}
                items={[
                  {label: t('roster.copyLast'), onClick: copyLastWeek},
                  {label: t('roster.clearWeek'), variant: 'destructive', onClick: () => dispatch({type: 'week/clear', weekStart})},
                ]}
              />
            </>
          )}
        </HStack>
      </HStack>

      <HStack hAlign="between" align="center" wrap="wrap" gap={3}>
        <SegmentedControl size="lg" label={t('common.department')} value={dept} onChange={(v) => go(weekStart, v as DeptFilter)}>
          <SegmentedControlItem value="all" label={t('common.everyone')} />
          {(['kitchen', 'service', 'bar'] as Dept[]).map((d) => (
            <SegmentedControlItem key={d} value={d} label={deptName(d)} />
          ))}
        </SegmentedControl>
        <HStack gap={6} wrap="wrap" align="end">
          <Stat label={t('roster.paidHours')} value={fmtHours(summary.hours * 60)} />
          <VStack gap={1} width={220}>
            <HStack hAlign="between">
              <Text type="supporting">{t('roster.labourCost')}</Text>
              <Text weight="semibold" hasTabularNumbers>
                {fmt.eur(summary.cost)} <Text type="supporting">{t('roster.labourOf', {budget: fmt.eur(data.settings.weeklyBudget)})}</Text>
              </Text>
            </HStack>
            <ProgressBar label={t('roster.labourBar')} isLabelHidden value={Math.min(budgetPct, 100)} variant={budgetPct > 100 ? 'error' : budgetPct > 90 ? 'warning' : 'accent'} />
          </VStack>
          <Stat label={t('roster.openShifts')} value={String(summary.openShifts)} />
          <Stat label={t('roster.gaps')} value={String(summary.gaps)} />
        </HStack>
      </HStack>

      {!isManager && !published && <Banner status="info" title={t('roster.draftTitle')} description={t('roster.draftDesc')} collapsible={false} />}
      {isManager && issueLines.length > 0 && (
        <Banner
          status={summary.conflicts > 0 ? 'error' : 'warning'}
          title={t('roster.issuesTitle', {conflicts: tn('roster.conflicts', summary.conflicts), warnings: tn('roster.warnings', summary.warnings)})}
          description={summary.conflicts > 0 ? t('roster.issuesFix') : t('roster.issuesReview')}>
          <VStack gap={1}>
            {issueLines.map((l) => (
              <Text key={l.key}>{l.text}</Text>
            ))}
          </VStack>
        </Banner>
      )}

      {narrow ? (
        <RosterAgenda data={data} days={days} dept={dept} isManager={isManager} viewerId={viewerId} onAdd={add} onOpenShift={openShift} />
      ) : (
        <RosterTable data={data} days={days} weekStart={weekStart} dept={dept} isManager={isManager} viewerId={viewerId} onAdd={add} onOpenShift={openShift} />
      )}

      {editing && <ShiftDialog initial={editing} onClose={() => setEditing(null)} />}
      {offering && (
        <Dialog isOpen onOpenChange={(o) => !o && setOffering(null)} width={440}>
          <Layout
            header={<DialogHeader title={t('roster.yourShift')} subtitle={`${fmt.dayLong(offering.date)} · ${shiftTime(offering)}`} onOpenChange={() => setOffering(null)} />}
            content={
              <LayoutContent>
                <Text>
                  {offering.offered
                    ? t('roster.offeredHelp')
                    : t('roster.offerHelp')}
                </Text>
              </LayoutContent>
            }
            footer={
              <LayoutFooter>
                <HStack gap={2} hAlign="end">
                  <Button label={t('common.close')} onClick={() => setOffering(null)} />
                  <Button
                    label={offering.offered ? t('roster.takeBack') : t('roster.offer')}
                    variant="primary"
                    onClick={() => {
                      dispatch({type: 'shift/save', shift: {...offering, offered: !offering.offered}});
                      notify.ok(offering.offered ? t('roster.takenBackToast') : t('roster.offeredToast'));
                      setOffering(null);
                    }}
                  />
                </HStack>
              </LayoutFooter>
            }
          />
        </Dialog>
      )}
    </VStack>
  );
}

function Stat({label, value}: {label: string; value: string}) {
  return (
    <VStack>
      <Text type="supporting">{label}</Text>
      <Text type="large" weight="semibold" hasTabularNumbers>
        {value}
      </Text>
    </VStack>
  );
}
