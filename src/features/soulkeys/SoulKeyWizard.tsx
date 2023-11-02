import { useWalletStatus } from 'features/auth';
import { chain } from 'features/cosoul/chains';
import { useNavQuery } from 'features/nav/getNavData';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { Check, Square } from '../../icons/__generated';
import { CreateUserNameForm } from 'components/MainLayout/CreateUserNameForm';
import { useWeb3React } from 'hooks/useWeb3React';
import { Button, Flex, Panel, Text } from 'ui';

import { SoulKeysChainGate } from './SoulKeysChainGate';

export const QUERY_KEY_SOULKEYS = 'soulKeys';

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
    [QUERY_KEY_SOULKEYS, address, 'wizard'],
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

  const hasRep = !!myProfile?.relationship_score?.total_score;
  const { data: keyData } = useQuery(
    [QUERY_KEY_SOULKEYS, address, 'wizardKeys'],
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

  if (!keyData || !myProfile || !data) {
    return <></>;
  }

  const WizardList = () => {
    return (
      <Panel css={{ gap: '$sm', width: '250px' }}>
        <Step label="Connect Wallet" test={!!address} />
        <Step label="On Optimism" test={chain && onCorrectChain} />
        <Step label="Name" test={hasName} />
        <Step label="CoSoul" test={hasCoSoul} />
        <Step label="Connect Rep" test={hasRep} />
        <Step label="Buy Your Own Link" test={keyData?.hasOwnKey} />
        <Step label="Buy Other Links" test={keyData?.hasOtherKey} />
      </Panel>
    );
  };

  const fullScreenStyles = {
    alignItems: 'flex-start',
    height: '100vh',
    p: '$lg',
    gap: '$md',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    // transition: 'all .7s',
    // animation: `${zoomBackground} 30s infinite ease-in-out`,
    animationDirection: 'alternate',
  };

  const RenderForm = () => {
    if (!onCorrectChain) {
      return (
        <Flex
          column
          css={{
            ...fullScreenStyles,
            backgroundImage: "url('/imgs/background/colink-op.jpg')",
          }}
        >
          <WizardList />
          your on the wrong chain
          <SoulKeysChainGate actionName="Use CoLink">
            {() => <></>}
          </SoulKeysChainGate>
        </Flex>
      );
    } else if (!hasName) {
      return (
        <Flex
          column
          css={{
            ...fullScreenStyles,
            backgroundImage: "url('/imgs/background/colink-name.jpg')",
          }}
        >
          <WizardList />
          <CreateUserNameForm address={address} />
        </Flex>
      );
    } else if (!hasCoSoul) {
      return (
        <Flex
          column
          css={{
            ...fullScreenStyles,
            backgroundImage: "url('/imgs/background/colink-cosoul.jpg')",
          }}
        >
          <WizardList />
          <Text>you no have cosoul</Text>
          <Button as={NavLink} to="/cosoul/mint" color="cta" size="large">
            Mint a CoSoul to Use CoLink
          </Button>
        </Flex>
      );
    } else if (!hasRep) {
      return (
        <Flex
          column
          css={{
            ...fullScreenStyles,
            backgroundImage: "url('/imgs/background/colink-rep.jpg')",
          }}
        >
          <WizardList />
          <Text>no rep!</Text>
        </Flex>
      );
    } else if (!keyData?.hasOwnKey) {
      return (
        <Flex
          column
          css={{
            ...fullScreenStyles,
            backgroundImage: "url('/imgs/background/colink-own.jpg')",
          }}
        >
          <WizardList />
          <Text>gotta buy your own link</Text>
        </Flex>
      );
    } else if (!keyData?.hasOtherKey) {
      return (
        <Flex
          column
          css={{
            ...fullScreenStyles,
            backgroundImage: "url('/imgs/background/colink-own.jpg')",
          }}
        >
          <WizardList />
          <Text>time to buy someone elses link</Text>
        </Flex>
      );
    }
    return null;
  };

  return (
    <Flex
      column
      css={{
        justifyContent: 'flex-start',
        width: '100%',
      }}
    >
      <RenderForm />
    </Flex>
  );
};
