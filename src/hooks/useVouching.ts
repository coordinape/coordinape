import { useRecoilValue, useSetRecoilState } from 'recoil';

import { rSelectedCircleId, rMyAddress, rNomineesRaw } from 'recoilState';
import { getApiService } from 'services/api';

import { useAsyncLoadCatch } from './useAsyncLoadCatch';

import { IApiNominee, NominateUserParam } from 'types';

export const useVouching = (): {
  nominateUser: (params: NominateUserParam) => Promise<IApiNominee>;
  vouchUser: (nominee_id: number) => Promise<IApiNominee>;
} => {
  const api = getApiService();
  const callWithLoadCatch = useAsyncLoadCatch();

  const updateNomineesMap = useSetRecoilState(rNomineesRaw);

  // A fake circleId will just return nothing
  const selectedCircleId = useRecoilValue(rSelectedCircleId) ?? -1;
  const myAddress = useRecoilValue(rMyAddress);

  const nominateUser = (params: NominateUserParam) =>
    callWithLoadCatch(
      async () => {
        if (myAddress === undefined) throw 'myAddress required';
        const newNominee = await api.nominateUser(
          selectedCircleId,
          myAddress,
          params
        );

        updateNomineesMap(
          oldMap => new Map(oldMap.set(newNominee.id, newNominee))
        );

        return newNominee;
      },
      { hideLoading: true }
    );

  const vouchUser = (nominee_id: number) =>
    callWithLoadCatch(
      async () => {
        if (myAddress === undefined) throw 'myAddress required';
        const newNominee = await api.vouchUser(
          selectedCircleId,
          myAddress,
          nominee_id
        );

        updateNomineesMap(
          oldMap => new Map(oldMap.set(newNominee.id, newNominee))
        );

        return newNominee;
      },
      { hideLoading: true }
    );

  return {
    nominateUser,
    vouchUser,
  };
};
