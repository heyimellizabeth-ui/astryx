import {describe, expect, it} from 'vitest';
import {makeFormats} from '../src/i18n/format';
import {addDays, daysInclusive, eachDay, isHhmm, isISODate, shiftMinutes, startOfWeek, weekdayIndex, weekDates} from '../src/lib/dates';

describe('dates', () => {
  it('finds the Monday that starts a week, including from a Sunday', () => {
    expect(startOfWeek('2026-11-15')).toBe('2026-11-09'); // Sunday
    expect(startOfWeek('2026-11-09')).toBe('2026-11-09'); // Monday
  });

  it('returns seven consecutive days for a week', () => {
    const days = weekDates('2026-11-09');
    expect(days).toHaveLength(7);
    expect(days[6]).toBe('2026-11-15');
  });

  it('adds days across month and year boundaries and across daylight saving', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-28', 2)).toBe('2026-03-30');
    expect(addDays('2026-10-24', 2)).toBe('2026-10-26');
  });

  it('indexes weekdays from Monday', () => {
    expect(weekdayIndex('2026-11-09')).toBe(0);
    expect(weekdayIndex('2026-11-15')).toBe(6);
  });

  it('counts calendar days inclusively and lists them', () => {
    expect(daysInclusive('2026-11-09', '2026-11-09')).toBe(1);
    expect(daysInclusive('2026-11-09', '2026-11-15')).toBe(7);
    expect(daysInclusive('2026-11-15', '2026-11-09')).toBe(0);
    expect(eachDay('2026-02-27', '2026-03-01')).toEqual(['2026-02-27', '2026-02-28', '2026-03-01']);
  });

  it('validates ISO dates and times', () => {
    expect(isISODate('2026-02-30')).toBe(false);
    expect(isISODate('2026-02-28')).toBe(true);
    expect(isISODate('nope')).toBe(false);
    expect(isHhmm('23:59')).toBe(true);
    expect(isHhmm('24:00')).toBe(false);
  });

  it('computes paid minutes, including shifts that end after midnight', () => {
    expect(shiftMinutes('16:00', '23:30', 30)).toBe(420);
    expect(shiftMinutes('17:00', '00:30', 30)).toBe(420);
    expect(shiftMinutes('09:00', '09:30', 60)).toBe(0);
  });

  it('formats ranges, adding the year only when it changes', () => {
    const {range} = makeFormats('en');
    expect(range('2026-11-09', '2026-11-09', 'to')).toBe('Mon 9 Nov');
    expect(range('2026-11-09', '2026-11-13', 'to')).toBe('9 Nov to 13 Nov');
    expect(range('2026-12-30', '2027-01-02', 'to')).toBe('30 Dec to 2 Jan 2027');
  });
});
