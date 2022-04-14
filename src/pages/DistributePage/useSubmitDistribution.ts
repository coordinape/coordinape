import assert from 'assert';

import { BigNumber, FixedNumber, utils } from 'ethers';
import { ValueTypes } from 'lib/gql/__generated__/zeus';
import { createDistribution } from 'lib/merkle-distributor';
import { MerkleDistributorInfo } from 'lib/merkle-distributor/parse-balance-map';
import { encodeCircleId } from 'lib/vaults';

import { useDistributor, useApeSnackbar, useContracts } from 'hooks';
import { Vault } from 'hooks/gql/useVaults';

import {
  useSaveEpochDistribution,
  useMarkDistributionSaved,
} from './mutations';
import type { PreviousDistribution } from './queries';

export type SubmitDistribution = {
  amount: number;
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
  const { uploadEpochRoot } = useDistributor();
  const { mutateAsync } = useSaveEpochDistribution();
  const { mutateAsync: markSaved } = useMarkDistributionSaved();
  const { apeError, showInfo } = useApeSnackbar();

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

    const denominator = FixedNumber.from(
      BigNumber.from(10).pow(vault.decimals)
    );
    let totalAmount = BigNumber.from(amount).mul(
      BigNumber.from(10).pow(vault.decimals)
    );

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

    try {
      assert(contracts, 'This network is not supported');
      const yVaultAddress = await contracts
        .getVault(vault.vault_address)
        .vault();

      const distribution = createDistribution(
        gifts,
        totalAmount,
        previousDistribution &&
          JSON.parse(previousDistribution.distribution_json)
      );

      previousDistribution &&
        (totalAmount = totalAmount.add(
          BigNumber.from(
            JSON.parse(previousDistribution.distribution_json).tokenTotal
          )
        ));

      const { merkleRoot } = distribution;
      const encodedCircleId = encodeCircleId(circleId);
      const claims: ValueTypes['claims_insert_input'][] = Object.entries(
        distribution.claims
      ).map(([address, claim]) => ({
        address: address.toLowerCase(),
        index: claim.index,
        amount: calculateClaimAmount(claim.amount),
        new_amount: previousDistribution
          ? calculateNewAmount(
              claim.amount,
              address,
              JSON.parse(
                previousDistribution.distribution_json
              ) as MerkleDistributorInfo
            )
          : calculateClaimAmount(claim.amount),
        proof: claim.proof.toString(),
        user_id: users[address.toLowerCase()],
      }));

      const updateDistribution: ValueTypes['distributions_insert_input'] = {
        total_amount: Number(FixedNumber.from(totalAmount, 'fixed128x18')),
        epoch_id: Number(epochId),
        merkle_root: distribution.merkleRoot,
        claims: {
          data: claims,
        },
        vault_id: Number(vault.id),
        distribution_json: JSON.stringify(distribution),
      };

      const response = await mutateAsync(updateDistribution);
      assert(response, 'Distribution was not saved.');

      const uploadRoot = await uploadEpochRoot(
        vault.vault_address,
        encodedCircleId,
        yVaultAddress.toString(),
        merkleRoot,
        totalAmount,
        utils.hexlify(1)
      );

      assert(
        uploadRoot && uploadRoot.tx?.value instanceof BigNumber,
        'No Epoch ID returned from function'
      );

      showInfo('Saving Distribution...');
      await markSaved({
        id: response.id,
        epochId: Number(FixedNumber.from(uploadRoot.tx.value)),
      });
      showInfo('Distribution saved successfully');
      return {
        merkleRoot,
        totalAmount,
        encodedCircleId,
        tokenAddress: yVaultAddress.toString(),
        epochId: uploadRoot.tx?.value as BigNumber,
      };
    } catch (e) {
      console.error(e);
      apeError(e);
      throw new Error(e as string);
    }
  };

  return submitDistribution;
}
