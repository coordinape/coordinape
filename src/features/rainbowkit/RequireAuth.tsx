import { ReactNode, useEffect, useState } from 'react';

import { useConnectModal } from '@rainbow-me/rainbowkit';
import { fullScreenStyles } from 'features/colinks/wizard/WizardSteps';
import CoLinksSplashLayout from 'features/cosoul/CoLinksSplashLayout';
import { NavLogo } from 'features/nav/NavLogo';
import { zoomBackground } from 'keyframes';
import { useAccount } from 'wagmi';

import { useReloadCookieAuth } from 'hooks/useReloadCookieAuth';
import { Button, Flex, Panel, Text } from 'ui';

export const RequireAuth = ({
  children,
  walletRequired = false,
}: {
  children: ReactNode;
  walletRequired: boolean;
}) => {
  const [autoOpened, setAutoOpened] = useState(false);
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const { profileId } = useReloadCookieAuth();
  const { isConnected, isDisconnected, status } = useAccount();
  const backgroundImages = [
    '/imgs/background/login-forest.jpg',
    '/imgs/background/login-lake.jpg',
    '/imgs/background/login-mirrors.jpg',
    '/imgs/background/login-river.jpg',
    '/imgs/background/login-snow.jpg',
    '/imgs/background/login-steeple.jpg',
  ];

  const [selectedBackgroundImage, setSelectedBackgroundImage] =
    useState<string>('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setSelectedBackgroundImage(backgroundImages[randomIndex]);
  }, []);

  useEffect(() => {
    // if we have a profileId and walletConnection, render children
    if (!!profileId && isConnected) return;

    // if walletRequired = false, and we have a profileId, render children
    if (!walletRequired && !!profileId) return;

    // else: require modal login

    if (openConnectModal && !connectModalOpen && !autoOpened) {
      setAutoOpened(true);
      openConnectModal();
    }
  }, [
    status,
    openConnectModal,
    connectModalOpen,
    autoOpened,
    profileId,
    walletRequired,
  ]);

  // TODO: show only for CoLinks pages and not for GiftCircle
  // if isDisconnected and walletRequired, then prompt Modal
  if (!profileId || (walletRequired && isDisconnected)) {
    return (
      <CoLinksSplashLayout>
        <Flex
          column
          css={{
            alignItems: 'center',
            gap: '$md',
          }}
        >
          <Panel
            noBorder
            css={{
              background: 'rgba(0,0,0,0.75)',
              alignItems: 'center',
              px: '$4xl',
              py: '$xl',
              gap: '$md',
              boxShadow: '$heavy',
            }}
          >
            <NavLogo forceTheme="dark" />
            <Text semibold css={{ textAlign: 'center', color: 'white' }}>
              This page requires you to login
            </Text>
            <Button
              color="coLinksCta"
              size="large"
              onClick={openConnectModal}
              css={{ mt: '$sm', width: '100%', fontWeight: '$semibold' }}
            >
              Connect Wallet to Login
            </Button>
          </Panel>
          <Flex
            css={{
              ...fullScreenStyles,
              background:
                'radial-gradient(circle, rgb(18, 19, 21) 0%, rgb(47 47 47) 58%, rgb(80 63 123) 83%, rgb(122, 160, 184) 100%)',
            }}
          />
          <Flex
            css={{
              ...fullScreenStyles,
              animation: `${zoomBackground} 30s infinite ease-in-out`,
              animationDirection: 'alternate',
              backgroundImage: `url(${selectedBackgroundImage})`,
            }}
          />
        </Flex>
      </CoLinksSplashLayout>
    );
  }

  return children;
};
