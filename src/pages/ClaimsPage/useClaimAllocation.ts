import assert from 'assert';

import { BigNumber, BytesLike } from 'ethers';

import { useApeSnackbar, useContracts } from 'hooks';
import type { Vault } from 'hooks/gql/useVaults';
import { sendAndTrackTx } from 'utils/contractHelpers';

import { useMarkClaimTaken } from './mutations';

export type AllocateClaim = {
  claimId: number;
  circleId: string;
  distributionEpochId: BigNumber;
  amount: string;
  merkleIndex: BigNumber;
  address: string;
  proof: BytesLike[];
  vault: Pick<
    Vault,
    'id' | 'simple_token_address' | 'token_address' | 'vault_address'
  >;
};

export function useClaimAllocation() {
  const contracts = useContracts();
  const { mutateAsync: markSaved } = useMarkClaimTaken();
  const { showError, showInfo } = useApeSnackbar();

  const allocateClaim = async ({
    claimId,
    vault,
    circleId,
    distributionEpochId,
    amount,
    merkleIndex,
    address,
    proof,
  }: AllocateClaim): Promise<string | Error> => {
    assert(contracts, 'This network is not supported');
    const vaultContract = contracts.getVault(vault.vault_address);
    const yVaultAddress = await vaultContract.vault();
    const ZERO_ADDRESS =
      '0x0000000000000000000000000000000000000000000000000000000000000000';
    try {
      const root = await contracts.distributor.epochRoots(
        vault.vault_address,
        circleId,
        yVaultAddress,
        distributionEpochId
      );

      if (root === ZERO_ADDRESS) throw new Error('No Epoch Root Found');

      const trx = await sendAndTrackTx(
        () =>
          contracts.distributor.claim(
            vault.vault_address,
            circleId,
            yVaultAddress,
            distributionEpochId,
            merkleIndex,
            address,
            amount,
            true,
            proof
          ),
        { showInfo, showError }
      );

      const { receipt } = trx;

      const event = receipt?.events?.find(e => e.event === 'Claimed');
      const txHash = receipt?.transactionHash;
      assert(event, 'Claimed event not found');
      assert(txHash, "Claimed event didn't return a transaction hash");
      showInfo('Saving Claim...');
      await markSaved({ claimId, txHash });
      showInfo('Claim Saved Successfully');

      return txHash;
    } catch (e) {
      console.error(e);
      showError(e);
      return new Error(e as string);
    }
  };

  return allocateClaim;
}
