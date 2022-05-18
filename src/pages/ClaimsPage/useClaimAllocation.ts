import assert from 'assert';

import { BigNumber, BytesLike } from 'ethers';

import { ZERO_ADDRESS } from 'config/constants';
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

export type ClaimResult = {
  txHash: string;
  claimable: BigNumber;
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
  }: AllocateClaim): Promise<ClaimResult> => {
    assert(contracts, 'This network is not supported');
    const vaultContract = contracts.getVault(vault.vault_address);
    const yVaultAddress = await vaultContract.vault();
    const tokenAddress =
      vault.simple_token_address === ZERO_ADDRESS
        ? vault.token_address
        : vault.simple_token_address;
    assert(tokenAddress, 'No Valid Token Address found');
    try {
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
      const claimable = event?.args?.claimable;
      const txHash = receipt?.transactionHash;
      assert(claimable, 'Claimed event not found');
      assert(txHash, "Claimed event didn't return a trasnaction hash");
      showInfo('Saving Claim...');
      await markSaved(claimId);
      showInfo('Claim Saved Successfully');

      return {
        txHash,
        claimable,
      };
    } catch (e) {
      console.error(e);
      showError(e);
      throw new Error(e as string);
    }
  };

  return allocateClaim;
}
