import { useEffect } from 'react';

import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';

import { LoadingModal } from '../../components';
import { useAuthStore } from '../../features/auth';
import { useAuthStateMachine } from '../../features/auth/RequireAuth';
import { QUERY_KEY_COLINKS } from '../../features/colinks/wizard/CoLinksWizard';
import { useWeb3React } from '../../hooks/useWeb3React';
import { client } from '../../lib/gql/client';
import { coLinksPaths } from '../../routes/paths';

// Routes recently logged in users to either the colinks app or the colinks wizard
export const LaunchPage = () => {
  useAuthStateMachine(false, false);
  const authStep = useAuthStore(state => state.step);
  const web3Context = useWeb3React();

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
    if (authStep === 'connect' && !web3Context.active) {
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
  }, [address, keyData, authStep, web3Context]);

  return <LoadingModal visible={true} />;
};
