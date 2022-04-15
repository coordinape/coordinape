import { Signer } from 'ethers';

import { provider } from './';

export async function unlockSigner(address: string): Promise<Signer> {
  await provider.send('evm_addAccount', [address, '']);
  await provider.send('personal_unlockAccount', [address, '', 0]);
  return provider.getSigner(address);
}
