import { anonClient } from 'lib/anongql/anonClient';

import { client } from '../../lib/gql/client';
import { Awaited } from '../../types/shim';

export type Cast = Awaited<ReturnType<typeof fetchCasts>>[number];
export const fetchCasts = async (anon: boolean, cast_ids: number[]) => {
  if (cast_ids.length === 0) return [];
  // get the cast info

  const { getCasts } = anon
    ? await anonClient.query(
        {
          getCasts: [
            {
              payload: {
                cast_ids,
              },
            },
            {
              casts: {
                id: true,
                address: true,
                fname: true,
                avatar_url: true,
                created_at: true,
                fid: true,
                hash: true,
                text: true,
                like_count: true,
                recast_count: true,
                replies_count: true,
                text_with_mentions: true,
                embeds: { url: true, type: true },
                mentioned_addresses: { address: true, fname: true },
              },
            },
          ],
        },
        {
          operationName: 'getActivities_getCastInfo',
        }
      )
    : await client.query(
        {
          getCasts: [
            {
              payload: {
                cast_ids,
              },
            },
            {
              casts: {
                id: true,
                address: true,
                fname: true,
                avatar_url: true,
                created_at: true,
                fid: true,
                hash: true,
                text: true,
                like_count: true,
                recast_count: true,
                replies_count: true,
                text_with_mentions: true,
                embeds: { url: true, type: true },
                mentioned_addresses: { address: true, fname: true },
              },
            },
          ],
        },
        {
          operationName: 'getActivities_getCastInfo',
        }
      );
  return getCasts.casts;
};
