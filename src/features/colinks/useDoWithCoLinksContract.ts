import { useEffect } from 'react';

import { CoLinks } from '@coordinape/hardhat/dist/typechain';

import { useToast } from '../../hooks';
import { useWeb3React } from '../../hooks/useWeb3React';
import { chain } from '../cosoul/chains';
import { getCoLinksContractWithSigner } from '../cosoul/contracts';

export const useDoWithCoLinksContract = () => {
  const { library } = useWeb3React();
  const signedContract = library
    ? getCoLinksContractWithSigner(library)
    : undefined;
  const chainId = chain.chainId;

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log({ library, signedContract, chainId });
  }, [library, signedContract, chainId]);

  const { showError } = useToast();
  return async (
    fn: (signedContract: CoLinks, chainId: string) => Promise<void>
  ) => {
    if (!signedContract) {
      // TODO: this is where we say "hey login dude"
      // TODO: improve this with some login situation
      showError('Please connect your wallet to continue');
      return;
    }
    // eslint-disable-next-line no-console
    return await fn(signedContract, chainId);
  };
};
