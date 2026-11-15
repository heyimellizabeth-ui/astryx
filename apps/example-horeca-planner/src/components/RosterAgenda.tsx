import {Button} from '@astryxdesign/core/Button';
import {Divider} from '@astryxdesign/core/Divider';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack} from '@astryxdesign/core/HStack';
import {Icon} from '@astryxdesign/core/Icon';
import {Text} from '@astryxdesign/core/Text';
import {Token} from '@astryxdesign/core/Token';
import {VStack} from '@astryxdesign/core/VStack';
import {formatDayLong, todayISO} from '../lib/dates';
import {coverageFor, leaveCovering, requiredFor} from '../lib/rules';
import {DEPT_LABEL, type Dept, type ISODate, type PlannerData, type Shift, type Staff} from '../types';
import {ShiftToken} from './ShiftToken';

interface Props {
  data: PlannerData;
  days: ISODate[];
  dept: Dept | 'all';
  isManager: boolean;
  viewerId: string;
  onAdd: (date: ISODate, staff: Staff | null) => void;
  onOpenShift: (shift: Shift) => void;
}

const DEPTS: Dept[] = ['kitchen', 'service', 'bar'];

export function RosterAgenda({data, days, dept, isManager, viewerId, onAdd, onOpenShift}: Props) {
  const today = todayISO();
  const depts = dept === 'all' ? DEPTS : [dept];

  return (
    <VStack gap={4}>
      {days.map((date, i) => {
        const closed = data.settings.closedDays.includes(i);
        const shifts = data.shifts.filter((s) => s.date === date && (dept === 'all' || s.dept === dept)).sort((a, b) => a.start.localeCompare(b.start));
        const away = data.staff.filter((p) => (dept === 'all' || p.dept === dept) && leaveCovering(p.id, date, data.timeOff, 'approved'));
        return (
          <VStack key={date} gap={2}>
            <Divider />
            <HStack gap={2} align="center" wrap="wrap">
              <Heading level={2}>{formatDayLong(date)}</Heading>
              {date === today && <Token size="sm" color="blue" label="Today" />}
            </HStack>
            {closed ? (
              <Text type="supporting">Closed</Text>
            ) : (
              <>
                <HStack gap={1} wrap="wrap">
                  {depts.map((d) => {
                    const have = coverageFor(d, date, data);
                    const need = requiredFor(d, date, data.settings);
                    const short = have < need;
                    return <Token key={d} size="sm" color={short ? 'red' : 'green'} icon={<Icon icon={short ? 'warning' : 'check'} />} label={`${DEPT_LABEL[d]} ${have}/${need}`} />;
                  })}
                </HStack>
                {shifts.length === 0 && <Text type="supporting">No shifts yet</Text>}
                {shifts.map((s) => {
                  const person = data.staff.find((p) => p.id === s.staffId);
                  return (
                    <HStack key={s.id} gap={2} align="center">
                      <ShiftToken shift={s} data={data} onOpen={onOpenShift} canOpen={isManager || s.staffId === viewerId} />
                      <Text maxLines={1}>{person ? person.name : 'Open shift'}</Text>
                    </HStack>
                  );
                })}
                {away.map((p) => (
                  <Text key={p.id} type="supporting">
                    {p.name} is off
                  </Text>
                ))}
                {isManager && <Button label={`Add shift on ${formatDayLong(date)}`} size="sm" variant="ghost" onClick={() => onAdd(date, null)} />}
              </>
            )}
          </VStack>
        );
      })}
    </VStack>
  );
}
