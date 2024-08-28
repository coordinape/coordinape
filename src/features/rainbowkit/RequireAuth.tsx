import { ReactNode, useEffect, useState } from 'react';

import { useConnectModal } from '@rainbow-me/rainbowkit';
import { fullScreenStyles } from 'features/colinks/wizard/WizardSteps';
import CoLinksSplashLayout from 'features/cosoul/CoLinksSplashLayout';
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
              background: 'rgba(0,0,0,0.7)',
              alignItems: 'center',
              px: '$1xl',
            }}
          >
            <Text h2>Connection Required</Text>
            <Text h2>Please connect to continue</Text>
            <Button size={'large'} color="cta" onClick={openConnectModal}>
              Connect Wallet
            </Button>
          </Panel>
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
      </CoLinksSplashLayout>
    );
  }

  return children;
};
