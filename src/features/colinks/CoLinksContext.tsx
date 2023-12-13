import React, { createContext, useEffect, useState } from 'react';

import { CoLinks } from '@coordinape/hardhat/dist/typechain';
import { Web3Provider } from '@ethersproject/providers';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { useWeb3React } from '../../hooks/useWeb3React';
import { coLinksPaths } from '../../routes/paths';
import { Text } from '../../ui';
import { chain } from '../cosoul/chains';
import { useCoSoulContracts } from '../cosoul/useCoSoulContracts';

import { useCoLinksNavQuery } from './useCoLinksNavQuery';
import { TOS_UPDATED_AT } from './wizard/WizardTerms';

// Define the context's type
interface CoLinksContextType {
  coLinks?: CoLinks;
  onCorrectChain?: boolean;
  library?: Web3Provider;
  chainId?: number;
  address?: string;
  awaitingWallet: boolean;
  setAwaitingWallet(b: boolean): void;
}

const initialState: CoLinksContextType = {
  awaitingWallet: false,
  setAwaitingWallet: () => {},
};

// Create the context
const CoLinksContext = createContext<CoLinksContextType>(initialState);

type CoLinksProviderProps = {
  children: React.ReactNode;
};

// Define the provider component
const CoLinksProvider: React.FC<CoLinksProviderProps> = ({ children }) => {
  const { library, chainId, account: address } = useWeb3React();
  const contracts = useCoSoulContracts();

  const navigate = useNavigate();
  const onCorrectChain = chainId === Number(chain.chainId);
  const location = useLocation();

  const [awaitingWallet, setAwaitingWallet] = useState(false);

  const { data } = useCoLinksNavQuery();

  useEffect(() => {
    if (!onCorrectChain) {
      navigate(
        coLinksPaths.wizard +
          '?redirect=' +
          encodeURIComponent(location.pathname),
        {
          replace: true,
        }
      );
    }
  }, [onCorrectChain]);

  useEffect(() => {
    if (data?.profile) {
      if (!data.profile.invite_code_redeemed_at) {
        navigate(coLinksPaths.wizard);
      }
      if (!data.profile.tos_agreed_at) {
        navigate(coLinksPaths.wizard);
      } else {
        const tosAgreedAt = new Date(data.profile.tos_agreed_at);
        const tosUpdatedAt = new Date(TOS_UPDATED_AT);
        if (tosAgreedAt < tosUpdatedAt) {
          navigate(coLinksPaths.wizard);
        }
      }
    }
  }, [data]);

  if (!chainId) {
    return <Text>Not connected</Text>;
  }

  if (!onCorrectChain) {
    return <LoadingIndicator />;
  }

  if (data === undefined) {
    return (
      <Text>
        <LoadingIndicator />
      </Text>
    );
  } else if (!data.profile.cosoul) {
    // show the mint button
    navigate(coLinksPaths.wizardStart);
    return null;
  } else if (!data.profile.links_held) {
    // redirect to wizard so they can buy their own link
    navigate(coLinksPaths.wizardStart);
    return null;
  }

  if (!contracts || !address || !data) {
    // FIXME: better loading state
    return <Text>Loading...</Text>;
  }
  const coLinks = contracts.coLinks;
  if (!coLinks) {
    return <Text>CoLinks not available.</Text>;
  }

  return (
    <CoLinksContext.Provider
      value={{
        coLinks,
        onCorrectChain,
        library,
        chainId,
        address,
        awaitingWallet,
        setAwaitingWallet,
      }}
    >
      {children}
    </CoLinksContext.Provider>
  );
};

export { CoLinksProvider, CoLinksContext };
