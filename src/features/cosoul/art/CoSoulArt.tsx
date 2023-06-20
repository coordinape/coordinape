import { useEffect, useRef } from 'react';

import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { artWidth, artWidthMobile } from '../MintPage';
import { Box, Canvas } from 'ui';

import { generateCoSoulArt } from './main';
import { getCosoulArtData, QUERY_KEY_COSOUL_ART_DATA } from './queries';

export const CoSoulArt = ({
  pGive,
  address,
  showGui = false,
  animate = true,
  width,
}: {
  pGive?: number;
  address?: string;
  showGui?: boolean;
  animate?: boolean;
  width?: string;
}) => {
  const params = useParams();
  const tokenId = Number(params.tokenId);

  const { data } = useQuery(
    [QUERY_KEY_COSOUL_ART_DATA, tokenId],
    () => getCosoulArtData(tokenId),
    {
      enabled: !!tokenId,
    }
  );

  const profileAddress = data?.profile.address || address;
  const userPgive = data?.pgive || pGive;

  return (
    <CosoulArtCanvas
      pGive={userPgive}
      address={profileAddress}
      animate={animate}
      width={width}
      showGui={showGui}
    />
  );
};

const CosoulArtCanvas = ({
  pGive,
  address,
  showGui = false,
  animate = true,
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
    // eslint-disable-next-line no-console
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
