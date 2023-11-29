import React, { createContext, useEffect } from 'react';

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
import { useCoSoulToken } from '../cosoul/useCoSoulToken';

// Define the context's type
interface CoLinksContextType {
  coLinks?: CoLinks;
  onCorrectChain?: boolean;
  library?: Web3Provider;
  chainId?: number;
  coSoulTokenId?: number;
  address?: string;
}

const initialState: CoLinksContextType = {};

// Create the context
const CoLinksContext = createContext<CoLinksContextType>(initialState);

type CoLinksProviderProps = {
  children: React.ReactNode;
};

// Define the provider component
const CoLinksProvider: React.FC<CoLinksProviderProps> = ({ children }) => {
  const { library, chainId, account: address } = useWeb3React();
  const contracts = useCoSoulContracts();
  const { tokenId } = useCoSoulToken({ contracts, address });

  const navigate = useNavigate();
  const onCorrectChain = chainId === Number(chain.chainId);
  const location = useLocation();

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

  if (!chainId) {
    return <Text>Not connected</Text>;
  }

  if (!onCorrectChain) {
    return <LoadingIndicator />;
  }

  if (tokenId === null) {
    return (
      <Text>
        <LoadingIndicator />
      </Text>
    );
  } else if (tokenId === 0) {
    // show the mint button
    navigate(coLinksPaths.wizardStart);
    return null;
  }

  if (!contracts || !address) {
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
        coSoulTokenId: tokenId,
        address,
      }}
    >
      {children}
    </CoLinksContext.Provider>
  );
};

export { CoLinksProvider, CoLinksContext };
