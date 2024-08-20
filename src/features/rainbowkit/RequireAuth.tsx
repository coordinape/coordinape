import { ReactNode, useEffect } from 'react';

import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect } from 'wagmi';

import { useReloadCookieAuth } from 'hooks/useReloadCookieAuth';
import { Box, Button } from 'ui';

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
  const {
    address,
    isConnected,
    connector: activeConnector,
    isDisconnected,
    status,
  } = useAccount();

  const { connect, connectors } = useConnect();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('useEffect invoked:', {
      profileId,
      address,
      status,
      activeConnector,
    });
  });

  useEffect(() => {
    // if we have a profileId and walletConnection, render children
    if (!!profileId && isConnected) return;

    // if walletRequired = false, and we have a profileId, render children
    if (!walletRequired && !!profileId) return;

    // else: require modal login
    if (openConnectModal && !connectModalOpen) openConnectModal();
  }, [
    openConnectModal,
    connectModalOpen,
    profileId,
    isConnected,
    walletRequired,
  ]);

  // if isDisconnected and walletRequired, then prompt Modal
  if (!profileId || (walletRequired && isDisconnected)) {
    return (
      <>
        <Box css={{ flex: 'column' }}>
          Connectors:
          {connectors.map(connector => (
            <Button key={connector.uid} onClick={() => connect({ connector })}>
              {connector.name}
            </Button>
          ))}
        </Box>

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
