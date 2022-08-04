import { QueryClaim } from './queries';

// Takes a group of claims, and generates a Epoch Date representation showing
// the date range and number of epochs in group.
export function formatEpochDates(claims: QueryClaim[]) {
  claims = claims.sort(
    (a, b) =>
      +new Date(a.distribution.epoch.start_date).valueOf() -
      +new Date(b.distribution.epoch.start_date).valueOf()
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

export function claimsRowKey(
  distribution: QueryClaim['distribution'],
  txHash?: QueryClaim['txHash']
): string {
  let key = `${distribution.vault.vault_address}-${distribution.epoch.circle?.id}-`;
  if (txHash) {
    key += `${txHash}`;
  }
  return key;
}
