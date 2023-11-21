import { NavLink } from 'react-router-dom';

import { GlobalUi } from '../../../components/GlobalUi';
import { isFeatureEnabled } from '../../../config/features';
import { useAuthStateMachine } from '../../../features/auth/RequireAuth';
import { NavLogo } from '../../../features/nav/NavLogo';
import useConnectedAddress from '../../../hooks/useConnectedAddress';
import { zoomBackground } from '../../../keyframes';
import { paths } from '../../../routes/paths';
import { Box, Button, Flex, HR, Text } from '../../../ui';
import { shortenAddressWithFrontLength } from '../../../utils';

const fullScreenStyles = {
  position: 'fixed',
  zIndex: '-1',
  height: '100vh',
  width: '100vw',
  p: '$lg',
  gap: '$md',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  transition: 'all .7s',
  animation: `${zoomBackground} 30s infinite ease-in-out`,
  animationDirection: 'alternate',
};

export const WizardStart = () => {
  // need to call this so address gets conditionally loaded
  useAuthStateMachine(false, false);

  // address will be available if we are logged in, otherwise undefined
  const address = useConnectedAddress();

  if (!isFeatureEnabled('soulkeys')) {
    return null;
  }

  const isLoggedIn = !!address;
  // am i logged in??????

  return (
    <Flex css={{ flexGrow: 1, height: '100vh', width: '100vw' }}>
      <Flex column css={{ height: '100vh', width: '100%' }}>
        <GlobalUi />
        <Flex
          column
          css={{
            background: '$surface',
            alignItems: 'flex-start',
            m: '$md',
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
          <NavLogo suppressAppMenu />
          <Flex column>
            <Text h2 display>
              CoLinks
            </Text>
            <Text h2>Let&apos;s adventure to get connected</Text>
            <HR />
          </Flex>

          <Text>
            CoLinks is a network of professionals and friends in the web3
            ecosystem.
          </Text>
          {isLoggedIn ? (
            <Flex column>
              <Box>
                <Text variant="label" css={{ mb: '$xs' }}>
                  Connected with Wallet
                </Text>
                <Text
                  tag
                  color="neutral"
                  css={{
                    width: '100%',
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                  }}
                >
                  {address && shortenAddressWithFrontLength(address, 6)}
                </Text>
              </Box>
              <Button
                as={NavLink}
                to={paths.coLinksWizard}
                color="cta"
                size="large"
                css={{ mt: '$sm' }}
              >
                {`Let's Go`}
              </Button>
            </Flex>
          ) : (
            <>
              <Text>First things first... Let&apos;s connect your wallet.</Text>
              <Button
                as={NavLink}
                to={paths.coLinksWizard}
                color="cta"
                size="large"
                css={{ mt: '$sm' }}
              >
                Connect to Join CoLinks
              </Button>
            </>
          )}
        </Flex>
      </Flex>
      <Flex
        css={{
          ...fullScreenStyles,
          backgroundImage: "url('/imgs/background/colink-start.jpg')",
        }}
      />
    </Flex>
  );
};
