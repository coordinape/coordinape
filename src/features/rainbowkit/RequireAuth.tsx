import { ReactNode, useEffect } from 'react';

import { useConnectModal } from '@rainbow-me/rainbowkit';
import CoLinksSplashLayout from 'features/cosoul/CoLinksSplashLayout';
import { useAccount } from 'wagmi';

import { Flex, Text } from '../../ui';
import { useReloadCookieAuth } from 'hooks/useReloadCookieAuth';

export const RequireAuth = ({
  children,
  walletRequired = false,
}: {
  children: ReactNode;
  walletRequired: boolean;
}) => {
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const { profileId } = useReloadCookieAuth();
  const { isConnected, isDisconnected, status } = useAccount();

  useEffect(() => {
    // if we have a profileId and walletConnection, render children
    if (!!profileId && isConnected) return;

    // if walletRequired = false, and we have a profileId, render children
    if (!walletRequired && !!profileId) return;

    // else: require modal login
    if (openConnectModal && !connectModalOpen) openConnectModal();
  }, [status, openConnectModal, connectModalOpen, profileId, walletRequired]);

  // TODO: show only for CoLinks pages and not for GiftCircle
  // if isDisconnected and walletRequired, then prompt Modal
  if (!profileId || (walletRequired && isDisconnected)) {
    return (
      <CoLinksSplashLayout>
        <Flex
          column
          css={{
            alignItems: 'center',
          }}
        >
          <Text h2>Connection Required</Text>
          <Text h2>Please connect to continue.</Text>
        </Flex>
      </CoLinksSplashLayout>
    );
  }

  return children;
};
