import assert from 'assert';

import { BigNumber, BytesLike } from 'ethers';
import { encodeCircleId } from 'lib/vaults';

import { ZERO_UINT } from 'config/constants';
import { useApeSnackbar, useContracts } from 'hooks';
import type { Vault } from 'hooks/gql/useVaults';
import { sendAndTrackTx } from 'utils/contractHelpers';

import { useMarkClaimTaken } from './mutations';

export type ClaimAllocationProps = {
  claimId: number;
  circleId: number;
  distributionEpochId: number;
  amount: string;
  index: number;
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

  return async ({
    claimId,
    vault,
    circleId,
    distributionEpochId,
    amount,
    index,
    address,
    proof,
  }: ClaimAllocationProps): Promise<string | Error> => {
    assert(contracts, 'This network is not supported');
    const vaultContract = contracts.getVault(vault.vault_address);
    const yVaultAddress = await vaultContract.vault();

    try {
      const encodedCircleId = encodeCircleId(circleId);

      const root = await contracts.distributor.epochRoots(
        vault.vault_address,
        encodedCircleId,
        yVaultAddress,
        distributionEpochId
      );

      if (root === ZERO_UINT) throw new Error('No Epoch Root Found');

      const trx = await sendAndTrackTx(
        () =>
          contracts.distributor.claim(
            vault.vault_address,
            encodedCircleId,
            yVaultAddress,
            BigNumber.from(distributionEpochId),
            BigNumber.from(index),
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

      showInfo('Saving record of claim...');
      await markSaved({ claimId, txHash });
      showInfo('Saved');

      return txHash;
    } catch (e) {
      console.error(e);
      showError(e);
      return new Error(e as string);
    }
  };
}
