import { Configuration, NeynarAPIClient } from '@neynar/nodejs-sdk';
import {
  CastParamType,
  EmbedUrl,
  NextCursor,
} from '@neynar/nodejs-sdk/build/api';

import { IS_LOCAL_ENV, NEYNAR_API_KEY, NEYNAR_BOT_SIGNER_UUID } from './config';

const config: Configuration = {
  apiKey: NEYNAR_API_KEY,
};
const client = new NeynarAPIClient(config);

type PublishCastOptions = {
  embeds?: EmbedUrl[];
  replyTo?: string;
  channelId?: string;
};

export const fetchCast = async (cast_hash: string) => {
  const cast = await client.lookupCastByHashOrWarpcastUrl({
    identifier: cast_hash,
    type: CastParamType.Hash,
  });
  return cast;
};

export const fetchCastsForChannel = async (
  channelIds: string[],
  withinSeconds?: number,
  limit: number = 50
) => {
  const feed = await client.fetchFeedByChannelIds({
    channelIds,
    withRecasts: false,
    withReplies: false,
    limit: limit,
  });

  // filter casts to only those within the last `withinSeconds`
  if (!withinSeconds) {
    return feed.casts;
  }

  const recentCasts = feed.casts.filter((cast: any) => {
    const castTime = new Date(cast.timestamp).getTime();
    const currentTime = new Date().getTime();
    return currentTime - castTime < withinSeconds * 1000;
  });

  return recentCasts;
};

export const fetchUserByFid = async (fid: number) => {
  try {
    const response = await client.fetchBulkUsers({ fids: [fid] });
    return response.users[0];
  } catch (err) {
    console.error('Got an error from Neynar attempting lookupUserByFid', err);
    throw err;
  }
};

export const fetchUserByUsername = async (username: string) => {
  try {
    const response = await client.lookupUserByUsername({ username });
    return response.user;
  } catch (err) {
    console.error(
      'Got an error from Neynar attempting lookupUserByUsername',
      err
    );
    throw err;
  }
};

export const fetchUserByAddress = async (address: string) => {
  try {
    const users = await client.fetchBulkUsersByEthOrSolAddress({
      addresses: [address],
    });
    const firstUser = Object.values(users)[0][0];
    for (const u of Object.values(users)[0]) {
      // try to find a real one
      if (u.pfp_url != '' && u.follower_count > 0) {
        return u;
      }
    }
    return firstUser;
  } catch (err: any) {
    if (err?.response?.status == 404) {
      return undefined;
    }
    throw err;
  }
};

export const publishCast = async (
  text: string,
  options: PublishCastOptions
) => {
  if (IS_LOCAL_ENV) {
    // eslint-disable-next-line no-console
    console.log('Ignoring farcast publish because localhost. Cast:', text);
    return;
  }

  try {
    const response = await client.publishCast({
      signerUuid: NEYNAR_BOT_SIGNER_UUID,
      text,
      ...options,
    });
    return response;
  } catch (err) {
    console.error('Got an error from Neynar attempting publishCast', err);
    throw err;
  }
};

export const validateFrame = async (messageBytesInHex: string) => {
  return await client.validateFrameAction({
    messageBytesInHex,
    followContext: true,
    signerContext: true,
    castReactionContext: true,
  });
};

export const generateWarpCastUrl = async (cast_hash: string) => {
  const castInfo = await client.lookupCastByHashOrWarpcastUrl({
    identifier: cast_hash,
    type: CastParamType.Hash,
  });
  const username = castInfo.cast.author.username;

  // shorten cast hash to first 10 characters
  const shortHash = cast_hash.slice(0, 10);
  return `https://warpcast.com/${username}/${shortHash}`;
};

export const fetchFollowers = async (fid: number, next?: NextCursor) => {
  try {
    const response = await client.fetchUserFollowers({
      fid,
      limit: 100,
      cursor: next?.cursor ? next?.cursor : undefined,
    });
    return response;
  } catch (err) {
    console.error(
      'Got an error from Neynar attempting lookupUserByUsername',
      err
    );
    throw err;
  }
};

export const fetchCastByHashOrWarpcastUrl = async (hash_or_url: string) => {
  try {
    const response = await client.lookupCastByHashOrWarpcastUrl({
      identifier: hash_or_url,
      type: hash_or_url.startsWith('http')
        ? CastParamType.Url
        : CastParamType.Hash,
    });
    return response.cast;
  } catch (err) {
    console.error('Got an error from Neynar attempting fetchCast', err);
    throw err;
  }
};
