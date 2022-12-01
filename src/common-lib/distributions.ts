import { formatUnits } from 'ethers/lib/utils';

const getUserClaimedFixedPaymentAmt = ({
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
  fixedDistPricePerShare = 1,
  circleDistDecimals = 18,
  circleDistClaimAmount = 0,
  circleDistPricePerShare = 1,
  circleFixedGifts,
}: {
  address?: string;
  fixedDistDecimals?: number;
  fixedDistClaimAmount?: number;
  fixedGifts?: Record<string, string>;
  fixedDistPricePerShare?: number;
  circleDistDecimals?: number;
  circleDistClaimAmount?: number;
  circleDistPricePerShare?: number;
  circleFixedGifts?: Record<string, string>;
}) => {
  let fixedPayment = 0,
    circleClaimed = 0;
  if (!address) return { fixedPayment, circleClaimed };

  if (circleDistClaimAmount) {
    const claimAmt = circleDistClaimAmount || 0;
    const fixedPaymentAmt = getUserClaimedFixedPaymentAmt({
      address,
      decimals: circleDistDecimals,
      fixedGifts: circleFixedGifts,
    });
    fixedPayment = fixedPaymentAmt * fixedDistPricePerShare;
    circleClaimed = (claimAmt - fixedPaymentAmt) * circleDistPricePerShare;
  }

  if (fixedGifts) {
    const fixedPaymentAmt = getUserClaimedFixedPaymentAmt({
      address,
      decimals: fixedDistDecimals,
      fixedGifts,
    });
    fixedPayment = fixedPaymentAmt * fixedDistPricePerShare;
  }

  return { fixedPayment, circleClaimed };
};
