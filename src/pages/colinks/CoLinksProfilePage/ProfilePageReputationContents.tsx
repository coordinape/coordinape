import { QUERY_KEY_COSOUL_VIEW, artWidth } from 'features/cosoul';
import { CoSoulArt } from 'features/cosoul/art/CoSoulArt';
import { CoSoulArtContainer } from 'features/cosoul/CoSoulArtContainer';
import { CoSoulCompositionRep } from 'features/cosoul/CoSoulCompositionRep';
import { CoSoulPromo } from 'features/cosoul/CoSoulPromo';
import { useQuery } from 'react-query';

import { CosoulData } from '../../../../_api/cosoul/[address]';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { Flex, Panel, Text } from 'ui';

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
  coSoulMinted = !!cosoul_data?.mintInfo;

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
      {cosoul_data && coSoulMinted ? (
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
      ) : (
        <Flex
          column
          css={{
            justifyContent: 'center',
            height: `${artWidth}`,
            alignItems: 'center',
            position: 'relative',
            gap: '$sm',
          }}
        >
          <Text tag color="secondary">
            No CoSoul minted for this address
          </Text>
          {cosoul_data && (
            <CoSoulPromo
              css={{ mt: 0 }}
              cosoul_data={cosoul_data}
              address={targetAddress}
            />
          )}
        </Flex>
      )}
    </>
  );
};
