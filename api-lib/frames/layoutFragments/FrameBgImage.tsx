import React from 'react';

import { webAppURL } from '../../../src/config/webAppURL';

export const IMAGE_URL_BASE = `${webAppURL('colinks')}/imgs/frames/`;

export const FrameBgImage = async ({ src }: { src: string }) => {
  const imageData = await fetch(new URL(`./${src}`, import.meta.url)).then(
    res => res.arrayBuffer()
  );

  // @ts-ignore
  return <img tw="w-full" alt="avatar" src={imageData} />;
};
