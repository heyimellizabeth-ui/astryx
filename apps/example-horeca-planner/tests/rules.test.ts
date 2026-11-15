import {describe, expect, it} from 'vitest';
import {buildSeed} from '../src/lib/seed';
import {candidatesFor, coverageFor, isOnBoard, leaveDays, requiredFor, shiftIssues, shiftSpan, shiftsInRange, staffWeekMinutes, summariseWeek, weekLabourCost} from '../src/lib/rules';
import type {PlannerData, Shift} from '../src/types';

// 2026-11-09 is a Monday; the seed builds its roster for the week containing "today".
const TODAY = '2026-11-11';
const WEEK = '2026-11-09';
const seed = (): PlannerData => buildSeed(TODAY);
const shift = (id: string, d: PlannerData): Shift => {
  const s = d.shifts.find((x) => x.id === id);
  if (!s) throw new Error(`missing shift ${id}`);
  return s;
};

describe('shiftIssues', () => {
  it('flags a shift on approved leave as an error', () => {
    const d = seed();
    const issues = shiftIssues(shift('sh-lars-1', d), d);
    expect(issues.map((i) => i.kind)).toContain('leave');
    expect(issues.find((i) => i.kind === 'leave')?.severity).toBe('error');
  });

  it('flags a shift on a day with a pending request as a warning', () => {
    const d = seed();
    const issues = shiftIssues(shift('sh-priya-4', d), d);
    expect(issues).toEqual([expect.objectContaining({kind: 'leave-pending', severity: 'warning'})]);
  });

  it('warns about too little rest after a close that runs past midnight', () => {
    const d = seed();
    const issues = shiftIssues(shift('sh-jonas-5', d), d);
    expect(issues.some((i) => i.kind === 'rest' && i.message.includes('10.5h'))).toBe(true);
  });

  it('reports overlapping shifts for the same person', () => {
    const d = seed();
    const clash: Shift = {...shift('sh-marco-1', d), id: 'extra', start: '12:00', end: '20:00'};
    const issues = shiftIssues(clash, {...d, shifts: [...d.shifts, clash]});
    expect(issues.some((i) => i.kind === 'overlap' && i.severity === 'error')).toBe(true);
  });

  it('warns when scheduled on a weekday the person cannot work', () => {
    const d = seed();
    const sunday: Shift = {...shift('sh-open-1', d), id: 'sun', staffId: 'st-daan', date: '2026-11-15'};
    expect(shiftIssues(sunday, {...d, shifts: [...d.shifts, sunday]}).some((i) => i.kind === 'unavailable')).toBe(true);
  });

  it('has nothing to say about an open shift', () => {
    const d = seed();
    expect(shiftIssues(shift('sh-open-1', d), d)).toEqual([]);
  });

  it('measures shifts that cross midnight as ending the next day', () => {
    const [start, end] = shiftSpan({date: '2026-11-13', start: '17:00', end: '00:30'});
    expect(end - start).toBe(450);
  });
});

describe('hours and cost', () => {
  it('adds up paid hours per person for a week', () => {
    const d = seed();
    expect(staffWeekMinutes('st-marco', d.shifts, WEEK)).toBe(5 * 450);
    expect(staffWeekMinutes('st-marco', d.shifts, '2026-11-30')).toBe(0);
  });

  it('prices only assigned shifts', () => {
    const d = seed();
    const withoutOpen = {...d, shifts: d.shifts.filter((s) => s.staffId)};
    expect(weekLabourCost(d.shifts, d.staff, WEEK)).toBeCloseTo(weekLabourCost(withoutOpen.shifts, d.staff, WEEK));
    expect(weekLabourCost(d.shifts, d.staff, WEEK)).toBeGreaterThan(3000);
  });
});

describe('coverage', () => {
  it('needs nobody on closed days and more people at weekends', () => {
    const d = seed();
    expect(requiredFor('kitchen', '2026-11-09', d.settings)).toBe(0);
    expect(requiredFor('kitchen', '2026-11-10', d.settings)).toBe(2);
    expect(requiredFor('kitchen', '2026-11-14', d.settings)).toBe(3);
  });

  it('does not count someone on approved leave', () => {
    const d = seed();
    // Tuesday kitchen: Marco, plus Lars who is off sick.
    expect(coverageFor('kitchen', '2026-11-10', d)).toBe(1);
  });

  it('seeds next week without the people who are on approved leave', () => {
    const d = seed();
    const nextWeek = d.shifts.filter((x) => x.date >= '2026-11-16' && x.date <= '2026-11-22' && x.staffId === 'st-aiko');
    expect(nextWeek.map((x) => x.date)).toEqual(['2026-11-21', '2026-11-22']);
  });

  it('rolls a week up into counts for the summary', () => {
    const s = summariseWeek(seed(), WEEK);
    expect(s.conflicts).toBeGreaterThanOrEqual(1);
    expect(s.openShifts).toBe(3);
    expect(s.gaps).toBeGreaterThan(0);
  });
});

describe('leave', () => {
  it('counts approved and pending holiday days separately', () => {
    const d = seed();
    expect(leaveDays('st-marco', d.timeOff, 2026, 'approved')).toBe(8);
    expect(leaveDays('st-priya', d.timeOff, 2026, 'pending')).toBe(3);
    expect(leaveDays('st-priya', d.timeOff, 2026, 'approved')).toBe(0);
  });

  it('finds the shifts a request would clash with', () => {
    const d = seed();
    expect(shiftsInRange('st-priya', '2026-11-13', '2026-11-15', d.shifts)).toHaveLength(3);
    expect(shiftsInRange('st-priya', '2026-12-01', '2026-12-03', d.shifts)).toHaveLength(0);
  });
});

describe('open board', () => {
  it('lists open and offered shifts, not assigned ones', () => {
    expect(isOnBoard({staffId: null})).toBe(true);
    expect(isOnBoard({staffId: 'x', offered: true})).toBe(true);
    expect(isOnBoard({staffId: 'x'})).toBe(false);
  });

  it('rules out people who are on leave and ranks the same department first', () => {
    const d = seed();
    const sick = shift('sh-open-2', d);
    const onLeave: Shift = {...sick, date: '2026-11-10'};
    const ranked = candidatesFor(onLeave, {...d, shifts: [...d.shifts]});
    expect(ranked.find((c) => c.staff.id === 'st-lars')?.blocked).toBe(true);
    expect(ranked[0].blocked).toBe(false);
    expect(ranked[0].staff.dept).toBe('kitchen');
  });
});
