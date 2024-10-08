import { useCoLinksNavQuery } from 'features/colinks/useCoLinksNavQuery';
import { WizardCoSoulSteps } from 'features/colinks/wizard/WizardCoSoulSteps';
import { TOS_UPDATED_AT } from 'features/colinks/wizard/WizardTerms';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';
import { useAccount } from 'wagmi';

import { GlobalUi } from 'components/GlobalUi';
import { EmailBanner } from 'pages/ProfilePage/EmailSettings/EmailBanner';
import { Flex } from 'ui';

export const QUERY_KEY_COLINKS = 'coLinks';

export const CoSoulWizard = () => {
  const { data } = useCoLinksNavQuery();
  const { chainId, address } = useAccount();

  const hasName =
    !!data?.profile?.name && !data.profile.name.startsWith('New User');

  const hasCoSoul = !!data?.profile.cosoul;
  const { data: myProfile } = useQuery(
    [QUERY_KEY_COLINKS, address, 'wizard'],
    async () => {
      const { profiles } = await client.query(
        {
          profiles: [
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
              tos_agreed_at: true,
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
      return profiles.pop();
    }
  );

  const hasRep = !!myProfile?.reputation_score?.total_score;
  const acceptedTOS =
    new Date(myProfile?.tos_agreed_at) >= new Date(TOS_UPDATED_AT);

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

  const readyData = keyData && myProfile && data && chainId && address;

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
            <WizardCoSoulSteps
              progress={{
                address,
                hasName,
                hasRep,
                hasCoSoul,
                hasOwnKey: keyData.hasOwnKey,
                acceptedTOS,
              }}
              repScore={myProfile?.reputation_score?.total_score}
            />
          </>
        )}
      </Flex>
    </Flex>
  );
};
