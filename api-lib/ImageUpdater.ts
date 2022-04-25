import { v4 as uuidv4 } from 'uuid';

import { AVATAR_DIR } from './config';
import { InternalServerError } from './HttpError';
import { parseBase64Image } from './images';
import { deleteImage, uploadImage } from './s3';

export class ImageUpdater<T> {
  private readonly resizer: (imageBuffer: Buffer) => Promise<Buffer>;
  private readonly updateMutation: (fileName: string) => Promise<T>;

  constructor(
    resizer: (imageBuffer: Buffer) => Promise<Buffer>,
    updateMutation: (fileName: string) => Promise<T>
  ) {
    this.resizer = resizer;
    this.updateMutation = updateMutation;
  }

  async uploadImage(
    image_data_base64: string,
    previousImage?: string
  ): Promise<T> {
    const imageBytes = parseBase64Image(image_data_base64);

    // resize and crop the image
    const resizedImage = await this.resizer(imageBytes);

    // generate a filename for the new image
    const fileName = AVATAR_DIR + uuidv4() + '.jpg';

    // Uploading files to the bucket
    try {
      await uploadImage(fileName, resizedImage);
    } catch (err: any) {
      throw new InternalServerError(
        err.message
          ? 'error uploading to s3: ' + err.message
          : 'Unexpected error uploading file'
      );
    }

    // Do the update mutation
    const returnedObject = await this.updateMutation(fileName);

    //delete the previous file from s3 if needed
    if (previousImage) {
      try {
        await deleteImage(previousImage);
      } catch (e: any) {
        console.error(
          `problem deleting previous image file '${previousImage}' - ${e}`
        );
      }
    }
    return returnedObject;
  }
}
