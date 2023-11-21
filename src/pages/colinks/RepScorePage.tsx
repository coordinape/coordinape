import { BuyOrSellCoLinks } from 'features/colinks/BuyOrSellCoLinks';
import { artWidth, QUERY_KEY_COSOUL_VIEW } from 'features/cosoul';
import { CoSoulArt } from 'features/cosoul/art/CoSoulArt';
import { CoSoulArtContainer } from 'features/cosoul/CoSoulArtContainer';
import { CoSoulCompositionRep } from 'features/cosoul/CoSoulCompositionRep';
import { CoSoulPromo } from 'features/cosoul/CoSoulPromo';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { CosoulData } from '../../../api/cosoul/[address]';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { CoLinksProvider } from '../../features/colinks/CoLinksContext';
import useConnectedAddress from '../../hooks/useConnectedAddress';
import { coLinksPaths } from '../../routes/paths';
import { AppLink, Avatar, ContentHeader, Flex, Panel, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

export const RepScorePage = () => {
  const currentUserAddress = useConnectedAddress();
  const { address: targetAddress } = useParams();
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
      <SingleColumnLayout
        css={{
          m: 'auto',
          alignItems: 'center',
          gap: 0,
          maxWidth: '1200px',
          minHeight: '100vh',
        }}
      >
        <Text h1 color="alert">
          {(error as string).toString()}
        </Text>
      </SingleColumnLayout>
    );
  }
  if (
    !currentUserAddress ||
    !targetAddress ||
    (coSoulLoading && cosoul_data === undefined)
  ) {
    return <LoadingIndicator />;
  }
  if (cosoul_data === undefined) {
    return <Panel>User not found</Panel>;
  }
  return (
    <SingleColumnLayout>
      <ContentHeader transparent>
        <Flex
          css={{
            justifyContent: 'space-between',
            width: '100%',
            flexGrow: 1,
            gap: '$md',
            '@sm': {
              flexDirection: 'column',
            },
          }}
        >
          <Flex css={{ gap: '$sm', width: '100%' }}>
            <Flex column css={{ gap: '$sm' }}>
              <Flex css={{ alignItems: 'center' }}>
                <Avatar
                  size="large"
                  name={cosoul_data.profileInfo.name}
                  path={cosoul_data.profileInfo.avatar}
                  margin="none"
                  css={{ mr: '$md' }}
                />
                <Text h2 display css={{ color: '$secondaryButtonText' }}>
                  {cosoul_data.profileInfo.name}
                </Text>
                <AppLink
                  to={coLinksPaths.profile(targetAddress)}
                  css={{ ml: '$md' }}
                >
                  View Profile
                </AppLink>
              </Flex>
            </Flex>
          </Flex>
          <Panel css={{ minWidth: '18em', border: 'none' }}>
            <CoLinksProvider>
              <BuyOrSellCoLinks
                subject={targetAddress}
                address={currentUserAddress}
              />
            </CoLinksProvider>
          </Panel>
        </Flex>
      </ContentHeader>
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
    </SingleColumnLayout>
  );
};
