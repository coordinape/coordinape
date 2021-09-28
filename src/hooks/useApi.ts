import {
  useRecoilCallback,
  useSetRecoilState,
  CallbackInterface,
} from 'recoil';

import {
  rMyAddress,
  rMyProfile,
  rCirclesMap,
  useTriggerProfileReload,
} from 'recoilState';
import { getApiService } from 'services/api';
import { createCircleWithDefaults } from 'utils/modelExtenders';

import { useAsyncLoadCatch } from './useAsyncLoadCatch';

import { CreateCircleParam } from 'types';

export const useApi = () => {
  const api = getApiService();
  const callWithLoadCatch = useAsyncLoadCatch();

  const updateCirclesMap = useSetRecoilState(rCirclesMap);
  const triggerProfileReload = useTriggerProfileReload();

  const getAddress = useRecoilCallback(
    ({ snapshot }: CallbackInterface) => async () =>
      await snapshot.getPromise(rMyAddress)
  );

  const getProfile = useRecoilCallback(
    ({ snapshot }: CallbackInterface) => async () =>
      await snapshot.getPromise(rMyProfile)
  );

  const createCircle = (
    params: CreateCircleParam,
    hCaptchaToken: string,
    uxresearchJson: string
  ) =>
    callWithLoadCatch(async () => {
      const myAddress = await getAddress();
      if (myAddress === undefined) throw 'myAddress required';
      const newCircle = await api.createCircle(
        myAddress,
        params,
        hCaptchaToken,
        uxresearchJson
      );

      updateCirclesMap(
        (oldMap) =>
          new Map(oldMap.set(newCircle.id, createCircleWithDefaults(newCircle)))
      );

      triggerProfileReload();
      await getProfile();

      return newCircle;
    });

  return {
    createCircle,
  };
};
