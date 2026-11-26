// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import type {ReactNode} from 'react';
import {Breadcrumbs, BreadcrumbItem} from '@astryxdesign/core/Breadcrumbs';
import {Button} from '@astryxdesign/core/Button';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {CONTACT, type Cta} from '../content';
import {srcSetFor, type Photo as PhotoData} from '../photos';
import {PageSection} from './PageSection';
import {Placeholder} from './Placeholder';

const enter = stylex.keyframes({
  from: {opacity: 0, transform: 'translateY(16px)'},
  to: {opacity: 1, transform: 'translateY(0)'},
});

const styles = stylex.create({
  reveal: {
    animationName: {
      default: 'none',
      '@media (prefers-reduced-motion: no-preference)': enter,
    },
    animationDuration: '0.6s',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    animationFillMode: 'both',
  },
  list: {
    margin: 0,
    paddingInlineStart: 20,
    listStyleType: 'disc',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
  },
  prose: {maxWidth: '65ch'},
  rows: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border-emphasized)',
  },
  row: {
    paddingBlock: 16,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border-emphasized)',
  },
  rowsLayout: {
    display: 'grid',
    gap: 24,
    alignItems: 'start',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'minmax(0, 5fr) minmax(0, 7fr)',
    },
  },
  bandTop: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 32,
  },
  bandLinks: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border)',
  },
  measure: {maxWidth: '40ch'},
  // "Interesse?" is the page's last word: set at the home head's size.
  ctaHead: {
    // Phones: 40px, so the longest closing word (Kennismaken?) fits 320px.
    fontSize: 'clamp(40px, 10px + 8vw, 140px)',
    lineHeight: 0.95,
    letterSpacing: '-0.045em',
  },
  ctaBody: {maxWidth: '44ch', fontWeight: 500},
  columns: {
    columnGap: 64,
    columnCount: {default: 1, '@media (min-width: 900px)': 2},
  },
  columnItem: {breakInside: 'avoid', marginBottom: 24},
  lead: {
    maxWidth: 'min(100%, 24em)',
    minWidth: 0,
    overflowWrap: 'break-word',
    fontSize: 'var(--text-heading-2-size)',
    lineHeight: 'var(--text-heading-2-leading)',
  },
  prose2: {maxWidth: '65ch'},
  // Ghost buttons carry the Button's inline padding inside their hit area; the
  // row is pulled back by the same token so the text sits on the column edge.
  ghostRow: {marginInlineStart: 'calc(-1 * var(--spacing-3))'},
  // A banner with something beside its head: the head on the left, the aside
  // on the right, both sitting on one baseline row from 900px.
  heroSplit: {
    display: 'grid',
    columnGap: 64,
    rowGap: 32,
    alignItems: 'end',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'minmax(0, 1fr) minmax(0, 380px)',
    },
  },
  heroSplitStart: {alignItems: 'start'},
  // The aside is a photograph: five of twelve columns, as tall as the head.
  heroSplitWide: {
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'minmax(0, 7fr) minmax(0, 5fr)',
    },
    alignItems: 'end',
  },
  heroAside: {
    position: 'relative',
    width: {default: 'min(100%, 340px)', '@media (min-width: 900px)': '100%'},
    justifySelf: {default: 'start', '@media (min-width: 900px)': 'end'},
    maxWidth: 440,
    aspectRatio: '4 / 5',
  },
  heroHead: {paddingBottom: {default: 0, '@media (min-width: 900px)': 8}},
  photo: {
    borderRadius: 'var(--radius-container)',
    overflow: 'hidden',
  },
  photoFill: {display: 'flex', height: '100%'},
  // A credited photograph. The frame is the shared 16px container corner, the
  // image fills it (object-fit: cover, the position stored with the photo) and
  // carries one treatment: a touch less saturation so the library photographs
  // sit together, a little dimmer in dark mode so they do not glare.
  picture: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    backgroundColor: 'var(--color-background-muted)',
    borderRadius: 'var(--radius-container)',
  },
  pictureBleed: {borderRadius: 0},
  // The arched window: a full half-circle over a 16px-cornered base.
  pictureArch: {borderRadius: 'var(--flex-arch)'},
  // Fills the nearest positioned box, so a box sized by flex or by its
  // neighbours (the hero) sets the crop and the image never sets the layout.
  pictureFill: {position: 'absolute', inset: 0, height: '100%'},
  pictureImage: {
    position: 'absolute',
    inset: 0,
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: {
      default: 'saturate(0.94)',
      '@media (prefers-color-scheme: dark)': 'saturate(0.94) brightness(0.9)',
    },
  },
});

