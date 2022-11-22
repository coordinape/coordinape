import { createContext, useContext } from 'react';

import { ReactComponent as CoinbaseSVG } from 'assets/svgs/wallet/coinbase.svg';
import { ReactComponent as MetaMaskSVG } from 'assets/svgs/wallet/metamask-color.svg';
import { ReactComponent as WalletConnectSVG } from 'assets/svgs/wallet/wallet-connect.svg';
import { EConnectorNames } from 'config/constants';
import { useApiBase } from 'hooks';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { useWeb3React } from 'hooks/useWeb3React';
import { connectors } from 'utils/connectors';

import useConnectedChain from './useConnectedChain';

const connectorIcon = (
  connector: ReturnType<typeof useWeb3React>['connector']
) => {
  if (!connector) return null;

  const name = Object.entries(connectors).find(
    ([, ctr]) => connector.constructor === ctr.constructor
  )?.[0];

  switch (name) {
    case EConnectorNames.Injected:
      return <MetaMaskSVG />;
    case EConnectorNames.WalletConnect:
      return <WalletConnectSVG />;
    case EConnectorNames.WalletLink:
      return <CoinbaseSVG />;
  }
  return null;
};

export const useWalletStatus = () => {
  const { connector, deactivate } = useWeb3React();
  const address = useConnectedAddress();
  const { chainName } = useConnectedChain();
  const { logout } = useApiBase();

  return {
    icon: connectorIcon(connector),
    address,
    chainName,
    logout: () => {
      logout();

      // this is wrapped in setTimeout to make sure the Recoil state changes
      // from logout() above are applied before we re-render RequireAuth.
      // otherwise, after logging out, you immediately see a signature prompt
      setTimeout(deactivate);
    },
  };
};

export type WalletStatus = {
  icon: JSX.Element | null;
  address: string | undefined;
  chainName: string | undefined;
  logout: () => void;
};

export type AuthStep = 'connect' | 'sign' | 'done';

type AuthContextType = [
  AuthStep,
  React.Dispatch<React.SetStateAction<AuthStep>>
];

export const AuthContext = createContext<AuthContextType>([
  'connect',
  () => {},
]);

export const useAuthStep = () => useContext(AuthContext);
