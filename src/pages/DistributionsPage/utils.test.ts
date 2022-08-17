import { numberWithCommas } from 'utils';

describe('numberWithCommas', () => {
  describe('with precision undefined', () => {
    test('with input 6, returns 6', () => {
      expect(numberWithCommas(6)).toEqual('6.000000');
    });
    test("with input '6'", () => {
      expect(numberWithCommas('6')).toEqual('6.000000');
    });
    test("with input '6.223435987', returns default precision 6", () => {
      expect(numberWithCommas(6.223435987)).toEqual('6.223436');
    });
  });
  describe('with precision 2', () => {
    test('with input 6', () => {
      expect(numberWithCommas(6, 2)).toEqual('6.00');
    });
    test("with input '6'", () => {
      expect(numberWithCommas('6', 2)).toEqual('6.00');
    });
    test("with input '6.223435987'", () => {
      expect(numberWithCommas(6.223435987, 2)).toEqual('6.22');
    });
  });
  describe('with precision 0', () => {
    test('with input defined', () => {
      expect(numberWithCommas(undefined, 0)).toEqual('0');
    });
    test('with input 6', () => {
      expect(numberWithCommas(6, 0)).toEqual('6');
    });
    test("with input '6'", () => {
      expect(numberWithCommas('6', 0)).toEqual('6');
    });
    test("with input '6.223435987'", () => {
      expect(numberWithCommas(6.223435987, 0)).toEqual('6');
    });
  });
  test('rounds last digit', () => {
    expect(numberWithCommas(2.119, 2)).toEqual('2.12');
  });
  test('with undefined input', () => {
    expect(numberWithCommas(undefined, 2)).toEqual('0.00');
  });
  test('with undefined input', () => {
    expect(numberWithCommas(undefined)).toEqual('0.000000');
  });
});
