import { useEffect, useRef } from 'react';

import { coSoulNodesCycle } from 'keyframes';
import { CSSTransition } from 'react-transition-group';

import { Box, Flex, Panel, Text } from 'ui';
import { numberWithCommas } from 'utils';

import { coSoulOutlineWidth } from './CoSoulArtContainer';
import { QueryCoSoulResult } from './getCoSoulData';
import './glitch.css';
import { artWidth } from './MintPage';
import { generateRandomNumber, scrambleNumber } from './numberScramble';

type CoSoulData = QueryCoSoulResult;

const nodeWidth = '180px';
const nodeBorderWidth = '2px';
const nodeDetails = {
  position: 'static',
  width: '50%',
  mt: '$sm',
  height: 'auto',
};
const nodeTextStyle = {
  '.nodeHeader': {
    fontSize: '45px',
    '@md': {
      fontSize: '35px',
    },
    fontWeight: '$semibold',
    color: '$secondaryButtonText',
  },
  '.nodeSubHeader': {
    fontSize: '$small',
    color: '$ctaHover',
  },
};
const nodePanelStyle = {
  ...nodeTextStyle,
  width: '100%',
  p: '$sm',
  borderRadius: '$3',
};
export const nodeStyle = {
  width: `${nodeWidth}`,
  p: '$sm $sm $md',
  position: 'absolute',
  borderBottom: `${nodeBorderWidth} solid $border `,
  zIndex: -1,
  ...nodeTextStyle,
  '@md': {
    width: '100px',
  },
  '@sm': {
    ...nodeDetails,
    zIndex: 1,
    border: 'none',
  },
};
export const nodeLineStyle = {
  content: '',
  position: 'absolute',
  bottom: `-${nodeBorderWidth}`,
  width: `calc(50vw - (${artWidth} / 2))`,
  maxWidth: `calc(($mediumScreen / 2) - (${artWidth} / 2))`,
  borderBottom: `${nodeBorderWidth} solid $border `,
  '@sm': {
    display: 'none',
  },
};

