import {
  ApeVaultFactory,
  ApeVaultWrapper,
  ApeVaultWrapper__factory,
} from '../../typechain';
import { USDC_ADDRESS, ZERO_ADDRESS } from '../constants';

import { Account } from './account';

export async function createApeVault(
  apeVaultFactory: ApeVaultFactory,
  from: Account
): Promise<ApeVaultWrapper> {
  apeVaultFactory.connect(from.signer);

  const tx = await apeVaultFactory.createApeVault(USDC_ADDRESS, ZERO_ADDRESS);
  const receipt = await tx.wait();
  if (receipt && receipt?.events) {
    for (const event of receipt.events) {
      if (event?.event === 'VaultCreated') {
        const vaultAddress = event.args?.vault;
        const vault = ApeVaultWrapper__factory.connect(
          vaultAddress,
          from.signer
        );
        return vault;
      }
    }
  }
  throw new Error('Vault not created');
}
