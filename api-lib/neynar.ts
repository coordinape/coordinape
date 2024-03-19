import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { EmbeddedCast } from '@neynar/nodejs-sdk/build/neynar-api/v2';

import { NEYNAR_API_KEY, NEYNAR_BOT_SIGNER_UUID } from './config';

const client = new NeynarAPIClient(NEYNAR_API_KEY);

type PublishCastOptions = {
  embeds?: EmbeddedCast[];
  replyTo?: string;
  channelId?: string;
};

export const fetchUserByFid = async (fid: number) => {
  try {
    const response = await client.fetchBulkUsers([fid]);
    return response.users[0];
  } catch (err) {
    console.error('Got an error from Neynar attempting lookupUserByFid', err);
    throw err;
  }
};

export const publishCast = async (
  text: string,
  options: PublishCastOptions
) => {
  try {
    const response = await client.publishCast(
      NEYNAR_BOT_SIGNER_UUID,
      text,
      options
    );
    return response;
  } catch (err) {
    console.error('Got an error from Neynar attempting publishCast', err);
    throw err;
  }
};
