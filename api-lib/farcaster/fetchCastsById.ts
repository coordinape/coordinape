import { order_by, Selector } from '../gql/__generated__/zeus';
import { adminClient } from '../gql/adminClient.ts';

const LIMIT = 10;

export type Cast = Awaited<ReturnType<typeof fetchCastsById>>[number];
export const EnrichedCastSelector = Selector('enriched_casts')({
  id: true,
  created_at: true,
  text: true,
  hash: true,
  fid: true,
  embeds: [{}, true],
  mentions: true,
  mentions_positions: true,
  fids: {
    custody_address: true,
  },
  farcaster_profile: {
    fname: true,
    avatar_url: true,
    verified_addresses: [{}, true],
  },
  __alias: {
    like_count: {
      reactions_aggregate: [
        {
          where: {
            deleted_at: { _is_null: true },
            reaction_type: { _eq: 1 },
          },
        },
        { aggregate: { count: [{}, true] } },
      ],
    },
    recast_count: {
      reactions_aggregate: [
        {
          where: {
            deleted_at: { _is_null: true },
            reaction_type: { _eq: 2 },
          },
        },
        { aggregate: { count: [{}, true] } },
      ],
    },
    replies_count: {
      replies_aggregate: [
        {
          where: {
            deleted_at: { _is_null: true },
          },
        },
        { aggregate: { count: [{}, true] } },
      ],
    },
  },
});

// TODO: Add db infra to cache the aggregate counts at insert time
export const fetchCastsById = async ({
  fid,
  cast_ids,
}: {
  fid?: number;
  cast_ids?: number[];
}) => {
  const { enriched_casts } = await adminClient.query(
    {
      enriched_casts: [
        {
          where: {
            deleted_at: { _is_null: true },
            ...(fid ? { fid: { _eq: fid } } : {}),
            ...(cast_ids ? { id: { _in: cast_ids } } : {}),
          },
          order_by: [{ created_at: order_by.desc }],
          limit: LIMIT,
        },
        EnrichedCastSelector,
      ],
    },
    {
      operationName: 'getCasts_fetchCasts',
    }
  );

  return enriched_casts;
};
