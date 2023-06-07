import { useLoginData } from 'features/auth';
import { useQuery } from 'react-query';

import isFeatureEnabled from 'config/features';
import { SingleColumnLayout } from 'ui/layouts';

import { CoSoulArt } from './art/CoSoulArt';
import { CoSoulArtContainer } from './CoSoulArtContainer';
import { CoSoulComposition } from './CoSoulComposition';
import { CoSoulDetails } from './CoSoulDetails';
import { CoSoulManagement } from './CoSoulManagement';
import { CoSoulProfileInfo } from './CoSoulProfileInfo';
import { getCoSoulData, QUERY_KEY_COSOUL_PAGE } from './getCoSoulData';

export const artWidthMobile = '320px';
export const artWidth = '500px';

export const MintPage = () => {
  const profile = useLoginData();
  const address = profile?.address;
  const profileId = profile?.id;

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

  // eslint-disable-next-line no-console
  console.log({ cosoul_data });

  if (!isFeatureEnabled('cosoul')) {
    return <></>;
  }
  return (
    <>
      {cosoul_data && (
        <SingleColumnLayout
          css={{
            m: 'auto',
            alignItems: 'center',
            maxWidth: '1200px',
            gap: '$1xl',
          }}
        >
          <CoSoulProfileInfo cosoul_data={cosoul_data} />
          <CoSoulManagement cosoul_data={cosoul_data} />
          <CoSoulComposition cosoul_data={cosoul_data}>
            <CoSoulArtContainer cosoul_data={cosoul_data}>
              <CoSoulArt
                pGive={cosoul_data.totalPgive}
                address={address}
                animate={true}
              />
            </CoSoulArtContainer>
          </CoSoulComposition>
          <CoSoulDetails cosoul_data={cosoul_data} />
        </SingleColumnLayout>
      )}
    </>
  );
};
