import {describe, expect, it} from 'vitest';
import {el, elData} from '../src/i18n/el';
import {en, enData} from '../src/i18n/en';
import {makeFormats} from '../src/i18n/format';
import {nl, nlData} from '../src/i18n/nl';
import {buildSeed} from '../src/lib/seed';

const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
const keys = Object.keys(en) as (keyof typeof en)[];

describe('translations', () => {
  it.each([
    ['nl', nl],
    ['el', el],
  ] as const)('%s has every key the English dictionary has, and nothing else', (_, messages) => {
    expect(Object.keys(messages).sort()).toEqual([...keys].sort());
  });

  it.each([
    ['nl', nl],
    ['el', el],
  ] as const)('%s keeps the same {placeholders} as English in every message', (_, messages) => {
    for (const key of keys) expect({key, p: placeholders(messages[key])}).toEqual({key, p: placeholders(en[key])});
  });

  it('gives every plural a singular and a plural form', () => {
    for (const messages of [en, nl, el]) {
      for (const key of Object.keys(messages)) {
        if (key.endsWith('.one')) expect(messages).toHaveProperty(key.replace(/\.one$/, '.other'));
        // `leave.other` is the "Other" leave type, not a plural form.
        if (key.endsWith('.other') && key !== 'leave.other') expect(messages).toHaveProperty(key.replace(/\.other$/, '.one'));
      }
    }
  });

  it('has no empty messages', () => {
    for (const messages of [en, nl, el]) for (const key of keys) expect(messages[key].trim()).not.toBe('');
  });

  it('translates every position and note the demo data uses', () => {
    const seed = buildSeed('2026-11-11');
    const texts = new Set<string>([
      ...seed.staff.map((s) => s.position),
      ...seed.shifts.map((s) => s.note ?? ''),
      ...seed.timeOff.flatMap((t) => [t.note, t.decisionNote ?? '']),
    ]);
    texts.delete('');
    for (const text of texts) {
      expect(nlData[text], `nl: ${text}`).toBeTruthy();
      expect(elData[text], `el: ${text}`).toBeTruthy();
    }
    expect(Object.keys(enData)).toHaveLength(0);
  });
});

describe('formats', () => {
  it('writes dates in the viewer’s language', () => {
    expect(makeFormats('en').dayLong('2026-11-09')).toBe('Mon 9 Nov');
    expect(makeFormats('nl').weekdayName(0).toLowerCase()).toBe('maandag');
    expect(makeFormats('el').weekdayName(0)).toBe('Δευτέρα');
    expect(makeFormats('nl').weekdayShort('2026-11-14').toLowerCase()).toContain('za');
  });

  it('formats hours, numbers and money with the local separators', () => {
    expect(makeFormats('en').hours(450, 'h')).toBe('7.5h');
    expect(makeFormats('nl').hours(450, 'u')).toBe('7,5u');
    expect(makeFormats('el').hours(450, 'ω')).toBe('7,5ω');
    expect(makeFormats('nl').eur(6473)).toContain('6.473');
  });
});
