import { Box, Flex, Text } from 'ui';
import { numberWithCommas } from 'utils';

import { nodeLineStyle, nodeStyle } from './CoSoulCompositionRep';
import { QueryCoSoulResult } from './getCoSoulData';

type CoSoulData = QueryCoSoulResult;
export const InitialRepDetail = ({
  cosoul_data,
}: {
  cosoul_data: CoSoulData;
}) => {
  return (
    <Flex
      css={{
        position: 'absolute',
        // refactor for no magic numbers please
        width: '910px',
        left: '-205px',
        top: '$xs',
        '@md': {
          width: '750px',
          left: '-125px',
        },
        '@sm': {
          position: 'static',
          width: 'auto',
        },
      }}
    >
      {/* Nodes Container */}
      <Box
        css={{
          width: '100%',
          height: '400px',
          position: 'absolute',
          top: '$3xl',
          zIndex: -1,
          '@sm': {
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            top: '-$xl',
            width: '100%',
            height: 'auto',
            background: '$surface',
            mt: 0,
            p: '0 $sm $sm',
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
          <Text className="nodeHeader">
            {numberWithCommas(cosoul_data.totalPgive, 0)}
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
          <Text className="nodeHeader">
            {numberWithCommas(cosoul_data.reputation?.github_score, 0)}
          </Text>
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
          <Text className="nodeHeader">
            {numberWithCommas(cosoul_data.reputation?.twitter_score, 0)}
          </Text>

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
          <Text className="nodeHeader">
            {numberWithCommas(cosoul_data.reputation?.email_score, 0)}
          </Text>

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
          <Text className="nodeHeader">
            {numberWithCommas(cosoul_data.reputation?.linkedin_score, 0)}
          </Text>

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
          <Text className="nodeHeader">
            {numberWithCommas(cosoul_data.reputation?.poap_score, 0)}
          </Text>

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
          <Text className="nodeHeader">
            {numberWithCommas(cosoul_data.reputation?.links_score, 0)}
          </Text>

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
          <Text className="nodeHeader">
            {numberWithCommas(cosoul_data.reputation?.invite_score, 0)}
          </Text>

          <Text className="nodeSubHeader">Invites</Text>
        </Box>
      </Box>
    </Flex>
  );
};
