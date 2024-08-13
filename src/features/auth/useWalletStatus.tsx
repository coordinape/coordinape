import { useDisconnect } from 'wagmi';

import { ExternalLink } from '../../icons/__generated';
import useConnectedAddress from 'hooks/useConnectedAddress';
import useConnectedChain from 'hooks/useConnectedChain';

import { useLogout } from './useLogout';

export const useWalletStatus = () => {
  const { disconnect } = useDisconnect();
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
      setTimeout(disconnect);
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
