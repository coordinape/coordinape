import assert from 'assert';

import { BigNumber, FixedNumber } from 'ethers';
import { hasSimpleToken } from 'lib/vaults';
import round from 'lodash/round';
import { useQuery } from 'react-query';

import { useContracts } from 'hooks';

import type { QueryEpoch } from './HistoryPage';

export const useDistroAmount = (distro: QueryEpoch['distributions'][0]) => {
  const contracts = useContracts();

  const {
    total_amount,
    vault: { symbol, decimals, vault_address },
  } = distro || { vault: { decimals: 18 } };

  const shifter = FixedNumber.from(BigNumber.from(10).pow(decimals));

  // note that this is being cached by symbol
  const pricePerShareQuery = useQuery(
    ['pricePerShare', symbol],
    async () => {
      if (hasSimpleToken({ symbol })) return FixedNumber.from(1);

      assert(contracts);
      const yToken = await contracts.getYVault(vault_address);
      return FixedNumber.from(await yToken.pricePerShare()).divUnsafe(shifter);
    },
    { enabled: !!(distro && contracts) }
  );

  const { isLoading, isIdle, data: pricePerShare } = pricePerShareQuery;
  if (isLoading || isIdle || !pricePerShare) return;

  const amount = FixedNumber.from(String(total_amount))
    .divUnsafe(shifter)
    .mulUnsafe(pricePerShare);

  return { amount: round(amount.toUnsafeFloat(), 2), symbol };
};
