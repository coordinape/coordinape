import { useRef, useState, useEffect } from 'react';

import { coSoulArtCycle, rotate } from 'keyframes';
import { DateTime } from 'luxon';
import { CSSTransition } from 'react-transition-group';

import { Box, Canvas, Flex, Text } from 'ui';

import { WebglMessage } from './art/WebglMessage';
import { artWidth, artWidthMobile } from './constants';
import { QueryCoSoulResult } from './getCoSoulData';

type CoSoulData = QueryCoSoulResult;

export const coSoulOutlineWidth = '4px';
export const coSoulCloud = {
  position: 'absolute',
  top: '$1xl',
  zIndex: -1,
  background: 'linear-gradient(#6c47d788, #31197488)',
  animation: `${rotate} 50s cubic-bezier(0.8, 0.2, 0.2, 0.8) alternate infinite`,
  borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%;',
  width: artWidth,
  height: artWidth,
  filter: `blur(calc(${artWidth} / 12.5))`,
  scale: '1.2',
  '@sm': {
    maxWidth: artWidthMobile,
    height: artWidthMobile,
    filter: `blur(calc(${artWidthMobile} / 5))`,
  },
};

export const CoSoulArtContainer = ({
  cosoul_data,
  children,
  minted,
}: {
  cosoul_data: CoSoulData;
  children: React.ReactNode;
  minted?: boolean;
}) => {
  const minted_date =
    cosoul_data.mintInfo?.created_at &&
    DateTime.fromISO(cosoul_data.mintInfo.created_at).toFormat('DD');
  const coSoulMinted = Boolean(cosoul_data.mintInfo ?? minted);
  const nodeRef = useRef(null);
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
        timeout={6000}
        classNames="art-container"
        appear
      >
        <Box
          ref={nodeRef}
          css={{
            outline: `${coSoulOutlineWidth} solid $surfaceNested`,
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
              animation: `${coSoulArtCycle} 3000ms ease-in-out`,
            },
          }}
        >
          <Flex
            column
            css={{
              filter: coSoulMinted ? 'none' : 'blur(18px)',
            }}
          >
            {children}
          </Flex>
          <WebglMessage webglEnabled={webglEnabled} />
          {!coSoulMinted && (
            <Text
              color="default"
              size="small"
              semibold
              css={{
                position: 'absolute',
                height: '4rem',
                top: 'calc(50% - 2rem)',
                width: '12rem',
                left: 'calc(50% - 6rem)',
                textAlign: 'center',
                color: 'white',
                opacity: 0.7,
                display: 'flex',
                justifyContent: 'center',
                padding: '$sm',
              }}
            >
              CoSoul art will generate after minting
            </Text>
          )}
          <Box css={{ position: 'absolute', bottom: '-1.5rem', right: 0 }}>
            {minted_date && (
              <Text size="small" color="dim">
                CoSoul minted on {minted_date}
              </Text>
            )}
          </Box>
        </Box>
      </CSSTransition>
      <Box css={{ ...coSoulCloud }} />
    </>
  );
};
