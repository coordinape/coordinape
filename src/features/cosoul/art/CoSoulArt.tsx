import { useEffect, useRef } from 'react';

import { artWidth, artWidthMobile } from '../constants';
import { Box, Canvas } from 'ui';

import { generateCoSoulArt } from './main';

export const CoSoulArt = ({
  pGive,
  address,
  showGui = false,
  animate = false,
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
  }, [pGive]);

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
