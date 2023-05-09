import { useEffect } from 'react';

import { useLoginData } from 'features/auth';
import { useQuery } from 'react-query';

import isFeatureEnabled from 'config/features';
import { SingleColumnLayout } from 'ui/layouts';

import { CoSoulComposition } from './CoSoulComposition';
import { CoSoulDetails } from './CoSoulDetails';
import { CoSoulOverview } from './CoSoulOverview';
import { getCoSoulData, QUERY_KEY_COSOUL_PAGE } from './getCoSoulData';

export const artWidthMobile = '320px';
export const artWidth = '500px';

export const MintPage = () => {
  const profile = useLoginData();
  const address = profile?.address;
  const profileId = profile?.id;
  const query = useQuery(
    [QUERY_KEY_COSOUL_PAGE, profileId, address],
    // @ts-ignore
    () => getCoSoulData(profileId, address)
  );
  const cosoul_data = query.data;
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log({ cosoul_data });
  });

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
            gap: '$1xl',
            maxWidth: '1200px',
          }}
        >
          <CoSoulOverview cosoul_data={cosoul_data} />
          <CoSoulComposition cosoul_data={cosoul_data} />
          <CoSoulDetails cosoul_data={cosoul_data} />
        </SingleColumnLayout>
      )}
    </>
  );
};
