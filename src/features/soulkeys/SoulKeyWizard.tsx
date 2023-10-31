import { useWalletStatus } from 'features/auth';
import { chain } from 'features/cosoul/chains';
import { CoSoulGate } from 'features/cosoul/CoSoulGate';
import { useNavQuery } from 'features/nav/getNavData';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

import { Check, Square } from '../../icons/__generated';
import { useWeb3React } from 'hooks/useWeb3React';
import { Flex, Panel, Text } from 'ui';

import { SoulKeysChainGate } from './SoulKeysChainGate';

const Step = ({ label, test }: { label: string; test?: boolean }) => {
  return (
    <Flex css={{ justifyContent: 'space-between' }}>
      <Text>{label}</Text>
      {test ? <Check color="complete" /> : <Square color="warning" />}
    </Flex>
  );
};
export const SoulKeyWizard = () => {
  const { data } = useNavQuery();
  const name = data?.profile.name;
  const { chainId } = useWeb3React();
  const { address } = useWalletStatus();
  const onCorrectChain = chainId === Number(chain.chainId);
  const hasName = name && !name.startsWith('New User') && !!address;
  const hasCoSoul = !!data?.profile.cosoul;

  const { data: myProfile } = useQuery(
    ['soulKeys', address, 'wizard'],
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
              relationship_score: {
                total_score: true,
              },
            },
          ],
        },
        {
          operationName: 'soulKeys_wizard',
        }
      );
      return profiles_public.pop();
    }
  );

  const { data: keyData } = useQuery(
    ['soulKeys', address, 'wizardKeys'],
    async () => {
      const { hasOwnKey, hasOtherKey } = await client.query(
        {
          __alias: {
            hasOwnKey: {
              key_holders: [
                {
                  where: {
                    address: {
                      _eq: address,
                    },
                    subject: {
                      _eq: address,
                    },
                  },
                  limit: 1,
                },
                {
                  amount: true,
                  address: true,
                },
              ],
            },
            hasOtherKey: {
              key_holders: [
                {
                  where: {
                    address: {
                      _eq: address,
                    },
                    subject: {
                      _neq: address,
                    },
                  },
                  limit: 1,
                },
                {
                  amount: true,
                  subject: true,
                },
              ],
            },
          },
        },
        {
          operationName: 'soulKeys_hasOwnAndOtherKeys',
        }
      );
      return {
        hasOwnKey: hasOwnKey[0]?.amount > 0,
        hasOtherKey: hasOtherKey[0]?.amount > 0,
      };
    }
  );

  if (!keyData || !myProfile) {
    return <></>;
  }

  return (
    <>
      <Panel nested css={{ gap: '$sm' }}>
        <Step label="Connect Wallet" test={!!address} />
        <Step label="On Optimism" test={chain && onCorrectChain} />
        <Step label="CoSoul" test={hasCoSoul} />
        <Step label="Name" test={hasName} />
        <Step
          label="Connect Rep"
          test={!!myProfile?.relationship_score?.total_score}
        />
        <Step label="Buy Your Own Link" test={keyData?.hasOwnKey} />
        <Step label="Buy Other Links" test={keyData?.hasOtherKey} />
      </Panel>
      <SoulKeysChainGate actionName="Use SoulKeys">
        {(contracts, currentUserAddress) => (
          <Flex column>
            <Text>on optimism</Text>
            <CoSoulGate
              contracts={contracts}
              address={currentUserAddress}
              message={'to Use SoulKeys'}
            >
              {() => <Text>hasCoSoul</Text>}
            </CoSoulGate>
          </Flex>
        )}
      </SoulKeysChainGate>
    </>
  );
};
