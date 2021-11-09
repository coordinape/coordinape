import { input, output } from './fixtures.json';
import { parseBalanceMap } from './parse-balance-map';

test('parse-balance-map with simple input', () => {
  const merkleInfo = parseBalanceMap(input);
  expect(merkleInfo.merkleRoot).toBe(output.merkleRoot);
});
