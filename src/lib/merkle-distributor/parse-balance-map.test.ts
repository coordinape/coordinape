import { input, output } from './fixtures.json';
import { parseBalanceMap } from './parse-balance-map';

test('Test multipliedState', () => {
  const merkleInfo = parseBalanceMap(input);
  expect(merkleInfo.merkleRoot).toBe(output.merkleRoot);
});
