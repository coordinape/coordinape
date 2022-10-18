import { formatUnits } from 'ethers/lib/utils';

import { EpochDataResult } from '../../src/pages/DistributionsPage/queries';

export const getUserClaimedFixedPaymentAmt = (
  dist: EpochDataResult['distributions'][0],
  address?: string
) => {
  if (!address) return 0;
  return dist.distribution_json?.fixedGifts &&
    address in dist.distribution_json.fixedGifts
    ? Number(
        formatUnits(
          dist.distribution_json.fixedGifts[address],
          dist.vault.decimals
        )
      )
    : 0;
};
export const claimsUnwrappedAmount = (
  id?: number,
  fixedDist?: EpochDataResult['distributions'][0],
  circleDist?: EpochDataResult['distributions'][0]
) => {
  let claimed = 0,
    fixedPayment = 0,
    circleClaimed = 0;
  if (!id) return { claimed, fixedPayment, circleClaimed };

  const calc = (id: number, dist: EpochDataResult['distributions'][0]) => {
    const claim = dist.claims.find(c => c.profile?.id === id);
    return {
      claim,
      fixedPaymentAmt: getUserClaimedFixedPaymentAmt(dist, claim?.address),
      pricePerShare: dist.pricePerShare.toUnsafeFloat(),
    };
  };
  if (fixedDist) {
    const { fixedPaymentAmt, pricePerShare } = calc(id, fixedDist);
    fixedPayment = fixedPaymentAmt * pricePerShare;
  }
  if (circleDist) {
    const { claim, fixedPaymentAmt, pricePerShare } = calc(id, circleDist);
    fixedPayment = fixedPaymentAmt * pricePerShare;
    claimed = (claim?.new_amount || 0) * pricePerShare;
    circleClaimed =
      ((claim?.new_amount || 0) - fixedPaymentAmt) * pricePerShare;
  }

  return {
    claimed,
    fixedPayment,
    circleClaimed,
  };
};
