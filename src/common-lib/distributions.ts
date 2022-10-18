import { FixedNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

interface Distribution {
  created_at: string;
  total_amount: string;
  tx_hash?: string;
  distribution_type: number;
  distribution_json: any;
  gift_amount: number;
  fixed_amount: number;
  vault: {
    id: number;
    decimals: number;
    symbol: string;
    vault_address: string;
    simple_token_address: string;
    chain_id: number;
  };
  pricePerShare: FixedNumber;
  epoch: {
    number?: number;
    circle?: {
      id: any;
      name: string;
    };
  };
  claims: Claim[];
}

interface Claim {
  id: number;
  new_amount: number;
  address: string;
  profile_id: number;
  profile?: {
    avatar?: string;
  };
}
export const getUserClaimedFixedPaymentAmt = (
  decimals: number,
  fixedGifts?: Record<string, string>,
  address?: string
) => {
  if (!address) return 0;
  return fixedGifts && address in fixedGifts
    ? Number(formatUnits(fixedGifts[address], decimals))
    : 0;
};
export const claimsUnwrappedAmount = (
  id?: number,
  fixedDist?: Distribution,
  circleDist?: Distribution
) => {
  let claimed = 0,
    fixedPayment = 0,
    circleClaimed = 0;
  if (!id) return { claimed, fixedPayment, circleClaimed };

  const calc = (id: number, dist: Distribution) => {
    const claim = dist.claims.find(
      (c: typeof dist.claims[0]) => c.profile_id === id
    );
    return {
      claim,
      fixedPaymentAmt: getUserClaimedFixedPaymentAmt(
        dist.vault.decimals,
        dist.distribution_json.fixedGifts,
        claim?.address
      ),
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
