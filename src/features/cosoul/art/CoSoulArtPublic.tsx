import { useEffect, useRef, useState } from 'react';

import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { CosoulArtData } from '../../../../api/cosoul/art/[artTokenId]';
import { Canvas, Flex } from 'ui';

import { CoSoulArt } from './CoSoulArt';
import { WebglMessage } from './WebglMessage';

export const CoSoulArtPublic = ({ animate = true }: { animate?: boolean }) => {
  const params = useParams();
  const artTokenId = Number(params.tokenId);

  const { data, isLoading } = useQuery(
    ['cosoul_art_data', artTokenId],
    async (): Promise<CosoulArtData> => {
      const res = await fetch('/api/cosoul/art/' + artTokenId);
      if (res.status === 404) {
        throw new Error('No cosoul exists for tokenId ' + artTokenId);
      } else if (!res.ok) {
        throw new Error('Failed to fetch cosoul data');
      }
      return res.json();
    },
    {
      enabled: !!artTokenId,
      retry: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  const webglTest = useRef<HTMLCanvasElement>(null);
  const [webglEnabled, setWebglEnabled] = useState(true);

  useEffect(() => {
    const canvas = webglTest.current;
    const checkWebglEnabled = () => {
      if (canvas) {
        const webglEnabled = !!canvas.getContext('webgl2');
        setWebglEnabled(webglEnabled);
      }
    };
    checkWebglEnabled();
  }, []);

  if (isLoading) {
    return (
      <Canvas
        ref={webglTest}
        css={{
          position: 'absolute',
          zIndex: -1,
          left: -5000,
        }}
      />
    );
  }

  if (!!data?.address && data?.pGive >= 0) {
    return (
      <Flex css={{ position: 'relative' }}>
        <WebglMessage webglEnabled={webglEnabled} />
        <CoSoulArt
          pGive={data.pGive}
          address={data.address}
          animate={animate}
          webglEnabled={webglEnabled}
        />
      </Flex>
    );
  } else {
    return <>No CoSoul exists for this tokenId</>;
  }
};
