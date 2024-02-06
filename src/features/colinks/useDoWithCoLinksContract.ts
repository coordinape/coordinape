import { useContext } from 'react';

import { CoLinks } from '@coordinape/contracts/typechain';

import { useWeb3React } from '../../hooks/useWeb3React';
import { chain } from '../cosoul/chains';
import { getCoLinksContractWithSigner } from '../cosoul/contracts';
import { useToast } from 'hooks/useToast';
import { switchNetwork } from 'utils/provider';

import { CoLinksContext } from './CoLinksContext';

export const useDoWithCoLinksContract = () => {
  const { library, chainId: walletChain } = useWeb3React();

  const { showDefault } = useToast();

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

    if (!onCorrectChain) {
      showDefault('Please switch to the correct network');
      await switchNetwork(chainId);
    }

    return await fn(signedContract, chainId);
  };
};
