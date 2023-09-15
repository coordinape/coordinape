import { client } from 'lib/gql/client';

export const getCircleData = (circleId: number) =>
  client.query(
    {
      circles_by_pk: [
        { id: circleId },
        {
          id: true,
          name: true,
          logo: true,
        },
      ],
    },
    {
      operationName: 'getCircleData',
    }
  );
export const QUERY_KEY_CIRCLE_DATA = 'myCircle';
