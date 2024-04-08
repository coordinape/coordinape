import { useEffect } from 'react';

import { useWalletStatus } from 'features/auth';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';

import { REQUIRE_INVITE_CODE } from '../../../pages/colinks/LaunchPage';
import { coLinksPaths } from '../../../routes/paths';
import { useCoLinksNavQuery } from '../useCoLinksNavQuery';
import { GlobalUi } from 'components/GlobalUi';
import { useWeb3React } from 'hooks/useWeb3React';
import { EmailBanner } from 'pages/ProfilePage/EmailSettings/EmailBanner';
import { Flex } from 'ui';

import { WizardList } from './WizardList';
import { WizardSteps } from './WizardSteps';

export const QUERY_KEY_COLINKS = 'coLinks';

export const CoLinksWizard = () => {
  const { data } = useCoLinksNavQuery();
  const { chainId, account } = useWeb3React();
  const { address } = useWalletStatus();
  const navigate = useNavigate();
  const hasCoSoul = !!data?.profile.cosoul;

  const description = data?.profile?.description;

  // TODO: rename step
  const hasName = !!description;

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
              invite_code_redeemed_at: true,
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

  const { data: checkEthDenverInvitee } = useQuery(
    ['colink_checkEthDenverInvitee', address, 'wizard'],
    async () => {
      const { checkEthDenverInvitee } = await client.query(
        {
          checkEthDenverInvitee: { is_eth_denver_invitee: true },
        },
        {
          operationName: 'coLinks_wizard',
        }
      );
      return checkEthDenverInvitee;
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
    keyData &&
    myProfile &&
    data &&
    chainId &&
    account &&
    address &&
    checkEthDenverInvitee;

  useEffect(() => {
    if (data?.profile && REQUIRE_INVITE_CODE) {
      if (
        !data.profile.invite_code_redeemed_at
        // !data.profile.invite_code_requested_at
      ) {
        navigate(coLinksPaths.wizardStart);
      }
    }
  }, [data]);

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
                hasName,
                hasRep,
                hasCoSoul,
                hasOwnKey: keyData.hasOwnKey,
                hasOtherKey: keyData.hasOtherKey,
                isEthDenverInvitee: checkEthDenverInvitee.is_eth_denver_invitee,
              }}
              repScore={myProfile?.reputation_score?.total_score}
            />
            <Flex
              css={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                '@sm': {
                  display: 'none',
                },
              }}
            >
              <WizardList
                progress={{
                  address,
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
