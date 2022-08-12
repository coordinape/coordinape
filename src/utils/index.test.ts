import { numberWithCommas } from './';

test('numberWithCommas', () => {
  expect(numberWithCommas('12345678.90123456')).toEqual('12,345,678.90123456');
});
