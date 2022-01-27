import { USDC_ADDRESS } from '../../../constants';
import {
  ApeToken,
  ApeVaultFactoryBeacon,
  ApeVaultWrapperImplementation,
  ApeVaultWrapperImplementation__factory,
} from '../../../typechain';
import { Account } from '../account';

export async function createApeVault(
  apeToken: ApeToken,
  apeVaultFactory: ApeVaultFactoryBeacon,
  from: Account
): Promise<ApeVaultWrapperImplementation> {
  apeVaultFactory.connect(from.signer);

  const tx = await apeVaultFactory.createApeVault(
    USDC_ADDRESS,
    apeToken.address
  );
  const receipt = await tx.wait();
  if (receipt && receipt?.events) {
    for (const event of receipt.events) {
      if (event?.event === 'VaultCreated') {
        const vaultAddress = event.args?.vault;
        const vault = ApeVaultWrapperImplementation__factory.connect(
          vaultAddress,
          from.signer
        );
        return vault;
      }
    }
  }
  throw new Error('Vault not created');
}
