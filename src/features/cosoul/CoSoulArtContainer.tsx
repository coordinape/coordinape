import { rotate } from 'keyframes';

import { Box } from 'ui';

import { CoSoulArt } from './CoSoulArt/CoSoulArt';
import { artWidth, artWidthMobile } from './MintPage';

export const CoSoulArtContainer = () => {
  return (
    <Box
      css={{
        // border: '1px dashed rgba(255, 255, 255, 0.3)',
        // borderRadius: '8px',
        // background: 'black',
        outline: '4px solid $surface',
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
      }}
    >
      <Box
        css={
          {
            // filter: 'blur(5px)',
          }
        }
      >
        {/* <video
          width="100%"
          autoPlay
          loop
          muted
          src="/imgs/background/cosoul-demo.mov"
        /> */}
        <CoSoulArt />
      </Box>
      <Box
        css={{
          position: 'absolute',
          top: 0,
          zIndex: -1,
          background: 'linear-gradient(rgb(198 219 137), rgb(34 119 127))',
          animation: `${rotate} 50s cubic-bezier(0.8, 0.2, 0.2, 0.8) alternate infinite`,
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%;',
          width: `${artWidth}`,
          height: `${artWidth}`,
          filter: `blur(calc(${artWidth} / 5))`,
          '@sm': {
            maxWidth: `${artWidthMobile}`,
            height: `${artWidthMobile}`,
            filter: `blur(calc(${artWidthMobile} / 5))`,
          },
        }}
      />
      {/* <Text
              color="default"
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
            </Text> */}
    </Box>
  );
};
