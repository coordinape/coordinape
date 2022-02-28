// this buffer is because the base64 size of the file is larger, base64 takes 4 chars to encode 3 bytes of data
// and the client limits file to 10MB - we need to make sure we have enough room to handle the base64 overhead
const base64Buffer = 4 / 3;
export const MAX_IMAGE_BYTES_LENGTH = 10 * 1024 * 1024; // 10MB+buffer
export const MAX_IMAGE_BYTES_LENGTH_BASE64 =
  MAX_IMAGE_BYTES_LENGTH * base64Buffer;
