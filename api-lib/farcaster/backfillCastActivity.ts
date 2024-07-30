import { normalizeError } from '../../src/utils/reporting.ts';
import { insertCastActivity } from '../event_triggers/activity';
import { adminClient } from '../gql/adminClient.ts';
import { fetchCastByHashOrWarpcastUrl } from '../neynar.ts';

export const backfillCastActivity = async (
  hash_or_url_or_cast_id: string | number
) => {
  let fullHash: string = '';
  if (typeof hash_or_url_or_cast_id === 'string') {
    const cast = await fetchCastByHashOrWarpcastUrl(hash_or_url_or_cast_id);
    if (cast) {
      fullHash = cast.hash;
    } else {
      throw new Error('cast not found to determine full hash');
    }
  }

  let cast = await getLocalCast(
    fullHash !== '' ? fullHash : hash_or_url_or_cast_id
  );
  if (!cast && fullHash !== '') {
    try {
      await backfillCast(fullHash);
      cast = await getLocalCast(fullHash);
    } catch (e: any) {
      console.error(normalizeError(e));
      throw e;
    }
  }

  if (!cast) {
    throw new Error('cast not found in local db');
  }
  if (!cast.farcaster_account) {
    throw new Error('no colinks profile account for cast author');
  }
  return await insertCastActivity({
    cast_id: cast.id,
    actor_profile_id: cast.farcaster_account.profile_id,
    created_at: cast.created_at,
  });
};

export const backfillCast = async (hashOrUrl: string) => {
  const cast = await fetchCastByHashOrWarpcastUrl(hashOrUrl);
  if (!cast) {
    throw new Error('cast not found');
  }

  const hash = '\\' + cast.hash.substring(1);
  await adminClient.mutate(
    {
      insert_farcaster_casts_one: [
        {
          object: {
            hash,
            created_at: cast.timestamp,
            timestamp: cast.timestamp,
            // TODO: no way to get these afaict??
            // mentions: cast.mentioned_profiles,
            // mentioned_positions: [],
            fid: cast.author.fid,
            text: cast.text,
            parent_fid: cast.parent_author.fid,
            parent_hash: cast.parent_hash,
            embeds: cast.embeds.map(e => ({
              ...('cast_id' in e ? { cast_id: e.cast_id } : { url: e.url }),
            })),
          },
        },
        {
          id: true,
          hash: true,
          __typename: true,
        },
      ],
    },
    {
      operationName: 'backfillCast',
    }
  );
};

const getLocalCast = async (full_hash_or_cast_id: number | string) => {
  const { farcaster_casts } = await adminClient.query(
    {
      farcaster_casts: [
        {
          where: {
            ...(typeof full_hash_or_cast_id === 'number'
              ? { id: { _eq: full_hash_or_cast_id } }
              : { hash: { _eq: '\\' + full_hash_or_cast_id.substring(1) } }),
            farcaster_account: {},
          },
        },
        {
          id: true,
          created_at: true,
          farcaster_account: {
            profile_id: true,
          },
        },
      ],
    },
    { operationName: 'backfillCastActivity__getLocalCastById' }
  );

  return farcaster_casts.pop();
};
