import { useEffect, useRef } from 'react';

import { QueryCoSoulResult } from '../getCoSoulData';
import { artWidth, artWidthMobile } from '../MintPage';
import { Box, Canvas } from 'ui';

import { generateCoSoulArt } from './main';

type CoSoulData = QueryCoSoulResult;

export const CoSoulArt = ({
  cosoul_data,
  address,
}: {
  cosoul_data: CoSoulData;
  address?: string;
}) => {
  useEffect(() => {
    if (canvasRef.current && canvas2Ref.current) {
      generateCoSoulArt(
        canvasRef.current,
        canvas2Ref.current,
        cosoul_data.totalPgive,
        address
      );
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
