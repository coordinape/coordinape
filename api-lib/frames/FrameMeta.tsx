import React from 'react';

import { VercelResponse } from '@vercel/node';
import { renderToString } from 'react-dom/server';

import { FramePostInfo } from './_getFramePostInfo.tsx';
import { FrameButton } from './FrameButton.tsx';
import { Frame } from './frames.ts';
import { getImgSrc, getPostUrl } from './routingUrls.ts';

export const RenderFrameMeta = async ({
  frame,
  res,
  params,
  info,
  onlyMetaTags,
}: {
  frame: Frame;
  res: VercelResponse;
  params: Record<string, string>;
  info?: FramePostInfo;
  onlyMetaTags?: boolean;
}) => {
  const imgSrc = getImgSrc(frame, params, info);
  const postURL = getPostUrl(frame, params);

  const scriptContent = `
    <script type="text/javascript">
      window.location.href = "${frame.clickURL ? frame.clickURL : 'https://docs.coordinape.com/colinks/give'}";
    </script>
 `;

  const wrappedContent = (children: React.ReactNode): React.JSX.Element => (
    <html lang="en">
      <head>
        {children}
        <title>Farcaster Frame</title>
        <div dangerouslySetInnerHTML={{ __html: scriptContent }} />;
      </head>
      <body>
        <h1>Redirecting to CoLinks...</h1>
      </body>
    </html>
  );

  const metaTags = async () => {
    const buttons: React.ReactNode[] = [];
    for (let i = 0; i < frame.buttons.length; i++) {
      const button = frame.buttons[i];
      buttons.push(
        <FrameButton
          key={i}
          idx={i + 1}
          title={button.title}
          action={button.action}
          target={
            button.target &&
            (typeof button.target === 'string'
              ? button.target
              : await button.target(params))
          }
        />
      );
    }
    return (
      <>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:post_url" content={postURL} />
        {/*{state && <meta property="fc:frame:state" content={state} />}*/}
        {buttons}
        {frame.inputText && (
          <meta
            name="fc:frame:input:text"
            content={await frame.inputText(params)}
          />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={imgSrc} />
        <meta property="og:image" content={imgSrc} />
        <meta property="fc:frame:image" content={imgSrc} />
        <meta
          property="fc:frame:image:aspect_ratio"
          content={frame.aspectRatio === '1.91:1' ? '1.91:1' : '1:1'}
        />
      </>
    );
  };
  if (onlyMetaTags) {
    const sString = renderToString(await metaTags());
    return res.status(200).send(sString);
  } else {
    const sString = renderToString(wrappedContent(await metaTags()));
    return res.status(200).send(sString);
  }
};
