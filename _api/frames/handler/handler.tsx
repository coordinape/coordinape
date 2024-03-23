import { VercelRequest, VercelResponse } from '@vercel/node';

import { errorResponse, NotFoundError } from '../../../api-lib/HttpError.ts';
import { FrameMessage } from '../FrameMessage.ts';
import { handleGivePost } from '../give/[id].tsx';

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

const handlers: Record<
  string,
  (msg: FrameMessage, res: VercelResponse) => void
> = {
  give: handleGivePost,
};

// TODO: what is the url realy? how does this work?
// /api/frames/handler/X -> handler.tsx
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

    // TODO: validation here when !LOCAL ? don't just use untrustedData
    const frameMessage: FrameMessage = untrustedData;

    // look the url up in a map
    const handler = handlers[frameMessage.url];

    if (handler) {
      handler(frameMessage, res);
      return;
    } else {
      // TODO: an error frame? we made a mistake
      throw new NotFoundError(`no handler found for ${frameMessage.url}`);
    }
  } catch (error: any) {
    return errorResponse(res, error);
  }
}
