import React from 'react';

import { createImage } from '../../../_api/frames/router.tsx';
import { webAppURL } from '../../../src/config/webAppURL';

export const IMAGE_URL_BASE = `${webAppURL('colinks')}/imgs/frames/`;

function arrayBufferToBase64Sync(arrayBuffer: ArrayBuffer): string {
  // Convert ArrayBuffer to Buffer
  const buffer = Buffer.from(arrayBuffer);
  // Convert the Buffer to a Base64 string
  return buffer.toString('base64');
}

export const FrameBgImage = ({ src }: { src: string }) => {
  const imageData = createImage(src);
  const base64Image = arrayBufferToBase64Sync(imageData);

  // @ts-ignore
  return (
    <img
      tw="w-full"
      alt="avatar"
      src={`data:image/jpeg;base64,${base64Image}`}
    />
  );
};
