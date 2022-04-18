import assert from 'assert';

import { BigNumber } from '@ethersproject/bignumber';
import maxBy from 'lodash/maxBy';

import { assertDef } from 'utils/tools';

import { MerkleDistributorInfo, parseBalanceMap } from './parse-balance-map';

/**
 *
 * @param gifts the map of GIVE allocations: address => total GIVE received
 * @param totalAmount the total amount of tokens to distribute, as a fixed-point number
 * @param previousDistribution the previous epoch's distribution info
 *
 * the map of GIVE allocations is in GIVE tokens, but that has to be converted
 * into a quantity of tokens. e.g. if there was a total of 500 GIVE allocated,
 * but the token amount to be distributed is 2000 USDC, then all the GIVE amounts
 * need to be multiplied by 4.
 *
 * the totalAmount must have the correct number of digits for the token, i.e.
 * 123 USDC should be BigNumber(123000000).
 */
export const createDistribution = (
  gifts: Record<string, number>,
  totalAmount: BigNumber,
  previousDistribution?: Partial<MerkleDistributorInfo>
): MerkleDistributorInfo => {
  const totalGive = Object.values(gifts).reduce((t, v) => t + v);
  let balances = Object.keys(gifts).map(address => ({
    address,
    earnings: totalAmount.mul(gifts[address]).div(totalGive),
  }));

  // handle dust amount by giving it to the highest earner
  const dust = getDust(totalAmount, balances);
  assert(dust.lt(20), `dust too high: ${dust.toString()}`);
  const topGift = assertDef(maxBy(Object.entries(gifts), x => x[1]));
  const topBalance = assertDef(balances.find(x => x.address === topGift[0]));
  topBalance.earnings = topBalance.earnings.add(dust);
  assert(getDust(totalAmount, balances).eq(0), `dust is still not 0`);

  // add values from previous epoch
  if (previousDistribution) {
    assert(previousDistribution.claims, 'No claims found');
    const claims = Object.entries(previousDistribution.claims);
    const addedClaims = [];
    for (const [addr, { amount }] of claims) {
      const balance = balances.find(({ address }) => address === addr);
      if (balance) {
        balance.earnings = balance.earnings.add(amount);
      } else {
        addedClaims.push({ address: addr, earnings: BigNumber.from(amount) });
      }
    }
    if (addedClaims.length > 0) balances = [...balances, ...addedClaims];
  }

  return parseBalanceMap(balances);
};

type Balance = { address: string; earnings: BigNumber };

const getDust = (total: BigNumber, balances: Balance[]) =>
  total.sub(balances.map(b => b.earnings).reduce((t, b) => b.add(t)));
