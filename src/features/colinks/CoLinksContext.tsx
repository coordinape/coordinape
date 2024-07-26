import React, { createContext, useEffect, useState } from 'react';

import { CoLinks } from '@coordinape/contracts/typechain';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';

import { LoadingModal } from '../../components';
import CopyCodeTextField from '../../components/CopyCodeTextField';
import useConnectedAddress from '../../hooks/useConnectedAddress';
import { coLinksPaths } from '../../routes/paths';
import { Button, Flex, Modal, Text } from '../../ui';
import { useAuthStore } from '../auth';
import { useLogout } from '../auth/useLogout';
import { getCoLinksContract } from '../cosoul/contracts';

import { FaviconNotificationBadge } from './FaviconNotificationBadge';
import { useCoLinksNavQuery } from './useCoLinksNavQuery';
import { TOS_UPDATED_AT } from './wizard/WizardTerms';

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
  const navigate = useNavigate();
  const location = useLocation();
  const [awaitingWallet, setAwaitingWallet] = useState(false);
  const { data, isLoading } = useCoLinksNavQuery();

  const [showConnectWallet, setShowConnectWallet] = useState(false);

  // TODO: on correct chain needs to be checked for the wizard
  // useEffect(() => {
  //   if (!onCorrectChain) {
  //     navigate(
  //       coLinksPaths.wizard +
  //         '?redirect=' +
  //         encodeURIComponent(location.pathname),
  //       {
  //         replace: true,
  //       }
  //     );
  //   }
  // }, [onCorrectChain]);

  useEffect(() => {
    if (address) {
      if (data) {
        if (data?.profile) {
          if (!data.profile.invite_code_redeemed_at) {
            navigate(coLinksPaths.wizard);
          } else if (!data.profile.tos_agreed_at) {
            navigate(coLinksPaths.wizard);
          } else if (!data.profile.cosoul) {
            // show the mint button
            navigate(coLinksPaths.wizard);
          } else if (!data.profile.links_held) {
            // redirect to wizard so they can buy their own link
            // we might already be on the wizard
            if (location.pathname !== coLinksPaths.wizard) {
              navigate(coLinksPaths.wizard);
            }
          } else {
            const tosAgreedAt = new Date(data.profile.tos_agreed_at);
            const tosUpdatedAt = new Date(TOS_UPDATED_AT);
            if (tosAgreedAt < tosUpdatedAt) {
              navigate(coLinksPaths.wizard);
            }
          }
        }
      }
    }
  }, [data]);

  // TODO: handle these cases
  // if (!chainId) {
  //   return <Text>Not connected</Text>;
  // }
  //
  // if (!onCorrectChain) {
  //   return <LoadingIndicator />;
  // }

  if (isLoading) {
    return <LoadingModal visible={true} />;
  }

  // if (!data) {
  //   return <Text>Loading...</Text>;
  // }
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
  const address = useConnectedAddress(true);
  const logout = useLogout(true);
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
        <Flex column>
          <Text variant={'label'}>Address:</Text>
          <CopyCodeTextField value={address} tabIndex={-1} />
        </Flex>
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
