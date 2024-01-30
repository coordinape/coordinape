// import sharp from 'sharp';

import { MAX_IMAGE_BYTES_LENGTH } from '../src/lib/images';

import { PayloadTooLargeError } from './HttpError';

export type ImageResizer = (imageBuffer: Buffer) => Promise<Buffer>;

export function parseBase64Image(imageDataBase64: string): Buffer {
  // base64 decode the provided image data
  const imageBytes = parseBase64(imageDataBase64);
  // file size check
  if (imageBytes.byteLength > MAX_IMAGE_BYTES_LENGTH) {
    throw new PayloadTooLargeError(
      `image size is larger than maximum allowed: ${imageBytes.byteLength}/${MAX_IMAGE_BYTES_LENGTH}`,
    );
  }
  return imageBytes;
}

function parseBase64(imageDataBase64: string): Buffer {
  return Buffer.from(imageDataBase64, 'base64');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function resizeAvatar(_imageBytes: Buffer) {
  // convert to a small jpeg w/ 80% quality
  // This is small because of the map view which needs to show lots of small avatars in a canvas
  // const img = sharp(imageBytes);
  // TODO: sharp is disabled
  // return img
  //   .resize({
  //     fit: 'cover',
  //     width: 240, // TODO: this is so small! but it matches what previous laravel impl did
  //     height: 240,
  //   })
  //   .jpeg({
  //     quality: 80,
  //   })
  //   .toBuffer();
  return _imageBytes;
}

// TODO: this is disabled
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function resizeBackground(_imageBytes: Buffer) {
  return _imageBytes;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function resizeCircleLogo(_imageBytes: Buffer) {
  return _imageBytes;
}

export { resizeAvatar, resizeBackground, resizeCircleLogo };
