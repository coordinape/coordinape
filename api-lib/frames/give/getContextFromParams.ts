import { NotFoundError } from '../../HttpError';
import { getViewerProfile } from '../getViewerProfile.ts';

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
