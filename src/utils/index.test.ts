import { numberWithCommas } from './';

describe('numberWithCommas', () => {
  test('commas are properly set', () => {
    expect(numberWithCommas('12345678.901222221')).toEqual('12,345,678.901222');
    expect(numberWithCommas('12345678.9012345678')).toEqual(
      '12,345,678.901235'
    );
    expect(numberWithCommas('12345678.901222221', 4)).toEqual(
      '12,345,678.9012'
    );
    expect(numberWithCommas('12345678.901292221', 4)).toEqual(
      '12,345,678.9013'
    );
  });
  test('with precision undefined', () => {
    expect(numberWithCommas(6)).toEqual('6.000000');
    expect(numberWithCommas('6')).toEqual('6.000000');
    expect(numberWithCommas(6.223435987)).toEqual('6.223436');
  });
  test('with precision 2', () => {
    expect(numberWithCommas(6, 2)).toEqual('6.00');
    expect(numberWithCommas('6', 2)).toEqual('6.00');
    expect(numberWithCommas(6.223435987, 2)).toEqual('6.22');
    expect(numberWithCommas(6.023435987, 2)).toEqual('6.02');
    expect(numberWithCommas(6.025435987, 2)).toEqual('6.03');
    expect(numberWithCommas(6.00825435987, 2)).toEqual('6.01');
    expect(numberWithCommas(6.00325435987, 2)).toEqual('6.00');
  });
  test('with precision 0', () => {
    expect(numberWithCommas(undefined, 0)).toEqual('0');
    expect(numberWithCommas(6, 0)).toEqual('6');
    expect(numberWithCommas('6', 0)).toEqual('6');
    expect(numberWithCommas(6.223435987, 0)).toEqual('6');
  });
  test('rounds last digit', () => {
    expect(numberWithCommas(2.119, 2)).toEqual('2.12');
  });
  test('with undefined input', () => {
    expect(numberWithCommas(undefined)).toEqual('0.000000');
    expect(numberWithCommas(undefined, 2)).toEqual('0.00');
  });
});
