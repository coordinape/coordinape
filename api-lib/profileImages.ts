import { VercelRequest } from '@vercel/node';

import {
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
  uploadImageInput,
} from '../src/lib/zod';

import { gql } from './Gql';

export const userAndImageData = (
  req: VercelRequest
): {
  input: { image_data_base64: string };
  hasuraProfileId: number;
} => {
  const {
    input: { object: input },
    session_variables: sessionVariables,
  } = composeHasuraActionRequestBodyWithSession(
    uploadImageInput,
    HasuraUserSessionVariables
  ).parse(req.body);
  return { input, hasuraProfileId: sessionVariables.hasuraProfileId };
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
    const mutationResult = await gql.q('mutation')({
      update_profiles_by_pk: [
        {
          _set: _set(fileName),
          pk_columns: { id: hasuraProfileId },
        },
        {
          id: true,
        },
      ],
    });

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
  const { profiles_by_pk } = await gql.q('query')({
    profiles_by_pk: [
      {
        id: hasuraProfileId,
      },
      {
        avatar: true,
        background: true,
      },
    ],
  });
  if (!profiles_by_pk) {
    throw `unable to load images for profile ${hasuraProfileId}`;
  }
  return profiles_by_pk;
};
