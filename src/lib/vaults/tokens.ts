import assert from 'assert';

import { BigNumber } from 'ethers';
import { GraphQLTypes } from 'lib/gql/__generated__/zeus';

import { Asset } from './';
import type { Contracts } from './contracts';

export const hasSimpleToken = (vault: Pick<GraphQLTypes['vaults'], 'symbol'>) =>
  !Object.values(Asset).includes(vault.symbol as Asset);

export const getTokenAddress = (
  vault: Pick<
    GraphQLTypes['vaults'],
    'symbol' | 'token_address' | 'simple_token_address'
  >
): string => {
  const address = hasSimpleToken(vault)
    ? vault.simple_token_address
    : vault.token_address;
  assert(address, 'Vault is missing token address');
  return address;
};

// given a vault that deposits in Yearn, convert an amount of the normal token
// to an amount of the Yearn vault token (e.g. USDC -> yvUSDC), for uploadEpochRoot
export const convertToVaultAmount = async (
  amount: string,
  vault: Pick<GraphQLTypes['vaults'], 'decimals' | 'vault_address' | 'symbol'>,
  contracts: Contracts
) => {
  const shifter = BigNumber.from(10).pow(vault.decimals);
  const weiAmount = BigNumber.from(amount).mul(shifter);
  if (hasSimpleToken(vault)) return weiAmount;

  const vaultContract = contracts.getVault(vault.vault_address);
  const yToken = await contracts.getYVault(vault.vault_address);
  const vaultBalance = await yToken.balanceOf(vault.vault_address);

  const newTotalAmount = await vaultContract.sharesForValue(weiAmount);

  if (newTotalAmount.lte(vaultBalance)) return newTotalAmount;

  // this is acceptable rounding error
  if (newTotalAmount.lt(vaultBalance.add(100))) return vaultBalance;

  throw new Error(
    `Trying to tap ${newTotalAmount} but vault has only ${vaultBalance}.`
  );
};
