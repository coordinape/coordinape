import { client } from 'lib/gql/client';

import { Awaited } from '../../types/shim';

export const getNominationsData = async (circleId: number) => {
  const gq = await client.query(
    {
      circles_by_pk: [
        { id: circleId },
        {
          nominees_aggregate: [
            { where: { ended: { _eq: false } } },
            { aggregate: { count: [{}, true] } },
          ],
        },
      ],
    },
    {
      operationName: 'getNominationsData',
    }
  );

  return gq.circles_by_pk;
};

export type QueryResult = Awaited<ReturnType<typeof getNominationsData>>;
