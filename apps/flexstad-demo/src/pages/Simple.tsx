// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {useEffect, type ReactNode} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Link} from '@astryxdesign/core/Link';
import {Text} from '@astryxdesign/core/Text';
import {CONTACT, FAQ, SERVICES, VACANCY} from '../content';
import {Faq} from '../sections/Faq';
import {
  ContactForm,
  FormPanel,
  SignupForm,
  SubscribeForm,
} from '../sections/Forms';
import {PageSection} from '../sections/PageSection';
import {CtaBand, PageHero, Paragraphs, RowsSection} from '../sections/ui';
import {LoginPanel} from '../portal/LoginPanel';
import {OVERVIEW_PATH, useDemoSession} from '../portal/demoAuth';
import {navigate} from '../router';
import {NotFound} from './NotFound';

const HOME = {title: 'Home', href: '/'};

const styles = stylex.create({
  // A short column of facts on the left, the form on the right.
  split: {
    display: 'grid',
    columnGap: 64,
    rowGap: 32,
    alignItems: 'start',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'minmax(0, 5fr) minmax(0, 7fr)',
    },
  },
  sticky: {
    position: {default: 'static', '@media (min-width: 900px)': 'sticky'},
    top: 96,
  },
  rows: {
    margin: 0,
    padding: 0,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border-emphasized)',
  },
  detail: {
    display: 'grid',
    gap: 4,
    paddingBlock: 16,
    margin: 0,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border-emphasized)',
  },
  detailValue: {margin: 0},
  // Ghost buttons carry the Button's inline padding inside their hit area; the
  // row is pulled back by the same token so the text sits on the column edge.
  ghostRow: {marginInlineStart: 'calc(-1 * var(--spacing-3))'},
  more: {paddingTop: 32},
  desktopOnly: {
    display: {default: 'none', '@media (min-width: 900px)': 'block'},
  },
  phoneOnly: {display: {default: 'block', '@media (min-width: 900px)': 'none'}},
  panel: {
    padding: {default: 24, '@media (min-width: 900px)': 56},
    borderRadius: 'var(--radius-container)',
    backgroundColor: 'var(--color-background-muted)',
  },
  panelText: {maxWidth: '60ch'},
  narrow: {maxWidth: 720},
  // The vacancy: facts and the apply action stay beside the text.
  vacancy: {
    display: 'grid',
    columnGap: 64,
    rowGap: 32,
    alignItems: 'start',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'minmax(0, 4fr) minmax(0, 8fr)',
    },
  },
  vacancyText: {maxWidth: '65ch', minWidth: 0},
  // The vacancy title is long: a step below the section head so it fits the narrow column.
  vacancyTitle: {
    overflowWrap: 'break-word',
    fontSize: 'clamp(24px, 14px + 1.1vw, 30px)',
    lineHeight: 1.2,
  },
  block: {
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-text-primary)',
  },
  items: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border-emphasized)',
  },
  item: {
    paddingBlock: 10,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border-emphasized)',
  },
  closingText: {
    maxWidth: 'min(100%, 24em)',
    margin: 0,
    fontSize: 'var(--text-heading-2-size)',
    lineHeight: 'var(--text-heading-2-leading)',
  },
});

function Detail({label, children}: {label: string; children: ReactNode}) {
  return (
    <div {...stylex.props(styles.detail)}>
      <dt {...stylex.props(styles.detailValue)}>
        <Text type="supporting" color="secondary">
          {label}
        </Text>
      </dt>
      <dd {...stylex.props(styles.detailValue)}>
        <Text type="large">{children}</Text>
      </dd>
    </div>
  );
}

/** The office and the ways to reach it, as hairline rows. */
function ContactDetails() {
  const [street, city] = CONTACT.address.split(', ');
  return (
    <dl {...stylex.props(styles.rows)}>
      <Detail label="Kantoor">
        {street}
        <br />
        {city}
        <br />
        Nederland
      </Detail>
      <Detail label="Email">
        <Link href={`mailto:${CONTACT.email}`}>{CONTACT.email}</Link>
      </Detail>
      <Detail label="Telefoon">
        <Link href={CONTACT.phoneHref}>{CONTACT.phone}</Link>
      </Detail>
      <Detail label="LinkedIn">
        <Link href={CONTACT.linkedin} isExternalLink>
          LinkedIn
        </Link>
      </Detail>
    </dl>
  );
}

export function Contact() {
  return (
    <>
      <PageHero title="Contact" trail={[HOME, {title: 'Contact'}]} />
      <PageSection>
        <div {...stylex.props(styles.split)}>
          <VStack gap={8} align="stretch">
            <ContactDetails />
            <VStack gap={3} align="start">
              <Heading level={3}>Iets kapot in uw pand?</Heading>
              <Text color="secondary">
                Huurt u bij ons en is er iets kapot of beschadigd? Meld het met
                foto’s, dan komt het direct bij ons team terecht.
              </Text>
              <Button
                label="Reparatie melden"
                href="/reparatie-melden/"
                variant="secondary"
                size="lg"
              />
            </VStack>
          </VStack>
          <FormPanel>
            <ContactForm />
          </FormPanel>
        </div>
      </PageSection>
    </>
  );
}

