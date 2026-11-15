import type {Dept, Hhmm, ISODate, PlannerData, Settings, Shift, Staff, TimeOff} from '../types';
import {dayNumber, eachDay, shiftMinutes, toMinutes, weekDates, weekdayIndex} from './dates';

export type Severity = 'error' | 'warning';
export interface Issue {
  kind: 'leave' | 'leave-pending' | 'overlap' | 'rest' | 'unavailable';
  severity: Severity;
  message: string;
}

/** Absolute start and end of a shift in minutes since 1970, so midnight crossings compare correctly. */
export function shiftSpan(shift: Pick<Shift, 'date' | 'start' | 'end'>): [number, number] {
  const base = dayNumber(shift.date) * 1440;
  const start = base + toMinutes(shift.start);
  let end = base + toMinutes(shift.end);
  if (end <= start) end += 1440;
  return [start, end];
}

export function leaveCovering(staffId: string, date: ISODate, timeOff: TimeOff[], status: TimeOff['status']): TimeOff | undefined {
  return timeOff.find((t) => t.staffId === staffId && t.status === status && t.start <= date && date <= t.end);
}

/** Problems with one assigned shift. Open shifts have none. */
export function shiftIssues(shift: Shift, data: Pick<PlannerData, 'staff' | 'shifts' | 'timeOff' | 'settings'>): Issue[] {
  if (!shift.staffId) return [];
  const person = data.staff.find((s) => s.id === shift.staffId);
  const issues: Issue[] = [];

  const approved = leaveCovering(shift.staffId, shift.date, data.timeOff, 'approved');
  if (approved) {
    issues.push({kind: 'leave', severity: 'error', message: `${person?.name ?? 'Staff'} is on approved leave`});
  } else if (leaveCovering(shift.staffId, shift.date, data.timeOff, 'pending')) {
    issues.push({kind: 'leave-pending', severity: 'warning', message: 'A leave request for this day is still pending'});
  }

  if (person?.unavailable.includes(weekdayIndex(shift.date))) {
    issues.push({kind: 'unavailable', severity: 'warning', message: 'Marked unavailable on this weekday'});
  }

  const [start, end] = shiftSpan(shift);
  const minRest = data.settings.minRestHours * 60;
  for (const other of data.shifts) {
    if (other.id === shift.id || other.staffId !== shift.staffId) continue;
    const [os, oe] = shiftSpan(other);
    if (os < end && start < oe) {
      issues.push({kind: 'overlap', severity: 'error', message: 'Overlaps another shift'});
    } else {
      const gap = os >= end ? os - end : start - oe;
      if (gap < minRest && gap >= 0 && Math.abs(dayNumber(other.date) - dayNumber(shift.date)) <= 1) {
        issues.push({
          kind: 'rest',
          severity: 'warning',
          message: `Only ${(gap / 60).toFixed(1)}h rest next to another shift (minimum ${data.settings.minRestHours}h)`,
        });
      }
    }
  }
  return dedupe(issues);
}

