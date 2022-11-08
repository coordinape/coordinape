import type { JsonRpcProvider } from '@ethersproject/providers';
import { Signer } from 'ethers';

import { provider as defaultProvider } from './provider';

export async function unlockSigner(
  address: string,
  provider?: JsonRpcProvider
): Promise<Signer> {
  if (!provider) provider = defaultProvider();

  if (!process.env.TEST_ON_HARDHAT_NODE) {
    await provider.send('evm_addAccount', [address, '']);
    await provider.send('personal_unlockAccount', [address, '', 0]);
    return provider.getSigner(address);
  }

  await provider.send('hardhat_impersonateAccount', [address]);
  return provider.getSigner(address);
}
