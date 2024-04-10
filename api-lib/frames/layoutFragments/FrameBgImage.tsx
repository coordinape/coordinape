import React from 'react';

import { createImage } from '../../../_api/frames/router.tsx';
import { webAppURL } from '../../../src/config/webAppURL';

export const IMAGE_URL_BASE = `${webAppURL('colinks')}/imgs/frames/`;

export const FrameBgImage = ({ src }: { src: string }) => {
  const imageData = createImage(src);

  // @ts-ignore
  return <img tw="w-full" alt="avatar" src={imageData} />;
};
