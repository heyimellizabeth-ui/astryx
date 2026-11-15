import {useState} from 'react';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {HStack} from '@astryxdesign/core/HStack';
import {Layout, LayoutContent, LayoutFooter} from '@astryxdesign/core/Layout';
import {Switch} from '@astryxdesign/core/Switch';
import {Text} from '@astryxdesign/core/Text';
import {TextArea} from '@astryxdesign/core/TextArea';
import {VStack} from '@astryxdesign/core/VStack';
import {formatRange} from '../lib/dates';
import {shiftsInRange} from '../lib/rules';
import {usePlanner} from '../state/store';
import {LEAVE_LABEL, type TimeOff} from '../types';
import {useNotify} from './shared';

interface Props {
  request: TimeOff;
  decision: 'approved' | 'denied';
  onClose: () => void;
}

export function DecisionDialog({request, decision, onClose}: Props) {
  const {data, dispatch} = usePlanner();
  const notify = useNotify();
  const person = data.staff.find((s) => s.id === request.staffId);
  const affected = shiftsInRange(request.staffId, request.start, request.end, data.shifts);
  const [release, setRelease] = useState(true);
  const [note, setNote] = useState('');
  const approving = decision === 'approved';

  function confirm() {
    dispatch({type: 'leave/decide', id: request.id, status: decision, decisionNote: note.trim() || undefined, releaseShifts: approving && release});
    const name = person?.name ?? 'Request';
    notify.ok(approving ? `${name}'s ${LEAVE_LABEL[request.type].toLowerCase()} approved` : `${name}'s request declined`);
    onClose();
  }

  return (
    <Dialog isOpen onOpenChange={(open) => !open && onClose()} purpose="form" width={480}>
      <Layout
        header={
          <DialogHeader
            title={approving ? 'Approve time off' : 'Decline time off'}
            subtitle={`${person?.name ?? 'Staff'} · ${LEAVE_LABEL[request.type]} · ${formatRange(request.start, request.end)}`}
            onOpenChange={() => onClose()}
          />
        }
        content={
          <LayoutContent>
            <VStack gap={4}>
              {request.note && <Text type="supporting">“{request.note}”</Text>}
              {approving && affected.length > 0 && (
                <>
                  <Banner
                    status="warning"
                    title={`${person?.name ?? 'They'} is rostered for ${affected.length} ${affected.length === 1 ? 'shift' : 'shifts'} in this period`}
                    collapsible={false}
                  />
                  <Switch
                    label={`Release ${affected.length === 1 ? 'the shift' : `${affected.length} shifts`} to the open board`}
                    description="Colleagues can pick them up, and they stay visible on the roster until filled."
                    value={release}
                    onChange={setRelease}
                  />
                </>
              )}
              <TextArea
                label={approving ? 'Note to staff' : 'Reason'}
                value={note}
                onChange={setNote}
                rows={2}
                isOptional
                placeholder={approving ? 'Enjoy the break' : 'Suggest other dates if you can'}
              />
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <HStack gap={2} hAlign="end">
              <Button label="Cancel" onClick={onClose} />
              <Button label={approving ? 'Approve' : 'Decline request'} variant={approving ? 'primary' : 'destructive'} onClick={confirm} />
            </HStack>
          </LayoutFooter>
        }
      />
    </Dialog>
  );
}
