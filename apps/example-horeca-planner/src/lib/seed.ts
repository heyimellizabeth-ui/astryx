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
  weeklyBudget: 6800,
  closedDays: [0],
  targets: {
    kitchen: {weekday: 2, weekend: 3},
    service: {weekday: 2, weekend: 4},
    bar: {weekday: 1, weekend: 2},
  },
};

const STAFF: Staff[] = [
  {id: 'st-marco', name: 'Marco Bianchi', position: 'Head chef', dept: 'kitchen', contractHours: 40, hourlyRate: 24, leaveAllowance: 25, unavailable: []},
  {id: 'st-aiko', name: 'Aiko Tanaka', position: 'Sous chef', dept: 'kitchen', contractHours: 40, hourlyRate: 20, leaveAllowance: 25, unavailable: []},
  {id: 'st-lars', name: 'Lars Eriksen', position: 'Line cook', dept: 'kitchen', contractHours: 32, hourlyRate: 16.5, leaveAllowance: 20, unavailable: []},
  {id: 'st-nadia', name: 'Nadia Haddad', position: 'Line cook', dept: 'kitchen', contractHours: 24, hourlyRate: 16, leaveAllowance: 15, unavailable: [1, 2]},
  {id: 'st-tomas', name: 'Tomás Reyes', position: 'Prep cook', dept: 'kitchen', contractHours: 24, hourlyRate: 15, leaveAllowance: 15, unavailable: []},
  {id: 'st-pieter', name: 'Pieter de Vries', position: 'Dishwasher', dept: 'kitchen', contractHours: 20, hourlyRate: 14, leaveAllowance: 12, unavailable: [1]},
  {id: 'st-sofia', name: 'Sofia Marchetti', position: 'Restaurant manager', dept: 'service', contractHours: 40, hourlyRate: 26, leaveAllowance: 25, unavailable: []},
  {id: 'st-jonas', name: 'Jonas Weber', position: 'Server', dept: 'service', contractHours: 32, hourlyRate: 15.5, leaveAllowance: 20, unavailable: []},
  {id: 'st-priya', name: 'Priya Nair', position: 'Server', dept: 'service', contractHours: 24, hourlyRate: 15, leaveAllowance: 15, unavailable: []},
  {id: 'st-chloe', name: 'Chloé Martin', position: 'Host', dept: 'service', contractHours: 20, hourlyRate: 14.5, leaveAllowance: 12, unavailable: [1, 2, 3]},
  {id: 'st-ibrahim', name: 'Ibrahim Yusuf', position: 'Runner', dept: 'service', contractHours: 16, hourlyRate: 14, leaveAllowance: 10, unavailable: []},
  {id: 'st-elena', name: 'Elena Kowalska', position: 'Head bartender', dept: 'bar', contractHours: 36, hourlyRate: 19, leaveAllowance: 25, unavailable: []},
  {id: 'st-daan', name: 'Daan Janssen', position: 'Bartender', dept: 'bar', contractHours: 24, hourlyRate: 16, leaveAllowance: 15, unavailable: [6]},
];

/** Day index (0 = Monday) to template, per person. Monday is closed. */
const PATTERN: Record<string, Partial<Record<number, TemplateKey>>> = {
  'st-marco': {1: 'kEarly', 2: 'kEarly', 3: 'kEarly', 4: 'kEarly', 5: 'kEarly'},
  'st-aiko': {2: 'kLate', 3: 'kLate', 4: 'kLate', 5: 'kLate', 6: 'kLate'},
  'st-lars': {1: 'kLate', 4: 'kEarly', 5: 'kEarly', 6: 'kEarly'},
  'st-nadia': {4: 'kLate', 5: 'kLate', 6: 'kLate'},
  'st-tomas': {2: 'kEarly', 3: 'kEarly', 5: 'kEarly'},
  'st-pieter': {3: 'dish', 4: 'dish', 5: 'dish', 6: 'dish'},
  'st-sofia': {2: 'sDinner', 3: 'sDinner', 4: 'sDinner', 5: 'sDinner', 6: 'sDinner'},
  'st-jonas': {1: 'sDinner', 3: 'sLunch', 4: 'sClose', 5: 'sLunch', 6: 'sDinner'},
  'st-priya': {2: 'sLunch', 4: 'sDinner', 5: 'sDinner', 6: 'sLunch'},
  'st-chloe': {4: 'sDinner', 5: 'sDinner', 6: 'sDinner'},
  'st-ibrahim': {5: 'sClose', 6: 'sDinner'},
  'st-elena': {2: 'bNight', 3: 'bNight', 4: 'bNight', 5: 'bNight', 6: 'bNight'},
  'st-daan': {1: 'bDay', 4: 'bDay', 5: 'bNight'},
};

