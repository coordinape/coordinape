import { useRef } from 'react';

import { coSoulNodesCycle, fadeIn } from 'keyframes';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { dark } from 'stitches.config';

import useConnectedAddress from 'hooks/useConnectedAddress';
import useProfileId from 'hooks/useProfileId';
import { coLinksPaths } from 'routes/paths';
import { Box, Button, Flex, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { CoSoulArt } from './art/CoSoulArt';
import { CoLinksCoSoulArtContainer } from './CoLinksCoSoulArtContainer';
import { coSoulCloud } from './CoSoulArtContainer';
import { getCoSoulData, QUERY_KEY_COSOUL_PAGE } from './getCoSoulData';
import { InitialRepDetail } from './InitialRepDetail';

export const artWidthMobile = '320px';
export const artWidth = '500px';

export const CoLinksMintPage = ({ minted }: { minted: boolean }) => {
  const address = useConnectedAddress(true);
  const profileId = useProfileId(true);
  const nodeRef = useRef(null);
  const nodeRefHeader = useRef(null);
  const nodeRefContinue = useRef(null);
  const query = useQuery(
    [QUERY_KEY_COSOUL_PAGE, profileId, address],
    () => getCoSoulData(profileId, address as string),
    {
      enabled: !!profileId && !!address,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  const cosoul_data = query.data;

  return (
    <>
      {cosoul_data && (
        <SingleColumnLayout
          css={{
            m: '$lg auto $lg',
            alignItems: 'center',
            maxWidth: '1200px',
            gap: 0,
            mb: 200,
            pointerEvents: 'auto',
          }}
        >
          <Box className={dark} css={{ mt: '-$lg' }}>
            <CSSTransition
              in={!minted}
              nodeRef={nodeRefHeader}
              timeout={2000}
              classNames="art-container-continue"
              appear
            >
              <Flex
                ref={nodeRefHeader}
                css={{
                  opacity: minted ? 1 : 0,
                  '&.art-container-continue-exit, &.art-container-continue-exit-active':
                    {
                      animation: `${fadeIn} 600ms ease-in-out`,
                    },
                }}
              >
                <Text
                  h2
                  display
                  css={{
                    color: '$linkHover',
                    pb: '$xs',
                    mb: '$md',
                    width: '100%',
                    justifyContent: 'center',
                  }}
                >
                  Your CoSoul
                </Text>
              </Flex>
            </CSSTransition>
            <Flex
              column
              css={{
                '@sm': {
                  flexDirection: 'column-reverse',
                },
              }}
            >
              <CSSTransition
                in={!minted}
                nodeRef={nodeRef}
                timeout={4000}
                classNames="composition"
                appear
              >
                <Box
                  ref={nodeRef}
                  css={{
                    transform: minted ? 'scale(1)' : 'scale(0)',
                    opacity: minted ? 1 : 0,
                    '&.composition-exit, &.composition-exit-active': {
                      animation: `${coSoulNodesCycle} 2000ms ease-in-out`,
                    },
                  }}
                >
                  <InitialRepDetail cosoul_data={cosoul_data} />
                </Box>
              </CSSTransition>
              <CoLinksCoSoulArtContainer
                css={{
                  scale: 0.8,
                  '@sm': {
                    mt: 0,
                    scale: 0.9,
                    height: 'auto',
                    width: 'auto',
                  },
                }}
                cosoul_data={cosoul_data}
                minted={minted}
              >
                <CoSoulArt
                  pGive={cosoul_data.totalPgive}
                  address={address}
                  repScore={cosoul_data.repScore}
                />
                <Box css={{ ...coSoulCloud, zIndex: -1 }} />
              </CoLinksCoSoulArtContainer>
            </Flex>
            <CSSTransition
              in={!minted}
              nodeRef={nodeRefContinue}
              timeout={2000}
              classNames="art-container-continue"
              appear
            >
              <Flex
                ref={nodeRefContinue}
                column
                css={{
                  mt: '$md',
                  mb: '$4xl',
                  gap: '$md',
                  width: artWidth,
                  color: '$text',
                  '@sm': {
                    width: artWidthMobile,
                  },
                  opacity: minted ? 1 : 0,
                  '&.art-container-continue-exit, &.art-container-continue-exit-active':
                    {
                      animation: `${fadeIn} 2000ms ease-in-out`,
                    },
                }}
              >
                <Text
                  h1
                  css={{
                    mt: '-$xl',
                    mb: '$sm',
                    color: '$text',
                    textAlign: 'center',
                    width: '100%',
                    display: 'block',
                  }}
                >
                  Build your stats
                  <br />
                  Evolve your CoSoul
                </Text>
                <Button
                  as={NavLink}
                  color="cta"
                  size="large"
                  to={coLinksPaths.root}
                >
                  Start Giving
                </Button>
              </Flex>
            </CSSTransition>
          </Box>
        </SingleColumnLayout>
      )}
    </>
  );
};
