import {createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode} from 'react';
import {InternationalizationProvider} from '@astryxdesign/core/i18n';
import elGR from '@astryxdesign/core/locales/el-GR.generated.js';
import nlNL from '@astryxdesign/core/locales/nl-NL.generated.js';
import type {Issue} from '../lib/rules';
import type {Dept, LeaveStatus, LeaveType} from '../types';
import {en, enData, type DataText, type MessageKey, type Messages, type PluralBase} from './en';
import {el, elData} from './el';
import {LANGS, localeOf, makeFormats, type Formats, type Lang} from './format';
import {nl, nlData} from './nl';

const MESSAGES: Record<Lang, Messages> = {en, nl, el};
const DATA: Record<Lang, DataText> = {en: enData, nl: nlData, el: elData};
const STORAGE_KEY = 'mise.lang';

type Params = Record<string, string | number | undefined>;

export interface I18n {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: MessageKey, params?: Params) => string;
  /** Picks the singular or plural sentence for `count` and fills `{n}`. */
  tn: (base: PluralBase, count: number, params?: Params) => string;
  /** Seed names and notes in the viewer's language. Text a person typed passes through unchanged. */
  data: (text: string | undefined) => string;
  fmt: Formats;
  /** 450 minutes as "7.5h", "7,5u" or "7,5ω". */
  hours: (minutes: number) => string;
  issue: (issue: Issue) => string;
  dept: (dept: Dept) => string;
  leaveType: (type: LeaveType) => string;
  status: (status: LeaveStatus) => string;
}

const Ctx = createContext<I18n | null>(null);

function fill(template: string, params: Params = {}): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? ''));
}

function initialLang(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (LANGS.some((l) => l.code === saved)) return saved as Lang;
  } catch {
    // Storage can be unavailable. Fall through to the browser language.
  }
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.slice(0, 2).toLowerCase();
    if (base === 'nl' || base === 'el') return base;
  }
  return 'en';
}

export function I18nProvider({children}: {children: ReactNode}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = localeOf(lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The choice still applies for this visit.
    }
  }, []);

  const value = useMemo<I18n>(() => {
    const messages = MESSAGES[lang];
    const fmt = makeFormats(lang);
    const rules = new Intl.PluralRules(localeOf(lang));
    const t: I18n['t'] = (key, params) => fill(messages[key], params);
    const hours = (minutes: number) => fmt.hours(minutes, messages['common.unit.h']);
    return {
      lang,
      setLang,
      t,
      tn: (base, count, params) => {
        const key = `${base}.${rules.select(count) === 'one' ? 'one' : 'other'}` as MessageKey;
        return fill(messages[key], {n: fmt.number(count), ...params});
      },
      data: (text) => (text ? (DATA[lang][text] ?? text) : ''),
      fmt,
      hours,
      issue: (issue) => {
        const {name, gapMinutes, minMinutes} = issue.params;
        const key = issue.kind === 'leave-pending' ? 'issue.leavePending' : (`issue.${issue.kind}` as MessageKey);
        return fill(messages[key], {name, hours: hours(gapMinutes ?? 0), min: hours(minMinutes ?? 0)});
      },
      dept: (d) => messages[`dept.${d}`],
      leaveType: (type) => messages[`leave.${type}`],
      status: (status) => messages[`status.${status}`],
    };
  }, [lang, setLang]);

  return (
    <Ctx.Provider value={value}>
      <InternationalizationProvider locale={localeOf(lang)} messages={{'nl-NL': nlNL, 'el-GR': elGR}}>
        {children}
      </InternationalizationProvider>
    </Ctx.Provider>
  );
}

export function useI18n(): I18n {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
