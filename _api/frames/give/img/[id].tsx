// TODO: add this routing to vercel.json
import { Readable } from 'node:stream';
// @ts-ignore
import type { ReadableStream } from 'node:stream/web';
import React from 'react';

import { VercelRequest, VercelResponse } from '@vercel/node';
import { ImageResponse } from '@vercel/og';

import { errorResponse } from '../../../../api-lib/HttpError.ts';

export default async function (req: VercelRequest, res: VercelResponse) {
  switch (req.method) {
    case 'GET':
      await GET(req, res);
      break;
    default:
      res.status(405).send('Method Not Allowed');
  }
}

// @ts-ignore
async function GET(req: VercelRequest, res: VercelResponse) {
  try {
    // const give = await getGive(req);
    // if (!give || !give.target_profile_public || !give.giver_profile_public) {
    //   throw new NotFoundError('give not found');
    // }
    const ir = new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 64,
            padding: 16,
          }}
        >
          <div>slurp the noodle</div>
          {/*<OGAvatar avatar={give.giver_profile_public.avatar} />*/}
          {/*<div>{give.giver_profile_public.name}</div>*/}
          {/*<div>GAVE TO</div>*/}
          {/*<OGAvatar avatar={give.target_profile_public.avatar} />*/}
          {/*<div>{give.target_profile_public.name}</div>*/}
        </div>
      )
    );
    // @ts-ignore
    Readable.fromWeb(ir.body as ReadableStream<any>).pipe(res);
  } catch (error: any) {
    return errorResponse(res, error);
  }
}
