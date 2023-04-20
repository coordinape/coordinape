import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

export function useCircleIntegrations(circleId?: number) {
  return useQuery(
    ['circle-integrations', circleId],
    async () => {
      const res = await client.query(
        {
          circles_by_pk: [
            { id: circleId as number },
            {
              id: true,
              integrations: [
                {},
                {
                  id: true,
                  type: true,
                  name: true,
                  data: [{ path: '$' }, true],
                },
              ],
            },
          ],
        },
        { operationName: 'circle_integrations' }
      );

      return res.circles_by_pk?.integrations;
    },
    { refetchOnWindowFocus: false, enabled: !!circleId }
  );
}

export type Integration = NonNullable<
  ReturnType<typeof useCircleIntegrations>['data']
>[0];
