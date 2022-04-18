import { utils } from 'ethers';

import { encodeCircleId, decodeCircleId } from './circleId';

test('encode & decode circle id', () => {
  const encoded = encodeCircleId(777);
  const expected =
    '0x636972636c652d312d3737370000000000000000000000000000000000000000';
  expect(encoded).toEqual(expected);
  expect(decodeCircleId(encoded)).toEqual(777);
  expect(encodeCircleId(decodeCircleId(encoded))).toEqual(encoded);
});

test('throw if prefix not found', () => {
  expect(() => {
    decodeCircleId(utils.formatBytes32String('whatever'));
  }).toThrowError('Could not decode circle ID');
});
