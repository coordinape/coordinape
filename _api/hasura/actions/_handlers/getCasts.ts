import type { VercelRequest, VercelResponse } from '@vercel/node';
import { uniq } from 'lodash-es';
import { z } from 'zod';

import { order_by } from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient.ts';
import { getAnonInput } from '../../../../api-lib/handlerHelpers.ts';
import { InternalServerError } from '../../../../api-lib/HttpError';
import {
  checkURLType,
  URLType,
} from '../../../../src/features/farcaster/checkURLType.ts';

const LIMIT = 10;

const getCastsSchema = z.object({
  // TODO: paging
  fid: z.number().optional(),
  cast_ids: z.array(z.number()).optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { payload } = await getAnonInput(req, getCastsSchema);

  try {
    const casts = await fetchCasts(payload);

    const mentionsMap = await getMentionsMap(casts);
    const enrichedCasts = await Promise.all(
      casts
        .filter(c => c.farcaster_profile)
        .map(async cast => {
          const { text_with_mentions, mentioned_addresses } =
            getTextWithMentions(cast, mentionsMap);

          // TODO: this needs to be cached!!!
          const embeds = await getEmbeds(cast);

          return {
            text_with_mentions,
            id: cast.id,
            embeds,
            like_count: cast.like_count?.aggregate?.count ?? 0,
            recast_count: cast.recast_count?.aggregate?.count ?? 0,
            replies_count: cast.replies_count?.aggregate?.count ?? 0,
            created_at: cast.created_at,
            hash: new String(cast.hash).replaceAll('\\', '0'),
            fid: cast.fid,
            text: cast.text,
            avatar_url: cast.farcaster_profile?.avatar_url,
            fname: cast.farcaster_profile?.fname,
            address: new String(
              cast.farcaster_profile?.verified_addresses?.[0] ??
                cast.fids?.custody_address
            ).replaceAll('\\', '0'),

            mentioned_addresses,
          };
        })
    );
    return res.status(200).json({ casts: enrichedCasts });
  } catch (e) {
    console.error(e);
    throw new InternalServerError('Error occurred searching profiles', e);
  }
}

type Cast = Awaited<ReturnType<typeof fetchCasts>>[number];

const getTextWithMentions = (
  cast: Cast,
  mentionsMap: Awaited<ReturnType<typeof getMentionsMap>>
) => {
  // figure out the mentions
  let offset = 0;
  let text_with_mentions = cast.text;
  const mentioned_addresses: { fname: string; address: string }[] = [];
  for (let i = 0; i < cast.mentions.length; i++) {
    const mention = cast.mentions[i];
    const mentionPosition = cast.mentions_positions[i];
    const mentionInfo = mentionsMap.get(mention);
    if (mentionInfo) {
      const start = mentionPosition + offset;
      text_with_mentions =
        text_with_mentions.slice(0, start) +
        `@${mentionInfo.fname} ` +
        text_with_mentions.slice(start + 1);
      offset += mentionInfo.fname.length + 1; // Adjust the offset based on the mentionName length plus a space
      mentioned_addresses.push({
        fname: mentionInfo.fname,
        address: mentionInfo.address,
      });
    }
  }
  return { mentioned_addresses, text_with_mentions };
};

const getMentionsMap = async (casts: Cast[]) => {
  const allMentions = uniq(casts.flatMap(cast => cast.mentions));
  const { farcaster_fnames: mentionedNames } = await adminClient.query(
    {
      farcaster_fnames: [
        {
          where: {
            fid: {
              _in: allMentions,
            },
          },
        },
        {
          profile_with_address: {
            verified_addresses: [{}, true],
          },
          fids: {
            custody_address: true,
          },
          fid: true,
          fname: true,
        },
      ],
    },
    {
      operationName: 'getCasts_fetchMentions @cached(ttl: 300)',
    }
  );

  const mentionsMap = new Map(
    mentionedNames.map(item => [
      item.fid,
      {
        fname: item.fname,
        address: new String(
          item.profile_with_address?.verified_addresses?.[0] ??
            item.fids?.custody_address
        ).replace('\\', '0'),
      },
    ])
  );
  return mentionsMap;
};

// TODO: Add db infra to cache the aggregate counts at insert time
const fetchCasts = async ({
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
        {
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
        },
      ],
    },
    {
      operationName: 'getCasts_fetchCasts',
    }
  );

  return enriched_casts;
};

type CastEmbed = {
  type: URLType;
  url: string;
};

const getEmbeds = (cast: Cast): Promise<CastEmbed[]> => {
  return Promise.all(
    cast.embeds
      .filter((emb: any) => emb.url)
      .map(async (emb: any) => {
        const type = await checkURLType(emb.url);
        return { type, url: emb.url };
      })
  );
};
