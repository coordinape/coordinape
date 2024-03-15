// TODO: add this routing to vercel.json
import React from 'react';

import { VercelRequest, VercelResponse } from '@vercel/node';
import ReactDOM from 'react-dom/server';

import { adminClient } from '../../../api-lib/gql/adminClient.ts';
import { errorResponse, NotFoundError } from '../../../api-lib/HttpError.ts';
import { Frame, FrameButton } from '../Frame.tsx';

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

// @ts-ignore
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
        postUrl={`http://colinks.co.local:3000/api/frames/give/${give.id}`}
        src={`http://colinks.co.local:3000/api/frames/give/img/${give.id}`}
      >
        <FrameButton id={1} content={'ok who cares'} />
        <FrameButton id={2} content={'i love give'} />
      </Frame>
    );
    const sString = ReactDOM.renderToString(s);
    return res.status(200).send(sString);
  } catch (error: any) {
    return errorResponse(res, error);
  }
}

export const getGive = async (req: VercelRequest) => {
  let id: number | undefined;
  if (typeof req.query.id == 'string') {
    id = parseInt(req.query.id);
  }

  if (!id) {
    throw new NotFoundError('no give ID provided');
  }

  const { colinks_gives_by_pk: give } = await adminClient.query(
    {
      colinks_gives_by_pk: [
        {
          id,
        },
        {
          id: true,
          profile_id: true,
          target_profile_id: true,
          giver_profile_public: {
            name: true,
            avatar: true,
          },
          target_profile_public: {
            name: true,
            avatar: true,
          },
        },
      ],
    },
    {
      operationName: 'frame_give_getGive',
    }
  );

  return give;
};
// @ts-ignore
async function POST(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      body: {
        untrustedData,
        trustedData: { messageBytes },
      },
    } = req;
    console.log(messageBytes);
    console.log(untrustedData);

    // const result = await validateFrame(messageBytes);
    // const { valid, action } = result;
    // console.log(action);
    // console.log({ frame: result });
    const s = (
      <Frame
        postUrl={'http://colinks.co.local:3000/api/frames/example'}
        src={`brokenimgfornow`}
        state={'moo bro'}
      >
        <FrameButton id={1} content={'boney'} />
        <FrameButton id={2} content={'poney'} />
      </Frame>
    );
    const sString = ReactDOM.renderToString(s);
    return res.status(200).send(sString);
  } catch (error: any) {
    return errorResponse(res, error);
  }
}
