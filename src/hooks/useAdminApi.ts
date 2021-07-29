import { useRecoilValue, useSetRecoilState } from 'recoil';

import {
  rSelectedCircleId,
  rMyAddress,
  rCirclesMap,
  rEpochsRaw,
  rUsersMap,
} from 'recoilState';
import { getApiService } from 'services/api';
import { createCircleWithDefaults } from 'utils/modelExtenders';

import { useAsyncLoadCatch } from './useAsyncLoadCatch';

import {
  IApiCircle,
  IUser,
  IApiEpoch,
  PutCirclesParam,
  UpdateUsersParam,
  PostUsersParam,
} from 'types';

export const useAdminApi = (): {
  updateCircle: (params: PutCirclesParam) => Promise<IApiCircle>;
  updateCircleLogo: (newAvatar: File) => Promise<IApiCircle>;
  createEpoch: (startDate: Date, endDate: Date) => Promise<IApiEpoch>;
  deleteEpoch: (id: number) => void;
  updateUser: (userAddress: string, params: UpdateUsersParam) => Promise<IUser>;
  createUser: (params: PostUsersParam) => Promise<IUser>;
  deleteUser: (userAddress: string) => void;
} => {
  const api = getApiService();
  const callWithLoadCatch = useAsyncLoadCatch();

  const updateCirclesMap = useSetRecoilState(rCirclesMap);
  const updateEpochsMap = useSetRecoilState(rEpochsRaw);
  const updateUsersMap = useSetRecoilState(rUsersMap);

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

  const createEpoch = (startDate: Date, endDate: Date) =>
    callWithLoadCatch(
      async () => {
        if (myAddress === undefined) throw 'myAddress required';
        const newEpoch = await api.postEpochs(
          myAddress,
          selectedCircleId,
          startDate,
          endDate
        );

        updateEpochsMap((oldMap) => new Map(oldMap.set(newEpoch.id, newEpoch)));

        return newEpoch;
      },
      { hideLoading: true }
    );

  const deleteEpoch = (epochId: number) =>
    callWithLoadCatch(async () => {
      if (myAddress === undefined) throw 'myAddress required';
      await api.deleteEpochs(myAddress, selectedCircleId, epochId);

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

      updateUsersMap(
        (oldMap) => new Map(oldMap.set(updatedUser.id, updatedUser))
      );

      return updatedUser;
    });

  const createUser = (params: PostUsersParam) =>
    callWithLoadCatch(async () => {
      if (myAddress === undefined) throw 'myAddress required';
      const newUser = await api.postUsers(selectedCircleId, myAddress, params);

      updateUsersMap((oldMap) => new Map(oldMap.set(newUser.id, newUser)));

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

      updateUsersMap(
        (oldMap) => new Map(oldMap.set(deletedUser?.id, deletedUser))
      );
    });

  return {
    updateCircle,
    updateCircleLogo,
    createEpoch,
    deleteEpoch,
    updateUser,
    createUser,
    deleteUser,
  };
};
