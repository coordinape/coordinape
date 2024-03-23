import React from 'react';

import { FrameImage } from './FrameImage.tsx';

// TODO: cache control isn't handled yet
/*
Frame servers can use the max-age directive in the HTTP Cache-Control header to ensure images in the initial frame refresh automatically.
A lower max-age ensures images update regularly without user interactions.
 */
export const Frame = ({
  children,
  postUrl,
  textField,
  state,
  src,
}: {
  children: React.ReactNode;
  postUrl: string;
  textField?: string;
  state?: string;
  src: string;
}) => {
  return (
    <html lang="en">
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:post_url" content={postUrl} />
        <meta property="fc:frame:post_url" content={postUrl} />
        summary_large_image
        <meta name="twitter:image" content={src} />
        <meta name="twitter:card" content="summary_large_image" />
        {children}
        {state && <meta property="fc:frame:state" content={state} />}
        {textField && (
          <meta property="fc:frame:input:text" content={textField} />
        )}
        <FrameImage src={src} />
        <title>Farcaster Frame</title>
      </head>
      <body>
        <h1>This is just a frame yall</h1>
      </body>
    </html>
  );
};

export const FrameButton = ({
  id,
  content,
}: {
  id: number;
  content: string;
}) => {
  return <meta property={`fc:frame:button:${id}`} content={content} />;
};
