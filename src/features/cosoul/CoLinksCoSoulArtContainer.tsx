import { useRef, useState, useEffect } from 'react';

import { coLinkcoSoulArtCycle, fadeIn } from 'keyframes';
import { CSSTransition } from 'react-transition-group';

import { Box, Canvas, Flex } from 'ui';

import { WebglMessage } from './art/WebglMessage';
import { artWidth, artWidthMobile } from './constants';
import { CoSoulProfileInfo } from './CoSoulProfileInfo';
import { QueryCoSoulResult } from './getCoSoulData';

type CoSoulData = QueryCoSoulResult;

export const CoLinksCoSoulArtContainer = ({
  cosoul_data,
  children,
  minted,
}: {
  cosoul_data: CoSoulData;
  children: React.ReactNode;
  minted?: boolean;
}) => {
  const coSoulMinted = Boolean(cosoul_data.mintInfo ?? minted);
  const nodeRef = useRef(null);
  const nodeRefScrim = useRef(null);
  const nodeRefProfile = useRef(null);
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
        nodeRef={nodeRefProfile}
        timeout={6000}
        classNames="art-container-profile"
        appear
      >
        <Box
          ref={nodeRefProfile}
          css={{
            width: '100%',
            maxWidth: `${artWidth}`,
            opacity: coSoulMinted ? 1 : 0,
            '&.art-container-profile-exit, &.art-container-profile-exit-active':
              {
                animation: `${fadeIn} 2000ms ease-in-out`,
              },
          }}
        >
          <CoSoulProfileInfo cosoul_data={cosoul_data} />
        </Box>
      </CSSTransition>
      <CSSTransition
        in={!coSoulMinted}
        nodeRef={nodeRef}
        timeout={6000}
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
              animation: `${coLinkcoSoulArtCycle} 3000ms ease-in-out`,
            },
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
        timeout={6000}
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
              animation: `${fadeIn} 2000ms ease-in-out`,
            },
          }}
        ></Box>
      </CSSTransition>
    </>
  );
};
