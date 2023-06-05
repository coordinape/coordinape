import { adminClient } from '../../../../api-lib/gql/adminClient';

export const getLocalPGive = async (address: string) => {
  const { member_epoch_pgives_aggregate } = await adminClient.query(
    {
      member_epoch_pgives_aggregate: [
        {
          where: {
            user: { profile: { address: { _eq: address } } },
          },
        },
        // what is the diff between pgive and normalized_pgive.
        // I thought pgive was normalized give, plus stuff
        { aggregate: { sum: [{}, { normalized_pgive: true }] } },
      ],
    },
    {
      operationName: 'getLocalPGive',
    }
  );
  const totalPGIVE =
    (member_epoch_pgives_aggregate.aggregate?.sum as any).normalized_pgive ?? 0;
  return totalPGIVE;
};
