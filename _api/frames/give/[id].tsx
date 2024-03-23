import React from 'react';

import { VercelRequest, VercelResponse } from '@vercel/node';
import ReactDOM from 'react-dom/server';

import { errorResponse, NotFoundError } from '../../../api-lib/HttpError.ts';
import { webAppURL } from '../../../src/config/webAppURL.ts';
import { Frame, FrameButton } from '../Frame.tsx';
import { getFarcasterInfo } from '../getFarcasterInfo.tsx';

import { GiverFrame } from './[id]/handler/giver.tsx';
import { RandoFrame } from './[id]/handler/rando.tsx';
import { getGive } from './getGive.tsx';

// HOME: X gave to Y
// *BUTTON* Enter the Arena
// I'm a Rando // I'm Y // I'm X

export default async function (req: VercelRequest, res: VercelResponse) {
  switch (req.method) {
    case 'GET':
      // home frame
      await GET(req, res);
      break;
    case 'POST':
      // after click
      await POST(req, res);
      break;
    default:
      res.status(405).send('Method Not Allowed');
  }
}

async function GET(req: VercelRequest, res: VercelResponse) {
  try {
    // WHOMST GAVE TO WHOMST, this is the home frame

    const give = await getGive(req);
    if (!give || !give.target_profile_public || !give.giver_profile_public) {
      throw new NotFoundError('give not found');
    }
    console.log(give);

    const s = (
      <Frame
        postUrl={`${webAppURL('colinks')}/api/frames/give/${give.id}`}
        src={`${webAppURL('colinks')}/api/frames/give/img/${give.id}`}
      >
        <FrameButton id={1} content={'Enter the Arena'} />
      </Frame>
    );
    const sString = ReactDOM.renderToString(s);
    return res.status(200).send(sString);
  } catch (error: any) {
    return errorResponse(res, error);
  }
}

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

    if (role === 'giver') {
      const s = <GiverFrame give={give} />;
      const sString = ReactDOM.renderToString(s);
      return res.status(200).send(sString);
    } else if (role === 'target') {
      // const s = <TargetFrame give={give} />;
      // const sString = ReactDOM.renderToString(s);
      // return res.status(200).send(sString);
    } else if (role === 'rando') {
      const s = <RandoFrame give={give} />;
      const sString = ReactDOM.renderToString(s);
      return res.status(200).send(sString);
    }
    res.send({ no: 'no' });
  } catch (error: any) {
    return errorResponse(res, error);
  }
}
