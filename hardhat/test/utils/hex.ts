export const paddedHex = (
  n: number,
  length: number = 8,
  prefix: boolean = false
): string => {
  const _hex = n.toString(16); // convert number to hexadecimal
  const hexLen = _hex.length;
  const extra = '0'.repeat(length - hexLen);
  let pre = '0x';
  if (!prefix) {
    pre = '';
  }
  if (hexLen === length) {
    return pre + _hex;
  } else if (hexLen < length) {
    return pre + extra + _hex;
  } else {
    return '?'.repeat(length); //it's hardf for pgive to need more than four bytes
  }
};
