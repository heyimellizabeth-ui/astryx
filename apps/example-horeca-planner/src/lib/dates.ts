import type {Hhmm, ISODate} from '../types';

const DAY_MS = 86_400_000;
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parts(iso: ISODate): [number, number, number] {
  const [y, m, d] = iso.split('-').map(Number);
  return [y, m - 1, d];
}

/** Days since 1970-01-01, computed in UTC so daylight saving never shifts a day. */
export function dayNumber(iso: ISODate): number {
  const [y, m, d] = parts(iso);
  return Math.round(Date.UTC(y, m, d) / DAY_MS);
}

export function fromDayNumber(n: number): ISODate {
  return new Date(n * DAY_MS).toISOString().slice(0, 10);
}

export function addDays(iso: ISODate, n: number): ISODate {
  return fromDayNumber(dayNumber(iso) + n);
}

/** 0 = Monday … 6 = Sunday. */
export function weekdayIndex(iso: ISODate): number {
  const [y, m, d] = parts(iso);
  return (new Date(Date.UTC(y, m, d)).getUTCDay() + 6) % 7;
}

export function startOfWeek(iso: ISODate): ISODate {
  return addDays(iso, -weekdayIndex(iso));
}

export function weekDates(weekStart: ISODate): ISODate[] {
  return Array.from({length: 7}, (_, i) => addDays(weekStart, i));
}

export function todayISO(now: Date = new Date()): ISODate {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function isISODate(value: unknown): value is ISODate {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && fromDayNumber(dayNumber(value)) === value;
}

export function eachDay(start: ISODate, end: ISODate): ISODate[] {
  const out: ISODate[] = [];
  for (let n = dayNumber(start); n <= dayNumber(end); n++) out.push(fromDayNumber(n));
  return out;
}

/** Inclusive number of calendar days between two dates. */
export function daysInclusive(start: ISODate, end: ISODate): number {
  return Math.max(0, dayNumber(end) - dayNumber(start) + 1);
}

export function weekdayShort(iso: ISODate): string {
  return WEEKDAYS[weekdayIndex(iso)];
}

export function weekdayName(index: number): string {
  return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index];
}

export function formatDay(iso: ISODate): string {
  const [, m, d] = parts(iso);
  return `${d} ${MONTHS[m]}`;
}

export function formatDayLong(iso: ISODate): string {
  return `${weekdayShort(iso)} ${formatDay(iso)}`;
}

export function formatRange(start: ISODate, end: ISODate): string {
  if (start === end) return formatDayLong(start);
  const [sy] = parts(start);
  const [ey] = parts(end);
  const year = sy === ey ? '' : ` ${ey}`;
  return `${formatDay(start)} to ${formatDay(end)}${year}`;
}

export function toMinutes(time: Hhmm): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function isHhmm(value: unknown): value is Hhmm {
  return typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

/** Paid minutes of a shift: duration minus the unpaid break. */
export function shiftMinutes(start: Hhmm, end: Hhmm, breakMin: number): number {
  let span = toMinutes(end) - toMinutes(start);
  if (span <= 0) span += 1440;
  return Math.max(0, span - breakMin);
}

export function formatHours(minutes: number): string {
  const h = minutes / 60;
  return Number.isInteger(h) ? `${h}h` : `${h.toFixed(1)}h`;
}
