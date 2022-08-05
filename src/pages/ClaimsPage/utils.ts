import groupBy from 'lodash/groupBy';
import partition from 'lodash/partition';
import sortBy from 'lodash/sortBy';

import { QueryClaim } from './queries';

// Takes a group of claims, and generates a Epoch Date representation showing
// the date range and number of epochs in group.
export function formatEpochDates(claims: QueryClaim[]) {
  claims = sortBy(claims, c =>
    new Date(c.distribution.epoch.start_date).getTime()
  );

  const startDate = new Date(claims[0].distribution.epoch.start_date);
  const endDate = new Date(
    claims[claims.length - 1].distribution.epoch.end_date
  );
  const epochsPlural = claims.length > 1 ? 'Epochs:' : 'Epoch:';

  const monthName = (_date: Date) =>
    _date.toLocaleString('default', { month: 'long' });

  return `${claims.length} ${epochsPlural} ${monthName(
    startDate
  )} ${startDate.getDate()} - ${monthName(
    endDate
  )} ${endDate.getDate()} ${endDate.getFullYear()}`;
}

// Takes a group of claims and reduces to a summed value for that group for
// display
export function formatClaimAmount(claims: QueryClaim[]): string {
  const totalAmount = claims.reduce((accumulator, curr) => {
    return accumulator + (curr.unwrappedNewAmount || 0);
  }, 0);
  return `${parseFloat(totalAmount.toString()).toFixed(2)} ${
    claims[0].distribution.vault.symbol
  }`;
}

const claimsRowKey = ({ distribution: { vault, epoch }, txHash }: QueryClaim) =>
  `${vault.vault_address}-${epoch.circle?.id}-${txHash || ''}`;

// reduceClaims: reduce all claims into one row per group of {vault, circle,
// txHash}, for representing a group of claims into one row per set
// of batch claimable claims. If you can claim them all together, display
// them all together. If they were claimed in same tx, display them as one row
// with link to the claim on etherscan)
//
// note that the "representative claim" for its set is determined by the order
// of the input, so the input must be sorted if you want sorted output.
const reduceClaims = (claims: QueryClaim[]) =>
  claims.reduce(
    (finalClaims, curr) =>
      finalClaims.filter(
        c =>
          c.distribution.vault.vault_address ===
            curr.distribution.vault.vault_address &&
          c.distribution.epoch.circle?.id ===
            curr.distribution.epoch.circle?.id &&
          c.txHash === curr.txHash
      ).length > 0
        ? finalClaims
        : [...finalClaims, curr],
    [] as QueryClaim[]
  );

export const createClaimsRows = (claims: QueryClaim[]) => {
  const groups = groupBy(claims, claimsRowKey);

  return partition(claims, 'txHash').map(subset =>
    reduceClaims(subset).map(claim => ({
      claim,
      group: groups[claimsRowKey(claim)],
    }))
  );
};
