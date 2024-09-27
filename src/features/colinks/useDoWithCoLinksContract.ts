import { useContext } from 'react';

import { useLocation, useNavigate } from 'react-router';
import { useAccount, useWalletClient } from 'wagmi';

import { coLinksPaths } from '../../routes/paths';
import {
  CoLinksWithWallet,
  getCoLinksContractWithWallet,
} from '../../utils/viem/contracts';
import { chain } from '../cosoul/chains';
import { useNavQuery } from '../nav/getNavData';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { useToast } from 'hooks/useToast';
import { switchNetwork } from 'utils/provider';

import { CoLinksContext } from './CoLinksContext';

export const useDoWithCoLinksContract = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authAddress = useConnectedAddress(false);
  const {
    address: walletAddress,
    chainId: walletChain,
    isConnected,
  } = useAccount();

  const { data: profile } = useNavQuery();

  const { data: client, isFetched: walletClientFetched } = useWalletClient({});

  const { showDefault, showError } = useToast();

  const { setShowConnectWallet } = useContext(CoLinksContext);

  const signedContract = client
    ? getCoLinksContractWithWallet(client)
    : undefined;

  const chainId = chain.chainId;
  const onCorrectChain = walletChain === Number(chain.chainId);

  return async (
    fn: (signedContract: CoLinksWithWallet, chainId: string) => Promise<void>
  ) => {
    if (!signedContract || !authAddress) {
      setShowConnectWallet(true);
      return;
    }

    // Check if the user needs to go to the wizard, if we aren't already there
    if (profile?.profiles[0].links_held === 0) {
      if (location.pathname !== coLinksPaths.wizard) {
        navigate(coLinksPaths.wizard);
        return;
      }
    }

    if (!isConnected) {
      showError('Please connect your wallet');
      return;
    }

    if (!walletClientFetched) {
      showError('walletClient not fetched yet');
      return;
    }

    if (!authAddress) {
      showError('Please connect your wallet');
      return;
    }

    if (!onCorrectChain) {
      showDefault('Please switch to the correct network');
      await switchNetwork(chainId);
    }

    if (authAddress.toLowerCase() !== walletAddress?.toLowerCase()) {
      console.error({ authAddress, walletAddress });
      showError(
        `You are not connected to the correct wallet. Please switch your wallet to ${authAddress} and try again.`
      );
      return;
    }

    return await fn(signedContract, chainId);
  };
};
