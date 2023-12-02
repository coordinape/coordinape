import { formatEther, parseEther } from 'ethers/lib/utils';

export const getPriceWithFees = (supply: number) => {
  const amount = 1;
  const eth = parseEther('1.0');
  const sum1 =
    supply == 0 ? 0 : ((supply - 1) * supply * (2 * (supply - 1) + 1)) / 6;
  const sum2 =
    supply == 0 && amount == 1
      ? 0
      : ((supply - 1 + amount) *
          (supply + amount) *
          (2 * (supply - 1 + amount) + 1)) /
        6;
  const summation = sum2 - sum1;
  const price = eth.mul(summation).div(16000).mul(110).div(100);
  return formatEther(price);
};
