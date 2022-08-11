import { numberWithCommas } from './';

test('numberWithCommas', () => {
  expect(numberWithCommas('12345678.901222221')).toEqual('12,345,678.901222');
  expect(numberWithCommas('12345678.9012345678')).toEqual('12,345,678.901235');
  expect(numberWithCommas('12345678.901222221', 4)).toEqual('12,345,678.9012');
  expect(numberWithCommas('12345678.901292221', 4)).toEqual('12,345,678.9013');
});
