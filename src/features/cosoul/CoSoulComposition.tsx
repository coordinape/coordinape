import { useEffect, useRef } from 'react';

import { CSSTransition } from 'react-transition-group';

import { Text, Box, Flex } from 'ui';
import { numberWithCommas } from 'utils';

import { QueryCoSoulResult } from './getCoSoulData';
import { artWidth } from './MintPage';
import { generateRandomNumber, scrambleNumber } from './numberScramble';
import './glitch.css';
import './coSoulAnimations.css';

type CoSoulData = QueryCoSoulResult;

export const CoSoulComposition = ({
  cosoul_data,
  children,
  minted,
}: {
  cosoul_data: CoSoulData;
  children: React.ReactNode;
  minted?: boolean;
}) => {
  const coSoulMinted = cosoul_data.mintInfo
    ? Boolean(cosoul_data.mintInfo)
    : minted;
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
      Object.values(nodes).forEach(node => scrambleNumber(node.current));
    }
  }, [coSoulMinted]);
  const nodeWidth = '180px';
  const nodeBorderWidth = '2px';
  const nodeDetails = {
    position: 'static',
    width: '50%',
    mt: '$md',
  };
  const nodeStyle = {
    width: `${nodeWidth}`,
    p: '$sm $sm $md',
    position: 'absolute',
    borderBottom: `${nodeBorderWidth} solid $border `,
    zIndex: -1,
    '.nodeHeader': {
      fontSize: '45px',
      '@md': {
        fontSize: '40px',
      },
      fontWeight: '$semibold',
      color: '$secondaryButtonText',
    },
    '.nodeSubHeader': {
      fontSize: '$small',
      color: '$ctaHover',
    },
    '.dud': {
      textShadow: 'indigo 2px 2px',
    },
    '@sm': {
      ...nodeDetails,
      zIndex: 1,
    },
  };
  const nodeLineStyle = {
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

  return (
    <Flex
      column
      css={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {children}

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
            zIndex: -1,
            '@sm': {
              position: 'relative',
              flexWrap: 'wrap',
              width: '100%',
              maxWidth: `${artWidth}`,
              border: '2px solid $border',
              background: coSoulMinted ? 'transparent' : 'black',
              mt: '$1xl',
              p: '0 $md $lg $md',
              borderRadius: '$3',
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
                {numberWithCommas(cosoul_data.organizationCount, 0)}
              </Text>
            )}
            <Text className="nodeSubHeader">Organizations</Text>
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
                {numberWithCommas(cosoul_data.circleCount, 0)}
              </Text>
            )}
            <Text className="nodeSubHeader">Circles</Text>
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
                {numberWithCommas(cosoul_data.contributionCount, 0)}
              </Text>
            )}
            <Text className="nodeSubHeader">Contributions</Text>
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
                {numberWithCommas(cosoul_data.noteCount, 0)}
              </Text>
            )}
            <Text className="nodeSubHeader">Notes received</Text>
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
                {numberWithCommas(cosoul_data.epochCount, 0)}
              </Text>
            )}
            <Text className="nodeSubHeader">Active epochs</Text>
          </Box>
        </Flex>
      </CSSTransition>
    </Flex>
  );
};
