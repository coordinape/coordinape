import { formatBytes } from './presentationHelpers';

describe('formatBytes', () => {
  test('it displays a pretty short size correctly', () => {
    expect(formatBytes(1024 ** 1)).toEqual('1 KB');
    expect(formatBytes(1024 ** 2)).toEqual('1 MB');
    expect(formatBytes(1024 ** 3)).toEqual('1 GB');
    expect(formatBytes(1024 ** 1 + 100)).toEqual('1.1 KB');
    expect(formatBytes(1024 ** 2 + 90000)).toEqual('1.09 MB');
  });
});
