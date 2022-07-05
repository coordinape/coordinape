import { Signer } from 'ethers';

import { provider } from './provider';

export async function unlockSigner(address: string): Promise<Signer> {
  if (!process.env.TEST_ON_HARDHAT_NODE) {
    await provider.send('evm_addAccount', [address, '']);
    await provider.send('personal_unlockAccount', [address, '', 0]);
    return provider.getSigner(address);
  }

  await provider.send('hardhat_impersonateAccount', [address]);

  return provider.getSigner(address);
}
