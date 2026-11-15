import {Icon} from '@astryxdesign/core/Icon';
import {Token} from '@astryxdesign/core/Token';
import {Tooltip} from '@astryxdesign/core/Tooltip';
import {shiftIssues} from '../lib/rules';
import type {PlannerData, Shift} from '../types';
import {DEPT_COLOR, shiftTime} from './shared';

export function ShiftToken({shift, data, onOpen, canOpen}: {shift: Shift; data: PlannerData; onOpen: (s: Shift) => void; canOpen: boolean}) {
  const issues = shiftIssues(shift, data);
  const hasError = issues.some((i) => i.severity === 'error');
  const time = shiftTime(shift);
  const label = !shift.staffId ? `${shift.position} ${time}` : shift.offered ? `${time} · offered` : time;
  const token = (
    <Token
      size="sm"
      color={hasError ? 'red' : DEPT_COLOR[shift.dept]}
      label={label}
      icon={issues.length > 0 ? <Icon icon="warning" /> : undefined}
      description={[...issues.map((i) => i.message), shift.note].filter(Boolean).join('. ') || undefined}
      onClick={canOpen ? () => onOpen(shift) : undefined}
    />
  );
  const tip = [...issues.map((i) => i.message), shift.note].filter(Boolean).join(' · ');
  return tip ? <Tooltip content={tip}>{token}</Tooltip> : token;
}
