import * as mutations from 'lib/gql/mutations';

import { useApiBase } from 'hooks';
import { useSelectedCircle } from 'recoilState/app';

import { useRecoilLoadCatch } from './useRecoilLoadCatch';

import { PutUsersParam, NominateUserParam } from 'types';

// API mutations that need a circle id.
// This could be parameterized like the admin hooks.
export const useApiWithSelectedCircle = () => {
  const { fetchManifest, fetchCircle } = useApiBase();
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

  const nominateUser = useRecoilLoadCatch(
    () => async (params: NominateUserParam) => {
      await mutations.createNominee(circleId, params);
      await fetchCircle({ circleId: circleId });
    },
    [circleId]
  );

  const vouchUser = useRecoilLoadCatch(
    () => async (nominee_id: number) => {
      await mutations.vouchUser(nominee_id);
      await fetchCircle({ circleId: circleId });
    },
    [circleId],
    { hideLoading: true }
  );

  return {
    updateMyUser,
    nominateUser,
    vouchUser,
  };
};
