import { round } from 'lodash';
export const shortenAddress = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};

/**
 * Also rounds to the nearest `precision` value, defaulting to 6
 */
export const numberWithCommas = (
  x: number | string | undefined,
  precision = 6
) => {
  if (!x) return '0';
  const [beforeDot, afterDot] = x.toString().split('.');
  return (
    beforeDot.replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
    (afterDot && precision > 0
      ? (
          '.' +
          (afterDot.length > precision
            ? round(Number.parseInt(afterDot), -(afterDot.length - precision))
            : afterDot)
        )
          .substring(0, precision + 1)
          .padEnd(precision + 1, '0')
      : '')
  );
};
