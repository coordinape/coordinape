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
  if (!x) {
    if (precision > 0) {
      return '0.'.padEnd(precision + 2, '0');
    } else return '0';
  }
  const split = x.toString().split('.');
  const [beforeDot, afterDot] = [split[0], split[1] || ''];
  const before = beforeDot.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const after =
    precision > 0
      ? '.' +
        (afterDot.length > precision
          ? String(
              round(Number.parseInt(afterDot), -(afterDot.length - precision))
            ).padStart(afterDot.length, '0')
          : afterDot
        )
          .substring(0, precision)
          .padEnd(precision, '0')
      : '';
  return before + after;
};
