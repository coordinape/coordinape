import { setMockHeaders } from '../../lib/gql/client';

export const setupMockClientForProfile = (profile: {
  id: number;
  address: string;
}) => {
  setMockHeaders({
    'x-hasura-role': 'user',
    'x-hasura-user-id': profile.id.toString(),
    'x-hasura-address': profile.address,
  });
};
