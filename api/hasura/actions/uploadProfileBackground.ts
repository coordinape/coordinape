import type { VercelRequest, VercelResponse } from '@vercel/node';

import { errorResponse } from '../../../api-lib/HttpError';
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

  try {
    const updatedProfile = await updater.uploadImage(
      input.image_data_base64,
      previousBackground
    );
    return res.status(200).json(updatedProfile);
  } catch (e: any) {
    return errorResponse(res, e);
  }
}

export default verifyHasuraRequestMiddleware(handler);
