import { artWidth, QUERY_KEY_COSOUL_VIEW } from 'features/cosoul';
import { CoSoulArt } from 'features/cosoul/art/CoSoulArt';
import { CoSoulArtContainer } from 'features/cosoul/CoSoulArtContainer';
import { CoSoulCompositionRep } from 'features/cosoul/CoSoulCompositionRep';
import { CoSoulPromo } from 'features/cosoul/CoSoulPromo';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { CosoulData } from '../../../api/cosoul/[address]';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { useAuthStore } from '../../features/auth';
import { InviteCodeLink } from '../../features/invites/InviteCodeLink';
import { Avatar, ContentHeader, Flex, Panel, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

export const RepScorePage = () => {
  const profileId = useAuthStore(state => state.profileId);

  const { address } = useParams();
  let coSoulMinted;
  const {
    data: cosoul_data,
    isLoading: coSoulLoading,
    isError,
    error,
  } = useQuery(
    [QUERY_KEY_COSOUL_VIEW, address],
    async (): Promise<CosoulData> => {
      const res = await fetch('/api/cosoul/' + address);
      if (res.status === 404) {
        coSoulMinted = false;
      } else if (!res.ok) {
        throw new Error('Failed to fetch cosoul data');
      }
      return res.json();
    },
    {
      enabled: !!address,
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
  if (coSoulLoading && cosoul_data === undefined) {
    return <LoadingIndicator />;
  }
  if (cosoul_data === undefined) {
    return <Panel>User not found</Panel>;
  }
  return (
    <SingleColumnLayout>
      <ContentHeader transparent>
        <Flex alignItems="center" css={{ gap: '$sm' }}>
          <Avatar
            size="large"
            name={cosoul_data.profileInfo.name}
            path={cosoul_data.profileInfo.avatar}
            margin="none"
            css={{ mr: '$sm' }}
          />
          <Flex column>
            <Text h2 display css={{ color: '$secondaryButtonText' }}>
              {cosoul_data.profileInfo.name}
            </Text>
            <Text>Reputation Score</Text>
          </Flex>
        </Flex>
      </ContentHeader>
      {!!profileId && cosoul_data.profileInfo.id == profileId && (
        <InviteCodeLink profileId={profileId} />
      )}
      {cosoul_data && coSoulMinted ? (
        <>
          <CoSoulCompositionRep cosoul_data={cosoul_data}>
            <CoSoulArtContainer cosoul_data={cosoul_data}>
              <CoSoulArt
                pGive={cosoul_data.totalPgive}
                repScore={cosoul_data.repScore}
                address={address}
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
              address={address}
            />
          )}
        </Flex>
      )}
    </SingleColumnLayout>
  );
};
