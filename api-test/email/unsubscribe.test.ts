beforeEach(() => {
  process.env.HMAC_SECRET = 'test-key';
});

afterEach(() => {
  jest.clearAllMocks();
});

import { genToken, decodeToken } from '../../api-lib/email/unsubscribe';

let profileId, email, token;

describe('unsubscribe tokens', () => {
  beforeEach(() => {
    profileId = '123';
    email = 'jugo@naranja.es';
    token = genToken(profileId, email);
  });

  it('generates and validates token', () => {
    expect(decodeToken(token)).toEqual({ profileId, email });
  });

  it('throws error on invalid token', () => {
    expect(() => {
      decodeToken('bogus');
    }).toThrow(/Invalid unsubscribe token/);
  });

  it('fails to validate token with wrong email', () => {
    const badToken =
      'profileId=123&email=jugo%40naranja.es&token=8481b9d81d5766b98e1beaa791ea9625f4c541cf10d6bc7413f2cb238e599994';

    expect(() => {
      decodeToken(badToken);
    }).toThrow(/Invalid unsubscribe token/);
  });
});
