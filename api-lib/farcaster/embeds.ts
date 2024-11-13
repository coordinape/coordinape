import {
  checkURLType,
  URLType,
} from '../../src/features/farcaster/checkURLType.ts';

import { Cast } from './fetchCastsByIdOrHash.ts';

export type CastEmbed = {
  type: URLType;
  url: string;
};

export const getEmbeds = (cast: Cast): Promise<CastEmbed[]> => {
  return Promise.all(
    cast.embeds
      .filter((emb: any) => emb.url)
      .map(async (emb: any) => {
        const type = await checkURLType(emb.url);
        return { type, url: emb.url };
      })
  );
};
