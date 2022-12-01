import { claimsUnwrappedAmount } from './distributions';

describe('claimsUnwrappedAmount', () => {
  test('Combined Distribution: 200 Gift + 100 Fixed claim', () => {
    const { fixedPayment, circleClaimed } = claimsUnwrappedAmount({
      address: '0x1',
      circleDistDecimals: 18,
      // the new_amount col includes fixed payment values as well
      circleDistClaimAmount: 300,
      circleDistPricePerShare: 1,
      circleFixedGifts: { '0x1': '100000000000000000000' },
    });
    expect(circleClaimed).toEqual(200);
    expect(fixedPayment).toEqual(100);
  });
  test('2 Distributions: 200 Gift + 50 Fixed claim', () => {
    const { fixedPayment, circleClaimed } = claimsUnwrappedAmount({
      address: '0x1',
      circleDistDecimals: 18,
      circleDistClaimAmount: 200,
      circleDistPricePerShare: 1,
      fixedGifts: { '0x1': '50000000000000000000' },
      fixedDistPricePerShare: 1,
      fixedDistDecimals: 18,
    });
    expect(circleClaimed).toEqual(200);
    expect(fixedPayment).toEqual(50);
  });
  test('2 Distributions: 200 Gift + 50 Fixed claim with different pricePerShare', () => {
    const { fixedPayment, circleClaimed } = claimsUnwrappedAmount({
      address: '0x1',
      circleDistDecimals: 18,
      circleDistClaimAmount: 200,
      circleDistPricePerShare: 1.2,
      fixedGifts: { '0x1': '50000000000000000000' },
      fixedDistPricePerShare: 2,
      fixedDistDecimals: 18,
    });
    expect(circleClaimed).toEqual(240);
    expect(fixedPayment).toEqual(100);
  });
});
