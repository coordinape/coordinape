import { formatEther, parseEther } from 'ethers/lib/utils';

const MAX_BASE_FEE = parseEther('0.000420');
export const getPriceWithFees = (
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

  if (buyOrSell === 'sell') {
    const withFees = formatEther(
      priceWithoutFees
        .mul(90)
        .div(100)
        .sub(supply == 0 ? 0 : baseFee)
    );
    return withFees;
  } else {
    return formatEther(
      priceWithoutFees
        .mul(110)
        .div(100)
        .add(supply == 0 ? 0 : baseFee)
    );
  }
};
