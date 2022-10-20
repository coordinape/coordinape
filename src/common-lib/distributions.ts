import { FixedNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

export const getUserClaimedFixedPaymentAmt = ({
  decimals,
  fixedGifts,
  address,
}: {
  decimals: number;
  fixedGifts?: Record<string, string>;
  address?: string;
}) => {
  if (!address) return 0;
  return fixedGifts && address in fixedGifts
    ? Number(formatUnits(fixedGifts[address], decimals))
    : 0;
};
export const claimsUnwrappedAmount = ({
  address,
  fixedGifts,
  fixedDistDecimals = 18,
  fixedDistPricePerShare,
  circleDistDecimals = 18,
  circleDistClaimAmount = 0,
  circleDistPricePerShare,
}: {
  address?: string;
  fixedDistDecimals?: number;
  fixedDistClaimAmount?: number;
  fixedGifts?: Record<string, string>;
  fixedDistPricePerShare?: FixedNumber;
  circleDistDecimals?: number;
  circleDistClaimAmount?: number;
  circleDistPricePerShare?: FixedNumber;
}) => {
  let claimed = 0,
    fixedPayment = 0,
    circleClaimed = 0;
  if (!address) return { claimed, fixedPayment, circleClaimed };

  const calc = ({
    address,
    decimals,
    fixedGifts,
    pricePerShare,
  }: {
    address: string;
    decimals: number;
    fixedGifts?: Record<string, string>;
    pricePerShare?: FixedNumber;
  }) => {
    return {
      fixedPaymentAmt: getUserClaimedFixedPaymentAmt({
        decimals,
        fixedGifts,
        address,
      }),
      pricePerShare: pricePerShare?.toUnsafeFloat() || 1,
    };
  };
  if (circleDistClaimAmount) {
    const claimAmt = circleDistClaimAmount || 0;
    const { fixedPaymentAmt, pricePerShare } = calc({
      address,
      decimals: circleDistDecimals,
      pricePerShare: circleDistPricePerShare,
    });
    fixedPayment = fixedPaymentAmt * pricePerShare;
    claimed = claimAmt * pricePerShare;
    circleClaimed = (claimAmt - fixedPaymentAmt) * pricePerShare;
  }

  if (fixedDistDecimals) {
    const { fixedPaymentAmt, pricePerShare } = calc({
      address,
      decimals: fixedDistDecimals,
      fixedGifts,
      pricePerShare: fixedDistPricePerShare,
    });
    fixedPayment = fixedPaymentAmt * pricePerShare;
  }

  return {
    claimed,
    fixedPayment,
    circleClaimed,
  };
};
