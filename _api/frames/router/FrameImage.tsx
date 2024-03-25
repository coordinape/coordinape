import { Readable } from 'node:stream';
import { ReadableStream } from 'node:stream/web';
import React from 'react';

import { VercelResponse } from '@vercel/node';
import { ImageResponse } from '@vercel/og';

export const RenderFrameImage = ({
  // children,
  res,
}: {
  // children: React.JSX.Element;
  res: VercelResponse;
}) => {
  const ir = new ImageResponse(<div>horse</div>);
  Readable.fromWeb(ir.body as ReadableStream<any>).pipe(res);
};
