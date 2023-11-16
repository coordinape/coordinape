import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';

import { LoadingModal } from '../../components';
import { QUERY_KEY_COLINKS } from '../../features/colinks/CoLinksWizard';
import useConnectedAddress from '../../hooks/useConnectedAddress';
import { client } from '../../lib/gql/client';
import { paths } from '../../routes/paths';

// Routes recently logged in users to either the colinks app or the colinks wizard
export const LaunchPage = () => {
  const address = useConnectedAddress();
  const navigate = useNavigate();

  const { data: keyData } = useQuery(
    [QUERY_KEY_COLINKS, address, 'splashKey'],
    async () => {
      const { hasOwnKey } = await client.query(
        {
          __alias: {
            hasOwnKey: {
              link_holders: [
                {
                  where: {
                    holder: {
                      _eq: address,
                    },
                    target: {
                      _eq: address,
                    },
                  },
                  limit: 1,
                },
                {
                  amount: true,
                  holder: true,
                },
              ],
            },
          },
        },
        {
          operationName: 'coLinks_hasOwnKey',
        }
      );
      return {
        hasOwnKey: hasOwnKey[0]?.amount > 0,
      };
    },
    {
      enabled: !!address,
    }
  );

  if (keyData !== undefined) {
    if (keyData.hasOwnKey) {
      navigate(paths.coLinksHome);
    } else {
      navigate(paths.coLinksWizardStart);
    }
  }
  return <LoadingModal visible={true} />;
};
