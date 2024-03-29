import React from 'react';

import { webAppURL } from '../../../src/config/webAppURL';

export const IMAGE_URL_BASE = `${webAppURL('colinks')}/public/imgs/frames/`;

export const FrameBgImage = ({ src }: { src: string }) => {
  return <img tw="w-full" alt="avatar" src={IMAGE_URL_BASE + src} />;
};
