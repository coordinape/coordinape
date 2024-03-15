import React from 'react';

export const FrameImage = ({
  src,
  aspectRatio = '1.91:1',
}: {
  src: string;
  aspectRatio?: '1.91:1' | '1:1';
}) => {
  return (
    <>
      <meta property="og:image" content={src} />
      <meta property="fc:frame:image" content={src} />
      <meta property="fc:frame:image:aspect_ratio" content={aspectRatio} />
    </>
  );
};
