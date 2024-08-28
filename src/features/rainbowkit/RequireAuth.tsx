import { ReactNode, useEffect, useState } from 'react';

import { useConnectModal } from '@rainbow-me/rainbowkit';
import CoLinksSplashLayout from 'features/cosoul/CoLinksSplashLayout';
import { useAccount } from 'wagmi';

import { Button, Flex, Text } from '../../ui';
import { useReloadCookieAuth } from 'hooks/useReloadCookieAuth';

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
          <Text h2>Connection Required</Text>
          <Text h2>Please connect to continue.</Text>
          <Button size={'large'} color="cta" onClick={openConnectModal}>
            Connect Wallet
          </Button>
        </Flex>
      </CoLinksSplashLayout>
    );
  }

  return children;
};
