import { VercelRequest } from '@vercel/node';
import { z } from 'zod';

import { adminClient } from './gql/adminClient';
import { getInput } from './handlerHelpers';

const uploadImageInput = z.object({ image_data_base64: z.string() }).strict();

export const userAndImageData = async (
  req: VercelRequest
): Promise<{
  input: { image_data_base64: string };
  hasuraProfileId: number;
}> => {
  const { payload: input, session } = await getInput(req, uploadImageInput);
  return { input, hasuraProfileId: session.hasuraProfileId };
};

export const profileUpdateAvatarMutation = (hasuraProfileId: number) => {
  return profileUpdateImageMutation(hasuraProfileId, (fileName: string) => {
    return { avatar: fileName };
  });
};

export const profileUpdateBackgroundMutation = (hasuraProfileId: number) => {
  return profileUpdateImageMutation(hasuraProfileId, (fileName: string) => {
    return { background: fileName };
  });
};

const profileUpdateImageMutation = (
  hasuraProfileId: number,
  _set: (fileName: string) => { background: string } | { avatar: string }
) => {
  // save the new image id in the db
  return async (fileName: string) => {
    const mutationResult = await adminClient.mutate(
      {
        update_profiles_by_pk: [
          {
            _set: _set(fileName),
            pk_columns: { id: hasuraProfileId },
          },
          {
            id: true,
          },
        ],
      },
      {
        operationName: 'profileUpdateImageMutation',
      }
    );

    if (!mutationResult.update_profiles_by_pk) {
      throw 'profile mutation was not successful';
    }

    return mutationResult.update_profiles_by_pk;
  };
};

export const profileImages = async (
  hasuraProfileId: number
): Promise<{ avatar?: string; background?: string }> => {
  // Figure out if there was a previous avatar, because we'll need to delete it
  const { profiles_by_pk } = await adminClient.query(
    {
      profiles_by_pk: [
        {
          id: hasuraProfileId,
        },
        {
          avatar: true,
          background: true,
        },
      ],
    },
    {
      operationName: 'profileImages',
    }
  );
  if (!profiles_by_pk) {
    throw `unable to load images for profile ${hasuraProfileId}`;
  }
  return profiles_by_pk;
};
