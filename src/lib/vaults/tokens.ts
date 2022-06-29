import assert from 'assert';

import { BigNumber, FixedNumber } from 'ethers';
import { GraphQLTypes } from 'lib/gql/__generated__/zeus';

import { ZERO_ADDRESS } from 'config/constants';

import type { Contracts } from './contracts';

export const hasSimpleToken = ({
  simple_token_address,
}: Pick<GraphQLTypes['vaults'], 'simple_token_address'>) =>
  simple_token_address && simple_token_address !== ZERO_ADDRESS;

export const getTokenAddress = (
  vault: Pick<
    GraphQLTypes['vaults'],
    'symbol' | 'token_address' | 'simple_token_address'
  >
): string => {
  const address = hasSimpleToken(vault)
    ? vault.simple_token_address
    : vault.token_address;
  assert(
    address && address !== ZERO_ADDRESS,
    'coVault is missing token address'
  );
  return address;
};

// given a vault that deposits in Yearn, convert an amount of the unwrapped token
// to an amount of the Yearn vault token (e.g. USDC -> yvUSDC), for uploadEpochRoot
//
// FIXME ideally this and getUnwrappedAmount would be symmetrical, but their
// arguments are very different
export const getWrappedAmount = async (
  amount: string,
  vault: Pick<
    GraphQLTypes['vaults'],
    'decimals' | 'vault_address' | 'simple_token_address'
  >,
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

export const getUnwrappedAmount = (
  amount: number,
  pricePerShare: FixedNumber,
  decimals?: number
) => {
  let result = FixedNumber.from(amount.toPrecision(30)).mulUnsafe(
    pricePerShare
  );

  if (decimals)
    result = result.divUnsafe(
      FixedNumber.from(BigNumber.from(10).pow(decimals))
    );

  return result.toUnsafeFloat();
};
