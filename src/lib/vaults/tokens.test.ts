import { BigNumber, FixedNumber } from '@ethersproject/bignumber';

import { getUnwrappedAmount } from './tokens';

describe('getUnwrappedAmount', () => {
  test('with decimals', () => {
    const actual = getUnwrappedAmount(1500000, FixedNumber.from('1.5'), 6);
    expect(actual).toEqual(2.25);
  });

  test('without decimals', () => {
    const actual = getUnwrappedAmount(15, FixedNumber.from('1.5'));
    expect(actual).toEqual(22.5);
  });

  test('with string amount', () => {
    const actual = getUnwrappedAmount('1500000', FixedNumber.from('1.5'), 6);
    expect(actual).toEqual(2.25);
  });

  test('with BigNumber amount', () => {
    const actual = getUnwrappedAmount(
      BigNumber.from('1500000'),
      FixedNumber.from('1.5'),
      6
    );
    expect(actual).toEqual(2.25);
  });

  test('handle underflow', () => {
    const amount = 383.5139154618724;
    expect(() => {
      getUnwrappedAmount(amount, FixedNumber.from('1.013406513638326563'));
    }).not.toThrow();
  });
});
