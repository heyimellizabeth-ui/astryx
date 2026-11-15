import {useEffect, useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {HStack} from '@astryxdesign/core/HStack';
import {Layout, LayoutContent, LayoutFooter} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {VStack} from '@astryxdesign/core/VStack';
import {useI18n} from '../i18n/I18nProvider';
import {LOCKOUT_SECONDS, MAX_ATTEMPTS, canVerify, verifyAdminPassword} from '../lib/auth';
import {usePlanner} from '../state/store';
import {useNotify} from './shared';

// Kept outside the component so closing and reopening the dialog does not reset the count.
let failedAttempts = 0;
let lockedUntil = 0;

export function SignInDialog({adminId, onClose}: {adminId: string; onClose: () => void}) {
  const {data, dispatch} = usePlanner();
  const {t} = useI18n();
  const notify = useNotify();
  const admin = data.staff.find((s) => s.id === adminId);
  const [password, setPassword] = useState('');
  const [wrong, setWrong] = useState(false);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const secondsLeft = Math.max(0, Math.ceil((lockedUntil - now) / 1000));
  const locked = secondsLeft > 0;

  useEffect(() => {
    if (!locked) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [locked]);

  async function submit() {
    if (busy || locked || !password) return;
    setBusy(true);
    const ok = await verifyAdminPassword(password).catch(() => false);
    setBusy(false);
    if (ok) {
      failedAttempts = 0;
      dispatch({type: 'viewer/signIn', viewerId: adminId});
      notify.ok(t('auth.signedIn', {name: admin?.name ?? ''}));
      onClose();
      return;
    }
    failedAttempts += 1;
    if (failedAttempts >= MAX_ATTEMPTS) {
      failedAttempts = 0;
      lockedUntil = Date.now() + LOCKOUT_SECONDS * 1000;
      setNow(Date.now());
    }
    setWrong(true);
    setPassword('');
  }

  const message = !canVerify() ? t('auth.unavailable') : locked ? t('auth.locked', {seconds: secondsLeft}) : wrong ? t('auth.wrong') : undefined;

  return (
    <Dialog isOpen onOpenChange={(open) => !open && onClose()} purpose="form" width={420}>
      <Layout
        header={<DialogHeader title={t('auth.title')} onOpenChange={() => onClose()} />}
        content={
          <LayoutContent>
            <VStack gap={4}>
              <Text>{t('auth.desc', {name: admin?.name ?? ''})}</Text>
              <TextInput
                label={t('auth.password')}
                type="password"
                value={password}
                onChange={(v) => {
                  setPassword(v);
                  setWrong(false);
                }}
                onEnter={submit}
                isRequired
                isDisabled={locked}
                status={message ? {type: 'error', message} : undefined}
              />
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <HStack gap={2} hAlign="end">
              <Button label={t('common.cancel')} onClick={onClose} />
              <Button label={t('auth.signIn')} variant="primary" onClick={submit} isLoading={busy} isDisabled={!password || locked || !canVerify()} />
            </HStack>
          </LayoutFooter>
        }
      />
    </Dialog>
  );
}
