import { vi } from 'vitest';

import { decodeToken, genToken } from '../../api-lib/colinks/share';
import { webAppURL } from '../../src/config/webAppURL';

beforeEach(() => {
  process.env.HMAC_SECRET = 'test-key';
});

afterEach(() => {
  vi.clearAllMocks();
});

let profileId, activityId, token, urlparams;

describe('share tokens', () => {
  beforeEach(() => {
    profileId = '123';
    activityId = '5461';
    urlparams = genToken(profileId, activityId);
    token = new URL(
      `/something?${urlparams}`,
      webAppURL('colinks')
    ).searchParams.get('s');
  });

  test('generates and validates token', () => {
    expect(decodeToken(token, profileId, activityId)).toEqual({
      profileId,
      activityId,
    });
  });

  test('throws error on invalid token', () => {
    expect(() => {
      decodeToken('bogus', profileId, activityId);
    }).toThrow(/Invalid token/);
  });

  test('fails to validate token with activityId', () => {
    const badToken =
      'profileId=123&activityId=1&token=0c91fd86dc511377d9b8584032bb7080f4575c2599b8e2b525e537de4225ba00';
    expect(() => {
      decodeToken(badToken, profileId, activityId);
    }).toThrow(/Invalid token/);
  });
});
