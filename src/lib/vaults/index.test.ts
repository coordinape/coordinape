import { encodeCircleId, decodeCircleId } from './index';

// this is pretty trivial now but will become more complex when we add version
// prefixes, etc.
test('encoding & decoding circle ids', () => {
  const encoded = encodeCircleId(777);
  const expected =
    '0x3737370000000000000000000000000000000000000000000000000000000000';
  expect(encoded).toEqual(expected);
  expect(decodeCircleId(encoded)).toEqual(777);
  expect(encodeCircleId(decodeCircleId(encoded))).toEqual(encoded);
});
