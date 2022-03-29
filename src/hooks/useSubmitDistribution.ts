import assert from 'assert';

import { BigNumber, FixedNumber, utils } from 'ethers';
import { GraphQLTypes, ValueTypes } from 'lib/gql/__generated__/zeus';
import {
  useSaveEpochDistribution,
  useUpdateDistribution,
} from 'lib/gql/mutations';
import { createDistribution } from 'lib/merkle-distributor';
import { encodeCircleId } from 'lib/vaults';

import { useDistributor, useApeSnackbar, useContracts } from 'hooks';

export type SubmitDistribution = {
  amount: number;
  vault: GraphQLTypes['vaults'];
  users: GraphQLTypes['users'][];
  circleId: number;
  epochId: number;
};

export function useSubmitDistribution() {
  const contracts = useContracts();
  const { uploadEpochRoot } = useDistributor();
  const { mutateAsync } = useSaveEpochDistribution();
  const { mutateAsync: updateDistributionMutateAsync } =
    useUpdateDistribution();
  const { apeError } = useApeSnackbar();

  const submitDistribution = async ({
    amount,
    vault,
    circleId,
    users,
    epochId,
  }: SubmitDistribution) => {
    assert(vault, 'No vault is found');
    const gifts = users.reduce((userList, user) => {
      const amount = user.received_gifts.reduce(
        (t, { tokens }) => t + tokens,
        0
      );
      if (amount > 0) userList[user.address] = amount;
      return userList;
    }, {} as Record<string, number>);

    const denominator = BigNumber.from(10).pow(vault.decimals);
    const totalDistributionAmount = BigNumber.from(amount).mul(denominator);

    try {
      assert(contracts, 'This network is not supported');
      const yVaultAddress = await contracts
        .getVault(vault.vault_address)
        .vault();
      const distribution = createDistribution(gifts, totalDistributionAmount);
      const claims: ValueTypes['claims_insert_input'][] = Object.entries(
        distribution.claims
      ).map(([address, claim]) => ({
        address,
        index: claim.index,
        amount: Number(
          FixedNumber.from(BigNumber.from(claim.amount)).divUnsafe(
            FixedNumber.from(denominator)
          )
        ),
        proof: claim.proof.toString(),
        user_id: users.find(({ address }) => address === address)?.id,
      }));

      const updateDistribution: ValueTypes['distributions_insert_input'] = {
        total_amount: Number(
          FixedNumber.from(totalDistributionAmount, 'fixed128x18')
        ),
        epoch_id: Number(epochId),
        merkle_root: distribution.merkleRoot,
        claims: {
          data: claims,
        },
        vault_id: Number(vault.id),
      };

      const { insert_distributions_one } = await mutateAsync(
        updateDistribution
      );
      assert(insert_distributions_one, 'Distribution was not saved.');

      await uploadEpochRoot(
        vault.vault_address,
        encodeCircleId(circleId),
        yVaultAddress.toString(),
        distribution.merkleRoot,
        totalDistributionAmount,
        utils.hexlify(1)
      );

      await updateDistributionMutateAsync(insert_distributions_one.id);
      return true;
    } catch (e) {
      console.error(e);
      apeError(e);
      return false;
    }
  };

  return submitDistribution;
}
