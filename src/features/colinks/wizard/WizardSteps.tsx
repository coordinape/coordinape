import { useEffect, useState } from 'react';

import { CoLinksMintPage } from 'features/cosoul/CoLinksMintPage';
import { CoSoulButton } from 'features/cosoul/CoSoulButton';
import { useNavigate } from 'react-router';
import { NavLink, useSearchParams } from 'react-router-dom';

import { BuyOrSellCoLinks } from '.././BuyOrSellCoLinks';
import { EditProfileInfo } from '../../../pages/AccountPage/EditProfileInfo';
import { useAuthStore } from '../../auth';
import { ShowOrConnectGitHub } from '../../github/ShowOrConnectGitHub';
import { ShowOrConnectLinkedIn } from '../../linkedin/ShowOrConnectLinkedIn';
import { ShowOrConnectTwitter } from '../../twitter/ShowOrConnectTwitter';
import { useMyTwitter } from '../../twitter/useMyTwitter';
import { CoLinksProvider } from '../CoLinksContext';
import { useToast } from 'hooks';
import { EmailCTA } from 'pages/ProfilePage/EmailSettings/EmailCTA';
import { coLinksPaths } from 'routes/paths';
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
    // } else if (hasCoSoul && showStepCoSoul) {
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
          <Text h2>Attain your CoSoul NFT</Text>
          {/* <Text>CoSoul is the Coordinape NFT Avatar.</Text> */}
          <Text>
            CoSoul holds your Rep Score on-chain, is synced monthly, and is a
            public view of your stats and username.
          </Text>
          <Text>CoSoul: YOUR key to the network.</Text>
          {!minted && (
            <Flex column css={{ mt: '$md', gap: '$md' }}>
              <CoSoulButton onReveal={() => setMinted(true)} />
              <Text size="small" color="neutral">
                There is a small fee to mint a CoSoul, and gas costs are minimal
                on Optimism.
              </Text>
            </Flex>
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
            <Text h2>Create your first link</Text>
            <Text>
              Your first Link adds you to the network and allows other CoLinks
              members to buy it too.
            </Text>
            <Text>
              Links are connections between people, they allow sharing of ideas
              and discussion, and a web of mutual reputation to form.
            </Text>
            <Text>
              Your wallet will receive 5% of the price when your Links are
              bought and sold.
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
          <Flex
            column
            css={{ gap: '$md', my: '$md', alignItems: 'flex-start' }}
          >
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
            <EmailCTA color="cta" size="medium" />
          </Flex>
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
  } else {
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
          <Text h2>You&apos;ve Completed the Quest!</Text>
          <Text>
            Now the real adventure begins. Find links to others, make
            professional connections, make friends, have fun!
          </Text>
          <Button
            as={NavLink}
            to={coLinksPaths.explore}
            color="cta"
            size="large"
          >
            Explore CoLinks!
          </Button>
        </WizardInstructions>
      </>
    );
  }
};
