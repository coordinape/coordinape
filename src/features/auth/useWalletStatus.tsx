// import CoinbaseSVG from '../../../public/assets/svgs/wallet/coinbase.svg?component';
// import MetaMaskSVG from '../../../public/assets/svgs/wallet/metamask-color.svg?component';
// import WalletConnectSVG from '../../../public/assets/svgs/wallet/wallet-connect.svg?component';
import { ExternalLink } from '../../icons/__generated';
import useConnectedAddress from 'hooks/useConnectedAddress';
import useConnectedChain from 'hooks/useConnectedChain';
import { useWeb3React } from 'hooks/useWeb3React';

import { useLogout } from './useLogout';

// const connectorIcon = (
//   connector: ReturnType<typeof useWeb3React>['connector']
// ) => {
//   if (!connector) return null;
//
//   const name = Object.entries(connectors).find(
//     ([, ctr]) => connector.constructor === ctr.constructor
//   )?.[0];
//
//   switch (name) {
//     case EConnectorNames.Injected:
//       return <MetaMaskSVG />;
//     case EConnectorNames.WalletConnect:
//       return <WalletConnectSVG />;
//     case EConnectorNames.WalletLink:
//       return <CoinbaseSVG />;
//   }
//   return null;
// };

export const useWalletStatus = () => {
  const { deactivate } = useWeb3React();
  const address = useConnectedAddress();
  const { chainId, chainName } = useConnectedChain();
  const logout = useLogout(true);

  return {
    icon: <ExternalLink />,
    address,
    chainId,
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
  chainId: number | undefined;
  logout: () => void;
};
