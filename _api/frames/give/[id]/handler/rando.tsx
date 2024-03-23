import React from 'react';

import { VercelRequest, VercelResponse } from '@vercel/node';

import {
  errorResponse,
  NotFoundError,
} from '../../../../../api-lib/HttpError.ts';
import { webAppURL } from '../../../../../src/config/webAppURL.ts';
import { Frame, FrameButton } from '../../../Frame.tsx';
import { getFarcasterInfo } from '../../../getFarcasterInfo.tsx';
import { getGive, Give } from '../../getGive.tsx';

export default async function (req: VercelRequest, res: VercelResponse) {
  switch (req.method) {
    case 'POST':
      // after click
      await POST(req, res);
      break;
    default:
      res.status(405).send('Method Not Allowed');
  }
}

export const RandoFrame = ({ give }: { give: Give }) => {
  return (
    <Frame
      postUrl={`${webAppURL('colinks')}/api/frames/give/${give.id}/handler/rando`}
      src={`${webAppURL('colinks')}/api/frames/give/${give.id}/img/rando`}
    >
      <FrameButton id={1} content={`U ARE A RANDO `} />
    </Frame>
  );
};

async function POST(req: VercelRequest, res: VercelResponse) {
  // whoami????
  try {
    const info = await getFarcasterInfo(req);
    const give = await getGive(req);
    if (!give || !give.target_profile_public || !give.giver_profile_public) {
      throw new NotFoundError('give not found');
    }

    type role = 'rando' | 'giver' | 'target';

    let role: role = 'rando';
    if (info.profile.id === give.giver_profile_public.id) {
      role = 'giver';
    } else if (info.profile.id === give.target_profile_public.id) {
      role = 'target';
    }

    console.log(info);
    res.send({ no: 'no' });
  } catch (error: any) {
    return errorResponse(res, error);
  }
}
