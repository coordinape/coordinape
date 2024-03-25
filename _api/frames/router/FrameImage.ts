import React from 'react';

import { VercelResponse } from '@vercel/node';

export const RenderFrameImage = (
  {
    // children,
    // res,
  }: {
    children: React.JSX.Element;
    res: VercelResponse;
  }
) => {
  return 'hi';
  // const ir = new ImageResponse(children);
  // Readable.fromWeb(ir.body as ReadableStream<any>).pipe(res);
};
