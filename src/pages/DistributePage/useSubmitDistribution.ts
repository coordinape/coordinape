import assert from 'assert';

import { BigNumber, FixedNumber, utils } from 'ethers';
import { ValueTypes } from 'lib/gql/__generated__/zeus';
import { createDistribution } from 'lib/merkle-distributor';
import { MerkleDistributorInfo } from 'lib/merkle-distributor/parse-balance-map';
import { encodeCircleId, convertToVaultAmount } from 'lib/vaults';

import { useApeSnackbar, useContracts } from 'hooks';
import type { Vault } from 'hooks/gql/useVaults';
import { sendAndTrackTx } from 'utils/contractHelpers';

import {
  useSaveEpochDistribution,
  useMarkDistributionSaved,
} from './mutations';
import type { PreviousDistribution } from './queries';

export type SubmitDistribution = {
  amount: string;
  vault: Vault;
  previousDistribution?: PreviousDistribution;
  users: Record<string, number>;
  gifts: Record<string, number>;
  circleId: number;
  epochId: number;
};

export type SubmitDistributionResult = {
  merkleRoot: string;
  totalAmount: BigNumber;
  encodedCircleId: string;
  tokenAddress: string;
  epochId: BigNumber;
};

export function useSubmitDistribution() {
  const contracts = useContracts();
  const { mutateAsync } = useSaveEpochDistribution();
  const { mutateAsync: markSaved } = useMarkDistributionSaved();
  const { showError, showInfo } = useApeSnackbar();

  const submitDistribution = async ({
    amount,
    vault,
    circleId,
    users,
    epochId,
    gifts,
    previousDistribution,
  }: SubmitDistribution): Promise<SubmitDistributionResult> => {
    assert(vault, 'No vault is found');

    try {
      assert(contracts, 'This network is not supported');

      const shifter = BigNumber.from(10).pow(vault.decimals);
      const vaultContract = contracts.getVault(vault.vault_address);
      const yVaultAddress = await vaultContract.vault();

      const newTotalAmount = await convertToVaultAmount(
        amount,
        vault,
        contracts
      );

      const denominator = FixedNumber.from(shifter);

      const calculateClaimAmount = (amount: string) =>
        Number(FixedNumber.from(BigNumber.from(amount)).divUnsafe(denominator));

      const calculateNewAmount = (
        currentAmount: string,
        address: string,
        previousDistribution: MerkleDistributorInfo
      ) => {
        const previous = FixedNumber.from(
          BigNumber.from(previousDistribution.claims[address].amount || '0')
        );
        const current = FixedNumber.from(BigNumber.from(currentAmount));
        return Number(current.subUnsafe(previous).divUnsafe(denominator));
      };

      const prev =
        previousDistribution &&
        JSON.parse(previousDistribution.distribution_json);

      const distribution = createDistribution(gifts, newTotalAmount, prev);

      const totalAmount = prev
        ? newTotalAmount.add(BigNumber.from(prev.tokenTotal))
        : newTotalAmount;

      const { merkleRoot } = distribution;
      const encodedCircleId = encodeCircleId(circleId);
      const claims: ValueTypes['claims_insert_input'][] = Object.entries(
        distribution.claims
      ).map(([address, claim]) => {
        const amount = calculateClaimAmount(claim.amount);
        return {
          address: address.toLowerCase(),
          index: claim.index,
          amount,
          new_amount: previousDistribution
            ? calculateNewAmount(claim.amount, address, prev)
            : amount,
          proof: claim.proof.toString(),
          user_id: users[address.toLowerCase()],
        };
      });

      const saveDistribution: ValueTypes['distributions_insert_input'] = {
        total_amount: Number(FixedNumber.from(totalAmount, 'fixed128x18')),
        epoch_id: Number(epochId),
        merkle_root: distribution.merkleRoot,
        claims: {
          data: claims,
        },
        vault_id: Number(vault.id),
        distribution_json: JSON.stringify(distribution),
      };

      const response = await mutateAsync(saveDistribution);
      assert(response, 'Distribution was not saved.');

      const { receipt } = await sendAndTrackTx(
        () =>
          contracts.distributor.uploadEpochRoot(
            vault.vault_address,
            encodedCircleId,
            yVaultAddress,
            merkleRoot,
            newTotalAmount,
            utils.hexlify(1)
          ),
        { showInfo, showError }
      );

      const event = receipt?.events?.find(e => e.event === 'EpochFunded');
      const distributorEpochId = event?.args?.epochId;
      assert(distributorEpochId, "Couldn't find epoch ID");

      showInfo('Saving Distribution...');
      await markSaved({
        id: response.id,
        epochId: distributorEpochId.toNumber(),
      });
      showInfo('Distribution saved successfully');
      return {
        merkleRoot,
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
