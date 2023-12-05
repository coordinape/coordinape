import assert from 'assert';

import { useAuthStore } from '../features/auth';

function useProfileId(required: true): number;
function useProfileId(required?: boolean): number | undefined;
function useProfileId(required = false) {
  const profileId = useAuthStore(state => state.profileId);
  assert(profileId || !required, 'no profileId found');
  return profileId || undefined;
}

export default useProfileId;
