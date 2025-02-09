import { WizardInstructions } from 'features/colinks/wizard/WizardInstructions';
import { fullScreenStyles } from 'features/colinks/wizard/WizardSteps';
import { zoomBackground } from 'keyframes';
import { NavLink } from 'react-router-dom';

import { GlobalUi } from '../../../components/GlobalUi';
import useProfileId from '../../../hooks/useProfileId';
import { EXTERNAL_URL_ABOUT, coLinksPaths } from '../../../routes/paths';
import { Button, Flex, HR, Link, Text } from '../../../ui';

export const WizardStart = () => {
  const profileId = useProfileId();

  const isLoggedIn = !!profileId;

  return (
    <Flex css={{ flexGrow: 1, height: '100vh', width: '100vw' }}>
      <Flex column css={{ height: '100vh', width: '100%' }}>
        <GlobalUi />
        <WizardInstructions>
          <Flex
            column
            css={{
              gap: '$lg',
              '@sm': {
                gap: '$sm',
              },
            }}
          >
            <Flex column css={{ gap: '$sm' }}>
              <Text h2>Get Linked!</Text>
              <Text
                css={{
                  '@sm': {
                    fontSize: '$small',
                  },
                }}
              >
                Buying or creating a Link means you can connect more deeply!
              </Text>
              <Text
                css={{
                  '@sm': {
                    fontSize: '$small',
                  },
                }}
              >
                Curate your Coordinape & Farcaster feed, bookmark your posse,
                and let people Link to you.
              </Text>
            </Flex>
            {isLoggedIn ? (
              <Flex column css={{ gap: '$md', width: '100%' }}>
                {
                  <Button
                    as={NavLink}
                    to={coLinksPaths.wizard}
                    color="cta"
                    size="large"
                    css={{ mt: '$sm', width: '100%' }}
                  >
                    {`Let's Go`}
                  </Button>
                }
                <Button
                  color="secondary"
                  as={Link}
                  href={EXTERNAL_URL_ABOUT}
                  size="small"
                  css={{ mt: '$sm' }}
                >
                  Learn More About CoLinks
                </Button>
              </Flex>
            ) : (
              <>
                <HR css={{ my: 0 }} />
                <Text p as="p">
                  <Text semibold css={{ mb: '$sm' }}>
                    Connect your wallet to get into CoLinks
                  </Text>
                  <Text>
                    {'After connecting your wallet you can buy and sell links.'}
                  </Text>
                </Text>

                <Button
                  as={NavLink}
                  to={coLinksPaths.wizard}
                  color="cta"
                  size="large"
                  css={{ mt: '$sm', width: '100%' }}
                >
                  Connect to Join CoLinks
                </Button>
                <Button color="secondary" as={Link} href={EXTERNAL_URL_ABOUT}>
                  Learn More About CoLinks
                </Button>
              </>
            )}
          </Flex>
        </WizardInstructions>
      </Flex>
      <Flex
        css={{
          ...fullScreenStyles,
          background:
            'radial-gradient(circle, rgb(18 19 21) 0%, #7D3B7B 58%, #3F4F7B 83%, #7AA0B8 100%)',
        }}
      />
      <Flex
        css={{
          ...fullScreenStyles,
          animation: `${zoomBackground} 30s infinite ease-in-out`,
          animationDirection: 'alternate',
          backgroundImage: "url('/imgs/background/colink-start.jpg')",
        }}
      />
    </Flex>
  );
};
