import { useEffect } from 'react';

import { QUERY_KEY_COSOUL_VIEW } from 'features/cosoul';
import { CoSoulArt } from 'features/cosoul/art/CoSoulArt';
import { artWidthMobile } from 'features/cosoul/constants';
import { CoSoulArtContainer } from 'features/cosoul/CoSoulArtContainer';
import { CoSoulCompositionRep } from 'features/cosoul/CoSoulCompositionRep';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { CosoulData } from '../../../../_api/cosoul/[address]';
import { LoadingIndicator } from 'components/LoadingIndicator';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { coLinksPaths } from 'routes/paths';
import { Button, Panel, Text } from 'ui';

export const ProfilePageReputationContents = ({
  targetAddress,
}: {
  targetAddress: string;
}) => {
  let coSoulMinted;
  const {
    data: cosoul_data,
    isLoading: coSoulLoading,
    isError,
    error,
    refetch,
  } = useQuery(
    [QUERY_KEY_COSOUL_VIEW, targetAddress],
    async (): Promise<CosoulData> => {
      const res = await fetch('/api/cosoul/' + targetAddress);
      if (res.status === 404) {
        coSoulMinted = false;
      } else if (!res.ok) {
        throw new Error('Failed to fetch cosoul data');
      }
      return res.json();
    },
    {
      enabled: !!targetAddress,
      retry: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  // Trigger a refetch when the component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

  coSoulMinted = !!cosoul_data?.mintInfo;

  const currentUserAddress = useConnectedAddress(false);
  const isCurrentUser =
    currentUserAddress &&
    targetAddress.toLowerCase() == currentUserAddress.toLowerCase();

  // Error
  if (isError) {
    return (
      <Text h1 color="alert">
        {(error as string).toString()}
      </Text>
    );
  }
  if (!targetAddress || (coSoulLoading && cosoul_data === undefined)) {
    return <LoadingIndicator />;
  }
  if (cosoul_data === undefined) {
    return <Panel>User not found</Panel>;
  }
  return (
    <>
      {!coSoulMinted && isCurrentUser && (
        <Panel
          noBorder
          css={{
            alignItems: 'center',
            justifyContent: 'center',
            gap: '$sm',
            width: artWidthMobile,
            margin: '0 auto -20px',
            background: '$tagSecondaryBackground',
          }}
        >
          <Text semibold css={{ color: '$tagSecondaryText' }}>
            Bring your Reputation onchain!
          </Text>
          <Button as={NavLink} to={coLinksPaths.cosoul} color="coLinksCta">
            Mint your CoSoul
          </Button>
        </Panel>
      )}
      {cosoul_data && (
        <>
          <CoSoulCompositionRep cosoul_data={cosoul_data}>
            <CoSoulArtContainer cosoul_data={cosoul_data}>
              <CoSoulArt
                pGive={cosoul_data.totalPgive}
                repScore={cosoul_data.repScore}
                address={targetAddress}
              />
            </CoSoulArtContainer>
          </CoSoulCompositionRep>
        </>
      )}
    </>
  );
};
