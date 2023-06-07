import { Text, Box, Flex } from 'ui';
import { numberWithCommas } from 'utils';

import { QueryCoSoulResult } from './getCoSoulData';
import { artWidth } from './MintPage';
import './glitch.css';

type CoSoulData = QueryCoSoulResult;

export const CoSoulComposition = ({
  cosoul_data,
  children,
}: {
  cosoul_data: CoSoulData;
  children: React.ReactNode;
}) => {
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

  // Math.floor(Math.random() * (max - min + 1) + min);
  function generateRandom1DigitNumber() {
    return Math.floor(Math.random() * (9 - 1 + 1) + 1);
  }
  function generateRandom2DigitNumber() {
    return Math.floor(Math.random() * (99 - 10 + 1) + 10);
  }
  function generateRandom3DigitNumber() {
    return Math.floor(Math.random() * (999 - 100 + 1) + 100);
  }

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
            background: mintInfo ? 'transparent' : 'black',
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
            className={`nodeHeader ${!mintInfo && 'glitch glitch2'}`}
            data-text={generateRandom3DigitNumber()}
          >
            {mintInfo
              ? numberWithCommas(cosoul_data.totalPgive, 0)
              : generateRandom3DigitNumber()}
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
            className={`nodeHeader ${!mintInfo && 'glitch glitch2'}`}
            data-text={generateRandom1DigitNumber()}
          >
            {mintInfo
              ? numberWithCommas(cosoul_data.organizationCount, 0)
              : generateRandom1DigitNumber()}
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
            className={`nodeHeader ${!mintInfo && 'glitch glitch3'}`}
            data-text={generateRandom1DigitNumber()}
          >
            {mintInfo
              ? numberWithCommas(cosoul_data.circleCount, 0)
              : generateRandom1DigitNumber()}
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
            className={`nodeHeader ${!mintInfo && 'glitch glitch4'}`}
            data-text={generateRandom3DigitNumber()}
          >
            {mintInfo
              ? numberWithCommas(cosoul_data.contributionCount, 0)
              : generateRandom3DigitNumber()}
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
            className={`nodeHeader ${!mintInfo && 'glitch glitch5'}`}
            data-text={generateRandom3DigitNumber()}
          >
            {mintInfo
              ? numberWithCommas(cosoul_data.noteCount, 0)
              : generateRandom3DigitNumber()}
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
            className={`nodeHeader ${!mintInfo && 'glitch glitch6'}`}
            data-text={generateRandom2DigitNumber()}
          >
            {mintInfo
              ? numberWithCommas(cosoul_data.epochCount, 0)
              : generateRandom2DigitNumber()}
          </Text>
          <Text className="nodeSubHeader">Active epochs</Text>
        </Box>
      </Flex>
    </Flex>
  );
};
