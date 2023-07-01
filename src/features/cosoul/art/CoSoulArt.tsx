import { artWidth, artWidthMobile } from '../constants';

import Display from './CoSoulArtDisplay.js';

const resolution = [2000, 2000];
const linewidth = 3;

export const CoSoulArt = ({
  pGive,
  address,
  animate = true,
  width,
}: {
  pGive?: number;
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
  return (
    <Display
      params={{ id: address?.toLowerCase(), pgive: pGive }}
      resolution={resolution}
      lineWidth={linewidth}
      canvasStyles={canvasStyles}
      animate={animate}
    />
  );
};