/** The frame shapes photographs take; the hero fills its own box instead. */
export const PHOTO_RATIOS = {
  wide: '21 / 9',
  landscape: '3 / 2',
  portrait: '4 / 5',
  square: '1 / 1',
} as const;

/** Reveals content once on load; static under reduced motion. */
export function Reveal({children}: {children: ReactNode}) {
  return <div {...stylex.props(styles.reveal)}>{children}</div>;
}

export function Paragraphs({items}: {items: ReadonlyArray<string>}) {
  return (
    <VStack gap={3} xstyle={styles.prose}>
      {items.map(text => (
        <Text key={text} color="secondary">
          {text}
        </Text>
      ))}
    </VStack>
  );
}

export function BulletList({items}: {items: ReadonlyArray<string>}) {
  return (
    <ul {...stylex.props(styles.list)}>
      {items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/** Photo slot with the shared rounded frame. */
export function Photo({
  label,
  seed,
  ratio,
  isFilled = false,
}: {
  label: string;
  seed?: number;
  ratio?: string;
  /** Stretch to the height of the cell the slot sits in. */
  isFilled?: boolean;
}) {
  return (
    <div
      {...stylex.props(styles.photo, isFilled ? styles.photoFill : undefined)}>
      <Placeholder label={label} seed={seed} ratio={ratio} />
    </div>
  );
}

/**
 * A credited library photograph (see `photos.ts`): the real `<img>` with its
 * width, height, Dutch alt text and stored crop. It fills `ratio`, or the
 * height of the box it sits in. Only the hero image is `isPriority`
 * (fetchpriority high, eager, the likely LCP); every other image is lazy.
 * Text over a photograph never sits on the image itself: put it on a plate
 * (`--flex-band` with `bandStyles.onBand`, aubergine and light text).
 */
export function PhotoImage({
  photo,
  ratio,
  isPriority = false,
  isBleed = false,
  isFilled = false,
  isArch = false,
  sizes = '100vw',
}: {
  photo: PhotoData;
  /** The `sizes` for the photograph's slot; the srcSet holds three cuts. */
  sizes?: string;
  ratio?: keyof typeof PHOTO_RATIOS;
  isPriority?: boolean;
  /** Full-bleed across the page: no corner radius. */
  isBleed?: boolean;
  /** Fill the nearest positioned box instead of taking a ratio. */
  isFilled?: boolean;
  /** Frame the photograph as an arched window. */
  isArch?: boolean;
}) {
  return (
    <div
      {...stylex.props(
        styles.picture,
        isBleed ? styles.pictureBleed : undefined,
        isArch ? styles.pictureArch : undefined,
        isFilled ? styles.pictureFill : undefined,
      )}
      style={ratio ? {aspectRatio: PHOTO_RATIOS[ratio]} : undefined}>
      <img
        src={photo.src}
        srcSet={srcSetFor(photo)}
        sizes={sizes}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        decoding={isPriority ? 'sync' : 'async'}
        fetchPriority={isPriority ? 'high' : undefined}
        loading={isPriority ? undefined : 'lazy'}
        {...stylex.props(styles.pictureImage)}
        style={{objectPosition: photo.objectPosition}}
      />
    </div>
  );
}

export function Crumbs({
  trail,
}: {
  trail: ReadonlyArray<{title: string; href?: string}>;
}) {
  return (
    <Breadcrumbs label="Kruimelpad">
      {trail.map((item, index) => (
        <BreadcrumbItem
          key={item.title}
          href={item.href}
          isCurrent={index === trail.length - 1}>
          {item.title}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}

interface PageHeroProps {
  trail?: ReadonlyArray<{title: string; href?: string}>;
  title: string;
  intro?: string;
  ctas?: ReadonlyArray<Cta>;
  /** Less padding under the head, for pages whose content follows at once. */
  paddingBlock?: 6 | 8 | 10;
  /** Set beside the head from 900px (an index of the page's content). */
  aside?: ReactNode;
  /** The aside is a photograph: it takes five columns and the head's height. */
  isAsidePhoto?: boolean;
}

/**
 * Inner-page hero, Banner posture: trail, the head at the display token, an
 * optional line and the actions, set across the content column. No picture
 * slot; pages that wait for photographs carry one as their first section.
 */
export function PageHero({
  trail,
  title,
  intro,
  ctas,
  paddingBlock = 8,
  aside,
  isAsidePhoto = false,
}: PageHeroProps) {
  // Beside a photograph the trail stays inside the head, so the picture runs
  // the head's full height. Beside an index the trail sits above both, so the
  // head and the index start on one line.
  const isSplitIndex = aside !== undefined && !isAsidePhoto;
  const crumbs = trail ? <Crumbs trail={trail} /> : null;
  const head = (
    <VStack gap={5} align="start">
      {isSplitIndex ? null : crumbs}
      <Reveal>
        <VStack gap={5} align="start">
          <Heading level={1} type="display-2">
            {title}
          </Heading>
          {intro ? (
            <Text type="large" color="secondary" xstyle={styles.prose2}>
              {intro}
            </Text>
          ) : null}
          {ctas && ctas.length > 0 ? (
            <HStack gap={3} wrap="wrap">
              {ctas.map((cta, index) => (
                <Button
                  key={cta.label}
                  label={cta.label}
                  href={cta.href}
                  size="lg"
                  variant={index === 0 ? 'primary' : 'ghost'}
                />
              ))}
            </HStack>
          ) : null}
        </VStack>
      </Reveal>
    </VStack>
  );
  return (
    <PageSection isBand paddingBlock={paddingBlock}>
      {aside ? (
        <VStack gap={5} align="stretch">
          {isSplitIndex ? crumbs : null}
          <div
            {...stylex.props(
              styles.heroSplit,
              isAsidePhoto ? styles.heroSplitWide : styles.heroSplitStart,
            )}>
            {head}
            {isAsidePhoto ? (
              <div {...stylex.props(styles.heroAside)}>{aside}</div>
            ) : (
              aside
            )}
          </div>
        </VStack>
      ) : (
        head
      )}
    </PageSection>
  );
}

/** A title on the left and its items as hairline rows on the right. */
export function RowsSection({
  title,
  items,
  aside,
}: {
  title: string;
  items: ReadonlyArray<string>;
  aside?: ReactNode;
}) {
  return (
    <div {...stylex.props(styles.rowsLayout)}>
      <VStack gap={4} align="start">
        <Heading level={2}>{title}</Heading>
        {aside}
      </VStack>
      <ul {...stylex.props(styles.rows)}>
        {items.map(item => (
          <li key={item} {...stylex.props(styles.row)}>
            <Text type="large">{item}</Text>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** First sentence of a paragraph (existing copy, reused as a short lead). */
export function firstSentence(text: string) {
  return text.split(/(?<=[.?!])\s/)[0];
}

/** The "Interesse?" band that closes the page. */
export function CtaBand({
  title = 'Interesse?',
  body,
  cta = {label: 'Neem contact op', href: '/contact/'},
}: {
  title?: string;
  body?: string;
  cta?: Cta;
}) {
  return (
    <PageSection isOrange paddingBlock={10}>
      <VStack gap={8}>
        <div {...stylex.props(styles.bandTop)}>
          <VStack gap={5}>
            <Heading level={2} xstyle={styles.ctaHead}>
              {title}
            </Heading>
            {body ? (
              <Text type="large" xstyle={styles.ctaBody}>
                {body}
              </Text>
            ) : null}
          </VStack>
          <Button
            label={cta.label}
            href={cta.href}
            variant="primary"
            size="lg"
          />
        </div>
        <div {...stylex.props(styles.bandLinks)}>
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
            <Button
              label="LinkedIn"
              href={CONTACT.linkedin}
              variant="ghost"
              size="lg"
            />
          </HStack>
        </div>
      </VStack>
    </PageSection>
  );
}

/** Paragraphs in two balanced columns from 900px, one on phones. */
export function TextColumns({items}: {items: ReadonlyArray<string>}) {
  return (
    <div {...stylex.props(styles.columns)}>
      {items.map(text => (
        <div key={text} {...stylex.props(styles.columnItem)}>
          <Text as="p" color="secondary">
            {text}
          </Text>
        </div>
      ))}
    </div>
  );
}

/**
 * An intro set as a statement: its first sentence at the section size, the
 * rest of the same text beneath in two columns. No word is added or dropped.
 */
export function LeadIntro({paragraphs}: {paragraphs: ReadonlyArray<string>}) {
  const [first, ...others] = paragraphs;
  const lead = firstSentence(first);
  const rest = first.slice(lead.length).trim();
  const items = rest ? [rest, ...others] : others;
  return (
    <VStack gap={8} align="stretch">
      <Text as="p" weight="bold" xstyle={styles.lead}>
        {lead}
      </Text>
      {items.length > 0 ? <TextColumns items={items} /> : null}
    </VStack>
  );
}
