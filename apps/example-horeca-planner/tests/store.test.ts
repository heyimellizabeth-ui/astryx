import {describe, expect, it} from 'vitest';
import {buildSeed} from '../src/lib/seed';
import {reduce, type PlannerState} from '../src/state/store';
import {MANAGER} from '../src/types';

const state = (): PlannerState => ({data: buildSeed('2026-11-11'), viewerId: MANAGER});

describe('planner reducer', () => {
  it('approving leave can release the shifts it covers to the open board', () => {
    const s = reduce(state(), {type: 'leave/decide', id: 'to-2', status: 'approved', releaseShifts: true});
    expect(s.data.timeOff.find((t) => t.id === 'to-2')?.status).toBe('approved');
    const priyaShifts = s.data.shifts.filter((x) => x.staffId === 'st-priya' && x.date >= '2026-11-13' && x.date <= '2026-11-15');
    expect(priyaShifts).toHaveLength(0);
  });

  it('approving without release keeps the shifts assigned', () => {
    const s = reduce(state(), {type: 'leave/decide', id: 'to-2', status: 'approved', releaseShifts: false});
    expect(s.data.shifts.filter((x) => x.staffId === 'st-priya' && x.date <= '2026-11-15')).toHaveLength(4);
  });

  it('declining never touches the roster and keeps the note', () => {
    const before = state();
    const s = reduce(before, {type: 'leave/decide', id: 'to-2', status: 'denied', decisionNote: 'Peak weekend', releaseShifts: true});
    expect(s.data.shifts).toEqual(before.data.shifts);
    expect(s.data.timeOff.find((t) => t.id === 'to-2')?.decisionNote).toBe('Peak weekend');
  });

  it('assigning a shift clears its offered flag', () => {
    const s0 = reduce(state(), {type: 'shift/save', shift: {...state().data.shifts[0], offered: true}});
    const id = s0.data.shifts[0].id;
    const s1 = reduce(s0, {type: 'shift/assign', id, staffId: 'st-nadia'});
    expect(s1.data.shifts.find((x) => x.id === id)).toMatchObject({staffId: 'st-nadia', offered: false});
  });

  it('copies a week forward, replacing what was there', () => {
    const s = reduce(state(), {type: 'week/copy', from: '2026-11-09', to: '2026-11-16'});
    const next = s.data.shifts.filter((x) => x.date >= '2026-11-16' && x.date <= '2026-11-22');
    const current = s.data.shifts.filter((x) => x.date >= '2026-11-09' && x.date <= '2026-11-15');
    expect(next).toHaveLength(current.length);
    const again = reduce(s, {type: 'week/copy', from: '2026-11-09', to: '2026-11-16'});
    expect(again.data.shifts).toHaveLength(s.data.shifts.length);
  });

  it('removing a person opens their shifts, drops their leave and resets the viewer', () => {
    const as: PlannerState = {...state(), viewerId: 'st-priya'};
    const s = reduce(as, {type: 'staff/delete', id: 'st-priya'});
    expect(s.data.staff.some((x) => x.id === 'st-priya')).toBe(false);
    expect(s.data.shifts.filter((x) => x.staffId === 'st-priya')).toHaveLength(0);
    expect(s.data.timeOff.some((t) => t.staffId === 'st-priya')).toBe(false);
    expect(s.viewerId).toBe(MANAGER);
  });

  it('publishes and unpublishes a week', () => {
    const on = reduce(state(), {type: 'week/publish', weekStart: '2026-11-09', published: true});
    expect(on.data.publishedWeeks).toContain('2026-11-09');
    const off = reduce(on, {type: 'week/publish', weekStart: '2026-11-09', published: false});
    expect(off.data.publishedWeeks).not.toContain('2026-11-09');
  });

  it('clears a week and deletes single shifts and leave', () => {
    const cleared = reduce(state(), {type: 'week/clear', weekStart: '2026-11-09'});
    expect(cleared.data.shifts.filter((x) => x.date <= '2026-11-15')).toHaveLength(0);
    expect(cleared.data.shifts.some((x) => x.date > '2026-11-15')).toBe(true);
    const one = reduce(state(), {type: 'shift/delete', id: 'sh-marco-1'});
    expect(one.data.shifts.some((x) => x.id === 'sh-marco-1')).toBe(false);
    const gone = reduce(state(), {type: 'leave/delete', id: 'to-1'});
    expect(gone.data.timeOff.some((t) => t.id === 'to-1')).toBe(false);
  });

  it('saves settings and staff, and switches the viewer', () => {
    const s0 = state();
    const s1 = reduce(s0, {type: 'settings/save', settings: {...s0.data.settings, weeklyBudget: 1}});
    expect(s1.data.settings.weeklyBudget).toBe(1);
    const s2 = reduce(s1, {type: 'staff/save', staff: {...s1.data.staff[0], name: 'Renamed'}});
    expect(s2.data.staff[0].name).toBe('Renamed');
    expect(reduce(s2, {type: 'viewer/set', viewerId: 'st-aiko'}).viewerId).toBe('st-aiko');
    expect(reduce({...s2, viewerId: 'st-aiko'}, {type: 'reset'}).viewerId).toBe(MANAGER);
  });
});
