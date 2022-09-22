import { getDisplayTokenString } from 'lib/vaults';
import groupBy from 'lodash/groupBy';
import partition from 'lodash/partition';
import sortBy from 'lodash/sortBy';

import { smartRounding } from 'utils';

import { QueryClaim } from './queries';

/**
 * Generates a text representation showing the date range and number of
 * distributions in the claims group.
 * @param claims - a group of claims that can be claimed togoether in one tx.
 */
export function formatDistributionDates(claims: QueryClaim[]) {
  claims = sortBy(claims, c =>
    new Date(c.distribution.epoch.start_date).getTime()
  );

  const startDate = new Date(claims[0].distribution.epoch.start_date);
  const endDate = new Date(
    claims[claims.length - 1].distribution.epoch.end_date
  );
  const epochsPlural = claims.length > 1 ? 'Distributions:' : 'Distribution:';

  const monthName = (_date: Date) =>
    _date.toLocaleString('default', { month: 'long' });

  return `${claims.length} ${epochsPlural} ${monthName(
    startDate
  )} ${startDate.getDate()} - ${monthName(
    endDate
  )} ${endDate.getDate()} ${endDate.getFullYear()}`;
}

/**
 * Generates a text representation showing the date range and number of
 * distributions in the claims group. This function only relies on the
 * Distribution's creation date in the database since deleted users
 * don't have access to epoch data
 * @param claims - a group of claims that can be claimed togoether in one tx.
 */
export function formatDeletedDistributionDates(claims: QueryClaim[]) {
  claims = sortBy(claims, c => new Date(c.distribution.created_at).getTime());

  const startDate = new Date(claims[0].distribution.created_at);
  const endDate = new Date(claims[claims.length - 1].distribution.created_at);
  const epochsPlural = claims.length > 1 ? 'Distributions:' : 'Distribution:';

  const monthName = (_date: Date) =>
    _date.toLocaleString('default', { month: 'long' });

  return `${claims.length} ${epochsPlural} ${monthName(
    startDate
  )} ${startDate.getDate()} - ${monthName(
    endDate
  )} ${endDate.getDate()} ${endDate.getFullYear()}`;
}

/**
 * Takes a group of claims and reduces to a summed value for that group for
 * display
 * @param claims - a group of claims.
 */
export function formatClaimAmount(claims: QueryClaim[]): string {
  const totalAmount = claims.reduce((accumulator, curr) => {
    return accumulator + (curr.unwrappedNewAmount || 0);
  }, 0);
  return `${smartRounding(totalAmount)} ${getDisplayTokenString(
    claims[0].distribution.vault
  )}`;
}

const claimsRowKey = ({
  distribution: { vault, distribution_json },
  txHash,
}: QueryClaim) =>
  `${vault.vault_address}-${distribution_json.circleId}-${txHash || ''}`;

/**
 * reduceClaims: reduce all claims into one row per group of {vault, circle,
 * txHash}, for representing a group of claims into one row per set
 * of batch claimable claims. If you can claim them all together, display
 * them all together. If they were claimed in same tx, display them as one row
 * with link to the claim on etherscan)
 *
 * note that the "representative claim" for its set is determined by the order
 * of the input, so the input must be sorted if you want sorted output.
 * @param claims - a array of claims.
 */
const reduceClaims = (claims: QueryClaim[]) =>
  claims.reduce(
    (finalClaims, curr) =>
      finalClaims.filter(
        c =>
          c.distribution.vault.vault_address ===
            curr.distribution.vault.vault_address &&
          c.distribution.distribution_json.circleId ===
            curr.distribution.distribution_json.circleId &&
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
