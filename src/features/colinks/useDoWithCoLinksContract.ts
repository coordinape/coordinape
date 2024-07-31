import { useContext } from 'react';

import { CoLinks } from '@coordinape/contracts/typechain';

import { useWeb3React } from '../../hooks/useWeb3React';
import { chain } from '../cosoul/chains';
import { getCoLinksContractWithSigner } from '../cosoul/contracts';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { useToast } from 'hooks/useToast';
import { switchNetwork } from 'utils/provider';

import { CoLinksContext } from './CoLinksContext';

export const useDoWithCoLinksContract = () => {
  const authAccount = useConnectedAddress(false);
  const {
    library,
    account: web3Account,
    chainId: walletChain,
  } = useWeb3React();

  const { showDefault, showError } = useToast();

  const { setShowConnectWallet } = useContext(CoLinksContext);

  const signedContract = library
    ? getCoLinksContractWithSigner(library)
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

    if (!authAccount) {
      showError('Please connect your wallet');
      return;
    }

    if (!onCorrectChain) {
      showDefault('Please switch to the correct network');
      await switchNetwork(chainId);
    }

    if (authAccount.toLowerCase() !== web3Account?.toLowerCase()) {
      console.error({ authAccount, web3Account });
      showError(
        `You are not connected to the correct wallet. Please switch your wallet to ${authAccount} and try again.`
      );
      return;
    }

    return await fn(signedContract, chainId);
  };
};
