import { useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

import { useStateMyAddress, useStateConnectorName } from 'recoilState';
import connectors from 'utils/connectors';
import { ConnectorNames } from 'utils/enums';

import { useApeSnackbar } from './useApeSnackbar';

const WALLET_TIMEOUT = 1000 * 10; // 10 seconds

export const useWallet = (): {
  myAddress: string | undefined;
  connectorName: ConnectorNames | undefined;
  activate: (wallet: ConnectorNames) => Promise<void>;
  deactivate: () => void;
} => {
  const { apeError } = useApeSnackbar();
  const [connectorName, setConnectorName] = useStateConnectorName();
  const web3Context = useWeb3React();
  const [myAddress, setMyAddress] = useStateMyAddress();

  const deactivateWallet = () => {
    setConnectorName(undefined);
    setMyAddress(undefined);
    web3Context.deactivate();
  };

  const activateWallet = async (wallet: ConnectorNames) => {
    if (!wallet) {
      apeError('Missing wallet connector name');
      return;
    }
    const newConnector = connectors[wallet];

    if (
      newConnector instanceof WalletConnectConnector &&
      newConnector.walletConnectProvider?.wc?.uri
    ) {
      newConnector.walletConnectProvider = undefined;
    }

    setConnectorName(wallet);
    const handle = setTimeout(() => {
      apeError('Wallet activation timed out.');
      deactivateWallet();
    }, WALLET_TIMEOUT);

    await web3Context.activate(newConnector, (error: Error) => {
      apeError(error);
      deactivateWallet();
    });

    clearTimeout(handle);

    return;
  };

  return {
    myAddress,
    connectorName,
    activate: activateWallet,
    deactivate: deactivateWallet,
  };
};
