import { vi } from 'vitest';

import { decodeToken, genToken } from '../../api-lib/colinks/sharePost';

beforeEach(() => {
  process.env.HMAC_SECRET = 'test-key';
});

afterEach(() => {
  vi.clearAllMocks();
});

let profileId, postId, token;

describe('share tokens', () => {
  beforeEach(() => {
    profileId = '123';
    postId = '5461';
    token = genToken(profileId, postId);
  });

  test('generates and validates token', () => {
    expect(decodeToken(token)).toEqual({ profileId, postId });
  });

  test('throws error on invalid token', () => {
    expect(() => {
      decodeToken('bogus');
    }).toThrow(/Invalid token/);
  });

  test('fails to validate token with postId', () => {
    const badToken =
      'profileId=123&postId=1&token=0c91fd86dc511377d9b8584032bb7080f4575c2599b8e2b525e537de4225ba00';
    expect(() => {
      decodeToken(badToken);
    }).toThrow(/Invalid token/);
  });
});
