/* eslint-disable no-console */
import { VercelRequest } from '@vercel/node';

import { findOrCreateProfileByFid } from '../../api-lib/neynar/findOrCreateProfileByFid.ts';
import { validateFrame } from '../../api-lib/neynar.ts';
import { IN_DEVELOPMENT } from '../../src/config/env.ts';

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

  const frameMessage: FrameMessage = untrustedData;
  const profile = await findOrCreateProfileByFid(frameMessage.fid);

  if (!IN_DEVELOPMENT) {
    const validated = await validateFrame(messageBytes);
    if (!validated.valid) {
      throw new Error('frame validation failed');
    }
  }

  return {
    message: frameMessage,
    profile,
  };
}

export type FramePostInfo = Awaited<ReturnType<typeof getFramePostInfo>>;
