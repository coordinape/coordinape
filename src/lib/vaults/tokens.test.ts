import { FixedNumber } from '@ethersproject/bignumber';

import { getUnwrappedAmount } from './tokens';

test('getUnwrappedAmount with decimals', () => {
  const actual = getUnwrappedAmount(1500000, FixedNumber.from('1.5'), 6);
  expect(actual).toEqual(2.25);
});

test('getUnwrappedAmount without decimals', () => {
  const actual = getUnwrappedAmount(15, FixedNumber.from('1.5'));
  expect(actual).toEqual(22.5);
});
