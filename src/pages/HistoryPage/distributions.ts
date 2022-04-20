import { BigNumber, FixedNumber } from 'ethers';
import round from 'lodash/round';
import { useQuery } from 'react-query';

import { useContracts } from 'hooks';

import type { QueryEpoch } from './HistoryPage';

export const useDistAmount = (dist: QueryEpoch['distributions'][0]) => {
  const contracts = useContracts();

  const {
    total_amount,
    vault: { symbol, decimals, vault_address },
  } = dist || { vault: { decimals: 18 } };

  // caching this by symbol so that it is fetched only once per token when
  // rendering a list of epochs with distributions
  const pricePerShareQuery = useQuery(
    ['pricePerShare', symbol],
    async () => contracts?.getPricePerShare(vault_address, symbol, decimals),
    { enabled: !!(dist && contracts) }
  );

  // return undefined if isIdle || isLoading
  if (!pricePerShareQuery.data) return;

  const amount = FixedNumber.from(String(total_amount))
    .mulUnsafe(pricePerShareQuery.data)
    .divUnsafe(FixedNumber.from(BigNumber.from(10).pow(decimals)));

  return { amount: round(amount.toUnsafeFloat(), 2), symbol };
};
