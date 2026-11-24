// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as stylex from '@stylexjs/stylex';

/**
 * The Flexstad wordmark, traced from the live site's own inline SVG (201 x 40):
 * the four orange bars of the mark and the letters. The letters take
 * `currentColor`, so the wordmark turns light on the aubergine band and in
 * dark mode; the bars always take the brand orange.
 */
const WORD_PATHS = [
  'M182.085 29.9934V9.92157H189.368C191.509 9.92157 193.382 10.3469 194.988 11.1976C196.594 12.0387 197.841 13.2143 198.73 14.7245C199.619 16.2251 200.063 17.9694 200.063 19.9575C200.063 21.4581 199.81 22.8249 199.303 24.0579C198.797 25.2909 198.07 26.3518 197.124 27.2407C196.188 28.12 195.064 28.7987 193.755 29.2766C192.446 29.7545 190.983 29.9934 189.368 29.9934H182.085ZM187.877 24.6027H189.225C189.932 24.6027 190.572 24.5119 191.146 24.3303C191.729 24.1391 192.231 23.8524 192.651 23.4701C193.081 23.0782 193.411 22.5907 193.64 22.0077C193.87 21.4246 193.984 20.7412 193.984 19.9575C193.984 18.9061 193.784 18.0363 193.382 17.3481C192.981 16.66 192.422 16.1486 191.705 15.8141C190.988 15.4796 190.161 15.3123 189.225 15.3123H187.877V24.6027Z',
  'M159.314 29.9934L166.626 9.92157H173.508L180.791 29.9934H174.253L173.135 26.4091H166.798L165.68 29.9934H159.314ZM168.031 21.6206H171.873L169.981 15.8858L168.031 21.6206Z',
  'M150.57 29.9934V15.1976H145.409V9.92157H161.552V15.1976H156.391V29.9934H150.57Z',
  'M136.19 30.4235C134.584 30.4235 133.022 30.1797 131.502 29.6923C129.992 29.2048 128.711 28.5023 127.66 27.5847L130.341 23.3123C130.733 23.7711 131.258 24.1725 131.918 24.5166C132.577 24.8607 133.285 25.1283 134.04 25.3195C134.795 25.5106 135.512 25.6062 136.19 25.6062C136.955 25.6062 137.586 25.4963 138.083 25.2765C138.58 25.0566 138.828 24.746 138.828 24.3446C138.828 23.9527 138.637 23.6325 138.255 23.384C137.872 23.1259 137.165 22.8631 136.133 22.5954L134.642 22.194C132.463 21.6014 130.905 20.7794 129.968 19.728C129.031 18.6671 128.563 17.415 128.563 15.9717C128.563 15.0637 128.759 14.2178 129.151 13.4341C129.552 12.6503 130.106 11.9669 130.814 11.3839C131.531 10.7913 132.372 10.3325 133.337 10.0075C134.302 9.68256 135.349 9.52007 136.477 9.52007C138.102 9.52007 139.612 9.75902 141.007 10.2369C142.412 10.7053 143.531 11.3552 144.362 12.1868L141.581 16.3445C141.246 15.9526 140.816 15.6085 140.291 15.3122C139.765 15.0064 139.187 14.7674 138.556 14.5954C137.925 14.4233 137.289 14.3373 136.649 14.3373C136.142 14.3373 135.703 14.3994 135.33 14.5237C134.957 14.6384 134.666 14.8009 134.455 15.0111C134.255 15.2119 134.154 15.446 134.154 15.7137C134.154 15.9526 134.24 16.1486 134.412 16.3015C134.584 16.4544 134.866 16.6026 135.258 16.7459C135.66 16.8893 136.2 17.0613 136.878 17.2621L138.341 17.6922C140.52 18.3326 142.087 19.1211 143.043 20.0578C143.999 20.9945 144.477 22.2036 144.477 23.6851C144.477 25.0136 144.133 26.1845 143.445 27.1976C142.757 28.2108 141.791 29.0041 140.549 29.5776C139.306 30.1415 137.853 30.4235 136.19 30.4235Z',
  'M107.488 29.9934L113.51 19.8141L107.689 9.92157H114.685L117.639 15.3696L120.592 9.92157H127.417L121.596 19.9001L127.503 29.9934H120.449L117.41 24.2299L114.37 29.9934H107.488Z',
  'M91.5916 29.9934V9.92157H106.473V14.9109H97.3838V17.5202H104.839V22.0794H97.3838V24.9468H106.588V29.9934H91.5916Z',
  'M76.1861 29.9934V9.92157H81.9782V24.7174H89.5768V29.9934H76.1861Z',
  'M59.9723 29.9934V9.92157H73.7358V15.1976H65.7644V18.2657H72.8469V23.3124H65.7644V29.9934H59.9723Z',
];

const MARK_PATHS = [
  'M45.0003 10H25.0003L30.0003 7.62939e-06H45.0003V10Z',
  'M45.001 30.0006H15.001L20.001 20.0006H45.001V30.0006Z',
  'M25 10.002L20.001 20H0V10H25V10.002Z',
  'M15 30.0001L10 40.0001H0V30.0001H15Z',
];

const styles = stylex.create({
  logo: {display: 'block', height: 'auto', flexShrink: 0},
  mark: {fill: 'var(--flex-orange)'},
  word: {fill: 'currentColor'},
});

export function BrandMark({
  width = 150,
  isMarkOnly = false,
}: {
  width?: number | string;
  /** Only the four bars (viewBox 0 0 45 40). */
  isMarkOnly?: boolean;
}) {
  return (
    <svg
      viewBox={isMarkOnly ? '0 0 45 40' : '0 0 201 40'}
      width={width}
      role="img"
      aria-label="Flexstad"
      {...stylex.props(styles.logo)}>
      <g {...stylex.props(styles.mark)}>
        {MARK_PATHS.map(d => (
          <path key={d} d={d} />
        ))}
      </g>
      {isMarkOnly ? null : (
        <g {...stylex.props(styles.word)}>
          {WORD_PATHS.map(d => (
            <path key={d} d={d} />
          ))}
        </g>
      )}
    </svg>
  );
}

const stripeStyles = stylex.create({
  band: {
    display: 'grid',
    gridTemplateRows: 'repeat(3, var(--flex-stripe))',
    rowGap: 'var(--flex-stripe-gap)',
    width: '100%',
    overflow: 'hidden',
  },
  row: {
    display: 'block',
    height: '100%',
    backgroundColor: 'var(--flex-orange)',
  },
  // The cut of each bar follows the logo's slant: half the bar's height
  // across for its full height, the same lean as the four bars of the mark.
  cut: (end: string) => ({
    width: end,
    clipPath:
      'polygon(0 0, 100% 0, calc(100% - var(--flex-stripe) / 2) 100%, 0 100%)',
  }),
});

/**
 * The stripe the live site closes its footer with, drawn from the logo's own
 * bars: three orange rows that stop at staggered lengths, each end cut on the
 * mark's slant. Decorative, so hidden from assistive technology.
 */
export function BrandStripes({
  ends = ['72%', '46%', '88%'],
}: {
  ends?: ReadonlyArray<string>;
}) {
  return (
    <div aria-hidden="true" {...stylex.props(stripeStyles.band)}>
      {ends.map((end, index) => (
        <span
          key={`${index}-${end}`}
          {...stylex.props(stripeStyles.row, stripeStyles.cut(end))}
        />
      ))}
    </div>
  );
}
