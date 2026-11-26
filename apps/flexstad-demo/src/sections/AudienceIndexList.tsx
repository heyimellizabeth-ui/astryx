// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {Text} from '@astryxdesign/core/Text';
import {AUDIENCES, AUDIENCE_PAGES} from '../content';
import {PHOTOS, type Photo} from '../photos';
import {firstSentence, PhotoImage} from './ui';

const WIDE = '@media (min-width: 900px)';

const styles = stylex.create({
  // The index: four audiences as full-width rows under one heavy rule.
  index: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    borderTopWidth: 2,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-text-primary)',
  },
  indexItem: {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border-emphasized)',
  },
  row: {
    position: 'relative',
    display: 'grid',
    alignItems: 'center',
    columnGap: 64,
    rowGap: 12,
    paddingBlock: {default: 24, [WIDE]: 28},
    paddingInline: {default: 0, [WIDE]: 16},
    color: 'var(--color-text-primary)',
    textDecoration: 'none',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 640px)': 'minmax(0, 1fr) 96px',
      [WIDE]: 'minmax(0, 6fr) minmax(0, 4fr) 192px',
    },
    // Phones: the arched photograph above the title, then the line, so a
    // long title keeps the full width.
    gridTemplateAreas: {
      default: '"pic" "title" "line"',
      '@media (min-width: 640px)': '"title pic" "line pic"',
      [WIDE]: '"title line pic"',
    },
    backgroundColor: {
      default: 'transparent',
      ':hover': 'var(--color-background-muted)',
    },
    transitionProperty: 'background-color',
    transitionDuration: '0.3s',
    transitionTimingFunction: 'var(--flex-ease)',
  },
  rowTitle: {
    gridArea: 'title',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    fontSize: 'clamp(34px, 12px + 3.6vw, 68px)',
    lineHeight: 1,
    fontWeight: 700,
    letterSpacing: '-0.035em',
    minWidth: 0,
    overflowWrap: 'break-word',
  },
  rowBar: {
    display: {default: 'none', [WIDE]: 'block'},
    position: 'absolute',
    insetInlineStart: 16,
    top: 'calc(50% - 7px)',
    width: 40,
    height: 14,
    backgroundColor: 'var(--flex-orange)',
    clipPath: 'polygon(7px 0, 100% 0, 100% 100%, 0 100%)',
    opacity: 0,
    transform: 'translateX(-16px)',
    transitionProperty: 'opacity, transform',
    transitionDuration: '0.35s',
    transitionTimingFunction: 'var(--flex-ease)',
  },
  rowTitleText: {
    transitionProperty: 'transform',
    transitionDuration: '0.35s',
    transitionTimingFunction: 'var(--flex-ease)',
  },
  rowLine: {gridArea: 'line', maxWidth: '44ch'},
  rowPic: {
    gridArea: 'pic',
    position: 'relative',
    width: {default: '40%', '@media (min-width: 640px)': '100%'},
    aspectRatio: '4 / 5',
    alignSelf: 'center',
    transitionProperty: 'transform',
    transitionDuration: '0.5s',
    transitionTimingFunction: 'var(--flex-ease)',
  },
  // The row is an Astryx ClickableCard: flat, square, no lift of its own,
  // so the row's own hover (the bar, the title, the window) carries it.
  card: {
    borderRadius: 0,
    backgroundColor: 'transparent',
    transform: 'none',
  },
});

// Each audience with the photograph that is its mood. `index` is its place in
// AUDIENCES, which holds the title and link the live site uses.
const ROWS: ReadonlyArray<{slug: string; index: number; photo: Photo}> = [
  {slug: 'vastgoedeigenaren', index: 0, photo: PHOTOS.ownersApartmentFacade},
  {slug: 'ondernemers', index: 1, photo: PHOTOS.makersClothingRail},
  {slug: 'gemeenten', index: 2, photo: PHOTOS.municipalitiesOfficeFloor},
  {slug: 'ontwikkelaars', index: 3, photo: PHOTOS.developersDesk},
];

/**
 * StyleX props plus one plain class: the row's hover and focus move its
 * children, which `index.css` keys on these classes (`.flex-index-*`).
 */
function withClass(name: string, style: stylex.StyleXStyles) {
  const props = stylex.props(style);
  return {...props, className: `${name} ${props.className ?? ''}`.trim()};
}

function AudienceRow({
  href,
  title,
  sentence,
  photo,
}: {
  href: string;
  title: string;
  sentence: string;
  photo: Photo;
}) {
  return (
    <ClickableCard
      label={title}
      href={href}
      padding={0}
      variant="transparent"
      xstyle={styles.card}>
      <div {...withClass('flex-index-row', styles.row)}>
        <h3 {...stylex.props(styles.rowTitle)}>
          <span
            aria-hidden="true"
            {...withClass('flex-index-bar', styles.rowBar)}
          />
          <span {...withClass('flex-index-title', styles.rowTitleText)}>
            {title}
          </span>
        </h3>
        <Text color="secondary" xstyle={styles.rowLine}>
          {sentence}
        </Text>
        <span {...withClass('flex-index-pic', styles.rowPic)}>
          <PhotoImage
            photo={photo}
            isFilled
            isArch
            sizes="(min-width: 900px) 192px, 96px"
          />
        </span>
      </div>
    </ClickableCard>
  );
}

/**
 * The four audiences as photo rows, the same on `/` and on `/voor-wie/`: one
 * component, so the two pages cannot drift apart. Every audience gets the
 * same weight: its title, its first sentence and its arched window.
 */
export function AudienceIndexList() {
  return (
    <ul {...stylex.props(styles.index)}>
      {ROWS.map(row => {
        const audience = AUDIENCES[row.index];
        const sentence = firstSentence(AUDIENCE_PAGES[row.slug].intro[0]);
        return (
          <li key={row.slug} {...stylex.props(styles.indexItem)}>
            <AudienceRow
              href={audience.href}
              title={audience.title}
              sentence={sentence}
              photo={row.photo}
            />
          </li>
        );
      })}
    </ul>
  );
}
