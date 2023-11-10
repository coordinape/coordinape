import { isFeatureEnabled } from '../../../config/features';
import { artWidth, artWidthMobile } from '../constants';

import Display from './CoSoulArtDisplay.js';

const resolution = [2000, 2000];
const linewidth = 3;

export const CoSoulArt = ({
  pGive,
  repScore,
  address,
  animate = true,
  width,
}: {
  pGive?: number;
  repScore: number;
  address?: string;
  animate?: boolean;
  width?: string;
}) => {
  const canvasStyles = {
    left: 0,
    top: 0,
    width: `${width ? width : artWidth} !important`,
    height: `${width ? width : artWidth} !important`,
    '@sm': {
      width: `${artWidthMobile} !important`,
      height: `${artWidthMobile} !important`,
    },
  };

  // use pGive unless we have feature flagged on backend (w/ env var)
  // this also allows for some usages to not pass in repScore (for now)
  let score = pGive ?? 0;
  if (isFeatureEnabled('rep_cosouls')) {
    score = repScore ?? pGive ?? 0;
  }

  // fall back to pGive if its bigger - we might not have calculated score yet
  if (pGive !== undefined && pGive > score) {
    score = pGive;
  }

  return (
    <Display
      params={{ id: address?.toLowerCase(), score: score }}
      resolution={resolution}
      lineWidth={linewidth}
      canvasStyles={canvasStyles}
      animate={animate}
    />
  );
};
