import { useRef } from 'react';

import { coSoulArtCycle, rotate } from 'keyframes';
import { DateTime } from 'luxon';
import { CSSTransition } from 'react-transition-group';

import { Box, Flex, Text } from 'ui';

import { WebglMessage } from './art/WebglMessage';
import { artWidth, artWidthMobile } from './constants';
import { QueryCoSoulResult } from './getCoSoulData';

type CoSoulData = QueryCoSoulResult;

export const coSoulCloud = {
  position: 'absolute',
  top: '$lg',
  zIndex: -1,
  background: 'linear-gradient(#6c47d7, #311974)',
  animation: `${rotate} 50s cubic-bezier(0.8, 0.2, 0.2, 0.8) alternate infinite`,
  borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%;',
  width: artWidth,
  height: artWidth,
  filter: `blur(calc(${artWidth} / 5))`,
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
  webglEnabled = true,
}: {
  cosoul_data: CoSoulData;
  children: React.ReactNode;
  minted?: boolean;
  webglEnabled?: boolean;
}) => {
  const minted_date =
    cosoul_data.mintInfo?.created_at &&
    DateTime.fromISO(cosoul_data.mintInfo.created_at).toFormat('DD');
  const coSoulMinted = Boolean(cosoul_data.mintInfo ?? minted);
  const nodeRef = useRef(null);

  return (
    <>
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
            outline: '4px solid $surfaceNested',
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
                color: '$headingText',
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
