import { useContext } from 'react';

import { CoLinks } from '@coordinape/contracts/typechain';

import { useWeb3React } from '../../hooks/useWeb3React';
import { chain } from '../cosoul/chains';
import { getCoLinksContractWithSigner } from '../cosoul/contracts';

import { CoLinksContext } from './CoLinksContext';

export const useDoWithCoLinksContract = () => {
  const { library } = useWeb3React();
  const { setShowConnectWallet } = useContext(CoLinksContext);

  const signedContract = library
    ? getCoLinksContractWithSigner(library)
    : undefined;
  const chainId = chain.chainId;

  return async (
    fn: (signedContract: CoLinks, chainId: string) => Promise<void>
  ) => {
    if (!signedContract) {
      setShowConnectWallet(true);
      return;
    }
    // eslint-disable-next-line no-console
    return await fn(signedContract, chainId);
  };
};
