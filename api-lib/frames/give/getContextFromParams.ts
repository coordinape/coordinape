import assert from 'assert';

import { adminClient } from '../../gql/adminClient';
import { NotFoundError } from '../../HttpError';

import { getGive } from './getGive';

export const getContextFromParams = async (params: Record<string, string>) => {
  const giveStr = params.giveId;
  if (!giveStr) {
    throw new NotFoundError('no giveId provided');
  }

  const giveId = Number(giveStr);
  const give = await getGive(giveId);

  const viewerProfileId = params.viewer_profile_id;

  let viewerProfile;

  if (viewerProfileId) {
    viewerProfile = await getViewerProfile(parseInt(viewerProfileId));
  }

  return { give: give, ...(viewerProfile && { viewerProfile }) };
};

const getViewerProfile = async (viewer_id: number) => {
  const { profiles_by_pk } = await adminClient.query(
    {
      profiles_by_pk: [
        {
          id: viewer_id,
        },
        {
          id: true,
          name: true,
          avatar: true,
          cosoul: {
            id: true,
          },
          links: true,
          links_held: true,
        },
      ],
    },
    { operationName: 'frames__getViewerProfile' }
  );

  assert(
    profiles_by_pk,
    'viewer profile not found in frame__getContextFromParams'
  );

  return profiles_by_pk;
};
