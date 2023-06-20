import { useAuthStateMachine } from 'features/auth/RequireAuth';
import { rotate } from 'keyframes';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { CosoulData } from '../../../api/cosoul/[address]';
import { LoadingModal } from 'components';
import isFeatureEnabled from 'config/features';
import { Box, Flex, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { artWidth, artWidthMobile } from '.';
import { CoSoulArt } from './art/CoSoulArt';
import { CoSoulArtContainer } from './CoSoulArtContainer';
import { CoSoulComposition } from './CoSoulComposition';
import { CoSoulDetails } from './CoSoulDetails';
import { CoSoulProfileInfo } from './CoSoulProfileInfo';
import { CoSoulPromo } from './CoSoulPromo';

export const QUERY_KEY_COSOUL_VIEW = 'cosoul_view';
export const ViewPage = () => {
  useAuthStateMachine(false, false);
  const { address } = useParams();

  const { data, isError, isLoading, error } = useQuery(
    [QUERY_KEY_COSOUL_VIEW, address],
    async (): Promise<CosoulData> => {
      const res = await fetch('/api/cosoul/' + address);
      if (!res.ok) {
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
  const coSoulMinted = Boolean(data?.mintInfo);

  if (!isFeatureEnabled('cosoul')) {
    return <></>;
  }

  // Waiting to validate the token
  if (isLoading) {
    return <LoadingModal visible={true} note="cosoul-lookup" />;
  }

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

  return (
    <SingleColumnLayout
      css={{
        m: 'auto',
        alignItems: 'center',
        maxWidth: '1200px',
        gap: '$1xl',
        mb: 200,
      }}
    >
      {data && coSoulMinted ? (
        <>
          <CoSoulProfileInfo cosoul_data={data} />
          <CoSoulPromo cosoul_data={data} address={address} />
          <CoSoulComposition cosoul_data={data}>
            <CoSoulArtContainer cosoul_data={data}>
              <CoSoulArt pGive={data.totalPgive} address={address} />
            </CoSoulArtContainer>
          </CoSoulComposition>
          <CoSoulDetails cosoul_data={data} />
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
          {data && (
            <CoSoulPromo css={{ mt: 0 }} cosoul_data={data} address={address} />
          )}
          <Box
            css={{
              position: 'absolute',
              top: '$lg',
              zIndex: -1,
              background: 'linear-gradient(#6c47d7, #311974)',
              animation: `${rotate} 50s cubic-bezier(0.8, 0.2, 0.2, 0.8) alternate infinite`,
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%;',
              width: `${artWidth}`,
              height: `${artWidth}`,
              filter: `blur(calc(${artWidth} / 5))`,
              '@sm': {
                maxWidth: `${artWidthMobile}`,
                height: `${artWidthMobile}`,
                filter: `blur(calc(${artWidthMobile} / 5))`,
              },
            }}
          />
        </Flex>
      )}
    </SingleColumnLayout>
  );
};
