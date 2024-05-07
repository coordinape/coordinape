import { NotFoundError } from '../../HttpError';
import { getViewerProfile } from '../getViewerProfile.ts';

export const getSurpriseContextFromParams = async (
  params: Record<string, string>
) => {
  const username = params.username;
  if (!username) {
    throw new NotFoundError('no username provided');
  }

  const viewerProfileId = params.viewer_profile_id;

  let viewerProfile;

  if (viewerProfileId) {
    viewerProfile = await getViewerProfile(parseInt(viewerProfileId));
  }

  return { username, ...(viewerProfile && { viewerProfile }) };
};
