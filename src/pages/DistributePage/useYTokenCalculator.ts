import assert from 'assert';

import { BigNumber } from 'ethers';

import { useContracts } from 'hooks';
import { Vault } from 'hooks/gql/useVaults';

/**
 * Convert to amount of yTokens if this is a Yearn vault token.
 * TODO skip this for simple token vaults -- but there are bigger issues
 * with simple token vaults yet to be resolved before uploading will work anyway
 * @returns Promise<BigNumber>
 */
export function useYTokenCalculator() {
  const contracts = useContracts();
  const total = async (amount: string, vault: Vault) => {
    assert(contracts);

    const shifter = BigNumber.from(10).pow(vault.decimals);
    const vaultContract = contracts.getVault(vault.vault_address);
    const yVaultAddress = await vaultContract.vault();
    const yToken = contracts.getERC20(yVaultAddress);
    const vaultBalance = await yToken.balanceOf(vault.vault_address);

    const weiAmount = BigNumber.from(amount).mul(shifter);
    let newTotalAmount = await vaultContract.sharesForValue(weiAmount);

    if (newTotalAmount.gt(vaultBalance)) {
      // acceptable rounding error?
      if (newTotalAmount.lt(vaultBalance.add(100))) {
        newTotalAmount = vaultBalance;
      } else {
        throw new Error(
          `Trying to tap ${newTotalAmount} but vault has only ${vaultBalance}.`
        );
      }
    }
    return newTotalAmount;
  };

  return total;
}
