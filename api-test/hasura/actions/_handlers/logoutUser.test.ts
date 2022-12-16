import { DateTime } from 'luxon';

import {
  hashTokenString,
  generateTokenString,
} from '../../../../api-lib/authHelpers';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { createProfile, mockUserClient } from '../../../helpers';
import { getUniqueAddress } from '../../../helpers/getUniqueAddress';

let address, profile;

beforeEach(async () => {
  address = await getUniqueAddress();
  profile = await createProfile(adminClient, { address });
  const tokenString = generateTokenString();
  const now = DateTime.now().toISO();
  await adminClient.mutate({
    insert_personal_access_tokens_one: [
      {
        object: {
          name: 'circle-access-token',
          abilities: '["read"]',
          tokenable_type: 'App\\Models\\Profile',
          tokenable_id: profile.id,
          token: hashTokenString(tokenString),
          updated_at: now,
          created_at: now,
          last_used_at: now,
        },
      },
      { id: true },
    ],
  });
});

describe('Logout User handler', () => {
  test('Test normal logout flow', async () => {
    const client = mockUserClient({ profileId: profile.id, address });
    const { logoutUser: result } = await client.mutate({
      logoutUser: { id: true },
    });
    expect(result).toEqual({ id: profile.id });
    const { personal_access_tokens: tokenResults } = await adminClient.query({
      personal_access_tokens: [
        {
          where: {
            tokenable_id: { _eq: profile.id },
            tokenable_type: { _eq: 'App\\Models\\Profile' },
          },
        },
        {
          id: true,
        },
      ],
    });
    expect(tokenResults.length).toEqual(0);
  });
});
