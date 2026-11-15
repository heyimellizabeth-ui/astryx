import {Avatar} from '@astryxdesign/core/Avatar';
import {HStack} from '@astryxdesign/core/HStack';
import {VStack} from '@astryxdesign/core/VStack';
import {Text} from '@astryxdesign/core/Text';
import {useToast} from '@astryxdesign/core/Toast';
import type {Dept, Shift, Staff} from '../types';

type TokenColor = 'orange' | 'blue' | 'purple';
export const DEPT_COLOR: Record<Dept, TokenColor> = {
  kitchen: 'orange',
  service: 'blue',
  bar: 'purple',
};

export function shiftTime(shift: Pick<Shift, 'start' | 'end'>): string {
  return `${shift.start}-${shift.end}`;
}

export function PersonCell({staff, caption}: {staff: Staff; caption?: string}) {
  return (
    <HStack gap={2} align="center">
      <Avatar name={staff.name} size="sm" tooltip={false} />
      <VStack>
        <Text weight="semibold" maxLines={1}>
          {staff.name}
        </Text>
        <Text type="supporting" maxLines={1}>
          {caption ?? staff.position}
        </Text>
      </VStack>
    </HStack>
  );
}

export function useNotify() {
  const showToast = useToast();
  return {
    ok: (body: string) => showToast({body}),
    fail: (body: string) => showToast({body, type: 'error'}),
  };
}

export const eur = new Intl.NumberFormat('en-IE', {style: 'currency', currency: 'EUR', maximumFractionDigits: 0});
export const eur2 = new Intl.NumberFormat('en-IE', {style: 'currency', currency: 'EUR'});
