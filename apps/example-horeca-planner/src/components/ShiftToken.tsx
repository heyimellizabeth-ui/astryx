import {Icon} from '@astryxdesign/core/Icon';
import {Text} from '@astryxdesign/core/Text';
import {Token} from '@astryxdesign/core/Token';
import {Tooltip} from '@astryxdesign/core/Tooltip';
import {VStack} from '@astryxdesign/core/VStack';
import {useI18n} from '../i18n/I18nProvider';
import {shiftIssues} from '../lib/rules';
import type {PlannerData, Shift} from '../types';
import {DEPT_COLOR, shiftTime} from './shared';

interface Props {
  shift: Shift;
  data: PlannerData;
  onOpen: (s: Shift) => void;
  canOpen: boolean;
  /** For an open shift in a narrow cell: the time in the token and the position beneath it. */
  stacked?: boolean;
}

export function ShiftToken({shift, data, onOpen, canOpen, stacked = false}: Props) {
  const {t, data: text, issue} = useI18n();
  const issues = shiftIssues(shift, data);
  const messages = issues.map(issue);
  const hasError = issues.some((i) => i.severity === 'error');
  const time = shiftTime(shift);
  const showPosition = !shift.staffId && !stacked;
  const label = showPosition ? `${text(shift.position)} ${time}` : shift.offered ? t('token.offered', {time}) : time;
  const token = (
    <Token
      size="sm"
      color={hasError ? 'red' : DEPT_COLOR[shift.dept]}
      label={label}
      icon={issues.length > 0 ? <Icon icon="warning" /> : undefined}
      description={[...messages, text(shift.note)].filter(Boolean).join('. ') || undefined}
      onClick={canOpen ? () => onOpen(shift) : undefined}
    />
  );
  const tip = [...messages, text(shift.note)].filter(Boolean).join(' · ');
  const withTip = tip ? <Tooltip content={tip}>{token}</Tooltip> : token;
  if (!shift.staffId && stacked) {
    return (
      <VStack gap={0.5} hAlign="start">
        {withTip}
        <Text type="supporting" maxLines={1}>
          {text(shift.position)}
        </Text>
      </VStack>
    );
  }
  return withTip;
}
