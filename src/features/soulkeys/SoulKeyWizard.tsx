import { useWalletStatus } from 'features/auth';
import { chain } from 'features/cosoul/chains';
import { useNavQuery } from 'features/nav/getNavData';
import { NavLogo } from 'features/nav/NavLogo';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { Check, OptimismLogo, Square } from '../../icons/__generated';
import { GlobalUi } from 'components/GlobalUi';
import { CreateUserNameForm } from 'components/MainLayout/CreateUserNameForm';
import { useWeb3React } from 'hooks/useWeb3React';
import { Button, Flex, HR, Text } from 'ui';

import { BuyOrSellSoulKeys } from './BuyOrSellSoulKeys';
import { SoulKeysChainGate } from './SoulKeysChainGate';

export const QUERY_KEY_SOULKEYS = 'soulKeys';

const Step = ({ label, test }: { label: string; test?: boolean }) => {
  return (
    <Flex css={{ justifyContent: 'space-between' }}>
      <Text>{label}</Text>
      {test ? <Check color="complete" /> : <Square color="neutral" />}
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

  if (!keyData || !myProfile || !data || !chainId) {
    return <></>;
  }

  const WizardList = () => {
    return (
      <Flex
        column
        css={{
          gap: '$sm',
          width: '260px',
          background: '$surface',
          p: '$lg $lg $1xl $xl',
          clipPath:
            'polygon(0 0,100% 0,100% 100%,55px 100%,0 calc(100% - 35px))',
        }}
      >
        <Step label="Connect Wallet" test={!!address} />
        <Step label="On Optimism" test={chain && onCorrectChain} />
        <Step label="Name" test={hasName} />
        <Step label="CoSoul" test={hasCoSoul} />
        <Step label="Buy Your Own Link" test={keyData?.hasOwnKey} />
        <Step label="Connect Rep" test={hasRep} />
        <Step label="Buy Other Links" test={keyData?.hasOtherKey} />
      </Flex>
    );
  };

  const WizardInstructions = ({ children }: { children: React.ReactNode }) => {
    return (
      <Flex
        column
        css={{
          background: '$surface',
          alignItems: 'flex-start',
          p: '$lg',
          pb: '$4xl',
          gap: '$md',
          width: '30%',
          minWidth: '300px',
          position: 'relative',
          clipPath:
            'polygon(0 0,100% 0,100% calc(100% - 50px),calc(100% - 60px) 100%,0 100%)',
        }}
      >
        <NavLogo />
        <Flex column css={{ width: '100%' }}>
          <Text h2 display>
            CoLinks
          </Text>
          <HR />
        </Flex>

        {children}
      </Flex>
    );
  };

  const fullScreenStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: '-1',
    height: '100vh',
    width: '100vw',
    p: '$lg',
    gap: '$md',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  };

  const RenderForm = () => {
    if (!onCorrectChain) {
      return (
        <>
          <Flex
            column
            css={{
              ...fullScreenStyles,
              backgroundImage: "url('/imgs/background/colink-op.jpg')",
            }}
          />
          <WizardInstructions>
            <Text h2>Awesome!</Text>
            <Text>
              Let&apos;s get you on the{' '}
              <OptimismLogo nostroke css={{ mx: '$xs' }} /> Optimism chain.
            </Text>
            <SoulKeysChainGate actionName="Use CoLinks">
              {() => <></>}
            </SoulKeysChainGate>
          </WizardInstructions>
        </>
      );
    } else if (!hasName) {
      return (
        <>
          <Flex
            column
            css={{
              ...fullScreenStyles,
              backgroundImage: "url('/imgs/background/colink-name.jpg')",
            }}
          />
          <WizardInstructions>
            <Text h2>What shall you be called?</Text>
            <CreateUserNameForm address={address} />
          </WizardInstructions>
        </>
      );
    } else if (!hasCoSoul) {
      return (
        <>
          <Flex
            column
            css={{
              ...fullScreenStyles,
              backgroundImage: "url('/imgs/background/colink-cosoul.jpg')",
            }}
          />
          <WizardInstructions>
            <Text h2>Attain your CoSoul</Text>
            <Text>
              CoSoul is your NFT avatar that allows access to all things
              Coordinape. You need one.
            </Text>
            <Button as={NavLink} to="/cosoul/mint" color="cta" size="large">
              Mint a CoSoul to Use CoLinks
            </Button>
          </WizardInstructions>
        </>
      );
    } else if (!keyData?.hasOwnKey) {
      return (
        <>
          <Flex
            column
            css={{
              ...fullScreenStyles,
              backgroundImage: "url('/imgs/background/colink-own.jpg')",
            }}
          />
          <WizardInstructions>
            <Flex column css={{ gap: '$md', mb: '$md' }}>
              <Text h2>Buy your own link</Text>
              <Text inline>
                Buying your Link allows other CoLink holders to buy your Link.
              </Text>
              <Text>
                Your Linkholders will gain access to X. You will receive Y% of
                the price when they buy or sell.
              </Text>
            </Flex>
            <SoulKeysChainGate actionName="Use SoulKeys">
              {(contracts, currentUserAddress, soulKeys) => (
                <BuyOrSellSoulKeys
                  subject={address}
                  address={address}
                  soulKeys={soulKeys}
                  chainId={chainId.toString()}
                  hideName={true}
                />
              )}
            </SoulKeysChainGate>
          </WizardInstructions>
        </>
      );
    } else if (!hasRep) {
      return (
        <>
          <Flex
            column
            css={{
              ...fullScreenStyles,
              backgroundImage: "url('/imgs/background/colink-rep.jpg')",
            }}
          />
          <WizardInstructions>
            <Text h2>Build Rep by connecting to other realms</Text>
            <Text>
              Establish your repulation by linking other channels like LinkedIn,
              Twitter, or your email address.
            </Text>
          </WizardInstructions>
        </>
      );
    } else if (!keyData?.hasOtherKey) {
      return (
        <>
          <Flex
            column
            css={{
              ...fullScreenStyles,
              backgroundImage: "url('/imgs/background/colink-other.jpg')",
            }}
          />
          <WizardInstructions>
            <Text h2>Explore and purchase other links</Text>
          </WizardInstructions>
        </>
      );
    }
    return null;
  };

  return (
    <Flex css={{ flexGrow: 1, height: '100vh', width: '100vw' }}>
      <Flex column css={{ height: '100vh', width: '100%' }}>
        <GlobalUi />
        <RenderForm />
        <Flex css={{ position: 'absolute', right: 0, top: 0 }}>
          <WizardList />
        </Flex>
      </Flex>
    </Flex>
  );
};
