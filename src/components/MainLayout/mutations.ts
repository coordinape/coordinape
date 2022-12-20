import { client } from 'lib/gql/client';

export const updateProfileNameMutation = async (name: string) =>
  await client.mutate(
    {
      updateProfileName: [{ payload: { name: name } }, { id: true }],
    },
    { operationName: 'updateProfileNameMutation' }
  );
