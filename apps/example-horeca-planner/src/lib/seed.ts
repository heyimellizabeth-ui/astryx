import type {Dept, PlannerData, Settings, Shift, Staff, TimeOff} from '../types';
import {addDays, startOfWeek, todayISO} from './dates';

interface Template {
  start: string;
  end: string;
  dept: Dept;
}

const T = {
  kEarly: {start: '09:00', end: '17:00', dept: 'kitchen'},
  kLate: {start: '15:00', end: '23:00', dept: 'kitchen'},
  dish: {start: '17:00', end: '23:00', dept: 'kitchen'},
  sLunch: {start: '11:00', end: '17:00', dept: 'service'},
  sDinner: {start: '16:00', end: '23:30', dept: 'service'},
  sClose: {start: '17:00', end: '00:30', dept: 'service'},
  bDay: {start: '12:00', end: '19:00', dept: 'bar'},
  bNight: {start: '17:00', end: '01:00', dept: 'bar'},
} satisfies Record<string, Template>;

type TemplateKey = keyof typeof T;

export const DEFAULT_SETTINGS: Settings = {
  minRestHours: 11,
  maxWeeklyHours: 48,
  weeklyBudget: 8000,
  closedDays: [0],
  targets: {
    kitchen: {weekday: 2, weekend: 3},
    service: {weekday: 2, weekend: 4},
    bar: {weekday: 1, weekend: 2},
  },
};

const person = (
  id: string,
  name: string,
  role: Staff['role'],
  dept: Dept,
  position: string,
  contractHours: number,
  hourlyRate: number,
  leaveAllowance: number,
  unavailable: number[] = [],
): Staff => ({id, name, role, dept, position, contractHours, hourlyRate, leaveAllowance, unavailable});

/** The team. Soula and Lizzy are administrators; everyone else is an employee. */
const STAFF: Staff[] = [
  person('st-soula', 'Soula', 'admin', 'service', 'Manager', 40, 24, 25),
  person('st-lizzy', 'Lizzy', 'admin', 'bar', 'Manager', 40, 24, 25),
  person('st-asterios', 'Asterios', 'employee', 'kitchen', 'Line cook', 40, 17, 20),
  person('st-apostolos', 'Apostolos', 'employee', 'kitchen', 'Line cook', 40, 17, 20),
  person('st-sajjad', 'Sajjad', 'employee', 'kitchen', 'Line cook', 32, 16, 20),
  person('st-mira', 'Mira B.', 'employee', 'kitchen', 'Line cook', 24, 16, 15),
  person('st-panagiwta', 'Panagiwta', 'employee', 'kitchen', 'Prep cook', 24, 15, 15),
  person('st-spyros', 'Spyros', 'employee', 'kitchen', 'Line cook', 40, 17, 20),
  person('st-nikitas', 'Nikitas', 'employee', 'service', 'Server', 32, 15.5, 20),
  person('st-dimitri', 'Dimitri', 'employee', 'service', 'Server', 32, 15.5, 20),
  person('st-giannis', 'Giannis S.', 'employee', 'service', 'Server', 32, 15.5, 20),
  person('st-seri', 'Seri', 'employee', 'service', 'Server', 24, 15, 15),
  person('st-rita', 'Rita', 'employee', 'service', 'Server', 24, 15, 15),
  person('st-eugenia', 'Eugenia', 'employee', 'service', 'Server', 24, 15, 15),
  person('st-hasna', 'Hasna', 'employee', 'service', 'Host', 20, 14.5, 12),
  person('st-albaraa', 'Albaraa', 'employee', 'service', 'Runner', 16, 14, 10, [1]),
  person('st-adel', 'Adel', 'employee', 'bar', 'Bartender', 24, 16, 15),
  person('st-raghda', 'Raghda', 'employee', 'bar', 'Bartender', 24, 16, 15),
  person('st-maria', 'Maria Z.', 'employee', 'bar', 'Bartender', 16, 15, 10, [1, 2]),
];

/** The signed-out viewer: can read the roster, cannot edit or act as anyone. */
export const GUEST = 'guest';

/** Day index (0 = Monday) to template, per person. Monday is closed. */
const PATTERN: Record<string, Partial<Record<number, TemplateKey>>> = {
  'st-soula': {2: 'sDinner', 3: 'sDinner', 4: 'sDinner', 5: 'sDinner', 6: 'sDinner'},
  'st-lizzy': {2: 'bNight', 3: 'bNight', 4: 'bNight', 5: 'bNight', 6: 'bNight'},
  'st-asterios': {1: 'kEarly', 2: 'kEarly', 3: 'kEarly', 4: 'kEarly', 5: 'kEarly'},
  'st-apostolos': {2: 'kLate', 3: 'kLate', 4: 'kLate', 5: 'kLate', 6: 'kLate'},
  'st-sajjad': {1: 'kLate', 4: 'kEarly', 5: 'kEarly', 6: 'kEarly'},
  'st-mira': {4: 'kLate', 5: 'kLate', 6: 'kLate'},
  'st-panagiwta': {2: 'kEarly', 3: 'kEarly', 5: 'kEarly'},
  'st-spyros': {3: 'dish', 4: 'dish', 5: 'dish', 6: 'dish'},
  'st-nikitas': {1: 'sDinner', 3: 'sLunch', 4: 'sClose', 5: 'sLunch', 6: 'sDinner'},
  'st-dimitri': {1: 'sLunch', 2: 'sLunch', 4: 'sDinner', 5: 'sDinner'},
  'st-giannis': {1: 'sDinner', 6: 'sLunch'},
  'st-seri': {3: 'sDinner', 5: 'sDinner', 6: 'sLunch'},
  'st-rita': {2: 'sLunch', 4: 'sDinner', 5: 'sDinner', 6: 'sLunch'},
  'st-eugenia': {4: 'sDinner', 5: 'sDinner', 6: 'sDinner'},
  'st-hasna': {4: 'sDinner', 5: 'sDinner', 6: 'sDinner'},
  'st-albaraa': {5: 'sClose', 6: 'sDinner'},
  'st-adel': {4: 'bNight', 5: 'bNight', 6: 'bDay'},
  'st-raghda': {4: 'bDay', 5: 'bDay', 6: 'bNight'},
  'st-maria': {3: 'bDay'},
};

