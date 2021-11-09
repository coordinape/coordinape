import { parseBalanceMap } from '../parse-balance-map';

import input from './input.json';
import output from './output.json';

test('Test multipliedState', () => {
  const merkleInfo = parseBalanceMap(input);
  expect(merkleInfo.merkleRoot).toBe(output.merkleRoot);
});
