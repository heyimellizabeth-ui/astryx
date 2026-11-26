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
import {useI18n} from '../i18n/I18nProvider';
import {shiftsInRange} from '../lib/rules';
import {usePlanner} from '../state/store';
import {type TimeOff} from '../types';
import {useNotify} from './shared';

interface Props {
  request: TimeOff;
  decision: 'approved' | 'denied';
  onClose: () => void;
}

export function DecisionDialog({request, decision, onClose}: Props) {
  const {data, dispatch} = usePlanner();
  const {t, tn, fmt, data: text, leaveType} = useI18n();
  const notify = useNotify();
  const person = data.staff.find((s) => s.id === request.staffId);
  const affected = shiftsInRange(request.staffId, request.start, request.end, data.shifts);
  const [release, setRelease] = useState(true);
  const [note, setNote] = useState('');
  const approving = decision === 'approved';

  function confirm() {
    dispatch({type: 'leave/decide', id: request.id, status: decision, decisionNote: note.trim() || undefined, releaseShifts: approving && release});
    const name = person?.name ?? '';
    notify.ok(approving ? t('decision.approvedToast', {type: leaveType(request.type), name}) : t('decision.declinedToast', {name}));
    onClose();
  }

  return (
    <Dialog isOpen onOpenChange={(open) => !open && onClose()} purpose="form" width={480}>
      <Layout
        header={
          <DialogHeader
            title={approving ? t('decision.approveTitle') : t('decision.declineTitle')}
            subtitle={`${person?.name ?? ''} · ${leaveType(request.type)} · ${fmt.range(request.start, request.end, t('common.to'))}`}
            onOpenChange={() => onClose()}
          />
        }
        content={
          <LayoutContent>
            <VStack gap={4}>
              {request.note && <Text type="supporting">“{text(request.note)}”</Text>}
              {approving && affected.length > 0 && (
                <>
                  <Banner
                    status="warning"
                    title={tn('decision.rostered', affected.length, {name: person?.name ?? ''})}
                    collapsible={false}
                  />
                  <Switch
                    label={tn('decision.release', affected.length)}
                    description={t('decision.releaseDesc')}
                    value={release}
                    onChange={setRelease}
                  />
                </>
              )}
              <TextArea
                label={approving ? t('decision.noteApprove') : t('decision.noteDecline')}
                value={note}
                onChange={setNote}
                rows={2}
                isOptional
                placeholder={approving ? t('decision.phApprove') : t('decision.phDecline')}
              />
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <HStack gap={2} hAlign="end">
              <Button label={t('common.cancel')} onClick={onClose} />
              <Button label={approving ? t('decision.approve') : t('decision.declineBtn')} variant={approving ? 'primary' : 'destructive'} onClick={confirm} />
            </HStack>
          </LayoutFooter>
        }
      />
    </Dialog>
  );
}