const POSITION_OF = new Map(STAFF.map((s) => [s.id, s.position]));

/** Approved leave the seed rosters around, as date ranges counted from the start of this week. */
function leaveBlocks(at: (offset: number) => string): {staffId: string; start: string; end: string}[] {
  return [
    {staffId: 'st-eugenia', start: at(7), end: at(11)},
    {staffId: 'st-spyros', start: at(0), end: at(6)},
  ];
}

export function buildSeed(today: string = todayISO()): PlannerData {
  const week = startOfWeek(today);
  const at = (offset: number) => addDays(week, offset);

  const shifts: Shift[] = [];
  const blocks = leaveBlocks(at);
  for (const [weekOffset, suffix] of [[0, ''], [7, '-w1']] as const) {
    for (const [staffId, days] of Object.entries(PATTERN)) {
      for (const [dayIdx, key] of Object.entries(days)) {
        const date = at(weekOffset + Number(dayIdx));
        // The pattern is rostered around leave that is already approved, so only a late sick call clashes.
        if (blocks.some((b) => b.staffId === staffId && b.start <= date && date <= b.end)) continue;
        const t = T[key as TemplateKey];
        shifts.push({
          id: `sh-${staffId.slice(3)}-${dayIdx}${suffix}`,
          date,
          start: t.start,
          end: t.end,
          breakMin: 30,
          dept: t.dept,
          position: POSITION_OF.get(staffId) ?? 'Staff',
          staffId,
        });
      }
    }
  }
  shifts.push(
    {id: 'sh-open-1', date: at(5), start: '16:00', end: '23:30', breakMin: 30, dept: 'service', position: 'Server', staffId: null, note: 'Busy Saturday, tables of 8+ booked'},
    {id: 'sh-open-2', date: at(6), start: '09:00', end: '17:00', breakMin: 30, dept: 'kitchen', position: 'Line cook', staffId: null, note: 'Sunday brunch'},
    {id: 'sh-open-3', date: at(3), start: '12:00', end: '19:00', breakMin: 30, dept: 'bar', position: 'Bartender', staffId: null},
    {id: 'sh-open-4', date: at(10), start: '16:00', end: '23:30', breakMin: 30, dept: 'service', position: 'Server', staffId: null, note: 'Covers Eugenia’s holiday'},
    {id: 'sh-open-5', date: at(12), start: '16:00', end: '23:30', breakMin: 30, dept: 'service', position: 'Server', staffId: null, note: 'Two large bookings'},
    {id: 'sh-open-6', date: at(13), start: '09:00', end: '17:00', breakMin: 30, dept: 'kitchen', position: 'Line cook', staffId: null, note: 'Sunday brunch'},
  );

  const timeOff: TimeOff[] = [
    {id: 'to-1', staffId: 'st-eugenia', type: 'holiday', start: at(7), end: at(11), note: 'Family trip to Lisbon', status: 'approved', createdAt: addDays(today, -21)},
    {id: 'to-2', staffId: 'st-rita', type: 'holiday', start: at(4), end: at(6), note: 'Sister’s wedding, can swap shifts with Dimitri', status: 'pending', createdAt: addDays(today, -2)},
    {id: 'to-3', staffId: 'st-nikitas', type: 'sick', start: at(1), end: at(1), note: 'Called in sick, doctor’s note to follow', status: 'approved', createdAt: today},
    {id: 'to-4', staffId: 'st-maria', type: 'holiday', start: at(14), end: at(20), note: 'Exam week then a short break', status: 'pending', createdAt: addDays(today, -1)},
    {id: 'to-5', staffId: 'st-giannis', type: 'holiday', start: at(11), end: at(13), note: 'Festival weekend', status: 'denied', createdAt: addDays(today, -9), decisionNote: 'Peak weekend, could you take the week after instead?'},
    {id: 'to-6', staffId: 'st-albaraa', type: 'unpaid', start: at(9), end: at(9), note: 'Driving test', status: 'pending', createdAt: addDays(today, -3)},
    {id: 'to-7', staffId: 'st-soula', type: 'holiday', start: addDays(today, -30), end: addDays(today, -23), note: '', status: 'approved', createdAt: addDays(today, -60)},
    {id: 'to-8', staffId: 'st-spyros', type: 'holiday', start: at(0), end: at(6), note: '', status: 'approved', createdAt: addDays(today, -40)},
  ];

  return {
    staff: STAFF,
    shifts,
    timeOff,
    settings: DEFAULT_SETTINGS,
    publishedWeeks: [addDays(week, -7)],
  };
}