export const CoSoulCompositionRep = ({
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
  const nodeScramble1 = useRef<HTMLSpanElement>(null);
  const nodeScramble2 = useRef<HTMLSpanElement>(null);
  const nodeScramble3 = useRef<HTMLSpanElement>(null);
  const nodeScramble4 = useRef<HTMLSpanElement>(null);
  const nodeScramble5 = useRef<HTMLSpanElement>(null);
  const nodeScramble6 = useRef<HTMLSpanElement>(null);
  const nodes = [
    nodeScramble1,
    nodeScramble2,
    nodeScramble3,
    nodeScramble4,
    nodeScramble5,
    nodeScramble6,
  ];
  useEffect(() => {
    if (coSoulMinted) {
      Object.values(nodes).forEach(node => node.current?.remove());
    } else {
      Object.values(nodes).forEach(node => {
        if (node.current) {
          scrambleNumber(node.current);
        }
      });
    }
  }, [coSoulMinted]);

  return (
    <>
      <Flex
        column
        css={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          maxWidth: '1100px',
          margin: 'auto',
        }}
      >
        <Flex column css={{ position: 'relative', width: '100%' }}>
          <Flex
            column
            css={{
              margin: 'auto',
              mb: '$lg',
              position: 'relative',
              '@md': {
                scale: 0.85,
              },
              '@sm': {
                scale: 1,
              },
            }}
          >
            {coSoulMinted && (
              <Flex
                css={{
                  ...nodePanelStyle,
                  position: 'relative',
                  bottom: '-$lg',
                  left: `calc(-1 * ${coSoulOutlineWidth})`,
                  background:
                    'linear-gradient(.08turn, $tagSecondaryBackground, $background)',
                  width: `calc(100% + (2*${coSoulOutlineWidth}))`,
                  maxWidth: `calc(${artWidth} + (2*${coSoulOutlineWidth}))`,
                  px: '$lg',
                  gap: '$xs',
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  alignItems: 'baseline',
                  span: { color: '$tagSecondaryText !important' },
                }}
              >
                <Text className="nodeHeader">
                  {numberWithCommas(cosoul_data.reputation?.total_score, 0)}
                </Text>
                <Text
                  className="nodeHeader"
                  css={{
                    fontWeight: '$normal !important',
                    fontSize: '20px !important',
                  }}
                >
                  Rep Score
                </Text>
              </Flex>
            )}
            {children}
          </Flex>
        </Flex>
        {/* Nodes Container */}
        <CSSTransition
          in={!coSoulMinted}
          nodeRef={nodeRef}
          timeout={6000}
          classNames="composition"
          appear
        >
          <Flex
            ref={nodeRef}
            row
            css={{
              width: '100%',
              height: `${artWidth}`,
              position: 'absolute',
              top: '$3xl',

              zIndex: -1,
              '@sm': {
                position: 'relative',
                flexWrap: 'wrap',
                width: '100%',
                height: 'auto',
                maxWidth: `${artWidth}`,
                background: coSoulMinted ? '$surface' : 'black',
                mt: 0,
                mb: '$1xl',
                p: '0 $sm $sm',
                borderRadius: '$3',
              },
              '&.composition-exit, &.composition-exit-active': {
                animation: `${coSoulNodesCycle} 3000ms ease-in-out`,
              },
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
              {!coSoulMinted && (
                <Text
                  ref={nodeScramble1}
                  className="nodeHeader glitch"
                  data-digits="3"
                  data-text={generateRandomNumber(3)}
                >
                  {generateRandomNumber(3)}
                </Text>
              )}
              {coSoulMinted && (
                <Text className="nodeHeader">
                  {numberWithCommas(cosoul_data.totalPgive, 0)}
                </Text>
              )}
              <Text className="nodeSubHeader">pGIVE</Text>
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
              {!coSoulMinted && (
                <Text
                  ref={nodeScramble2}
                  className="nodeHeader glitch glitch2"
                  data-digits="1"
                  data-text={generateRandomNumber(1)}
                >
                  {generateRandomNumber(1)}
                </Text>
              )}
              {coSoulMinted && (
                <Text className="nodeHeader">
                  {numberWithCommas(cosoul_data.reputation?.github_score, 0)}
                </Text>
              )}
              <Text className="nodeSubHeader">GitHub</Text>
            </Box>
            {/* Node */}
            <Box
              css={{
                ...nodeStyle,
                right: 0,
                bottom: '63%',
                '&:after': {
                  ...nodeLineStyle,
                  right: '99.5%',
                  rotate: '-8deg',
                  transformOrigin: '100% 0',
                },
              }}
            >
              {!coSoulMinted && (
                <Text
                  ref={nodeScramble3}
                  className="nodeHeader glitch glitch3"
                  data-digits="1"
                  data-text={generateRandomNumber(1)}
                >
                  {generateRandomNumber(1)}
                </Text>
              )}
              {coSoulMinted && (
                <Text className="nodeHeader">
                  {numberWithCommas(cosoul_data.reputation?.twitter_score, 0)}
                </Text>
              )}
              <Text className="nodeSubHeader">Twitter</Text>
            </Box>
            {/* Node */}
            <Box
              css={{
                ...nodeStyle,
                right: 0,
                bottom: '33%',
                '&:after': {
                  ...nodeLineStyle,
                  right: '99.5%',
                  rotate: '8deg',
                  transformOrigin: '100% 0',
                },
              }}
            >
              {!coSoulMinted && (
                <Text
                  ref={nodeScramble3}
                  className="nodeHeader glitch glitch3"
                  data-digits="1"
                  data-text={generateRandomNumber(1)}
                >
                  {generateRandomNumber(1)}
                </Text>
              )}
              {coSoulMinted && (
                <Text className="nodeHeader">
                  {numberWithCommas(cosoul_data.reputation?.email_score, 0)}
                </Text>
              )}
              <Text className="nodeSubHeader">Email</Text>
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
              {!coSoulMinted && (
                <Text
                  ref={nodeScramble4}
                  className="nodeHeader glitch glitch4"
                  data-digits="3"
                  data-text={generateRandomNumber(3)}
                >
                  {generateRandomNumber(3)}
                </Text>
              )}
              {coSoulMinted && (
                <Text className="nodeHeader">
                  {numberWithCommas(cosoul_data.reputation?.linkedin_score, 0)}
                </Text>
              )}
              <Text className="nodeSubHeader">LinkedIn</Text>
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
              {!coSoulMinted && (
                <Text
                  ref={nodeScramble5}
                  className="nodeHeader glitch glitch5"
                  data-digits="3"
                  data-text={generateRandomNumber(3)}
                >
                  {generateRandomNumber(3)}
                </Text>
              )}
              {coSoulMinted && (
                <Text className="nodeHeader">
                  {numberWithCommas(cosoul_data.reputation?.poap_score, 0)}
                </Text>
              )}
              <Text className="nodeSubHeader">POAP</Text>
            </Box>
            {/* Node */}
            <Box
              css={{
                ...nodeStyle,
                bottom: '33%',
                left: 0,
                '&:after': {
                  ...nodeLineStyle,
                  left: '99.5%',
                  rotate: '-8deg',
                  transformOrigin: '0 0',
                },
              }}
            >
              {!coSoulMinted && (
                <Text
                  ref={nodeScramble6}
                  className="nodeHeader glitch glitch6"
                  data-digits="2"
                  data-text={generateRandomNumber(2)}
                >
                  {generateRandomNumber(2)}
                </Text>
              )}
              {coSoulMinted && (
                <Text className="nodeHeader">
                  {numberWithCommas(cosoul_data.reputation?.links_score, 0)}
                </Text>
              )}
              <Text className="nodeSubHeader">Links</Text>
            </Box>
            <Box
              css={{
                ...nodeStyle,
                bottom: '63%',
                left: 0,
                '&:after': {
                  ...nodeLineStyle,
                  left: '99.5%',
                  rotate: '8deg',
                  transformOrigin: '0 0',
                },
              }}
            >
              {!coSoulMinted && (
                <Text
                  ref={nodeScramble6}
                  className="nodeHeader glitch glitch6"
                  data-digits="2"
                  data-text={generateRandomNumber(2)}
                >
                  {generateRandomNumber(2)}
                </Text>
              )}
              {coSoulMinted && (
                <Text className="nodeHeader">
                  {numberWithCommas(cosoul_data.reputation?.invite_score, 0)}
                </Text>
              )}
              <Text className="nodeSubHeader">Invites</Text>
            </Box>
          </Flex>
        </CSSTransition>
        {coSoulMinted && (
          <Flex
            column
            css={{
              gap: '$sm',
              mt: '$md',
              width: '100%',
              maxWidth: `${artWidth}`,
            }}
          >
            <Text variant="label">pGIVE Details</Text>
            <Panel
              css={{
                display: 'grid',
                gap: '$md',
                gridTemplateColumns: '1fr 1fr 1fr',
                borderColor: 'transparent',
                background: '$surface',
                p: '$sm',
                '@sm': {
                  gridTemplateColumns: '1fr 1fr',
                },
              }}
            >
              <Box css={{ ...nodePanelStyle, background: '$surfaceNested' }}>
                <Text className="nodeHeader">
                  {numberWithCommas(cosoul_data.totalPgive, 0)}
                </Text>
                <Text className="nodeSubHeader">pGIVE</Text>
              </Box>
              <Box css={{ ...nodePanelStyle }}>
                <Text className="nodeHeader">
                  {numberWithCommas(cosoul_data.organizationCount, 0)}
                </Text>
                <Text className="nodeSubHeader">Organizations</Text>
              </Box>
              <Box css={{ ...nodePanelStyle }}>
                <Text className="nodeHeader">
                  {numberWithCommas(cosoul_data.circleCount, 0)}
                </Text>
                <Text className="nodeSubHeader">Circles</Text>
              </Box>
              <Box css={{ ...nodePanelStyle }}>
                <Text className="nodeHeader">
                  {numberWithCommas(cosoul_data.contributionCount, 0)}
                </Text>
                <Text className="nodeSubHeader">Contributions</Text>
              </Box>
              <Box css={{ ...nodePanelStyle }}>
                <Text className="nodeHeader">
                  {numberWithCommas(cosoul_data.noteCount, 0)}
                </Text>
                <Text className="nodeSubHeader">Notes Received</Text>
              </Box>
              <Box css={{ ...nodePanelStyle }}>
                <Text className="nodeHeader">
                  {numberWithCommas(cosoul_data.epochCount, 0)}
                </Text>
                <Text className="nodeSubHeader">Active Epochs</Text>
              </Box>
            </Panel>
          </Flex>
        )}
      </Flex>
    </>
  );
};
