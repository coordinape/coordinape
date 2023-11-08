import { useLoginData } from 'features/auth';
import { useQuery } from 'react-query';

import { Box } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { CoSoulArt } from './art/CoSoulArt';
import { CoLinksCoSoulArtContainer } from './CoLinksCoSoulArtContainer';
import { coSoulCloud } from './CoSoulArtContainer';
import { getCoSoulData, QUERY_KEY_COSOUL_PAGE } from './getCoSoulData';

export const artWidthMobile = '320px';
export const artWidth = '500px';

export const CoLinksMintPage = ({ minted }: { minted: boolean }) => {
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
          {/* <Button size="small" onClick={() => setMinted(prev => !prev)}>
            Test mint animations
          </Button> */}
          <CoLinksCoSoulArtContainer cosoul_data={cosoul_data} minted={minted}>
            <CoSoulArt pGive={cosoul_data.totalPgive} address={address} />
            <Box css={{ ...coSoulCloud, zIndex: -1 }} />
          </CoLinksCoSoulArtContainer>
        </SingleColumnLayout>
      )}
    </>
  );
};
