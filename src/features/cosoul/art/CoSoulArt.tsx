import { artWidth, artWidthMobile } from '../MintPage';

import Display from './CoSoulArtDisplay.js';

const resolution = [2000,2000];
const linewidth = 3;

// url params for testing
const params = new URLSearchParams(window.location.href);
const p = {
  address: params.get('address'),
  pgive: params.get('pgive'),
  animate: params.get('animate') !== 'false',
};

export const CoSoulArt = ({
  pGive = Number(p.pgive),
  address = p.address || '',
  showGui = false,
  animate = p.animate || false,
  width,
}: {
  pGive?: number;
  address?: string;
  showGui?: boolean;
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
        params={{id: address, pgive: pGive}} 
        resolution={resolution} 
        lineWidth={linewidth}
        canvasStyles={canvasStyles}/>
  );
};
