import React from 'react';

import { VercelResponse } from '@vercel/node';
// import { renderToString } from 'react-dom/server';
import { DateTime } from 'luxon';
import { renderToString } from 'react-dom/server';

import { Frame, FRAME_ROUTER_URL_BASE } from '../../_api/frames/router.tsx';

import { FramePostInfo } from './_getFramePostInfo.tsx';
import { FrameButton } from './FrameButton.tsx';

export const RenderFrameMeta = ({
  frame,
  res,
  params,
  info,
}: {
  frame: Frame;
  res: VercelResponse;
  params: Record<string, string>;
  info?: FramePostInfo;
}) => {
  const resourceId = frame.resourceIdentifier.getResourceId(params);
  const resourcePath = resourceId ? `${resourceId}` : '';
  // TODO: get these outta here, make them a router function or on Frame

  const viewer_profile_id: string | undefined = info?.profile?.id;
  const error_message: string | undefined = params['error_message'];

  const imgParams = {
    ts: DateTime.now().valueOf().toString(),
    ...(error_message && { error_message: error_message }),
    ...(viewer_profile_id && { viewer_profile_id: viewer_profile_id }),
  };

  const imgSrc = `${FRAME_ROUTER_URL_BASE}/img/${frame.id}${resourcePath}?${new URLSearchParams(imgParams).toString()}`;
  const postURL = `${FRAME_ROUTER_URL_BASE}/post/${frame.id}${resourcePath}`;
  const buttons = frame.buttons;

  const content: React.JSX.Element = (
    <html lang="en">
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:post_url" content={postURL} />
        {/*{state && <meta property="fc:frame:state" content={state} />}*/}
        {buttons.map((button, idx) => (
          <FrameButton
            key={idx}
            idx={idx + 1}
            title={button.title}
            action={button.action}
            target={button.target}
          />
        ))}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={imgSrc} />
        <meta property="og:image" content={imgSrc} />
        <meta property="fc:frame:image" content={imgSrc} />
        <meta property="fc:frame:image:aspect_ratio" content="1:1" />
        <title>Farcaster Frame</title>
      </head>
      <body>
        <h1>This is just a frame yall</h1>
      </body>
    </html>
  );
  const sString = renderToString(content);
  return res.status(200).send(sString);
};