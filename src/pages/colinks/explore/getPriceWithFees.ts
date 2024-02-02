import { BigNumber } from '@ethersproject/bignumber';
import { formatEther, parseEther } from 'ethers/lib/utils';

export const MAX_BASE_FEE_STRING = '0.000420';
const MAX_BASE_FEE = parseEther(MAX_BASE_FEE_STRING);

export const getPricing = (
  supply: number,
  buyOrSell: 'buy' | 'sell' = 'buy'
) => {
  const amount = 1;
  const eth = parseEther('1.0');

  const sum1 =
    supply == 0
      ? 0
      : ((supply - 1) * supply * (2 * (supply - 1) + 1) * 100) / 24;
  const sum2 =
    supply == 0 && amount == 1
      ? 0
      : ((supply - 1 + amount) *
          (supply + amount) *
          (2 * (supply - 1 + amount) + 1) *
          100) /
        24;
  const summation = sum2 - sum1;
  const priceWithoutFees = eth.mul(summation).div(16000 * 100);

  let baseFee = buyOrSell === 'buy' ? MAX_BASE_FEE : priceWithoutFees.div(10);
  if (baseFee.gt(MAX_BASE_FEE)) {
    baseFee = MAX_BASE_FEE;
  }

  let priceWithFees: BigNumber;
  if (buyOrSell === 'sell') {
    priceWithFees = priceWithoutFees
      .mul(90)
      .div(100)
      .sub(supply == 0 ? 0 : baseFee);
  } else {
    priceWithFees = priceWithoutFees
      .mul(110)
      .div(100)
      .add(supply == 0 ? 0 : baseFee);
  }
  return {
    priceWithoutFees,
    baseFee,
    priceWithFees,
    fees: priceWithFees.sub(priceWithoutFees),
  };
};

export const getPriceWithFees = (
  supply: number,
  buyOrSell: 'buy' | 'sell' = 'buy'
) => {
  const { priceWithFees } = getPricing(supply, buyOrSell);

  return formatEther(priceWithFees);
};
