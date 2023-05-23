import { useEffect, useRef } from 'react';

import { artWidth, artWidthMobile } from '../MintPage';
import { Box, Canvas } from 'ui';

import { generateCoSoulArt } from './main';

export const CoSoulArt = ({
  pGive,
  address,
  showGui = false,
}: {
  pGive?: number;
  address?: string;
  showGui?: boolean;
}) => {
  useEffect(() => {
    if (canvasForegroundRef.current && canvasBackgroundRef.current) {
      generateCoSoulArt(
        canvasForegroundRef.current,
        canvasBackgroundRef.current,
        pGive,
        address,
        showGui
      );
    }
  }, []);
  const canvasForegroundRef = useRef<HTMLCanvasElement>(null);
  const canvasBackgroundRef = useRef<HTMLCanvasElement>(null);
  const canvasStyles = {
    left: 0,
    top: 0,
    width: `${artWidth} !important`,
    height: `${artWidth} !important`,
    '@sm': {
      width: `${artWidthMobile} !important`,
      height: `${artWidthMobile} !important`,
    },
  };
  return (
    <Box css={{ background: '$surface ' }}>
      <Box css={{ position: 'relative' }}>
        <Canvas
          ref={canvasForegroundRef}
          css={{
            ...canvasStyles,
            position: 'relative',
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
    </Box>
  );
};
