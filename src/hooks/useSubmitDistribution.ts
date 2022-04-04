import assert from 'assert';

import { BigNumber, FixedNumber, utils } from 'ethers';
import { GraphQLTypes, ValueTypes } from 'lib/gql/__generated__/zeus';
import {
  useSaveEpochDistribution,
  useUpdateDistribution,
} from 'lib/gql/mutations';
import { getPreviousDistribution } from 'lib/gql/queries';
import { createDistribution } from 'lib/merkle-distributor';
import { MerkleDistributorInfo } from 'lib/merkle-distributor/parse-balance-map';
import { encodeCircleId } from 'lib/vaults';

import { useDistributor, useApeSnackbar, useContracts } from 'hooks';

import { Vault } from './gql/useVaults';

export type SubmitDistribution = {
  amount: number;
  vault: Vault;
  // TODO: Convert this to use the correct type
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

    const denominator = FixedNumber.from(
      BigNumber.from(10).pow(vault[0].decimals)
    );
    const totalDistributionAmount = BigNumber.from(amount).mul(
      BigNumber.from(10).pow(vault[0].decimals)
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
      const query = await getPreviousDistribution(epochId);
      const previousDistribution = query?.distribution_json;

      assert(contracts, 'This network is not supported');
      const yVaultAddress = await contracts
        .getVault(vault[0].vault_address)
        .vault();

      const distribution = createDistribution(
        gifts,
        totalDistributionAmount,
        previousDistribution && JSON.parse(previousDistribution)
      );
      const claims: ValueTypes['claims_insert_input'][] = Object.entries(
        distribution.claims
      ).map(([address, claim]) => ({
        address,
        index: claim.index,
        amount: calculateClaimAmount(claim.amount),
        new_amount: previousDistribution
          ? calculateNewAmount(
              claim.amount,
              address,
              JSON.parse(previousDistribution) as MerkleDistributorInfo
            )
          : calculateClaimAmount(claim.amount),
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
        vault_id: Number(vault[0].id),
        distribution_json: JSON.stringify(distribution),
      };

      const response = await mutateAsync(updateDistribution);
      assert(response, 'Distribution was not saved.');

      await uploadEpochRoot(
        vault[0].vault_address,
        encodeCircleId(circleId),
        yVaultAddress.toString(),
        distribution.merkleRoot,
        totalDistributionAmount,
        utils.hexlify(1)
      );

      await updateDistributionMutateAsync(response.id);
      return true;
    } catch (e) {
      console.error(e);
      apeError(e);
      return false;
    }
  };

  return submitDistribution;
}
