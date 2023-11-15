import { useState } from 'react';

import { CoLinksMintPage } from 'features/cosoul/CoLinksMintPage';
import { CoSoulButton } from 'features/cosoul/CoSoulButton';
import { NavLogo } from 'features/nav/NavLogo';
import { client } from 'lib/gql/client';
import { useQueryClient } from 'react-query';
import { NavLink } from 'react-router-dom';

import { AvatarUpload } from '../../components';
import { useAuthStore } from '../auth';
import { ShowOrConnectGitHub } from '../github/ShowOrConnectGitHub';
import { ShowOrConnectLinkedIn } from '../linkedin/ShowOrConnectLinkedIn';
import { ShowOrConnectTwitter } from '../twitter/ShowOrConnectTwitter';
import { useMyTwitter } from '../twitter/useMyTwitter';
import { CreateUserNameForm } from 'components/MainLayout/CreateUserNameForm';
import { useToast } from 'hooks';
import { OptimismLogo } from 'icons/__generated';
import { EmailCTA } from 'pages/ProfilePage/EmailSettings/EmailCTA';
import { paths } from 'routes/paths';
import { Button, Flex, HR, Link, Panel, Text } from 'ui';
import { chainId } from 'utils/testing/provider';

import { BuyOrSellCoLinks } from './BuyOrSellCoLinks';
import { CoLinksChainGate } from './CoLinksChainGate';
import { QUERY_KEY_COLINKS } from './CoLinksWizard';
import { WizardProgress } from './WizardProgress';

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

export const WizardSteps = ({
  progress,
  repScore,
}: {
  progress: WizardProgress;
  repScore: number | undefined;
}) => {
  const {
    address,
    onCorrectChain,
    hasName,
    // hasRep,
    hasCoSoul,
    hasOwnKey,
    hasOtherKey,
  } = progress;
  const [updatingRepScore, setUpdatingRepScore] = useState(false);
  const [showStepRep, setShowStepRep] = useState(true);
  const [showStepBuyOther, setShowStepBuyOther] = useState(true);
  const [minted, setMinted] = useState(false);
  const [showStepCoSoul, setShowStepCoSoul] = useState(true);
  const { showError } = useToast();

  const profileId = useAuthStore(state => state.profileId);

  const { twitter } = useMyTwitter(profileId);

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
          <Text h2>Who are you?</Text>
          {/*Get started quickly with Twitter (X ??):*/}
          <ShowOrConnectTwitter
            callbackPage={'/colinks/wizard'}
            minimal={true}
          />
          {!twitter && (
            <>
              <Text h2>-OR-</Text>
              <Text>Set your name and avatar</Text>
            </>
          )}

          <Flex column css={{ gap: '$md' }}>
            <Flex column>
              <Text variant="label" css={{ mb: '$xs' }}>
                Avatar
              </Text>
              <AvatarUpload original={twitter?.profile_image_url} />
            </Flex>

            <CreateUserNameForm
              address={address}
              hideWalletAddress={true}
              name={twitter?.username}
            />
          </Flex>
        </WizardInstructions>
      </>
    );
  } else if (!hasCoSoul && showStepCoSoul) {
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
          {minted ? (
            <>
              <Text>Your CoSoul has been minted!</Text>
              <Button
                color="cta"
                size="large"
                onClick={() => setShowStepCoSoul(false)}
              >
                Continue to Next Step
              </Button>
            </>
          ) : (
            <>
              <Text>Your rep is synced to your minted CoSoul every month.</Text>
              <Text>
                Minting will create a public view of your stats, username, and
                organization/circle names; similar to what is displayed below.
              </Text>
              <Text>
                There is a small fee of .0032 ETH + gas to mint a CoSoul.
              </Text>
              <CoSoulButton onReveal={() => setMinted(true)} />
            </>
          )}
        </WizardInstructions>
        <Flex
          css={{
            zIndex: 3,
            pointerEvents: 'none',
            overflow: 'auto',
            height: '100vh',
          }}
        >
          <CoLinksMintPage
            minted={minted}
            setShowStepCoSoul={setShowStepCoSoul}
          />
        </Flex>
      </>
    );
  } else if (!hasOwnKey) {
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
              Your Linkholders will gain access to X. You will receive Y% of the
              price when they buy or sell.
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
  } else if (showStepRep) {
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
          <Flex column css={{ gap: '$md', my: '$md' }}>
            <ShowOrConnectTwitter
              minimal={true}
              callbackPage={paths.coLinksWizard}
            />
            <ShowOrConnectGitHub
              minimal={true}
              callbackPage={paths.coLinksWizard}
            />
            <ShowOrConnectLinkedIn
              minimal={true}
              callbackPage={paths.coLinksWizard}
            />
          </Flex>
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
              <Text h2>{repScore ?? '0'}</Text>
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
  } else if (!hasOtherKey && showStepBuyOther) {
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
            You can add purchase other Links later by visiting the Explore page.
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
          Now the real adventure begins. Buy and sell the links of others, make
          professional connections, make friends, have fun!
        </Text>
        <Button as={NavLink} to={paths.coLinksExplore} color="cta" size="large">
          Explore CoLinks!
        </Button>
      </WizardInstructions>
    </>
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
