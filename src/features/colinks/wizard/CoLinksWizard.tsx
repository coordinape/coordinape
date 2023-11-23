import { useWalletStatus } from 'features/auth';
import { chain } from 'features/cosoul/chains';
import { useNavQuery } from 'features/nav/getNavData';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

import { GlobalUi } from 'components/GlobalUi';
import { useWeb3React } from 'hooks/useWeb3React';
import { EmailBanner } from 'pages/ProfilePage/EmailSettings/EmailBanner';
import { Flex } from 'ui';

import { WizardList } from './WizardList';
import { WizardSteps } from './WizardSteps';

export const QUERY_KEY_COLINKS = 'coLinks';

export const CoLinksWizard = () => {
  const { data } = useNavQuery();
  const { chainId, account } = useWeb3React();
  const onCorrectChain = chainId === Number(chain.chainId);
  const { address } = useWalletStatus();
  const hasCoSoul = !!data?.profile.cosoul;

  const description = data?.profile?.description;

  // TODO: rename step
  const hasName = !!description;

  const { data: myProfile } = useQuery(
    [QUERY_KEY_COLINKS, address, 'wizard'],
    async () => {
      const { profiles_public } = await client.query(
        {
          profiles_public: [
            {
              where: {
                address: {
                  _ilike: address,
                },
              },
              limit: 1,
            },
            {
              id: true,
              name: true,
              avatar: true,
              reputation_score: {
                total_score: true,
              },
            },
          ],
        },
        {
          operationName: 'coLinks_wizard',
        }
      );
      return profiles_public.pop();
    }
  );

  const hasRep = !!myProfile?.reputation_score?.total_score;
  const { data: keyData } = useQuery(
    [QUERY_KEY_COLINKS, address, 'wizardKeys'],
    async () => {
      const { hasOwnKey, hasOtherKey } = await client.query(
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
            hasOtherKey: {
              link_holders: [
                {
                  where: {
                    holder: {
                      _eq: address,
                    },
                    target: {
                      _neq: address,
                    },
                  },
                  limit: 1,
                },
                {
                  amount: true,
                  target: true,
                },
              ],
            },
          },
        },
        {
          operationName: 'coLinks_hasOwnAndOtherKeys',
        }
      );
      return {
        hasOwnKey: hasOwnKey[0]?.amount > 0,
        hasOtherKey: hasOtherKey[0]?.amount > 0,
      };
    }
  );

  const readyData =
    keyData && myProfile && data && chainId && account && address;

  return (
    <Flex css={{ flexGrow: 1, height: '100vh', width: '100vw' }}>
      <Flex
        column
        css={{
          height: '100vh',
          width: '100%',
        }}
      >
        <EmailBanner />
        <GlobalUi />
        {readyData && (
          <>
            <WizardSteps
              progress={{
                address,
                onCorrectChain: onCorrectChain,
                hasName,
                hasRep,
                hasCoSoul,
                hasOwnKey: keyData.hasOwnKey,
                hasOtherKey: keyData.hasOtherKey,
              }}
              repScore={myProfile?.reputation_score?.total_score}
            />
            <Flex css={{ position: 'absolute', right: 0, bottom: 0 }}>
              <WizardList
                progress={{
                  address,
                  onCorrectChain: onCorrectChain,
                  hasName,
                  hasRep,
                  hasCoSoul,
                  hasOwnKey: keyData.hasOwnKey,
                  hasOtherKey: keyData.hasOtherKey,
                }}
              />
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
};
