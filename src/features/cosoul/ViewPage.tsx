import { useAuthStateMachine } from 'features/auth/RequireAuth';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { CosoulData } from '../../../api/cosoul/[address]';
import { LoadingModal } from 'components';
import isFeatureEnabled from 'config/features';
import { Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

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

  if (!isFeatureEnabled('cosoul')) {
    return <></>;
  }

  // Waiting to validate the token
  if (isLoading) {
    return <LoadingModal visible={true} note="cosoul-lookup" />;
  }

  // eslint-disable-next-line no-console
  console.log({ data });

  // Error
  if (isError) {
    return (
      <SingleColumnLayout
        css={{
          m: 'auto',
          alignItems: 'center',
          gap: '$1xl',
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
    <>
      {data && (
        <SingleColumnLayout
          css={{
            m: 'auto',
            alignItems: 'center',
            maxWidth: '1200px',
            gap: '$1xl',
          }}
        >
          <CoSoulProfileInfo cosoul_data={data} />
          <CoSoulPromo cosoul_data={data} address={address} />
          <CoSoulComposition cosoul_data={data}>
            <CoSoulArtContainer cosoul_data={data}>
              <CoSoulArt pGive={data.totalPgive} address={address} />
            </CoSoulArtContainer>
          </CoSoulComposition>
          <CoSoulDetails cosoul_data={data} />
        </SingleColumnLayout>
      )}
    </>
  );
};
