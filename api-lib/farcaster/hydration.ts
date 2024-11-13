import { getEmbeds } from './embeds.ts';
import { Cast } from './fetchCastsByIdOrHash.ts';
import { getMentionsMap, getTextWithMentions } from './mentions.ts';

export type HydratedCast = Awaited<ReturnType<typeof hydrateCasts>>[number];

export async function hydrateCasts(casts: Cast[]) {
  const mentionsMap = await getMentionsMap(casts);
  const enrichedCasts = await Promise.all(
    casts
      .filter(c => c.farcaster_profile)
      .map(async cast => {
        const { text_with_mentions, mentioned_addresses } = getTextWithMentions(
          cast,
          mentionsMap
        );

        // TODO: this needs to be cached (in db?) !!!
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
  return enrichedCasts;
}
