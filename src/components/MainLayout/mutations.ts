import { client } from 'lib/gql/client';

export const updateProfileNameMutation = async (name: string) =>
  await client.mutate(
    {
      updateProfile: [{ payload: { name: name } }, { id: true }],
    },
    { operationName: 'updateProfileNameMutation' }
  );
