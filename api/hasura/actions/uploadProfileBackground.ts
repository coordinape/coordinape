import type { VercelRequest, VercelResponse } from '@vercel/node';

import { resizeBackground } from '../../../api-lib/images';
import { ImageUpdater } from '../../../api-lib/ImageUpdater';
import {
  profileImages,
  profileUpdateBackgroundMutation,
  userAndImageData,
} from '../../../api-lib/profileImages';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

async function handler(req: VercelRequest, res: VercelResponse) {
  const { input, hasuraProfileId } = userAndImageData(req);
  const { background: previousBackground } = await profileImages(
    hasuraProfileId
  );

  const updater = new ImageUpdater<{ id: number }>(
    resizeBackground,
    profileUpdateBackgroundMutation(hasuraProfileId)
  );

  const updatedProfile = await updater.uploadImage(
    input.image_data_base64,
    previousBackground
  );
  return res.status(200).json(updatedProfile);
}

export default verifyHasuraRequestMiddleware(handler);
