import assert from 'assert';

import debug from 'debug';
import { BigNumber, FixedNumber, utils } from 'ethers';
import { ValueTypes } from 'lib/gql/__generated__/zeus';
import { createDistribution } from 'lib/merkle-distributor';
import { encodeCircleId, getWrappedAmount } from 'lib/vaults';

import { useApeSnackbar, useContracts } from 'hooks';
import type { Vault } from 'hooks/gql/useVaults';
import { sendAndTrackTx } from 'utils/contractHelpers';

import {
  useMarkDistributionSaved,
  useSaveEpochDistribution,
} from './mutations';
import type { PreviousDistribution } from './queries';

const log = debug('distributions'); // eslint-disable-line @typescript-eslint/no-unused-vars

export type SubmitDistribution = {
  amount: string;
  vault: Pick<Vault, 'id' | 'decimals' | 'symbol' | 'vault_address'>;
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
  encodedCircleId: string;
  tokenAddress: string;
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
  const { mutateAsync: saveDistribution } = useSaveEpochDistribution();
  const { mutateAsync: markDistributionUploaded } = useMarkDistributionSaved();

  const { showError, showInfo } = useApeSnackbar();

  const submitDistribution = async ({
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
  }: SubmitDistribution): Promise<SubmitDistributionResult> => {
    assert(vault, 'No vault is found');

    try {
      assert(contracts, 'This network is not supported');

      const vaultContract = contracts.getVault(vault.vault_address);
      const yVaultAddress = await vaultContract.vault();
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

      const totalAmount = prev
        ? newTotalAmount.add(BigNumber.from(prev.tokenTotal))
        : newTotalAmount;

      const response = await saveDistribution({
        // FIXME: we're storing total amounts as fixed numbers & claim amounts
        // as floating-point numbers. we should change this to be consistent,
        // but that will probably require hacking Zeus to return numeric
        // columns as FixedNumber, not Number; otherwise, we create rounding
        // error as soon as we read from the DB...
        total_amount: FixedNumber.from(totalAmount).toString(),

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

      const encodedCircleId = encodeCircleId(circleId);

      const { receipt } = await sendAndTrackTx(
        () =>
          contracts.distributor.uploadEpochRoot(
            vault.vault_address,
            encodedCircleId,
            yVaultAddress,
            distribution.merkleRoot,
            newTotalAmount,
            utils.hexlify(1)
          ),
        {
          showInfo,
          showError,
          description: 'Submit Distribution',
          chainId: contracts.chainId,
        }
      );

      const event = receipt?.events?.find(e => e.event === 'EpochFunded');
      const txHash = receipt?.transactionHash;
      const distributorEpochId = event?.args?.epochId;
      assert(distributorEpochId, "Couldn't find epoch ID");
      assert(
        txHash,
        `no tx hash in receipt: ${JSON.stringify(receipt, null, 2)}`
      );

      showInfo('Saving Distribution...');
      await markDistributionUploaded({
        id: response.id,
        epochId: distributorEpochId.toNumber(),
        txHash,
      });
      showInfo('Distribution saved successfully');
      return {
        merkleRoot: distribution.merkleRoot,
        totalAmount,
        encodedCircleId,
        tokenAddress: yVaultAddress.toString(),
        epochId: distributorEpochId,
      };
    } catch (e) {
      console.error(e);
      showError(e);
      throw new Error(e as string);
    }
  };

  return submitDistribution;
}
