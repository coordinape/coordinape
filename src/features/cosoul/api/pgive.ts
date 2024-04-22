import { adminClient } from '../../../../api-lib/gql/adminClient';

export const getLocalPGIVE = async (address: string) => {
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
        // @ts-ignore
        { aggregate: { sum: [{}, { normalized_pgive: true }] } },
      ],
    },
    {
      operationName: 'getLocalPGive',
    }
  );

  // ALSO ADD colinks_GIVE
  const { colinks_gives_aggregate } = await adminClient.query(
    {
      colinks_gives_aggregate: [
        {
          where: {
            created_at: {
              // This is because we are only counting GIVE in PGIVE starting in April 2024
              // The GIVE must have occured after april first to count
              _gt: '2024-04-01',
            },
            target_profile_public: {
              address: {
                _ilike: address,
              },
            },
          },
        },
        { aggregate: { count: [{}, true] } },
      ],
    },
    {
      operationName: 'getLocalColinksGIVE',
    }
  );

  const coLinksGIVEs = colinks_gives_aggregate.aggregate?.count ?? 0;

  const epochPGIVE = Math.floor(
    // @ts-ignore
    (member_epoch_pgives_aggregate.aggregate?.sum as any).normalized_pgive ?? 0
  );
  return epochPGIVE + coLinksGIVEs;
};
