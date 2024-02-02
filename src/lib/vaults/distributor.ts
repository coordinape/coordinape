import { BigNumber } from '@ethersproject/bignumber';
import { utils } from 'ethers';
import { GraphQLTypes } from 'lib/gql/__generated__/zeus';

import { Contracts, encodeCircleId, hasSimpleToken } from '.';

export async function uploadEpochRoot(
  contracts: Contracts,
  vault: Pick<GraphQLTypes['vaults'], 'simple_token_address' | 'vault_address'>,
  circleId: number,
  merkleRoot: string,
  amount: BigNumber
) {
  const encodedCircleId = encodeCircleId(circleId);
  const isSimpleToken = hasSimpleToken(vault);
  const vaultContract = contracts.getVault(vault.vault_address);
  const tokenAddress = isSimpleToken
    ? vault.simple_token_address
    : await vaultContract.vault();
  const tapType = utils.hexlify(isSimpleToken ? 2 : 1);

  return contracts.distributor.uploadEpochRoot(
    vault.vault_address,
    encodedCircleId,
    tokenAddress,
    merkleRoot,
    amount,
    tapType
  );
}
