import { useRef, useState, useEffect } from 'react';

import { CSS } from '@stitches/react';
import { coLinkcoSoulArtCycle, fadeIn } from 'keyframes';
import { CSSTransition } from 'react-transition-group';

import { Box, Canvas, Flex } from 'ui';

import { WebglMessage } from './art/WebglMessage';
import { artWidth, artWidthMobile } from './constants';
import { QueryCoSoulResult } from './getCoSoulData';

type CoSoulData = QueryCoSoulResult;

export const CoLinksCoSoulArtContainer = ({
  cosoul_data,
  children,
  minted,
  css,
}: {
  cosoul_data: CoSoulData;
  children: React.ReactNode;
  minted?: boolean;
  css?: CSS;
}) => {
  const coSoulMinted = Boolean(cosoul_data.mintInfo ?? minted);
  const nodeRef = useRef(null);
  const nodeRefScrim = useRef(null);
  const webglTest = useRef<HTMLCanvasElement>(null);
  const [webglEnabled, setWebglEnabled] = useState(true);

  useEffect(() => {
    const canvas = webglTest.current;
    const checkWebglEnabled = () => {
      if (canvas) {
        const webglEnabled = !!canvas.getContext('webgl2');
        document.getElementById('cosoulSolo')?.classList.add('webglReady');
        setWebglEnabled(webglEnabled);
      }
    };
    checkWebglEnabled();
  }, []);

  return (
    <>
      <Canvas
        ref={webglTest}
        css={{
          position: 'absolute',
          zIndex: -1,
          left: -5000,
        }}
      />
      <CSSTransition
        in={!coSoulMinted}
        nodeRef={nodeRef}
        timeout={2000}
        classNames="art-container"
        appear
      >
        <Box
          ref={nodeRef}
          css={{
            // outline: '4px solid $background',
            position: 'relative',
            width: '100%',
            maxWidth: `${artWidth}`,
            height: `${artWidth}`,
            my: '$lg',
            '@sm': {
              maxWidth: `${artWidthMobile}`,
              height: `${artWidthMobile}`,
            },
            iframe: {
              border: 'none',
              body: {
                m: 0,
              },
            },
            '&.art-container-exit, &.art-container-exit-active': {
              animation: `${coLinkcoSoulArtCycle} 1500ms ease-in-out`,
            },
            ...css,
          }}
        >
          <Flex
            column
            css={{
              position: 'relative',
              zIndex: 3,
              filter: coSoulMinted ? 'none' : 'blur(18px)',
              opacity: coSoulMinted ? 1 : 0,
            }}
          >
            {children}
          </Flex>
          <WebglMessage webglEnabled={webglEnabled} />
        </Box>
      </CSSTransition>
      <CSSTransition
        in={!coSoulMinted}
        nodeRef={nodeRefScrim}
        timeout={1000}
        classNames="art-container-scrim"
        appear
      >
        <Box
          ref={nodeRefScrim}
          css={{
            background: 'rgba(0,0,0,0.9)',
            width: '100vw',
            height: '100vh',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: '-1',
            opacity: coSoulMinted ? 1 : 0,
            pointerEvents: 'none',
            '&.art-container-scrim-exit, &.art-container-scrim-exit-active': {
              animation: `${fadeIn} 1000ms ease-in-out`,
            },
          }}
        ></Box>
      </CSSTransition>
    </>
  );
};
