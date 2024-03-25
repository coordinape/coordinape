import { VercelRequest } from '@vercel/node';

import { findOrCreateProfileByFid } from '../../api-lib/neynar/findOrCreateProfileByFid.ts';

import { FrameMessage } from './FrameMessage.ts';

export async function getFramePostInfo(req: VercelRequest) {
  const {
    body: {
      untrustedData,
      trustedData: { messageBytes },
    },
  } = req;
  console.log(messageBytes);
  console.log(untrustedData);

  // TODO: validation here when !LOCAL ? don't just use untrustedData
  const frameMessage: FrameMessage = untrustedData;
  const profile = await findOrCreateProfileByFid(frameMessage.fid);

  // are we X or Y or rando ?

  return {
    message: frameMessage,
    profile,
  };
}

export type FramePostInfo = Awaited<ReturnType<typeof getFramePostInfo>>;
