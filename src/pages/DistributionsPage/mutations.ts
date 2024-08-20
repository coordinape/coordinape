import { client } from 'lib/gql/client';
import { useMutation } from 'react-query';

export function useGiveCsv() {
  return useMutation(
    async ({
      circleId,
      epoch,
      epochId,
    }: {
      circleId: number;
      epoch?: number;
      epochId?: number;
    }) => {
      const { giveCsv } = await client.mutate(
        {
          giveCsv: [
            {
              payload: {
                circle_id: circleId,
                epoch_id: epochId,
                epoch: epoch,
              },
            },
            {
              file: true,
            },
          ],
        },
        {
          operationName: 'giveCsv',
        }
      );
      return giveCsv;
    }
  );
}
