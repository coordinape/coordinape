import { vi } from 'vitest';

import { decodeToken, genToken } from '../../api-lib/email/unsubscribe';

beforeEach(() => {
  process.env.HMAC_SECRET = 'test-key';
});

afterEach(() => {
  vi.clearAllMocks();
});

let profileId, email, emailType, token;

describe('unsubscribe tokens', () => {
  beforeEach(() => {
    profileId = '123';
    email = 'jugo@naranja.es';
    emailType = 'product';
    token = genToken(profileId, email, emailType);
  });

  // this is disabled because timeSafeCompare is not available in the browser
  test('generates and validates token', () => {
    expect(decodeToken(token)).toEqual({ profileId, email, emailType });
  });

  test('throws error on invalid token', () => {
    expect(() => {
      decodeToken('bogus');
    }).toThrow(/Invalid unsubscribe token/);
  });

  test('fails to validate token with wrong email', () => {
    const badToken =
      'profileId=123&email=jugo%40naranja.es&token=8481b9d81d5766b98e1beaa791ea9625f4c541cf10d6bc7413f2cb238e599994';

    expect(() => {
      decodeToken(badToken);
    }).toThrow(/Invalid unsubscribe token/);
  });
});
