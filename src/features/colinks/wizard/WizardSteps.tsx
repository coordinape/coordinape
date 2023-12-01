import assert from 'assert';
import { useEffect, useState } from 'react';

import { CoLinksMintPage } from 'features/cosoul/CoLinksMintPage';
import { CoSoulButton } from 'features/cosoul/CoSoulButton';
import { QUERY_KEY_NAV, useNavQuery } from 'features/nav/getNavData';
import { client } from 'lib/gql/client';
import { useMutation, useQueryClient } from 'react-query';
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
import { coLinksPaths, EXTERNAL_URL_TOS } from 'routes/paths';
import { Button, Flex, HR, Link, Panel, Text } from 'ui';

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
  aspectRatio: '1/1',
  backgroundSize: 'cover',
  '@media (min-aspect-ratio: 10.7/5)': {
    backgroundSize: 'contain',
  },
};

export const TOS_UPDATED_AT = '2023-11-30';

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

  // TOS stuff
  const { data } = useNavQuery();
  const queryClient = useQueryClient();
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    // require TOS agreement since TOS_UPDATED_AT
    if (data?.profile?.tos_agreed_at) {
      const tosAgreedAt = new Date(data.profile.tos_agreed_at);
      const tosUpdatedAt = new Date(TOS_UPDATED_AT);
      if (tosAgreedAt > tosUpdatedAt) {
        setTermsAccepted(true);
      }
    }
  }, [data?.profile?.tos_agreed_at]);

  const acceptTos = async (profileId: number) => {
    const { acceptTOS } = await client.mutate(
      { acceptTOS: { tos_agreed_at: true } },
      { operationName: 'acceptTOS__termsGate' }
    );

    assert(acceptTOS);

    return { tos_agreed_at: acceptTOS.tos_agreed_at, profile_id: profileId };
  };

  const acceptTosMutation = useMutation(acceptTos, {
    onSuccess: res => {
      if (res) {
        setTermsAccepted(true);

        queryClient.setQueryData<typeof data>(
          [QUERY_KEY_NAV, profileId],
          oldData => {
            if (oldData) {
              const tos_agreed_at = res.tos_agreed_at;
              const profile = { ...oldData.profile, tos_agreed_at };

              return { ...oldData, profile };
            }
          }
        );
      }
    },
    onError: error => {
      showError(error);
    },
  });
  const onAcceptTermsSubmit = async () => {
    assert(profileId);
    await acceptTosMutation.mutate(profileId);
  };

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
            background:
              'radial-gradient(circle, rgb(18 19 21) 0%, rgb(73 74 76) 78%, rgb(83 75 78) 83%, rgb(110 109 109) 100%)',
          }}
        />
        <Flex
          css={{
            ...fullScreenStyles,
            backgroundImage: "url('/imgs/background/colink-name.jpg')",
            backgroundPosition: '50% 60%',
          }}
        />
        <WizardInstructions>
          <ShowOrConnectTwitter
            callbackPage={coLinksPaths.wizard}
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
  } else if (profileId && !termsAccepted) {
    return (
      <>
        <Flex
          css={{
            ...fullScreenStyles,
            background:
              'radial-gradient(circle, rgb(18 19 21) 0%, #E5AF52 58%, #815114 83%, #8DA9AF 100%)',
          }}
        />
        <Flex
          column
          css={{
            ...fullScreenStyles,
            backgroundImage: "url('/imgs/background/colink-tos.jpg')",
            backgroundPosition: 'bottom',
          }}
        />
        <WizardInstructions>
          <Flex column css={{ gap: '$md', mb: '$md' }}>
            <Text h2>Terms of Service</Text>
            <Text p as="p">
              To use CoLinks you must accept our{' '}
              <Link
                inlineLink
                href={EXTERNAL_URL_TOS}
                target="_blank"
                css={{ textDecoration: 'underline' }}
              >
                terms of service
              </Link>
            </Text>
          </Flex>
          <Button size="large" color="cta" onClick={onAcceptTermsSubmit}>
            Accept Terms of Service
          </Button>
        </WizardInstructions>
      </>
    );
    // } else if (hasCoSoul && showStepCoSoul) {
  } else if (!hasCoSoul && showStepCoSoul) {
    return (
      <>
        <Flex
          css={{
            ...fullScreenStyles,
            background:
              'radial-gradient(circle, rgb(18 19 21) 0%, #31641F 38%, #66D439 63%, #793FE0 100%)',
          }}
        />
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
          css={{
            ...fullScreenStyles,
            background:
              'radial-gradient(circle, #E3A102 25%, #FFF9BC 58%, #BCDBDA 88%, #FFFCDE 100%)',
          }}
        />
        <Flex
          column
          css={{
            ...fullScreenStyles,
            backgroundImage: "url('/imgs/background/colink-own.jpg')",
            backgroundPosition: '50% 75%',
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
          css={{
            ...fullScreenStyles,
            background:
              'radial-gradient(circle, #1F1518 20%, #B85252 58%, #FEEDC1 82%, #4B2E35 100%)',
          }}
        />
        <Flex
          column
          css={{
            ...fullScreenStyles,
            backgroundImage: "url('/imgs/background/colink-rep.jpg')",
            backgroundPosition: '50% 45%',
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
          css={{
            ...fullScreenStyles,
            background:
              'radial-gradient(circle, #ffffff 20%, #DCC3C9 58%, #FFFFFF 78%, #4A5F80 100%)',
          }}
        />
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
