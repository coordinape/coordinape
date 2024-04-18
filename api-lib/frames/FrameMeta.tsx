import React from 'react';

import { VercelResponse } from '@vercel/node';
import { renderToString } from 'react-dom/server';

import { Frame } from '../../_api/frames/router.tsx';

import { FramePostInfo } from './_getFramePostInfo.tsx';
import { FrameButton } from './FrameButton.tsx';
import { getImgSrc, getPostUrl } from './routingUrls.ts';

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
  const imgSrc = getImgSrc(frame, params, info);
  const postURL = getPostUrl(frame, params);
  const buttons = frame.buttons;

  const scriptContent = `
    <script type="text/javascript">
      window.location.href = "${frame.clickURL ? frame.clickURL : 'https://docs.coordinape.com/colinks/give'}";
    </script>
 `;

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
        {frame.inputText && (
          <meta name="fc:frame:input:text" content={frame.inputText(params)} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={imgSrc} />
        <meta property="og:image" content={imgSrc} />
        <meta property="fc:frame:image" content={imgSrc} />
        <meta
          property="fc:frame:image:aspect_ratio"
          content={frame.aspectRatio === '1.91:1' ? '1.91:1' : '1:1'}
        />
        <title>Farcaster Frame</title>
        <div dangerouslySetInnerHTML={{ __html: scriptContent }} />;
      </head>
      <body>
        <h1>Redirecting to CoLinks...</h1>
      </body>
    </html>
  );
  const sString = renderToString(content);
  return res.status(200).send(sString);
};
