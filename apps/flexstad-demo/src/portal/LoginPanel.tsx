// Copyright (c) Meta Platforms, Inc. and affiliates.

import {useEffect, useRef, useState, type FormEvent} from 'react';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {FormLayout} from '@astryxdesign/core/FormLayout';
import {Heading} from '@astryxdesign/core/Heading';
import {Icon} from '@astryxdesign/core/Icon';
import {VStack} from '@astryxdesign/core/Layout';
import {Link} from '@astryxdesign/core/Link';
import {Text} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {CONTACT} from '../content';
import {checkDemoLogin, startDemoSession} from './demoAuth';

/**
 * The demo login form. Safeguards: the check runs here in the browser against
 * the one published test account; there is no `action`, no field `name`, no
 * request; the typed values live in this component's state and nowhere else.
 */
export function LoginPanel() {
  const formRef = useRef<HTMLFormElement>(null);
  const focusTarget = useRef<'invalid' | 'user'>('invalid');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [isShown, setIsShown] = useState(false);
  const [hasTried, setHasTried] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [tries, setTries] = useState(0);

  const userError =
    user.trim() === '' ? 'Vul je gebruikersnaam in.' : undefined;
  const passError = pass === '' ? 'Vul je wachtwoord in.' : undefined;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setHasTried(true);
    if (userError || passError) {
      setIsRejected(false);
      focusTarget.current = 'invalid';
      setTries(count => count + 1);
      return;
    }
    if (!checkDemoLogin(user, pass)) {
      setIsRejected(true);
      focusTarget.current = 'user';
      setTries(count => count + 1);
      return;
    }
    // Drop the typed values before leaving; the route change then follows
    // from the session flag.
    setUser('');
    setPass('');
    startDemoSession();
  }

  // The messages land on the render after the press, so focus moves here.
  useEffect(() => {
    if (tries === 0) {
      return;
    }
    const form = formRef.current;
    const target =
      focusTarget.current === 'user'
        ? form?.querySelector<HTMLElement>('input')
        : form?.querySelector<HTMLElement>('input[aria-invalid="true"]');
    target?.focus();
  }, [tries]);

  return (
    <VStack gap={5} align="stretch">
      <Heading level={2}>Inloggen</Heading>
      <Banner status="info" title="Demo" collapsible={false}>
        Dit is een testomgeving. Log in met gebruikersnaam {'KEESFLEX'} en
        wachtwoord {'12345678'}. Vul hier nooit je echte gegevens in.
      </Banner>
      <form ref={formRef} onSubmit={handleSubmit} noValidate autoComplete="off">
        <VStack gap={6} align="stretch">
          {isRejected ? (
            <Banner status="error" collapsible={false}>
              Dit is een demo. Alleen het testaccount werkt.
            </Banner>
          ) : null}
          <FormLayout>
            <TextInput
              size="lg"
              label="Gebruikersnaam"
              value={user}
              onChange={setUser}
              autoComplete="off"
              isRequired
              status={
                hasTried && userError
                  ? {type: 'error', message: userError}
                  : undefined
              }
            />
            <VStack gap={2} align="stretch">
              <TextInput
                size="lg"
                label="Wachtwoord"
                type={isShown ? 'text' : 'password'}
                value={pass}
                onChange={setPass}
                autoComplete="off"
                isRequired
                status={
                  hasTried && passError
                    ? {type: 'error', message: passError}
                    : undefined
                }
              />
              <div>
                <Button
                  label={isShown ? 'Verberg wachtwoord' : 'Toon wachtwoord'}
                  variant="ghost"
                  icon={<Icon icon="eyeSlash" />}
                  onClick={() => setIsShown(value => !value)}
                />
              </div>
            </VStack>
          </FormLayout>
          <div>
            <Button
              label="Inloggen"
              type="submit"
              variant="primary"
              size="lg"
            />
          </div>
        </VStack>
      </form>
      <Text color="secondary">
        Hulp nodig? Bel <Link href={CONTACT.phoneHref}>{CONTACT.phone}</Link> of
        mail <Link href={`mailto:${CONTACT.email}`}>{CONTACT.email}</Link>.
      </Text>
    </VStack>
  );
}
