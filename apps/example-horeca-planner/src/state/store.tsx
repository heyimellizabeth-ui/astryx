import {createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode} from 'react';
import {addDays, startOfWeek, todayISO, weekDates} from '../lib/dates';
import {DEFAULT_VIEWER, buildSeed} from '../lib/seed';
import {type ISODate, type LeaveStatus, type PlannerData, type Settings, type Shift, type Staff, type TimeOff} from '../types';

export interface PlannerState {
  data: PlannerData;
  /** The staff id of the person the app is being used as. */
  viewerId: string;
}

export type Action =
  | {type: 'shift/save'; shift: Shift}
  | {type: 'shift/delete'; id: string}
  | {type: 'shift/assign'; id: string; staffId: string | null}
  | {type: 'leave/save'; leave: TimeOff}
  | {type: 'leave/delete'; id: string}
  | {type: 'leave/decide'; id: string; status: Exclude<LeaveStatus, 'pending'>; decisionNote?: string; releaseShifts: boolean}
  | {type: 'staff/save'; staff: Staff}
  | {type: 'staff/delete'; id: string}
  | {type: 'settings/save'; settings: Settings}
  | {type: 'week/publish'; weekStart: ISODate; published: boolean}
  | {type: 'week/copy'; from: ISODate; to: ISODate}
  | {type: 'week/clear'; weekStart: ISODate}
  | {type: 'viewer/set'; viewerId: string}
  | {type: 'reset'};

let counter = 0;
export function newId(prefix: string): string {
  counter += 1;
  const random = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${random}${counter}`;
}

function upsert<T extends {id: string}>(list: T[], item: T): T[] {
  return list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item];
}

export function reduce(state: PlannerState, action: Action): PlannerState {
  const {data} = state;
  const next = (patch: Partial<PlannerData>): PlannerState => ({...state, data: {...data, ...patch}});

  switch (action.type) {
    case 'shift/save':
      return next({shifts: upsert(data.shifts, action.shift)});
    case 'shift/delete':
      return next({shifts: data.shifts.filter((s) => s.id !== action.id)});
    case 'shift/assign':
      return next({shifts: data.shifts.map((s) => (s.id === action.id ? {...s, staffId: action.staffId, offered: false} : s))});
    case 'leave/save':
      return next({timeOff: upsert(data.timeOff, action.leave)});
    case 'leave/delete':
      return next({timeOff: data.timeOff.filter((t) => t.id !== action.id)});
    case 'leave/decide': {
      const request = data.timeOff.find((t) => t.id === action.id);
      if (!request) return state;
      const timeOff = data.timeOff.map((t) => (t.id === action.id ? {...t, status: action.status, decisionNote: action.decisionNote} : t));
      const shifts =
        action.status === 'approved' && action.releaseShifts
          ? data.shifts.map((s) => (s.staffId === request.staffId && s.date >= request.start && s.date <= request.end ? {...s, staffId: null, offered: false} : s))
          : data.shifts;
      return next({timeOff, shifts});
    }
    case 'staff/save':
      return next({staff: upsert(data.staff, action.staff)});
    case 'staff/delete': {
      const target = data.staff.find((s) => s.id === action.id);
      const admins = data.staff.filter((s) => s.role === 'admin');
      // The roster always keeps at least one administrator.
      if (!target || (target.role === 'admin' && admins.length <= 1)) return state;
      const remaining = data.staff.filter((s) => s.id !== action.id);
      return {
        ...next({
        staff: data.staff.filter((s) => s.id !== action.id),
        timeOff: data.timeOff.filter((t) => t.staffId !== action.id),
        shifts: data.shifts.map((s) => (s.staffId === action.id ? {...s, staffId: null, offered: false} : s)),
      }),
        viewerId: state.viewerId === action.id ? (remaining.find((s) => s.role === 'admin')?.id ?? DEFAULT_VIEWER) : state.viewerId,
      };
    }
    case 'settings/save':
      return next({settings: action.settings});
    case 'week/publish': {
      const rest = data.publishedWeeks.filter((w) => w !== action.weekStart);
      return next({publishedWeeks: action.published ? [...rest, action.weekStart] : rest});
    }
    case 'week/copy': {
      const target = new Set(weekDates(action.to));
      const source = new Set(weekDates(action.from));
      const copies = data.shifts
        .filter((s) => source.has(s.date))
        .map((s) => ({...s, offered: false, id: newId('sh'), date: addDays(s.date, 7 * weeksBetween(action.from, action.to))}));
      return next({shifts: [...data.shifts.filter((s) => !target.has(s.date)), ...copies]});
    }
    case 'week/clear': {
      const days = new Set(weekDates(action.weekStart));
      return next({shifts: data.shifts.filter((s) => !days.has(s.date))});
    }
    case 'viewer/set':
      return {...state, viewerId: action.viewerId};
    case 'reset':
      return {data: buildSeed(), viewerId: DEFAULT_VIEWER};
  }
}

function weeksBetween(from: ISODate, to: ISODate): number {
  return Math.round((Date.parse(to) - Date.parse(from)) / (7 * 86_400_000));
}

const STORAGE_KEY = 'mise.planner.v2';

function load(): PlannerState {
  const fresh: PlannerState = {data: buildSeed(), viewerId: DEFAULT_VIEWER};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fresh;
    const parsed = JSON.parse(raw) as Partial<PlannerState>;
    const d = parsed.data;
    if (!d || !Array.isArray(d.staff) || !Array.isArray(d.shifts) || !Array.isArray(d.timeOff) || !d.settings) return fresh;
    return {data: d, viewerId: typeof parsed.viewerId === 'string' ? parsed.viewerId : DEFAULT_VIEWER};
  } catch {
    return fresh;
  }
}

interface Ctx {
  state: PlannerState;
  dispatch: Dispatch<Action>;
}
const PlannerContext = createContext<Ctx | null>(null);

export function PlannerProvider({children}: {children: ReactNode}) {
  const [state, dispatch] = useReducer(reduce, undefined, load);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be unavailable (private window, quota). The planner still works for this visit.
    }
  }, [state]);

  const value = useMemo(() => ({state, dispatch}), [state]);
  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error('usePlanner must be used inside PlannerProvider');
  const {state, dispatch} = ctx;
  const viewer = state.data.staff.find((s) => s.id === state.viewerId) ?? state.data.staff.find((s) => s.role === 'admin') ?? null;
  const isManager = viewer?.role === 'admin';
  return {data: state.data, viewerId: viewer?.id ?? state.viewerId, viewer, isManager, dispatch};
}

export {startOfWeek, todayISO};
