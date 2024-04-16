import { NotFoundError } from '../../HttpError';
import { getViewerProfile } from '../getViewerProfile.ts';

export const getContextFromParams = async (params: Record<string, string>) => {
  const skill = params.skill;
  if (!skill) {
    throw new NotFoundError('no skill provided');
  }

  const viewerProfileId = params.viewer_profile_id;

  let viewerProfile;

  if (viewerProfileId) {
    viewerProfile = await getViewerProfile(parseInt(viewerProfileId));
  }

  return { skill, ...(viewerProfile && { viewerProfile }) };
};
