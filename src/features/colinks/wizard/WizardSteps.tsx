import { useEffect, useState } from 'react';

import { CoLinksMintPage } from 'features/cosoul/CoLinksMintPage';
import { CoSoulButton } from 'features/cosoul/CoSoulButton';
import { useNavigate } from 'react-router';
import { NavLink, useSearchParams } from 'react-router-dom';

import { BuyOrSellCoLinks } from '.././BuyOrSellCoLinks';
import { EditProfileInfo } from '../../../pages/AccountPage/EditProfileInfo';
import { coLinksPaths } from '../../../routes/paths';
import { useAuthStore } from '../../auth';
import { ShowOrConnectGitHub } from '../../github/ShowOrConnectGitHub';
import { ShowOrConnectLinkedIn } from '../../linkedin/ShowOrConnectLinkedIn';
import { ShowOrConnectTwitter } from '../../twitter/ShowOrConnectTwitter';
import { useMyTwitter } from '../../twitter/useMyTwitter';
import { CoLinksProvider } from '../CoLinksContext';
import { useToast } from 'hooks';
import { EmailCTA } from 'pages/ProfilePage/EmailSettings/EmailCTA';
import { Button, Flex, HR, Panel, Text } from 'ui';

import { SkipButton } from './SkipButton';
import { WizardBuyOtherLinks } from './WizardBuyOtherLinks';
import { WizardInstructions } from './WizardInstructions';
import { WizardProgress } from './WizardProgress';
import { WizardSwitchToOptimism } from './WizardSwitchToOptimism';

export const fullScreenStyles = {
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
    // hasOtherKey,
  } = progress;

  const [showStepRep, setShowStepRep] = useState(true);
  const [showStepBuyOther, setShowStepBuyOther] = useState(true);
  const [minted, setMinted] = useState(false);
  const [showStepCoSoul, setShowStepCoSoul] = useState(true);
  const { showError } = useToast();

  const profileId = useAuthStore(state => state.profileId);

  const { twitter } = useMyTwitter(profileId);

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const error = searchParams.get('error');
  const redirect = searchParams.get('redirect');

  // Show the error and remove it from the URL
  // this error comes from the twitter/github/linkedin callbacks
  useEffect(() => {
    if (error) {
      showError(error);
      setSearchParams('');
    }
  }, [error]);

  if (onCorrectChain && redirect) {
    navigate(redirect, {
      replace: true,
    });
    return null;
  }

  if (!onCorrectChain) {
    return <WizardSwitchToOptimism />;
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
          <Text variant="label">Who are you?</Text>
          {/*Get started quickly with Twitter (X ??):*/}
          <ShowOrConnectTwitter
            callbackPage={'/colinks/wizard'}
            minimal={true}
          />
          {!twitter && (
            <>
              <Flex
                css={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '$md',
                  mt: '$sm',
                  flexWrap: 'nowrap',
                  width: '100%',
                }}
              >
                <HR css={{ flexShrink: 2 }} />
                <Text
                  size="xs"
                  color="neutral"
                  css={{ flexShrink: 1, whiteSpace: 'nowrap' }}
                >
                  Or Set Your Name and Avatar
                </Text>
                <HR css={{ flexShrink: 2 }} />
              </Flex>
            </>
          )}

          <EditProfileInfo
            vertical={true}
            preloadProfile={
              twitter
                ? {
                    name: twitter.username,
                    avatar: twitter.profile_image_url,
                    description: twitter.description,
                  }
                : undefined
            }
          />
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
              <Text>
                Your rep score is synced to your minted CoSoul every month.
              </Text>
              <Text>
                Minting will create a public view of your stats and username.
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
          <CoLinksProvider>
            <BuyOrSellCoLinks subject={address} address={address} />
          </CoLinksProvider>
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
              callbackPage={coLinksPaths.wizard}
            />
            <ShowOrConnectGitHub
              minimal={true}
              callbackPage={coLinksPaths.wizard}
            />
            <ShowOrConnectLinkedIn
              minimal={true}
              callbackPage={coLinksPaths.wizard}
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
                Initial Rep Score
              </Text>
              <Text h2>{repScore ?? '0'}</Text>
            </Flex>
          </Panel>
          <SkipButton onClick={() => setShowStepRep(false)} />
        </WizardInstructions>
      </>
    );
  } else if (showStepBuyOther) {
    return (
      <WizardBuyOtherLinks
        skipStep={() => setShowStepBuyOther(false)}
        address={progress.address}
      />
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
        <Button as={NavLink} to={coLinksPaths.explore} color="cta" size="large">
          Explore CoLinks!
        </Button>
      </WizardInstructions>
    </>
  );
};