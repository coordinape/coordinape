import assert from 'assert';

import { parseUnits } from 'ethers/lib/utils';
import { lockedTokenDistribution } from 'lib/hedgey';

import { useContracts } from 'hooks';

import {
  useMarkLockedDistributionDone,
  useSaveLockedTokenDistribution,
} from './mutations';
import { getProfileIds } from './queries';

export const useLockedTokenDistribution = () => {
  const contracts = useContracts();
  const { mutateAsync: saveLockedTokenDistribution } =
    useSaveLockedTokenDistribution();
  const { mutateAsync: markLockedDistributionDone } =
    useMarkLockedDistributionDone();
  return async ({
    amount,
    gifts,
    vault,
    tokenContractAddress,
    hedgeyLockPeriod,
    hedgeyTransferable,
    epochId,
    totalGive,
  }: any) => {
    assert(contracts, 'This network is not supported');

    const token = contracts.getERC20(
      vault ? vault.simple_token_address : tokenContractAddress
    );

    const [symbol, decimals] = await Promise.all([
      token.symbol(),
      token.decimals(),
    ]);
    const weiAmount = parseUnits(amount, decimals);

    if (vault) {
      const vaultContract = contracts.getVault(vault.vault_address);
      const result = await vaultContract.apeWithdrawSimpleToken(weiAmount);
      await result.wait();
    }

    const balances = Object.keys(gifts).map(address => ({
      address,
      earnings: weiAmount.mul(gifts[address]).div(totalGive).toString(),
    }));

    const profileIds = await getProfileIds(
      balances.map(balance => balance.address)
    );

    const response = await saveLockedTokenDistribution({
      token_symbol: symbol,
      token_decimals: decimals.toString(),
      token_contract_address: tokenContractAddress,
      epoch_id: epochId,
      gift_amount: amount,
      chain_id: Number(contracts.chainId),
      locked_token_distribution_gifts: balances.map(balance => ({
        profile_id: profileIds.find(
          profile => profile.address === balance.address
        )?.id,
        earnings: balance.earnings,
      })),
    });

    assert(response, 'Locked distribution was not saved.');

    const transaction = await lockedTokenDistribution(
      contracts.provider,
      contracts,
      token,
      weiAmount,
      hedgeyLockPeriod,
      hedgeyTransferable,
      balances
    );
    const receipt = await transaction.wait();
    if (!receipt) return;

    await markLockedDistributionDone({
      id: response.id,
      tx_hash: receipt.transactionHash,
    });
    return receipt;
  };
};
