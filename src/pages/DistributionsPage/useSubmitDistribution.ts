import assert from 'assert';

import debug from 'debug';
import { BigNumber, FixedNumber } from 'ethers';
import { ValueTypes, vault_tx_types_enum } from 'lib/gql/__generated__/zeus';
import { savePendingVaultTx } from 'lib/gql/mutations';
import { createDistribution } from 'lib/merkle-distributor';
import { getWrappedAmount } from 'lib/vaults';
import { uploadEpochRoot } from 'lib/vaults/distributor';

import { useApeSnackbar, useContracts } from 'hooks';
import type { Vault } from 'hooks/gql/useVaults';
import { sendAndTrackTx } from 'utils/contractHelpers';

import { useMarkDistributionDone, useSaveDistribution } from './mutations';
import type { PreviousDistribution } from './queries';

const log = debug('distributions'); // eslint-disable-line @typescript-eslint/no-unused-vars

export type SubmitDistributionProps = {
  amount: string;
  vault: Pick<
    Vault,
    'id' | 'decimals' | 'symbol' | 'vault_address' | 'simple_token_address'
  >;
  previousDistribution?: PreviousDistribution;
  profileIdsByAddress: Record<string, number>;
  gifts: Record<string, number>;
  fixedGifts: Record<string, BigNumber>;
  circleId: number;
  epochId: number;
  fixedAmount: string;
  giftAmount: string;
  type: number;
};

export type SubmitDistributionResult = {
  merkleRoot: string;
  totalAmount: BigNumber;
  epochId: BigNumber;
};

const fixed = (val: any) => FixedNumber.from(BigNumber.from(val));

export function useSubmitDistribution() {
  const contracts = useContracts();

  // we write distribution data to the DB twice.
  //
  // the first time we store all the relevant data, before the transaction to
  // upload the epoch root.
  //
  // the second time, after the merkle root has been uploaded, we record the
  // hash of the tx.
  //
  // so if there is some issue after the first save, before the epoch root is
  // uploaded, we'll know there was an issue because we'll see the distribution
  // in the database without a hash.
  //
  const { mutateAsync: saveDistribution } = useSaveDistribution();
  const { mutateAsync: markDistributionDone } = useMarkDistributionDone();
  const { showError, showInfo } = useApeSnackbar();

  return async ({
    amount,
    vault,
    circleId,
    epochId,
    gifts,
    fixedGifts,
    previousDistribution,
    profileIdsByAddress,
    fixedAmount,
    giftAmount,
    type,
  }: SubmitDistributionProps): Promise<
    SubmitDistributionResult | undefined
  > => {
    assert(vault, 'No vault is found');

    try {
      assert(contracts, 'This network is not supported');

      const newTotalAmount = await getWrappedAmount(amount, vault, contracts);
      const shifter = FixedNumber.from(BigNumber.from(10).pow(vault.decimals));
      const newGiftAmount = await getWrappedAmount(
        giftAmount,
        vault,
        contracts
      );
      const prev =
        previousDistribution &&
        JSON.parse(previousDistribution.distribution_json);

      const distribution = createDistribution(
        gifts,
        fixedGifts,
        newTotalAmount,
        newGiftAmount,
        prev
      );

      const claims: ValueTypes['claims_insert_input'][] = Object.entries(
        distribution.claims
      ).map(([address, claim]) => {
        const amount = fixed(claim.amount).divUnsafe(shifter);
        const new_amount = prev
          ? fixed(claim.amount)
              .subUnsafe(fixed(prev.claims[address]?.amount || '0'))
              .divUnsafe(shifter)
              .toString()
          : amount.toString();

        return {
          address: address.toLowerCase(),
          index: claim.index,
          amount: amount.toString(),
          new_amount: new_amount.toString(),
          proof: claim.proof.toString(),
          profile_id: profileIdsByAddress[address.toLowerCase()],
        };
      });

      const response = await saveDistribution({
        // FIXME: we're storing total amounts as fixed numbers & claim amounts
        // as floating-point numbers. we should change this to be consistent,
        // but that will probably require hacking Zeus to return numeric
        // columns as FixedNumber, not Number; otherwise, we create rounding
        // error as soon as we read from the DB...
        total_amount: distribution.tokenTotal,

        epoch_id: Number(epochId),
        merkle_root: distribution.merkleRoot,
        claims: { data: claims },
        vault_id: Number(vault.id),
        distribution_json: JSON.stringify(distribution),
        fixed_amount: Number(FixedNumber.from(fixedAmount, 'fixed128x18')),
        gift_amount: Number(FixedNumber.from(giftAmount, 'fixed128x18')),
        distribution_type: type,
      });

      assert(response, 'Distribution was not saved.');

      const { receipt } = await sendAndTrackTx(
        () =>
          uploadEpochRoot(
            contracts,
            vault,
            circleId,
            distribution.merkleRoot,
            newTotalAmount
          ),
        {
          showInfo,
          showError,
          description: 'Submit Distribution',
          chainId: contracts.chainId,
          savePending: (txHash: string) =>
            savePendingVaultTx({
              tx_hash: txHash,
              distribution_id: response.id,
              chain_id: Number.parseInt(contracts.chainId),
              tx_type: vault_tx_types_enum.Distribution,
            }),
        }
      );

      // could be due to user cancellation
      if (!receipt) return;

      const event = receipt?.events?.find(e => e.event === 'EpochFunded');
      const txHash = receipt?.transactionHash;
      const distributorEpochId = event?.args?.epochId;
      assert(distributorEpochId, "Couldn't find epoch ID");
      assert(
        txHash,
        `no tx hash in receipt: ${JSON.stringify(receipt, null, 2)}`
      );

      showInfo('Saving Distribution...');
      await markDistributionDone({
        id: response.id,
        epochId: distributorEpochId.toNumber(),
        vaultId: vault.id,
        txHash,
        circleId,
      });
      showInfo('Distribution saved successfully');
      return {
        merkleRoot: distribution.merkleRoot,
        totalAmount: BigNumber.from(distribution.tokenTotal),
        epochId: distributorEpochId,
      };
    } catch (e) {
      console.error(e);
      showError(e);
      throw new Error(e as string);
    }
  };
}
