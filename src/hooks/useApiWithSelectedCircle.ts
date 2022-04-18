import * as mutations from 'lib/gql/mutations';

import { useApiBase } from 'hooks';
import { useSelectedCircle } from 'recoilState/app';

import { useRecoilLoadCatch } from './useRecoilLoadCatch';

import { PutUsersParam } from 'types';

// API mutations that need a circle id.
// This could be parameterized like the admin hooks.
export const useApiWithSelectedCircle = () => {
  const { fetchManifest } = useApiBase();
  const { circleId, myUser } = useSelectedCircle();

  const updateMyUser = useRecoilLoadCatch(
    () => async (params: PutUsersParam) => {
      await mutations.updateUser({
        // TODO: this was using the local fields from myUser AND the params, but I have no idea why
        circle_id: circleId,
        ...params,
      });
      await fetchManifest();
    },
    [circleId, myUser]
  );

  return { updateMyUser };
};
