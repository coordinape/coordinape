import { useState } from 'react';

import { useWalletStatus } from 'features/auth';
import { chain } from 'features/cosoul/chains';
import { CoLinksMintPage } from 'features/cosoul/CoLinksMintPage';
import { MintOrBurnButton } from 'features/cosoul/MintOrBurnButton';
import { useCoSoulContracts } from 'features/cosoul/useCoSoulContracts';
import { useNavQuery } from 'features/nav/getNavData';
import { NavLogo } from 'features/nav/NavLogo';
import { client } from 'lib/gql/client';
import { useQuery, useQueryClient } from 'react-query';
import { NavLink } from 'react-router-dom';

import { Check, OptimismLogo, Square } from '../../icons/__generated';
import { GlobalUi } from 'components/GlobalUi';
import { CreateUserNameForm } from 'components/MainLayout/CreateUserNameForm';
import { useToast } from 'hooks';
import { useWeb3React } from 'hooks/useWeb3React';
import { EmailBanner } from 'pages/ProfilePage/EmailSettings/EmailBanner';
import { EmailCTA } from 'pages/ProfilePage/EmailSettings/EmailCTA';
import { paths } from 'routes/paths';
import { Button, Flex, HR, Link, Panel, Text } from 'ui';

import { BuyOrSellCoLinks } from './BuyOrSellCoLinks';
import { CoLinksChainGate } from './CoLinksChainGate';

export const QUERY_KEY_COLINKS = 'coLinks';

const Step = ({ label, test }: { label: string; test?: boolean }) => {
  return (
    <Flex css={{ justifyContent: 'space-between' }}>
      <Text>{label}</Text>
      {test ? <Check color="complete" /> : <Square color="neutral" />}
    </Flex>
  );
};
export const CoLinksWizard = () => {
  const { data } = useNavQuery();
  const name = data?.profile.name;
  const { chainId, account } = useWeb3React();
  const contracts = useCoSoulContracts();
  const { address } = useWalletStatus();
  const onCorrectChain = chainId === Number(chain.chainId);
  const hasName = name && !name.startsWith('New User') && !!address;
  const hasCoSoul = !!data?.profile.cosoul;

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

  const [updatingRepScore, setUpdatingRepScore] = useState(false);
  const [showStepRep, setShowStepRep] = useState(true);
  const [showStepBuyOther, setShowStepBuyOther] = useState(true);
  const [minted, setMinted] = useState(false);
  const { showError } = useToast();

  const queryClient = useQueryClient();

  const updateRepScore = async () => {
    setUpdatingRepScore(true);
    try {
      await client.mutate(
        {
          updateRepScore: { success: true },
        },
        {
          operationName: 'updateMyRepScore',
        }
      );
      queryClient.invalidateQueries([QUERY_KEY_COLINKS, address]);
    } catch (e) {
      showError(e);
    } finally {
      setUpdatingRepScore(false);
    }
  };

  if (!keyData || !myProfile || !data || !chainId || !contracts || !account) {
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
          position: 'absolute',
          right: '$md',
          bottom: '$md',
          p: '$2xl $lg $lg $xl',
          clipPath: 'polygon(0 50px,60px 0,100% 0,100% 100%,0 100%)',
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
          position: 'absolute',
          m: '$md',
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
            <CoLinksChainGate actionName="Use CoLinks">
              {() => <></>}
            </CoLinksChainGate>
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
            <Text>
              pGIVE is an abstraction of the GIVE you have received in
              Coordinape.
            </Text>
            <Text>pGIVE auto-syncs to your minted CoSoul every month.</Text>
            <Text>
              Minting will create a public view of your stats, username, and
              organization/circle names; similar to what is displayed below.
            </Text>
            <MintOrBurnButton
              contracts={contracts}
              address={account}
              onReveal={() => setMinted(true)}
            />
            <Text>
              There is a small 0.0032 ETH fee to mint a CoSoul, and gas costs
              are minimal.
            </Text>
          </WizardInstructions>
          <Flex css={{ zIndex: 3, pointerEvents: 'none' }}>
            <CoLinksMintPage minted={minted} />
          </Flex>
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
            <CoLinksChainGate actionName="Use CoLinks">
              {(contracts, currentUserAddress, coLinks) => (
                <BuyOrSellCoLinks
                  subject={address}
                  address={address}
                  coLinks={coLinks}
                  chainId={chainId.toString()}
                  hideName={true}
                />
              )}
            </CoLinksChainGate>
          </WizardInstructions>
        </>
      );
    } else if (!hasRep && showStepRep) {
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
            <EmailCTA color="cta" size="medium" />
            <Panel
              nested
              css={{
                gap: '$sm',
                mt: '$md',
                alignItems: 'center',
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <Flex css={{ gap: '$sm' }}>
                <Text semibold size="small">
                  Rep Score
                </Text>
                <Text h2>
                  {myProfile?.reputation_score?.total_score ?? '0'}
                </Text>
              </Flex>
              <Flex>
                <Button
                  disabled={updatingRepScore}
                  color="neutral"
                  onClick={updateRepScore}
                  size="xs"
                >
                  Update Score
                </Button>
              </Flex>
            </Panel>
            <Link inlineLink onClick={() => setShowStepRep(false)}>
              Skip for now
            </Link>
            <Text size="small">
              You can add rep connections later by visiting your Account page.
            </Text>
          </WizardInstructions>
        </>
      );
    } else if (!keyData?.hasOtherKey && showStepBuyOther) {
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
            <Text h2>Connect by purchasing someone&apos;s Link</Text>
            <Text>Here are some recommendations</Text>
            <Panel nested>TODO show 5 from your network</Panel>
            <Link inlineLink onClick={() => setShowStepBuyOther(false)}>
              Skip for now
            </Link>
            <Text size="small">
              You can add purchase other Links later by visiting the Explore
              page.
            </Text>
          </WizardInstructions>
        </>
      );
    }
    return (
      <>
        <Flex
          column
          css={{
            ...fullScreenStyles,
            backgroundImage: "url('/imgs/background/colink-explore.jpg')",
          }}
        />
        <WizardInstructions>
          <Text h2>You&apos;re set up!</Text>
          <Text>
            Now the real adventure begins. Buy and sell the links of others,
            make professional connections, make friends, have fun!
          </Text>
          <Button
            as={NavLink}
            to={paths.coLinksExplore}
            color="cta"
            size="large"
          >
            Explore CoLinks!
          </Button>
        </WizardInstructions>
      </>
    );
  };

  return (
    <Flex css={{ flexGrow: 1, height: '100vh', width: '100vw' }}>
      <Flex column css={{ height: '100vh', width: '100%' }}>
        <EmailBanner />
        <GlobalUi />
        <RenderForm />
        <Flex css={{ position: 'absolute', right: 0, bottom: 0 }}>
          <WizardList />
        </Flex>
      </Flex>
    </Flex>
  );
};
