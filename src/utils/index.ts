import assert from 'assert';

import { round } from 'lodash';

export const assertDef = <T>(
  val: T | undefined | null,
  message?: string
): T => {
  assert(val, message);
  return val;
};

export const shortenAddress = (address: string, backAddress = true) => {
  const front = address.substring(0, 6);
  if (!backAddress) return front;

  return `${front}...${address.substring(address.length - 4)}`;
};

export const smartRounding = (x: number | string | undefined) => {
  const ceiling = 10;
  if (!x || Number(x) > ceiling) return numberWithCommas(x, 2);

  return numberWithCommas(x, 4);
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
  const rounded = +(
    round(Number(Number(x) + 'e+' + precision)) +
    'e-' +
    precision
  );
  const split = rounded.toString().split('.');
  const [beforeDot, afterDot] = [split[0], split[1] || ''];
  const before = beforeDot.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return precision > 0
    ? before + '.' + afterDot.padEnd(precision, '0')
    : before;
};
