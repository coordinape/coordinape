import { ReactNode, useEffect } from 'react';

import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import { useReloadCookieAuth } from 'hooks/useReloadCookieAuth';
import { Box } from 'ui';

const DEBUG = true; // TODO remove

export const RequireAuth = ({
  children,
  walletRequired = false,
}: {
  children: ReactNode;
  walletRequired: boolean;
}) => {
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const { profileId } = useReloadCookieAuth();
  const { address, isConnected, isDisconnected, status } = useAccount();

  useEffect(() => {
    // if we have a profileId and walletConnection, render children
    if (!!profileId && isConnected) return;

    // if walletRequired = false, and we have a profileId, render children
    if (!walletRequired && !!profileId) return;

    // else: require modal login
    if (openConnectModal && !connectModalOpen) openConnectModal();
  }, [status, openConnectModal, connectModalOpen, profileId, walletRequired]);

  // TODO: show anything ehre?
  // if isDisconnected and walletRequired, then prompt Modal
  if (!profileId || (walletRequired && isDisconnected)) {
    return (
      <>
        <div>
          {DEBUG && (
            <>
              <div>WAGMI Status: {status}</div>
              <div>ProfileId: {profileId}</div>
              <div>
                {' '}
                Wallet Connection Required = {walletRequired ? 'true' : 'false'}
              </div>
            </>
          )}
          <ConnectButton />
          Login Required
        </div>
      </>
    );
  }

  return (
    <>
      {DEBUG && (
        <Box
          css={{
            backgroundColor: 'white',
            position: 'absolute',
            zIndex: 1000,
            color: 'red',
          }}
        >
          WAGMI Status: {status} | Account: {address}
        </Box>
      )}
      {children}
    </>
  );
};
