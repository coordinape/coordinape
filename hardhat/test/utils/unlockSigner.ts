import { Signer } from 'ethers';
import { ethers, network } from 'hardhat';

export async function unlockSigner(address: string): Promise<Signer> {
  await network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [address],
  });
  return await ethers.provider.getSigner(address);
}
