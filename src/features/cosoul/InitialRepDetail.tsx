import { useRef } from 'react';

import { coSoulNodesCycle } from 'keyframes';
import { CSSTransition } from 'react-transition-group';

import { Box, Flex, Text } from 'ui';
import { numberWithCommas } from 'utils';

import { artWidth } from './constants';
import { nodeLineStyle, nodeStyle } from './CoSoulCompositionRep';
import { QueryCoSoulResult } from './getCoSoulData';

type CoSoulData = QueryCoSoulResult;
export const InitialRepDetail = ({
  cosoul_data,
  children,
  minted,
}: {
  cosoul_data: CoSoulData;
  children: React.ReactNode;
  minted: boolean;
}) => {
  const coSoulMinted = Boolean(cosoul_data.mintInfo ?? minted);
  const nodeRef = useRef(null);
  return (
    <Flex column>
      {children}
      <Flex>
        {/* Nodes Container */}
        <CSSTransition
          in={!coSoulMinted}
          nodeRef={nodeRef}
          timeout={6000}
          classNames="composition"
          appear
        >
          <Box
            ref={nodeRef}
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
                opacity: coSoulMinted ? 0 : 1,
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
              <Text className="nodeHeader">
                {numberWithCommas(cosoul_data.totalPgive, 0)}
              </Text>
              <Text className="nodeSubHeader">
                xxxxx{coSoulMinted ? 'minted' : 'shit'}pGIVE
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
        </CSSTransition>
      </Flex>
    </Flex>
  );
};
