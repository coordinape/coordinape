import React from 'react';

import { VercelResponse } from '@vercel/node';

// import { renderToString } from 'react-dom/server';
import { renderToString } from 'react-dom/server';

import { FrameButton } from './FrameButton';
import { Frame, FRAME_ROUTER_URL_BASE } from './router';

export const RenderFrameMeta = ({
  frame,
  res,
  params,
}: {
  frame: Frame;
  res: VercelResponse;
  params: Record<string, string>;
}) => {
  const resourceId = frame.resourceIdentifier.getResourceId(params);
  const resourcePath = resourceId ? `/${resourceId}` : '';
  // TODO: get these outta here, make them a router function or on Frame
  const imgSrc = `${FRAME_ROUTER_URL_BASE}/img/${frame.id}${resourcePath}`;
  const postURL = `${FRAME_ROUTER_URL_BASE}/post/${frame.id}${resourcePath}`;
  const buttons = frame.buttons;

  const content: React.JSX.Element = (
    <html lang="en">
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:post_url" content={postURL} />
        <meta property="fc:frame:post_url" content={postURL} />
        {/*{state && <meta property="fc:frame:state" content={state} />}*/}
        <meta name="twitter:card" content="summary_large_image" />
        {buttons.map((button, idx) => (
          <FrameButton
            key={idx}
            idx={idx + 1}
            title={button.title}
            action={button.action}
            target={button.target}
          />
        ))}
        <meta name="twitter:image" content={imgSrc} />
        <meta property="og:image" content={imgSrc} />
        <meta property="fc:frame:image" content={imgSrc} />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
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
