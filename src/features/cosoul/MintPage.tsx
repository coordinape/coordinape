/* eslint-disable jsx-a11y/media-has-caption */
// import { rotate } from 'keyframes';
import { NavLink } from 'react-router-dom';

import isFeatureEnabled from 'config/features';
import { paths } from 'routes/paths';
import { Flex, Button, Text, Panel, Box } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

export const MintPage = () => {
  const artWidthMobile = '320px';
  const artWidth = '500px';
  const nodeWidth = '180px';
  const nodeBorderWidth = '2px';
  const nodeStyle = {
    width: `${nodeWidth}`,
    p: '$sm $sm $md',
    position: 'absolute',
    borderBottom: `${nodeBorderWidth} solid $border`,
    zIndex: -1,
    '.nodeHeader': {
      fontSize: '50px',
      '@md': {
        fontSize: '40px',
      },
      fontWeight: '$semibold',
      color: '$headingText',
    },
    '@sm': {
      position: 'static',
      width: '50%',
      mt: '$md',
    },
  };
  const nodeLineStyle = {
    content: '',
    position: 'absolute',
    bottom: `-${nodeBorderWidth}`,
    width: `calc(50vw - (${artWidth} / 2))`,
    maxWidth: `calc(($mediumScreen / 2) - (${artWidth} / 2))`,
    borderBottom: `${nodeBorderWidth} solid $border`,
    '@sm': {
      display: 'none',
    },
  };

  if (!isFeatureEnabled('cosoul')) {
    return <></>;
  }
  return (
    <Box>
      <SingleColumnLayout
        css={{ m: 'auto', alignItems: 'center', gap: '$1xl' }}
      >
        <Panel
          css={{
            justifyContent: 'space-between',
            borderColor: '$cta',
            minWidth: '180px',
            maxWidth: `${artWidth}`,
            minHeight: `calc(${artWidth} * .6)`,
            gap: '$3xl',
            '@sm': {
              maxWidth: `${artWidthMobile}`,
              height: 'auto',
              gap: '$1xl',
            },
          }}
        >
          <Flex column css={{ gap: '$sm' }}>
            <Text variant="label">{"You've Earned"}</Text>
            <Text h2 display>
              2,345 pGIVE
            </Text>
            <Text size="small" color="secondary">
              pGIVE is an abstraction of the GIVE you have received in
              Coordinape
            </Text>
          </Flex>
          <Flex column css={{ gap: '$md' }}>
            <Button color="cta" size="large" as={NavLink} to={paths.cosoul}>
              Sync Your CoSoul
            </Button>
            <Text size="small" color="secondary">
              There are no fees to mint CoSouls, and gas costs are minimal.
            </Text>
          </Flex>
        </Panel>
        <Flex
          column
          css={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            mb: '$4xl',
          }}
        >
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
              <video
                width="100%"
                autoPlay
                loop
                muted
                src="/imgs/background/cosoul-demo.mov"
              />
            </Box>
            {/* <Box
              css={{
                background:
                  'linear-gradient(rgb(198 219 137), rgb(34 119 127))',
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
            /> */}
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
          {/* Nodes Container */}
          <Flex
            row
            css={{
              flexWrap: 'wrap',
            }}
          >
            {/* Node */}
            <Box
              css={{
                ...nodeStyle,
                bottom: 'calc(100% - 40px)',
                left: 0,
                '&:after': {
                  ...nodeLineStyle,
                  left: '100%',
                  rotate: '15deg',
                  transformOrigin: '0 0',
                },
              }}
            >
              <Text className="nodeHeader">2,300</Text>
              <Text size="small" color="secondary">
                GIVE
              </Text>
            </Box>
            {/* Node */}
            <Box
              css={{
                ...nodeStyle,
                bottom: 'calc(100% - 40px)',
                right: 0,
                '&:after': {
                  ...nodeLineStyle,
                  right: '100%',
                  rotate: '-15deg',
                  transformOrigin: '100% 0',
                },
              }}
            >
              <Text className="nodeHeader">2</Text>
              <Text size="small" color="secondary">
                Organizations
              </Text>
            </Box>
            {/* Node */}
            <Box
              css={{
                ...nodeStyle,
                right: 0,
                bottom: '50%',
                '&:after': {
                  ...nodeLineStyle,
                  right: '99.5%',
                  rotate: '-5deg',
                  transformOrigin: '100% 0',
                },
              }}
            >
              <Text className="nodeHeader">5</Text>
              <Text size="small" color="secondary">
                Circles
              </Text>
            </Box>
            {/* Node */}
            <Box
              css={{
                ...nodeStyle,
                right: 0,
                bottom: 0,
                '&:after': {
                  ...nodeLineStyle,
                  right: '99.5%',
                  rotate: '15deg',
                  transformOrigin: '100% 0',
                },
              }}
            >
              <Text className="nodeHeader">234</Text>
              <Text size="small" color="secondary">
                Contributions
              </Text>
            </Box>
            {/* Node */}
            <Box
              css={{
                ...nodeStyle,
                left: 0,
                bottom: 0,
                '&:after': {
                  ...nodeLineStyle,
                  left: '99.5%',
                  rotate: '-15deg',
                  transformOrigin: '0 0',
                },
              }}
            >
              <Text className="nodeHeader">180</Text>
              <Text size="small" color="secondary">
                Notes
              </Text>
            </Box>
            {/* Node */}
            <Box
              css={{
                ...nodeStyle,
                bottom: '50%',
                left: 0,
                '&:after': {
                  ...nodeLineStyle,
                  left: '99.5%',
                  rotate: '5deg',
                  transformOrigin: '0 0',
                },
              }}
            >
              <Text className="nodeHeader">25</Text>
              <Text size="small" color="secondary">
                Epoch months
              </Text>
            </Box>
          </Flex>
        </Flex>
      </SingleColumnLayout>
    </Box>
  );
};
