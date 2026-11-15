import type {ISODateString} from '@astryxdesign/core/Calendar';
import type {ISOTimeString} from '@astryxdesign/core/TimeInput';

/** Astryx brands its date and time strings. Values here are validated with isISODate and isHhmm before they reach a field. */
export const asDateValue = (iso: string): ISODateString => iso as ISODateString;
export const asTimeValue = (hhmm: string): ISOTimeString => hhmm as ISOTimeString;
