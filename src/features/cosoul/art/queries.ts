import { client } from 'lib/gql/client';

export const getCosoulArtData = async (tokenId?: number) => {
  const { cosouls } = await client.query(
    {
      cosouls: [
        {
          where: { token_id: { _eq: tokenId } },
          limit: 1,
        },
        {
          profile: { address: true },
          pgive: true,
        },
      ],
    },
    { operationName: 'cosoulArt_getCosoulArtData' }
  );

  const cosoul = cosouls.pop();
  return cosoul;
};

export const QUERY_KEY_COSOUL_ART_DATA = 'getCosoulArtData';
