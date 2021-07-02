import { useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

import {
  useStateMyAddress,
  useStateConnectorName,
  useSetInitialized,
} from 'recoilState';
import connectors from 'utils/connectors';
import { ConnectorNames } from 'utils/enums';

import { useAsync } from './useAsync';

export const useWallet = (): {
  myAddress: string | undefined;
  connectorName: ConnectorNames | undefined;
  activate: (wallet: ConnectorNames) => Promise<void>;
  deactivate: () => void;
} => {
  const asyncCall = useAsync();
  const [connectorName, setConnectorName] = useStateConnectorName();
  const web3Context = useWeb3React();
  const [myAddress, setMyAddress] = useStateMyAddress();
  const setInitialized = useSetInitialized();

  const activateWallet = (wallet: ConnectorNames) => {
    console.log('activateWallet');
    const call = async () => {
      if (!wallet) throw 'Missing wallet connector name';
      const newConnector = connectors[wallet];

      if (
        newConnector instanceof WalletConnectConnector &&
        newConnector.walletConnectProvider?.wc?.uri
      ) {
        newConnector.walletConnectProvider = undefined;
      }

      setConnectorName(wallet);
      return web3Context
        .activate(newConnector, undefined, true)
        .then(() => setInitialized(true));
    };
    return <Promise<void>>asyncCall(call(), true);
  };

  const deactivateWallet = () => {
    setConnectorName(undefined);
    setMyAddress(undefined);
    web3Context.deactivate();
  };

  return {
    myAddress,
    connectorName,
    activate: activateWallet,
    deactivate: deactivateWallet,
  };
};
