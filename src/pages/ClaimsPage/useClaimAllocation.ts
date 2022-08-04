import assert from 'assert';

import { BigNumber, BytesLike } from 'ethers';
import { vault_tx_types_enum } from 'lib/gql/__generated__/zeus';
import { savePendingVaultTx } from 'lib/gql/mutations';
import { encodeCircleId } from 'lib/vaults';

import { ZERO_UINT } from 'config/constants';
import { useApeSnackbar, useContracts } from 'hooks';
import { sendAndTrackTx } from 'utils/contractHelpers';

import { useMarkClaimTaken } from './mutations';
import type { QueryClaim } from './queries';

export type ClaimAllocationProps = {
  claimId: number;
  distribution: QueryClaim['distribution'];
  amount: string;
  index: number;
  address: string;
  proof: BytesLike[];
};

export function useClaimAllocation() {
  const contracts = useContracts();
  const { mutateAsync: markSaved } = useMarkClaimTaken();
  const { showError, showInfo } = useApeSnackbar();

  return async ({
    distribution,
    amount,
    index,
    address,
    proof,
    claimId,
  }: ClaimAllocationProps): Promise<string | undefined> => {
    assert(contracts, 'This network is not supported');
    const {
      vault,
      distribution_epoch_id,
      epoch: { circle },
    } = distribution;
    const vaultContract = contracts.getVault(vault.vault_address);
    const yVaultAddress = await vaultContract.vault();
    try {
      assert(circle);
      const encodedCircleId = encodeCircleId(circle.id);

      const root = await contracts.distributor.epochRoots(
        vault.vault_address,
        encodedCircleId,
        yVaultAddress,
        distribution_epoch_id
      );

      if (root === ZERO_UINT) throw new Error('No Epoch Root Found');

      const trx = await sendAndTrackTx(
        () =>
          contracts.distributor.claim(
            vault.vault_address,
            encodedCircleId,
            yVaultAddress,
            BigNumber.from(distribution_epoch_id),
            BigNumber.from(index),
            address,
            amount,
            true,
            proof
          ),
        {
          showInfo,
          showError,
          description: 'Claim Tokens',
          chainId: contracts.chainId,
          savePending: async (txHash: string) =>
            savePendingVaultTx({
              tx_hash: txHash,
              claim_id: claimId,
              org_id: circle.organization.id,
              chain_id: Number.parseInt(contracts.chainId),
              tx_type: vault_tx_types_enum.Claim,
            }),
        }
      );

      const { receipt, error } = trx;
      if ((error as any)?.message.match(/User denied transaction signature/))
        return;

      const event = receipt?.events?.find(e => e.event === 'Claimed');
      const txHash = receipt?.transactionHash;
      assert(event, 'Claimed event not found');
      assert(txHash, "Claimed event didn't return a transaction hash");

      showInfo('Saving record of claim...');
      await markSaved({
        circleId: circle.id,
        txHash,
        vaultAddress: vault.vault_address,
      });
      showInfo('Claim of allocations successful');

      return txHash;
    } catch (e) {
      console.error(e);
      showError(e);
    }
  };
}
