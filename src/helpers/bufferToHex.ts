export const bufferToHex = function (buf: Buffer): string {
  return '0x' + buf.toString('hex');
};
