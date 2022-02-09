import sharp from "sharp";

async function resizeAvatar(imageBytes: Buffer) {
  const img = sharp(imageBytes);
  return img
    .resize({
      fit: 'cover',
      width: 240, // TODO: this is so small! but it matches what previous laravel impl did
      height: 240,
    })
    .jpeg({
      quality: 80,
    })
    .toBuffer();
}

export {
  resizeAvatar,
};