import { useRecoilValue, useSetRecoilState } from 'recoil';

import {
  rSelectedCircleId,
  rMyAddress,
  rCirclesMap,
  rEpochsRaw,
  rUsersMapRaw,
} from 'recoilState';
import { getApiService } from 'services/api';
import {
  createCircleWithDefaults,
  updatedUserMapWithoutProfile,
} from 'utils/modelExtenders';

import { useAsyncLoadCatch } from './useAsyncLoadCatch';

import {
  PutCirclesParam,
  UpdateUsersParam,
  PostUsersParam,
  UpdateCreateEpochParam,
} from 'types';

export const useAdminApi = () => {
  const api = getApiService();
  const callWithLoadCatch = useAsyncLoadCatch();

  const updateCirclesMap = useSetRecoilState(rCirclesMap);
  const updateEpochsMap = useSetRecoilState(rEpochsRaw);
  const updateUsersMap = useSetRecoilState(rUsersMapRaw);

  // A fake circleId will just return nothing
  const selectedCircleId = useRecoilValue(rSelectedCircleId) ?? -1;
  const myAddress = useRecoilValue(rMyAddress);

  const updateCircle = (params: PutCirclesParam) =>
    callWithLoadCatch(async () => {
      if (myAddress === undefined) throw 'myAddress required';
      const newCircle = await api.putCircles(
        selectedCircleId,
        myAddress,
        params
      );

      updateCirclesMap(
        (oldMap) =>
          new Map(
            oldMap.set(selectedCircleId, createCircleWithDefaults(newCircle))
          )
      );

      return newCircle;
    });

  const updateCircleLogo = async (newAvatar: File) =>
    callWithLoadCatch(async () => {
      if (myAddress === undefined) throw 'myAddress required';
      const newCircle = await api.uploadCircleLogo(
        selectedCircleId,
        myAddress,
        newAvatar
      );

      updateCirclesMap(
        (oldMap) =>
          new Map(
            oldMap.set(selectedCircleId, createCircleWithDefaults(newCircle))
          )
      );

      return newCircle;
    });

  const createEpoch = (params: UpdateCreateEpochParam) =>
    callWithLoadCatch(
      async () => {
        if (myAddress === undefined) throw 'myAddress required';
        const newEpoch = await api.createEpoch(
          myAddress,
          selectedCircleId,
          params
        );

        updateEpochsMap((oldMap) => new Map(oldMap.set(newEpoch.id, newEpoch)));

        return newEpoch;
      },
      { hideLoading: true }
    );

  const updateEpoch = (epochId: number, params: UpdateCreateEpochParam) =>
    callWithLoadCatch(
      async () => {
        if (myAddress === undefined) throw 'myAddress required';
        const newEpoch = await api.updateEpoch(
          myAddress,
          selectedCircleId,
          epochId,
          params
        );

        updateEpochsMap((oldMap) => new Map(oldMap.set(newEpoch.id, newEpoch)));

        return newEpoch;
      },
      { hideLoading: true }
    );

  const deleteEpoch = (epochId: number) =>
    callWithLoadCatch(async () => {
      if (myAddress === undefined) throw 'myAddress required';
      await api.deleteEpoch(myAddress, selectedCircleId, epochId);

      updateEpochsMap((oldMap) => {
        oldMap.delete(epochId);
        return new Map(oldMap);
      });
    });

  // What if they update themselves? refresh?
  const updateUser = (userAddress: string, params: UpdateUsersParam) =>
    callWithLoadCatch(async () => {
      if (myAddress === undefined) throw 'myAddress required';
      const updatedUser = await api.updateUsers(
        selectedCircleId,
        myAddress,
        userAddress,
        params
      );

      updateUsersMap((oldMap) =>
        updatedUserMapWithoutProfile(updatedUser, oldMap)
      );

      return updatedUser;
    });

  const createUser = (params: PostUsersParam) =>
    callWithLoadCatch(async () => {
      if (myAddress === undefined) throw 'myAddress required';
      const newUser = await api.createUser(selectedCircleId, myAddress, params);

      updateUsersMap((oldMap) => updatedUserMapWithoutProfile(newUser, oldMap));

      return newUser;
    });

  const deleteUser = (userAddress: string) =>
    callWithLoadCatch(async () => {
      if (myAddress === undefined) throw 'myAddress required';
      if (myAddress === userAddress) {
        throw 'Cannot delete your own address';
      }
      const deletedUser = await api.deleteUsers(
        selectedCircleId,
        myAddress,
        userAddress
      );

      updateUsersMap((oldMap) =>
        updatedUserMapWithoutProfile(deletedUser, oldMap)
      );
    });
  const getDiscordWebhook = () =>
    callWithLoadCatch(async () => {
      if (myAddress === undefined) throw 'myAddress required';
      const webhook = await api.getDiscordWebhook(myAddress, selectedCircleId);
      return webhook;
    });

  return {
    updateCircle,
    updateCircleLogo,
    createEpoch,
    updateEpoch,
    deleteEpoch,
    updateUser,
    createUser,
    deleteUser,
    getDiscordWebhook,
  };
};
