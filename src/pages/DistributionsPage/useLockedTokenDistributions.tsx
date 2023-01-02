import assert from 'assert';

import { parseUnits } from 'ethers/lib/utils';
import { lockedTokenDistribution } from 'lib/hedgey';

import { DebugLogger } from '../../common-lib/log';
import { useContracts } from 'hooks';

import {
  useMarkLockedDistributionDone,
  useSaveLockedTokenDistribution,
} from './mutations';
import { getProfileIds } from './queries';

const logger = new DebugLogger('useLockedTokenDistribution');

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
    logger.log('useLockedTokenDistribution');

    let tokenAddress;
    if (vault) {
      tokenAddress = vault.simple_token_address || vault.vault_address;
    } else {
      tokenAddress = tokenContractAddress;
    }

    assert(tokenAddress, 'no token address');
    const token = contracts.getERC20(tokenAddress);

    const [symbol, decimals] = await Promise.all([
      token.symbol(),
      token.decimals(),
    ]);
    const weiAmount = parseUnits(amount, decimals);

    if (vault) {
      logger.log(`withdrawing... ${weiAmount.toString()}`);
      const vaultContract = contracts.getVault(tokenAddress);
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

    logger.log('saving...');
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
    logger.log('saved');

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