export function Inschrijven() {
  const answer = FAQ[0].items[0].answer;
  const more = [FAQ[0].items[2], FAQ[0].items[4]];
  // The aside is rendered twice, one copy per breakpoint (the other is
  // display: none, so it leaves the accessibility tree and the tab order):
  // beside the form from 900px, after the form on phones.
  const aside = (
    <>
      <div>
        <VStack gap={5} align="start">
          <Heading level={2}>Jouw gegevens</Heading>
          <Text color="secondary">{answer}</Text>
          <HStack gap={2} wrap="wrap" xstyle={styles.ghostRow}>
            <Button
              label={CONTACT.phone}
              href={CONTACT.phoneHref}
              variant="ghost"
              size="lg"
            />
            <Button
              label={CONTACT.email}
              href={`mailto:${CONTACT.email}`}
              variant="ghost"
              size="lg"
            />
          </HStack>
        </VStack>
      </div>
      <VStack gap={5} xstyle={styles.more}>
        {more.map(item => (
          <VStack key={item.question} gap={2} align="start">
            <Heading level={3}>{item.question}</Heading>
            <Text color="secondary">{item.answer}</Text>
          </VStack>
        ))}
      </VStack>
    </>
  );
  return (
    <>
      <PageHero title="Inschrijven" trail={[HOME, {title: 'Inschrijven'}]} />
      <PageSection>
        <div {...stylex.props(styles.split)}>
          <div {...stylex.props(styles.sticky, styles.desktopOnly)}>
            {aside}
          </div>
          <VStack gap={8}>
            <FormPanel>
              <SignupForm />
            </FormPanel>
            <div {...stylex.props(styles.phoneOnly)}>{aside}</div>
          </VStack>
        </div>
      </PageSection>
    </>
  );
}

export function Abonneren() {
  return (
    <>
      <PageHero
        title="Aanmelden"
        intro="Kies een inschrijving die bij jou past."
        trail={[HOME, {title: 'Aanmelden'}]}
      />
      <PageSection>
        <div {...stylex.props(styles.narrow)}>
          <FormPanel>
            <SubscribeForm />
          </FormPanel>
        </div>
      </PageSection>
    </>
  );
}

/**
 * The demo login: a working form against one published test account, with
 * nothing collected (see `portal/demoAuth.ts`). A visitor who is already
 * logged in goes on to the overview without seeing the form.
 */
export function MijnFlexstad() {
  const hasSession = useDemoSession();
  useEffect(() => {
    if (hasSession) {
      navigate(OVERVIEW_PATH, {replace: true});
    }
  }, [hasSession]);
  if (hasSession) {
    return null;
  }
  return (
    <>
      <PageHero title="MijnFlexstad" trail={[HOME, {title: 'MijnFlexstad'}]} />
      <PageSection>
        <Card maxWidth={640} padding={8}>
          <LoginPanel />
        </Card>
      </PageSection>
    </>
  );
}

function VacancyList({items}: {items: ReadonlyArray<string>}) {
  return (
    <ul {...stylex.props(styles.items)}>
      {items.map(item => (
        <li key={item} {...stylex.props(styles.item)}>
          <Text color="secondary">{item}</Text>
        </li>
      ))}
    </ul>
  );
}

export function Vacatures() {
  return (
    <>
      <PageHero title="Vacatures" trail={[HOME, {title: 'Vacatures'}]} />
      <PageSection>
        <div {...stylex.props(styles.vacancy)}>
          <div {...stylex.props(styles.sticky)}>
            <VStack gap={4} align="start">
              <Heading level={2} xstyle={styles.vacancyTitle}>
                {VACANCY.title}
              </Heading>
              <Text weight="medium" color="secondary">
                {VACANCY.meta}
              </Text>
              <Button
                label="Neem contact op"
                href="/contact/"
                variant="primary"
                size="lg"
              />
            </VStack>
          </div>
          <VStack gap={8} xstyle={styles.vacancyText}>
            <Paragraphs items={VACANCY.intro} />
            {VACANCY.blocks.map(block => (
              <VStack key={block.title} gap={3} xstyle={styles.block}>
                <Heading level={3}>{block.title}</Heading>
                {block.lead ? (
                  <Text color="secondary">{block.lead}</Text>
                ) : null}
                <VacancyList items={block.items} />
                {block.after ? (
                  <Text color="secondary">{block.after}</Text>
                ) : null}
              </VStack>
            ))}
            <VStack gap={3} xstyle={styles.block}>
              <Heading level={3}>{VACANCY.about.title}</Heading>
              <Paragraphs items={VACANCY.about.body} />
            </VStack>
            <VStack gap={3} xstyle={styles.block}>
              <Heading level={3}>{VACANCY.apply.title}</Heading>
              <Paragraphs items={VACANCY.apply.body} />
              <div>
                <Button
                  label="Neem contact op"
                  href="/contact/"
                  variant="primary"
                  size="lg"
                />
              </div>
            </VStack>
          </VStack>
        </div>
      </PageSection>
      <CtaBand />
    </>
  );
}

/** Both services share one live text: a head, the list, the closing line. */
export function Dienst({slug}: {slug: string}) {
  const service = SERVICES[slug];
  if (!service) {
    return <NotFound />;
  }
  return (
    <>
      <PageHero title={service.title} trail={[HOME, {title: service.title}]} />
      <PageSection>
        <div {...stylex.props(styles.split, styles.panel)}>
          <Heading level={2}>{service.heading}</Heading>
          <Text type="large" color="secondary" xstyle={styles.panelText}>
            {service.body}
          </Text>
        </div>
      </PageSection>
      <PageSection isWashed>
        <RowsSection
          title={service.bulletsTitle}
          items={service.bullets}
          aside={<Paragraphs items={[service.bulletsIntro]} />}
        />
      </PageSection>
      <PageSection paddingBlock={8}>
        <Text as="p" weight="bold" xstyle={styles.closingText}>
          {service.closing}
        </Text>
      </PageSection>
      <Faq />
      <CtaBand />
    </>
  );
}
