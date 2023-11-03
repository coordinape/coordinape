import { NavLogo } from 'features/nav/NavLogo';
import { zoomBackground } from 'keyframes';
import { NavLink } from 'react-router-dom';

import { GlobalUi } from 'components/GlobalUi';
import isFeatureEnabled from 'config/features';
import { paths } from 'routes/paths';
import { Button, Flex, HR, Text } from 'ui';

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

export const SoulKeysWizardStart = () => {
  if (!isFeatureEnabled('soulkeys')) {
    return null;
  }

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
          <NavLogo />
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
          <Text>First things first... Let&apos;s connect your wallet.</Text>
          <Button
            as={NavLink}
            to={paths.soulKeysWizard}
            color="cta"
            size="large"
            css={{ mt: '$sm' }}
          >
            Connect to Join CoLinks
          </Button>
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
