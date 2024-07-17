import { client } from '../../lib/gql/client';

// TODO: search by farcaster username, farcaster address - this is tricky due to how the address data is structured
export const fetchFarcasterUserResults = async ({
  search,
}: {
  search: string;
}) => {
  const { farcaster_profile_with_addresses } = await client.query(
    {
      farcaster_profile_with_addresses: [
        {
          where: {
            _or: [{ fname: { _ilike: '%s' + search + '%' } }],
          },
        },
        {
          fname: true,
          avatar_url: true,
          verified_addresses: [{}, true],
          fid: true,
        },
      ],
    },
    {
      operationName: 'searchFarcasterUsers__searchBoxQuery',
    }
  );
  return farcaster_profile_with_addresses;
};
