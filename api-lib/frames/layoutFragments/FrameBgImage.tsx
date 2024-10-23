import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';

import { webAppURL } from '../../../src/config/webAppURL';
import { IS_LOCAL_ENV } from '../../config.ts';

export const IMAGE_URL_BASE = `${webAppURL('colinks')}/imgs/frames/`;

function arrayBufferToBase64Sync(arrayBuffer: ArrayBuffer): string {
  // Convert ArrayBuffer to Buffer
  const buffer = Buffer.from(arrayBuffer);
  // Convert the Buffer to a Base64 string
  return buffer.toString('base64');
}

export const FrameBgImage = ({ src }: { src: string }) => {
  // if src begins with `http` then assume its a remote url
  let source;
  if (src.startsWith('http')) {
    source = src;
  } else {
    const imageData = createImage(src);
    const base64Image = arrayBufferToBase64Sync(imageData);
    source = `data:image/jpeg;base64,${base64Image}`;
  }

  // @ts-ignore
  return <img tw="w-full" alt="avatar" src={source} />;
};

export const createImage = (fileNameWithExt: string) => {
  let imageData: ArrayBuffer;
  const file = fileNameWithExt.replace('.jpg', '');
  if (IS_LOCAL_ENV) {
    imageData = readFileSync(getImagePath(file));
  } else {
    imageData = readFileSync(join(__dirname, `./${file}.jpg`));
  }
  return imageData;
};

export const getImagePath = (name: string) =>
  join(process.cwd(), 'public', 'imgs', 'frames', `${name}.jpg`);
