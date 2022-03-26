import * as mutations from 'lib/gql/mutations';

import { useApiBase } from 'hooks';
import { useSelectedCircle } from 'recoilState/app';
import { getApiService } from 'services/api';

import { useRecoilLoadCatch } from './useRecoilLoadCatch';

import { PutUsersParam, NominateUserParam } from 'types';

// API mutations that need a circle id.
// This could be parameterized like the admin hooks.
export const useApiWithSelectedCircle = () => {
  const { fetchManifest, fetchCircle } = useApiBase();
  const { circleId, myUser } = useSelectedCircle();

  const updateMyUser = useRecoilLoadCatch(
    () => async (params: PutUsersParam) => {
      await getApiService().updateMyUser(circleId, {
        name: myUser.name,
        bio: myUser.bio,
        non_receiver: myUser.non_receiver,
        non_giver: myUser.non_giver,
        epoch_first_visit: myUser.epoch_first_visit,
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
      await getApiService().vouchUser(circleId, nominee_id);
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
