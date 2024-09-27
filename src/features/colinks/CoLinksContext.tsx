import React, { createContext, useEffect, useState } from 'react';

import { useNavigate } from 'react-router';

import CopyCodeTextField from '../../components/CopyCodeTextField';
import useConnectedAddress from '../../hooks/useConnectedAddress';
import useProfileId from '../../hooks/useProfileId';
import { coLinksPaths } from '../../routes/paths';
import { Button, Flex, Modal, Text } from '../../ui';
import { CoLinks, getCoLinksContract } from '../../utils/viem/contracts';
import { useAuthStore } from '../auth';
import { useLogout } from '../auth/useLogout';

import { FaviconNotificationBadge } from './FaviconNotificationBadge';

// Define the context's type
interface CoLinksContextType {
  coLinksReadOnly?: CoLinks;
  address?: string;
  awaitingWallet: boolean;
  setAwaitingWallet(b: boolean): void;
  setShowConnectWallet: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialState: CoLinksContextType = {
  awaitingWallet: false,
  setAwaitingWallet: () => {},
  setShowConnectWallet: () => {},
};

// Create the context
const CoLinksContext = createContext<CoLinksContextType>(initialState);

type CoLinksProviderProps = {
  children: React.ReactNode;
};

// Define the provider component
const CoLinksProvider: React.FC<CoLinksProviderProps> = ({ children }) => {
  const address = useAuthStore(state => state.address);
  const [awaitingWallet, setAwaitingWallet] = useState(false);

  const [showConnectWallet, setShowConnectWallet] = useState(false);

  const coLinksReadOnly = getCoLinksContract();
  if (!coLinksReadOnly) {
    return <Text>CoLinks not available.</Text>;
  }

  return (
    <CoLinksContext.Provider
      value={{
        coLinksReadOnly,
        address,
        awaitingWallet,
        setAwaitingWallet,
        setShowConnectWallet,
      }}
    >
      <FaviconNotificationBadge />
      {children}
      {showConnectWallet && (
        <ConnectWalletModal onClose={() => setShowConnectWallet(false)} />
      )}
    </CoLinksContext.Provider>
  );
};

export { CoLinksProvider, CoLinksContext };

const ConnectWalletModal = ({ onClose }: { onClose(): void }) => {
  const navigate = useNavigate();
  const profileId = useProfileId(false);
  const address = useConnectedAddress();
  const logout = useLogout(true);

  useEffect(() => {
    if (!profileId || !address) {
      navigate(coLinksPaths.wizardStart);
    }
  }, [profileId, address]);

  return (
    <Modal
      open={true}
      onOpenChange={open => {
        !open && onClose();
      }}
    >
      <Flex column css={{ gap: '$md' }}>
        <Flex column>
          <Text h1>Connect a Wallet to Continue</Text>
          <Text p>
            To perform on-chain interactions, you need to login with your
            wallet.
          </Text>
        </Flex>
        {address && (
          <Flex column>
            <Text variant={'label'}>Address:</Text>
            <CopyCodeTextField value={address} tabIndex={-1} />
          </Flex>
        )}
        <Flex>
          <Text size={'small'}>Log out and log back in using your wallet.</Text>
        </Flex>
        <Button tabIndex={0} onClick={logout}>
          Log Out
        </Button>
      </Flex>
    </Modal>
  );
};
