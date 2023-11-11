import { Dispatch, useRef } from 'react';

import { useLoginData } from 'features/auth';
import { fadeIn } from 'keyframes';
import { useQuery } from 'react-query';
import { CSSTransition } from 'react-transition-group';

import { Box, Button, Flex, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { CoSoulArt } from './art/CoSoulArt';
import { CoLinksCoSoulArtContainer } from './CoLinksCoSoulArtContainer';
import { coSoulCloud } from './CoSoulArtContainer';
import { getCoSoulData, QUERY_KEY_COSOUL_PAGE } from './getCoSoulData';

export const artWidthMobile = '320px';
export const artWidth = '500px';

export const CoLinksMintPage = ({
  minted,
  setShowStepCoSoul,
}: {
  minted: boolean;
  setShowStepCoSoul: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const profile = useLoginData();
  const address = profile?.address;
  const profileId = profile?.id;
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
            m: 'auto',
            alignItems: 'center',
            maxWidth: '1200px',
            gap: 0,
            mb: 200,
            pointerEvents: 'auto',
          }}
        >
          <CoLinksCoSoulArtContainer cosoul_data={cosoul_data} minted={minted}>
            <CoSoulArt
              pGive={cosoul_data.totalPgive}
              address={address}
              repScore={cosoul_data.repScore}
            />
            <Box css={{ ...coSoulCloud, zIndex: -1 }} />
          </CoLinksCoSoulArtContainer>

          <CSSTransition
            in={!minted}
            nodeRef={nodeRefContinue}
            timeout={6000}
            classNames="art-container-continue"
            appear
          >
            <Flex
              ref={nodeRefContinue}
              column
              css={{
                mt: '$md',
                gap: '$md',
                width: artWidth,
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
              <Text>
                Nice! This is your CoSoul Artwork. It will grow in complexity as
                you use CoLinks.
              </Text>
              <Text>
                You can build up your CoSoul and Rep score by using the app and
                making connections.
              </Text>
              <Button
                color="cta"
                size="large"
                onClick={() => setShowStepCoSoul(false)}
              >
                Continue to Next Step
              </Button>
            </Flex>
          </CSSTransition>
        </SingleColumnLayout>
      )}
    </>
  );
};