function dedupe(issues: Issue[]): Issue[] {
  const seen = new Set<string>();
  return issues.filter((i) => {
    const key = `${i.kind}:${i.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function weekShifts(shifts: Shift[], weekStart: ISODate): Shift[] {
  const days = new Set(weekDates(weekStart));
  return shifts.filter((s) => days.has(s.date));
}

export function paidMinutes(shift: Pick<Shift, 'start' | 'end' | 'breakMin'>): number {
  return shiftMinutes(shift.start, shift.end, shift.breakMin);
}

export function staffWeekMinutes(staffId: string, shifts: Shift[], weekStart: ISODate): number {
  return weekShifts(shifts, weekStart)
    .filter((s) => s.staffId === staffId)
    .reduce((sum, s) => sum + paidMinutes(s), 0);
}

export function weekLabourCost(shifts: Shift[], staff: Staff[], weekStart: ISODate): number {
  const rate = new Map(staff.map((s) => [s.id, s.hourlyRate]));
  return weekShifts(shifts, weekStart).reduce((sum, s) => {
    if (!s.staffId) return sum;
    return sum + (paidMinutes(s) / 60) * (rate.get(s.staffId) ?? 0);
  }, 0);
}

export function requiredFor(dept: Dept, date: ISODate, settings: Settings): number {
  const idx = weekdayIndex(date);
  if (settings.closedDays.includes(idx)) return 0;
  const t = settings.targets[dept];
  return idx >= 4 ? t.weekend : t.weekday;
}

/** People on the roster for a department that day, not counting anyone on approved leave. */
export function coverageFor(dept: Dept, date: ISODate, data: Pick<PlannerData, 'shifts' | 'timeOff'>): number {
  const people = new Set<string>();
  for (const s of data.shifts) {
    if (s.date !== date || s.dept !== dept || !s.staffId) continue;
    if (leaveCovering(s.staffId, date, data.timeOff, 'approved')) continue;
    people.add(s.staffId);
  }
  return people.size;
}

export interface WeekSummary {
  hours: number;
  cost: number;
  openShifts: number;
  conflicts: number;
  warnings: number;
  gaps: number;
}

export function summariseWeek(data: PlannerData, weekStart: ISODate): WeekSummary {
  const shifts = weekShifts(data.shifts, weekStart);
  let conflicts = 0;
  let warnings = 0;
  for (const s of shifts) {
    for (const issue of shiftIssues(s, data)) {
      if (issue.severity === 'error') conflicts++;
      else warnings++;
    }
  }
  let gaps = 0;
  for (const date of weekDates(weekStart)) {
    for (const dept of ['kitchen', 'service', 'bar'] as const) {
      if (coverageFor(dept, date, data) < requiredFor(dept, date, data.settings)) gaps++;
    }
  }
  return {
    hours: shifts.reduce((m, s) => m + (s.staffId ? paidMinutes(s) : 0), 0) / 60,
    cost: weekLabourCost(data.shifts, data.staff, weekStart),
    openShifts: shifts.filter(isOnBoard).length,
    conflicts,
    warnings,
    gaps,
  };
}

/** Calendar days of leave of one type a person has taken or booked in a year. */
export function leaveDays(staffId: string, timeOff: TimeOff[], year: number, status: TimeOff['status'], type: TimeOff['type'] = 'holiday'): number {
  let total = 0;
  for (const t of timeOff) {
    if (t.staffId !== staffId || t.status !== status || t.type !== type) continue;
    total += eachDay(t.start, t.end).filter((d) => d.startsWith(String(year))).length;
  }
  return total;
}

/** Shifts a leave request would clash with, so the manager sees the cost of saying yes. */
export function shiftsInRange(staffId: string, start: ISODate, end: ISODate, shifts: Shift[]): Shift[] {
  return shifts.filter((s) => s.staffId === staffId && s.date >= start && s.date <= end);
}

export function isValidTimeRange(start: Hhmm, end: Hhmm): boolean {
  return start !== end;
}

/** Open shifts and shifts someone has offered up: everything a colleague could pick up. */
export function isOnBoard(shift: Pick<Shift, 'staffId' | 'offered'>): boolean {
  return !shift.staffId || Boolean(shift.offered);
}

export interface Candidate {
  staff: Staff;
  issues: Issue[];
  /** Hard conflicts (leave, overlap) rule a person out. Warnings only inform. */
  blocked: boolean;
}

/** Everyone who could take a shift, with what would go wrong if they did. */
export function candidatesFor(shift: Shift, data: PlannerData): Candidate[] {
  return data.staff
    .filter((s) => s.id !== shift.staffId)
    .map((s) => {
      const hypothetical: Shift = {...shift, staffId: s.id, offered: false};
      const issues = shiftIssues(hypothetical, {...data, shifts: data.shifts.filter((x) => x.id !== shift.id)});
      return {staff: s, issues, blocked: issues.some((i) => i.severity === 'error')};
    })
    .sort((a, b) => Number(a.blocked) - Number(b.blocked) || Number(b.staff.dept === shift.dept) - Number(a.staff.dept === shift.dept) || a.staff.name.localeCompare(b.staff.name));
}

export function upcomingOnBoard(shifts: Shift[], today: ISODate): Shift[] {
  return shifts.filter((s) => isOnBoard(s) && s.date >= today);
}
