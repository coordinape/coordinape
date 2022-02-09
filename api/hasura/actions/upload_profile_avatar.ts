import type { VercelRequest, VercelResponse } from '@vercel/node';
import { v4 as uuidv4 } from 'uuid';

import { gql } from '../../../api-lib/Gql';
import { resizeAvatar } from '../../../api-lib/images';
import { deleteImage, uploadImage } from '../../../api-lib/s3';
import {
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
  updateProfileAvatarInput,
} from '../../../src/lib/zod';

// this buffer is because the base64 size of the file is approximately 33% bigger than the underlying file
// and the client limits file to 10MB - we need to make sure we have enough room to handle the base64 overhead
const base64Buffer = 1.4;
const MAX_IMAGE_BYTES_LENGTH = 10 * 1024 * 1024 * base64Buffer; // 10MB+buffer

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // parse the input
  const {
    input: { object: input },
    session_variables: sessionVariables,
  } = composeHasuraActionRequestBodyWithSession(
    updateProfileAvatarInput,
    HasuraUserSessionVariables
  ).parse(req.body);

  try {
    // base64 decode the provided image data
    const imageBytes = Buffer.from(input.image_data_base64, 'base64');

    // file size check
    if (imageBytes.byteLength > MAX_IMAGE_BYTES_LENGTH) {
      return res.status(400).json({
        message: `image size is larger than maximum allowed: ${imageBytes.byteLength}/${MAX_IMAGE_BYTES_LENGTH}`,
        code: '400',
      });
    }

    // Figure out if there was a previous avatar, because we'll need to delete it
    const { profiles_by_pk } = await gql.q('query')({
      profiles_by_pk: [
        {
          id: sessionVariables.hasuraProfileId,
        },
        {
          avatar: true,
        },
      ],
    });

    // see if there was a previous avatar so we can delete it after new one is saved
    let previousAvatar: string | undefined = undefined;
    if (profiles_by_pk) {
      previousAvatar = profiles_by_pk.avatar;
    }

    // resize and crop the avatar
    const avatarJpeg = await resizeAvatar(imageBytes);

    // generate a filename for the new avatar
    const fileName = uuidv4() + '.jpg';

    // Uploading files to the bucket
    try {
      await uploadImage(fileName, avatarJpeg);
    } catch (err: any) {
      return res.status(500).json({
        error: '500',
        message: err.message
          ? 'error uploading to s3: ' + err.message
          : 'Unexpected error uploading file',
      });
    }

    // save the new image id in the db
    const mutationResult = await gql.q('mutation')({
      update_profiles_by_pk: [
        {
          _set: { avatar: fileName },
          pk_columns: { id: sessionVariables.hasuraProfileId },
        },
        {
          id: true,
          avatar: true,
          address: true,
        },
      ],
    });

    if (mutationResult.update_profiles_by_pk) {
      if (previousAvatar) {
        //delete the previous file from s3
        await deleteImage(previousAvatar);
      }
      return res.status(200).json({
        profile_id: mutationResult.update_profiles_by_pk.id,
        profile: mutationResult.update_profiles_by_pk,
      });
    }
  } catch (e: any) {
    return res.status(401).json({
      error: '401',
      message: e.message || 'Unexpected error',
    });
  }
}
