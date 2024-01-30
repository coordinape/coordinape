import { MAX_IMAGE_BYTES_LENGTH } from '../src/lib/images';

import { PayloadTooLargeError } from './HttpError';

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
async function resizeCircleLogo(_imageBytes: Buffer) {
  return _imageBytes;
}

export { resizeCircleLogo };
