import assert from 'assert';

import { BigNumber, BytesLike } from 'ethers';
import { vault_tx_types_enum } from 'lib/gql/__generated__/zeus';
import { savePendingVaultTx } from 'lib/gql/mutations';
import { encodeCircleId, hasSimpleToken } from 'lib/vaults';

import { useApeSnackbar, useContracts } from 'hooks';
import { sendAndTrackTx } from 'utils/contractHelpers';

import { useMarkClaimTaken } from './mutations';
import type { QueryClaim } from './queries';
import { findMax } from './utils';

export type ClaimAllocationProps = {
  claimIds: number[];
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
    claimIds,
  }: ClaimAllocationProps): Promise<string | undefined> => {
    assert(contracts, 'This network is not supported');
    const {
      vault,
      distribution_epoch_id,
      distribution_json: { circleId },
      epoch,
    } = distribution;
    const vaultContract = contracts.getVault(vault.vault_address);
    const yVaultAddress = await vaultContract.vault();
    try {
      const encodedCircleId = encodeCircleId(circleId);

      const isSimpleToken = hasSimpleToken(vault);

      const trx = await sendAndTrackTx(
        () =>
          contracts.distributor.claim(
            vault.vault_address,
            encodedCircleId,
            isSimpleToken ? vault.simple_token_address : yVaultAddress,
            BigNumber.from(distribution_epoch_id),
            BigNumber.from(index),
            address,
            amount,
            !isSimpleToken,
            proof
          ),
        {
          showInfo,
          showError,
          description: `Claim Tokens from ${
            epoch?.circle?.name || vault.vault_address
          }${epoch?.circle ? `: Epoch ${distribution.epoch.number}` : ''}`,
          chainId: contracts.chainId,
          savePending: async (txHash: string) =>
            savePendingVaultTx({
              tx_hash: txHash,
              claim_id: findMax(claimIds),
              chain_id: Number.parseInt(contracts.chainId),
              tx_type: vault_tx_types_enum.Claim,
            }),
        }
      );

      const { receipt, error } = trx;
      if ((error as any)?.message.match(/User denied transaction signature/))
        return;

      // some other error occurred. saveAndTrackTx will report it
      if (!receipt) return;

      const event = receipt?.events?.find(e => e.event === 'Claimed');
      const txHash = receipt?.transactionHash;
      assert(event, 'Claimed event not found');
      assert(txHash, "Claimed event didn't return a transaction hash");

      showInfo('Saving record of claim...');
      await markSaved({
        claimIds,
        txHash,
      });
      showInfo('Claim succeeded');

      return txHash;
    } catch (e) {
      console.error(e);
      showError(e);
    }
  };
}
