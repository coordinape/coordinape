import assert from 'assert';

import { AddressZero } from '@ethersproject/constants';
import { BigNumber, FixedNumber } from 'ethers';
import { parseUnits, isAddress } from 'ethers/lib/utils';
import { GraphQLTypes } from 'lib/gql/__generated__/zeus';

import { shortenAddress } from 'utils';

import type { Contracts } from './contracts';

export const hasSimpleToken = ({
  simple_token_address,
}: Pick<GraphQLTypes['vaults'], 'simple_token_address'>) => {
  if (!simple_token_address) return false;
  assert(isAddress(simple_token_address), 'invalid address');
  return simple_token_address !== AddressZero;
};

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
    address && address !== AddressZero,
    'CoVault is missing token address'
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
): Promise<BigNumber> => {
  const weiAmount = parseUnits(amount, vault.decimals);
  if (hasSimpleToken(vault)) return weiAmount;

  const vaultContract = contracts.getVault(vault.vault_address);
  const yToken = await contracts.getYVault(vault.vault_address);
  const vaultBalance = await yToken.balanceOf(vault.vault_address);

  const newTotalAmount = await vaultContract.sharesForValue(weiAmount);

  if (newTotalAmount.lte(vaultBalance)) return newTotalAmount;

  // this is acceptable rounding error
  const acceptableError = BigNumber.from(10).pow(vault.decimals - 4);
  if (newTotalAmount.lt(vaultBalance.add(acceptableError))) return vaultBalance;

  throw new Error(
    `Trying to tap ${newTotalAmount} but vault has only ${vaultBalance}.`
  );
};

export const getUnwrappedAmount = (
  amount: number | string | BigNumber,
  pricePerShare: FixedNumber,
  decimals?: number
) => {
  let figure = amount;
  if (typeof amount === 'number') {
    const str = amount.toPrecision(30);
    const [b, a] = str.split('.');
    figure = b + '.' + a.substring(0, 18);
  }
  let result = FixedNumber.from(figure).mulUnsafe(pricePerShare);

  if (decimals)
    result = result.divUnsafe(
      FixedNumber.from(BigNumber.from(10).pow(decimals))
    );

  return result.toUnsafeFloat();
};

const yearnPrefix = 'Yearn ';

const addYearnPrefix = (symbol: string) =>
  symbol.includes(yearnPrefix) ? symbol : yearnPrefix + symbol;

export const removeYearnPrefix = (symbol: string) =>
  symbol.includes(yearnPrefix) ? symbol.substring(yearnPrefix.length) : symbol;

export const getDisplayTokenString = (vault: {
  symbol: string;
  simple_token_address: string;
}): string =>
  hasSimpleToken(vault) ? vault.symbol : addYearnPrefix(vault.symbol);

export const getVaultSymbolAddressString = (vault: {
  symbol: string;
  vault_address: string;
}): string => `${vault.symbol} ${shortenAddress(vault.vault_address, false)}`;

export const removeAddressSuffix = (symbol: string, vaultAddress: string) => {
  const suffix = shortenAddress(vaultAddress, false);
  return symbol.includes(suffix) ? symbol.substring(suffix.length) : symbol;
};
