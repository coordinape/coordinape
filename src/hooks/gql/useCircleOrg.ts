import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

export function useCircleOrg(circleId: number) {
  return useQuery(['circle-org', circleId], async () => {
    const res = await client.query(
      {
        circles_by_pk: [
          { id: circleId },
          {
            id: true,
            organization: {
              id: true,
            },
          },
        ],
      },
      {
        operationName: 'circle_integrations',
      }
    );

    return res.circles_by_pk?.organization;
  });
}
