import {
  useRecoilCallback,
  useSetRecoilState,
  CallbackInterface,
} from 'recoil';

import {
  rMyAddress,
  rMyProfile,
  rCirclesMap,
  rSelectedCircle,
  rSelectedMyUser,
  useTriggerProfileReload,
} from 'recoilState';
import { getApiService } from 'services/api';
import { createCircleWithDefaults } from 'utils/modelExtenders';

import { useAsyncLoadCatch } from './useAsyncLoadCatch';

import { CreateCircleParam, PutUsersParam, PostProfileParam } from 'types';

export const useApi = () => {
  const api = getApiService();
  const callWithLoadCatch = useAsyncLoadCatch();

  const updateCirclesMap = useSetRecoilState(rCirclesMap);
  const triggerProfileReload = useTriggerProfileReload();

  const getAddress = useRecoilCallback(
    ({ snapshot }: CallbackInterface) =>
      async () =>
        await snapshot.getPromise(rMyAddress)
  );

  const getProfile = useRecoilCallback(
    ({ snapshot }: CallbackInterface) =>
      async () =>
        await snapshot.getPromise(rMyProfile)
  );

  const getSelectedCircle = useRecoilCallback(
    ({ snapshot }: CallbackInterface) =>
      async () =>
        await snapshot.getPromise(rSelectedCircle)
  );

  const getSelectedMyUser = useRecoilCallback(
    ({ snapshot }: CallbackInterface) =>
      async () =>
        await snapshot.getPromise(rSelectedMyUser)
  );

  const createCircle = (
    params: CreateCircleParam,
    captchaToken: string,
    uxresearchJson: string
  ) =>
    callWithLoadCatch(async () => {
      const myAddress = await getAddress();
      if (myAddress === undefined) throw 'myAddress required';
      const newCircle = await api.createCircle(
        myAddress,
        params,
        captchaToken,
        uxresearchJson
      );

      updateCirclesMap(
        oldMap =>
          new Map(oldMap.set(newCircle.id, createCircleWithDefaults(newCircle)))
      );

      triggerProfileReload();
      await getProfile();

      return newCircle;
    });

  const updateMyUser = async (params: PutUsersParam) =>
    callWithLoadCatch(async () => {
      const selectedCircle = await getSelectedCircle();
      const selectedMyUser = await getSelectedMyUser();
      if (!selectedMyUser || !selectedCircle) {
        throw 'Need to select a circle to update circle user';
      }
      const updatedUser = await api.updateMyUser(
        selectedCircle.id,
        selectedMyUser.address,
        {
          name: selectedMyUser.name,
          bio: selectedMyUser.bio,
          non_receiver: selectedMyUser.non_receiver,
          non_giver: selectedMyUser.non_giver,
          epoch_first_visit: selectedMyUser.epoch_first_visit,
          ...params,
        }
      );

      triggerProfileReload();

      return updatedUser;
    });

  const updateAvatar = async (newAvatar: File) =>
    callWithLoadCatch(async () => {
      const selectedCircle = await getSelectedCircle();
      const selectedMyUser = await getSelectedMyUser();
      if (!selectedMyUser || !selectedCircle) {
        throw 'Need to select a circle to update circle user';
      }
      await api.uploadAvatar(selectedMyUser.address, newAvatar);

      triggerProfileReload();
    });

  const updateBackground = async (newAvatar: File) =>
    callWithLoadCatch(async () => {
      const selectedCircle = await getSelectedCircle();
      const selectedMyUser = await getSelectedMyUser();
      if (!selectedMyUser || !selectedCircle) {
        throw 'Need to select a circle to update circle user';
      }
      await api.uploadBackground(selectedMyUser.address, newAvatar);

      triggerProfileReload();
    });

  const updateMyProfile = async (params: PostProfileParam) =>
    callWithLoadCatch(async () => {
      const selectedMyUser = await getSelectedMyUser();
      if (!selectedMyUser) {
        throw 'Need to select a circle to update circle user';
      }
      const result = await api.updateProfile(selectedMyUser.address, params);

      // TODO: Could we just update with result here?
      triggerProfileReload();
      return result;
    });

  return {
    createCircle,
    updateMyUser,
    updateAvatar,
    updateBackground,
    updateMyProfile,
  };
};
