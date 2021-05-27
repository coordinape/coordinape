import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { BigNumber, ethers } from 'ethers';

import { ConnectWalletModal, LoadingModal } from 'components';
import { TOKEN_PRICE_DECIMALS } from 'config/constants';
import { useConnectedWeb3Context } from 'contexts/connectedWeb3';
import { ERC20Service } from 'services/erc20';
import { StakeService } from 'services/stake';
import { ZERO_NUMBER } from 'utils/number';

import { KnownToken } from 'types';

interface IBalanceInfo {
  ethBalance: BigNumber;
  tokenBalances: {
    [key in KnownToken]: BigNumber;
  };
  fssInTotal: BigNumber;
  fmaInStaking: BigNumber;
  ratioFMAFSS: BigNumber;
  withdrawableDivends: BigNumber;
}

export interface IGlobalData {
  walletConnectModalOpened: boolean;
  isLoading: boolean;
  loadingText: string;
}

export interface IGlobalDefaultData extends IGlobalData {
  toggleWalletConnectModal: () => void;
  setLoading: (loading: boolean, loadingText?: string) => void;
}

const GlobalContext = React.createContext<IGlobalDefaultData>({
  walletConnectModalOpened: false,
  toggleWalletConnectModal: () => {},
  isLoading: false,
  loadingText: '',
  setLoading: () => {},
});

export const useGlobal = () => {
  const context = React.useContext(GlobalContext);

  if (!context) {
    throw new Error('Component rendered outside the provider tree');
  }

  return context;
};

interface IProps {
  children: React.ReactNode | React.ReactNode[];
}

export const GlobalProvider = (props: IProps) => {
  const [state, setState] = useState<IGlobalData>({
    walletConnectModalOpened: false,
    isLoading: false,
    loadingText: '',
  });
  const { account, library: provider, networkId } = useConnectedWeb3Context();

  const loadAllData = async () => {};

  useEffect(() => {
    // eslint-disable-next-line
    loadAllData();
  }, [networkId, account]);

  const toggleWalletConnectModal = () => {
    setState((prevState) => ({
      ...prevState,
      walletConnectModalOpened: !prevState.walletConnectModalOpened,
    }));
  };

  const setLoading = (loading: boolean, loadingText?: string) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: loading,
      loadingText: loadingText || '',
    }));
  };

  return (
    <GlobalContext.Provider
      value={{
        ...state,
        toggleWalletConnectModal,
        setLoading,
      }}
    >
      {props.children}
      {state.walletConnectModalOpened && (
        <ConnectWalletModal
          onClose={toggleWalletConnectModal}
          visible={state.walletConnectModalOpened}
        />
      )}
      {state.isLoading && (
        <LoadingModal
          onClose={() => setLoading(false)}
          text={state.loadingText}
          visible={state.isLoading}
        />
      )}
    </GlobalContext.Provider>
  );
};
