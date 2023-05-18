import { useEffect } from 'react';

import { artWidth, artWidthMobile } from '../MintPage';
import { Box, Canvas } from 'ui';

import { startFromComponent } from './main';

export const CoSoulArt = () => {
  useEffect(() => {
    startFromComponent();
  }, []);

  return (
    <Box
      css={{
        background: 'indigo',
        maxWidth: `${artWidth}`,
        height: `${artWidth}`,
        '@sm': {
          maxWidth: `${artWidthMobile}`,
          height: `${artWidthMobile}`,
        },
      }}
    >
      <Box css={{ position: 'relative' }}>
        <Canvas
          id="disp"
          width="500"
          height="500"
          css={{ position: 'absolute', left: 0, top: 0, zIndex: 1 }}
        />
        <Canvas
          id="disp2"
          width="500"
          height="500"
          css={{ position: 'absolute', left: 0, top: 0, zIndex: 0 }}
        />
      </Box>
    </Box>
  );
};
