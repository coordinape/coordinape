import { useEffect } from 'react';

import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { useAccount } from 'wagmi';

import { LoadingModal } from '../../components';
import { QUERY_KEY_COLINKS } from '../../features/colinks/wizard/CoLinksWizard';
import { useWeb3React } from '../../hooks/useWeb3React';
import { client } from '../../lib/gql/client';
import { coLinksPaths } from '../../routes/paths';

// Routes recently logged in users to either the colinks app or the colinks wizard
export const LaunchPage = () => {
  const { isConnected } = useAccount();

  const { account: address } = useWeb3React();
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

  useEffect(() => {
    // get a new wallet connection
    if (!isConnected) {
      navigate(coLinksPaths.wizardStart, {
        replace: true,
      });
    } else if (keyData !== undefined) {
      if (keyData.hasOwnKey) {
        navigate(coLinksPaths.home, {
          replace: true,
        });
      } else {
        navigate(coLinksPaths.wizardStart, {
          replace: true,
        });
      }
    }
  }, [address, keyData, isConnected]);

  return <LoadingModal visible={true} />;
};
