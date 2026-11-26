import type {ISODate} from '../types';
import {dayNumber} from '../lib/dates';

export type Lang = 'en' | 'nl' | 'el';

export const LANGS: readonly {code: Lang; name: string; locale: string}[] = [
  {code: 'en', name: 'English', locale: 'en'},
  {code: 'nl', name: 'Nederlands', locale: 'nl-NL'},
  {code: 'el', name: 'Ελληνικά', locale: 'el-GR'},
];

export function localeOf(lang: Lang): string {
  return LANGS.find((l) => l.code === lang)?.locale ?? 'en';
}

function utc(iso: ISODate): Date {
  return new Date(dayNumber(iso) * 86_400_000);
}

export interface Formats {
  /** "9 Nov" */
  day: (iso: ISODate) => string;
  /** "Mon 9 Nov" */
  dayLong: (iso: ISODate) => string;
  /** "Mon" */
  weekdayShort: (iso: ISODate) => string;
  /** "Monday", for a weekday index where 0 is Monday. */
  weekdayName: (index: number) => string;
  /** "9 Nov to 13 Nov", with the year when it changes. */
  range: (start: ISODate, end: ISODate, to: string) => string;
  /** 7.5 hours as "7.5h". The unit comes from the language. */
  hours: (minutes: number, unit: string) => string;
  eur: (value: number) => string;
  eur2: (value: number) => string;
  number: (value: number) => string;
}

export function makeFormats(lang: Lang): Formats {
  const locale = localeOf(lang);
  const part = (opts: Intl.DateTimeFormatOptions, iso: ISODate, type: Intl.DateTimeFormatPartTypes): string =>
    new Intl.DateTimeFormat(locale, {...opts, timeZone: 'UTC'}).formatToParts(utc(iso)).find((p) => p.type === type)?.value ?? '';

  const weekdayShort = (iso: ISODate) => part({weekday: 'short'}, iso, 'weekday');
  const day = (iso: ISODate) => `${Number(iso.slice(8))} ${part({month: 'short'}, iso, 'month')}`;
  const nf = new Intl.NumberFormat(locale, {maximumFractionDigits: 1});
  const money = (digits: number) => new Intl.NumberFormat(locale, {style: 'currency', currency: 'EUR', minimumFractionDigits: digits, maximumFractionDigits: digits});
  const whole = money(0);
  const cents = money(2);

  return {
    day,
    dayLong: (iso) => `${weekdayShort(iso)} ${day(iso)}`,
    weekdayShort,
    // 2024-01-01 is a Monday.
    weekdayName: (index) => part({weekday: 'long'}, new Date(Date.UTC(2024, 0, 1 + index)).toISOString().slice(0, 10), 'weekday'),
    range: (start, end, to) => {
      if (start === end) return `${weekdayShort(start)} ${day(start)}`;
      const year = start.slice(0, 4) === end.slice(0, 4) ? '' : ` ${end.slice(0, 4)}`;
      return `${day(start)} ${to} ${day(end)}${year}`;
    },
    hours: (minutes, unit) => `${nf.format(minutes / 60)}${unit}`,
    eur: (v) => whole.format(v),
    eur2: (v) => cents.format(v),
    number: (v) => nf.format(v),
  };
}