const POSITION_OF = new Map(STAFF.map((s) => [s.id, s.position]));

/** The approved leave the seed rosters around, as plain date ranges. */
function LEAVE_BLOCKS(at: (offset: number) => string): {staffId: string; start: string; end: string}[] {
  return [{staffId: 'st-aiko', start: at(7), end: at(11)}];
}

export function buildSeed(today: string = todayISO()): PlannerData {
  const week = startOfWeek(today);
  const at = (offset: number) => addDays(week, offset);

  const shifts: Shift[] = [];
  const timeOffEarly = LEAVE_BLOCKS(at);
  for (const [weekOffset, suffix] of [[0, ''], [7, '-w1']] as const) {
    for (const [staffId, days] of Object.entries(PATTERN)) {
      for (const [dayIdx, key] of Object.entries(days)) {
        const date = at(weekOffset + Number(dayIdx));
        // Next week starts from the same pattern, minus anyone already approved to be away.
        if (weekOffset > 0 && timeOffEarly.some((b) => b.staffId === staffId && b.start <= date && date <= b.end)) continue;
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
    {id: 'sh-open-4', date: at(10), start: '15:00', end: '23:00', breakMin: 30, dept: 'kitchen', position: 'Sous chef', staffId: null, note: 'Covers Aiko’s holiday'},
    {id: 'sh-open-5', date: at(12), start: '16:00', end: '23:30', breakMin: 30, dept: 'service', position: 'Server', staffId: null, note: 'Two large bookings'},
    {id: 'sh-open-6', date: at(13), start: '09:00', end: '17:00', breakMin: 30, dept: 'kitchen', position: 'Line cook', staffId: null, note: 'Sunday brunch'},
  );

  const timeOff: TimeOff[] = [
    {id: 'to-1', staffId: 'st-aiko', type: 'holiday', start: at(7), end: at(11), note: 'Family trip to Lisbon', status: 'approved', createdAt: addDays(today, -21)},
    {id: 'to-2', staffId: 'st-priya', type: 'holiday', start: at(4), end: at(6), note: 'Sister’s wedding, can swap shifts with Jonas', status: 'pending', createdAt: addDays(today, -2)},
    {id: 'to-3', staffId: 'st-lars', type: 'sick', start: at(1), end: at(1), note: 'Called in sick, doctor’s note to follow', status: 'approved', createdAt: today},
    {id: 'to-4', staffId: 'st-chloe', type: 'holiday', start: at(14), end: at(20), note: 'Exam week then a short break', status: 'pending', createdAt: addDays(today, -1)},
    {id: 'to-5', staffId: 'st-daan', type: 'holiday', start: at(11), end: at(13), note: 'Festival weekend', status: 'denied', createdAt: addDays(today, -9), decisionNote: 'Peak weekend, could you take the week after instead?'},
    {id: 'to-6', staffId: 'st-ibrahim', type: 'unpaid', start: at(9), end: at(9), note: 'Driving test', status: 'pending', createdAt: addDays(today, -3)},
    {id: 'to-7', staffId: 'st-marco', type: 'holiday', start: addDays(today, -30), end: addDays(today, -23), note: '', status: 'approved', createdAt: addDays(today, -60)},
  ];

  return {
    staff: STAFF,
    shifts,
    timeOff,
    settings: DEFAULT_SETTINGS,
    publishedWeeks: [addDays(week, -7)],
  };
}
