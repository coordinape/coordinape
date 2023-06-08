import { useEffect } from 'react';

import { Text, Box, Flex } from 'ui';
import { numberWithCommas } from 'utils';

import { QueryCoSoulResult } from './getCoSoulData';
import { artWidth } from './MintPage';
import { generateRandomNumber, startNumberScramble } from './numberScramble';

type CoSoulData = QueryCoSoulResult;

export const CoSoulComposition = ({
  cosoul_data,
  children,
}: {
  cosoul_data: CoSoulData;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    startNumberScramble('.scramble');
  }, []);
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
      fontFamily: 'monospace',
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
      fontStyle: 'italic',
      fontFamily: 'monospace',
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
  const mintInfo = cosoul_data.mintInfo;

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
      <Flex
        row
        css={{
          flexWrap: 'wrap',
          width: '100%',
          maxWidth: `${artWidth}`,
          '@sm': {
            border: '2px solid $border',
            mt: '$md',
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
          <Text
            className={`nodeHeader ${!mintInfo && 'scramble'}`}
            data-digits="3"
          >
            {mintInfo
              ? numberWithCommas(cosoul_data.totalPgive, 0)
              : generateRandomNumber(3)}
          </Text>
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
          <Text
            className={`nodeHeader ${!mintInfo && 'scramble'}`}
            data-digits="1"
          >
            {mintInfo
              ? numberWithCommas(cosoul_data.organizationCount, 0)
              : generateRandomNumber(1)}
          </Text>
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
          <Text
            className={`nodeHeader ${!mintInfo && 'scramble'}`}
            data-digits="1"
          >
            {mintInfo
              ? numberWithCommas(cosoul_data.circleCount, 0)
              : generateRandomNumber(1)}
          </Text>
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
          <Text
            className={`nodeHeader ${!mintInfo && 'scramble'}`}
            data-digits="3"
          >
            {mintInfo
              ? numberWithCommas(cosoul_data.contributionCount, 0)
              : generateRandomNumber(3)}
          </Text>
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
          <Text
            className={`nodeHeader ${!mintInfo && 'scramble'}`}
            data-digits="3"
          >
            {mintInfo
              ? numberWithCommas(cosoul_data.noteCount, 0)
              : generateRandomNumber(3)}
          </Text>
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
          <Text
            className={`nodeHeader ${!mintInfo && 'scramble'}`}
            data-digits="2"
          >
            {mintInfo
              ? numberWithCommas(cosoul_data.epochCount, 0)
              : generateRandomNumber(2)}
          </Text>
          <Text className="nodeSubHeader">Active epochs</Text>
        </Box>
      </Flex>
    </Flex>
  );
};
