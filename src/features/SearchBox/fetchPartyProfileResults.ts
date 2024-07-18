import { anonClient } from '../../lib/anongql/anonClient';

// TODO: search by farcaster username, farcaster address - this is tricky due to how the address data is structured
export const fetchPartyProfileResults = async ({
  search,
}: {
  search: string;
}) => {
  const { profiles_public } = await anonClient.query(
    {
      profiles_public: [
        {
          where: {
            _or: [
              { name: { _ilike: '%' + search + '%' } },
              {
                address: { _ilike: '%' + search + '%' },
              },
            ],
          },
        },
        {
          id: true,
          name: true,
          avatar: true,
          address: true,
          links: true,
          reputation_score: {
            total_score: true,
          },
        },
      ],
    },
    {
      operationName: 'searchPartyProfiles__searchBoxQuery',
    }
  );
  return profiles_public;
};
