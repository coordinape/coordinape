import { client } from 'lib/gql/client';

export const endEpochMutation = async ({
  id,
  circle_id,
}: {
  id: number;
  circle_id: number;
}) =>
  await client.mutate(
    {
      endEpoch: [{ payload: { id, circle_id } }, { id: true }],
    },
    { operationName: 'endEpochMutation' }
  );
