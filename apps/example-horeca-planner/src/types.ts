export type ISODate = string; // YYYY-MM-DD
export type Hhmm = string; // HH:MM, 24h

export type Dept = 'kitchen' | 'service' | 'bar';

export interface Staff {
  id: string;
  name: string;
  position: string;
  dept: Dept;
  /** Contracted hours per week. */
  contractHours: number;
  /** Gross hourly cost in euros. */
  hourlyRate: number;
  /** Annual leave allowance in days. */
  leaveAllowance: number;
  /** Weekdays the person cannot work, 0 = Monday … 6 = Sunday. */
  unavailable: number[];
}

export interface Shift {
  id: string;
  date: ISODate;
  start: Hhmm;
  /** An end at or before the start means the shift runs past midnight. */
  end: Hhmm;
  breakMin: number;
  dept: Dept;
  position: string;
  /** null = open shift, nobody assigned yet. */
  staffId: string | null;
  note?: string;
  /** The assigned person put this shift on the open board. They keep it until a colleague takes it. */
  offered?: boolean;
}

export type LeaveType = 'holiday' | 'sick' | 'unpaid' | 'other';
export type LeaveStatus = 'pending' | 'approved' | 'denied';

export interface TimeOff {
  id: string;
  staffId: string;
  type: LeaveType;
  start: ISODate;
  end: ISODate;
  note: string;
  status: LeaveStatus;
  createdAt: ISODate;
  decisionNote?: string;
}

export interface Settings {
  minRestHours: number;
  maxWeeklyHours: number;
  weeklyBudget: number;
  /** Weekdays the restaurant is closed, 0 = Monday. */
  closedDays: number[];
  /** Minimum people scheduled per department per open day. */
  targets: Record<Dept, {weekday: number; weekend: number}>;
}

export interface PlannerData {
  staff: Staff[];
  shifts: Shift[];
  timeOff: TimeOff[];
  settings: Settings;
  /** Week-start dates (Mondays) whose roster has been published to staff. */
  publishedWeeks: ISODate[];
}

export const DEPT_LABEL: Record<Dept, string> = {
  kitchen: 'Kitchen',
  service: 'Service',
  bar: 'Bar',
};

export const LEAVE_LABEL: Record<LeaveType, string> = {
  holiday: 'Holiday',
  sick: 'Sick leave',
  unpaid: 'Unpaid',
  other: 'Other',
};

export const MANAGER = 'manager';
