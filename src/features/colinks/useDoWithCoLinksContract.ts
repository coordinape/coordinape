import assert from 'assert';
import { useContext, useEffect } from 'react';

import { useAccount, useWalletClient } from 'wagmi';

import { chain } from '../cosoul/chains';
import { getCoLinksContractWithWallet } from '../cosoul/contracts';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { useToast } from 'hooks/useToast';
import { switchNetwork } from 'utils/provider';

import { CoLinksContext } from './CoLinksContext';

//define return type for getCoLinksContractWithWallet
export type CoLinks = ReturnType<typeof getCoLinksContractWithWallet>;

export const useDoWithCoLinksContract = () => {
  const authAddress = useConnectedAddress(false);
  const {
    address: walletAddress,
    chainId: walletChain,
    isConnected,
  } = useAccount();

  const { data: client, isFetched: walletClientFetched } = useWalletClient({
    // account: walletAddress, // TODO: ensure this matches profile auth'd address
    // chainId: walletChain,
  });

  const { showDefault, showError } = useToast();

  const { setShowConnectWallet } = useContext(CoLinksContext);

  const signedContract = client
    ? getCoLinksContractWithWallet(client)
    : undefined;

  const chainId = chain.chainId;
  const onCorrectChain = walletChain === Number(chain.chainId);

  return async (
    fn: (signedContract: CoLinks, chainId: string) => Promise<void>
  ) => {
    if (!signedContract) {
      setShowConnectWallet(true);
      return;
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
