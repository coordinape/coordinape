import type { QueryClaim } from './queries';
import { createClaimsRows } from './utils';

test('handle empty list', () => {
  expect(createClaimsRows([])).toEqual([[], []]);
});

test('create claims rows', () => {
  const claims = [
    // group of 2 (with 5th claim)
    {
      txHash: '0x1',
      distribution: {
        vault: { vault_address: '0xv1' },
        epoch: { circle: { id: 1 } },
      },
    },
    // group of 2 (with 4th claim), different circle, unclaimed
    {
      distribution: {
        vault: { vault_address: '0xv1' },
        epoch: { circle: { id: 2 } },
      },
    },
    // group of 1, same vault & circle as 1st group, but unclaimed
    {
      distribution: {
        vault: { vault_address: '0xv1' },
        epoch: { circle: { id: 1 } },
      },
    },
    // see above
    {
      distribution: {
        vault: { vault_address: '0xv1' },
        epoch: { circle: { id: 2 } },
      },
    },
    // see above
    {
      txHash: '0x1',
      distribution: {
        vault: { vault_address: '0xv1' },
        epoch: { circle: { id: 1 } },
      },
    },
    // group of 1, same vault & circle as 1st group, but different hash
    {
      txHash: '0x2',
      distribution: {
        vault: { vault_address: '0xv1' },
        epoch: { circle: { id: 1 } },
      },
    },
  ] as QueryClaim[];

  const output = createClaimsRows(claims);
  expect(output).toEqual([
    [
      { claim: claims[0], group: [claims[0], claims[4]] },
      { claim: claims[5], group: [claims[5]] },
    ],
    [
      { claim: claims[1], group: [claims[1], claims[3]] },
      { claim: claims[2], group: [claims[2]] },
    ],
  ]);
});
