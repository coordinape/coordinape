import { useEffect, useRef } from 'react';

import { artWidth, artWidthMobile } from '../MintPage';
import { Box, Canvas } from 'ui';

import { startFromComponent } from './main';

export const CoSoulArt = () => {
  useEffect(() => {
    if (canvasRef.current && canvas2Ref.current) {
      startFromComponent(canvasRef.current, canvas2Ref.current);
    }
  }, []);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);
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
          ref={canvasRef}
          css={{
            ...canvasStyles,
            position: 'relative',
            zIndex: 1,
          }}
        />
        <Canvas
          ref={canvas2Ref}
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
