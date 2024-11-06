import { uniq } from 'lodash-es';

import { adminClient } from '../gql/adminClient.ts';

import { Cast } from './fetchCastsById.ts';

export const getTextWithMentions = (
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

export const getMentionsMap = async (casts: Cast[]) => {
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
