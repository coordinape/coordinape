import { useEffect, useRef } from 'react';

import { artWidth, artWidthMobile } from '../MintPage';
import { Box, Canvas } from 'ui';

import { generateCoSoulArt } from './main';

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
  useEffect(() => {
    if (canvasForegroundRef.current && canvasBackgroundRef.current) {
      generateCoSoulArt(
        canvasForegroundRef.current,
        canvasBackgroundRef.current,
        pGive,
        address,
        showGui,
        animate
      );
    }
  }, []);

  const canvasForegroundRef = useRef<HTMLCanvasElement>(null);
  const canvasBackgroundRef = useRef<HTMLCanvasElement>(null);
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
    <Box
      css={{
        ...canvasStyles,
        background: 'black',
        position: 'relative',
      }}
    >
      <Canvas
        ref={canvasForegroundRef}
        css={{
          ...canvasStyles,
          position: 'absolute',
          zIndex: 1,
        }}
      />
      <Canvas
        ref={canvasBackgroundRef}
        css={{
          ...canvasStyles,
          position: 'absolute',
          zIndex: 0,
        }}
      />
    </Box>
  );
};
