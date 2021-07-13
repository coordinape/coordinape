import { useRecoilValue, useSetRecoilState } from 'recoil';

import {
  rSelectedCircleId,
  rCircleEpochsStatus,
  rSelectedMyUser,
  rSelectedCircleUsers,
  rSelectedCircle,
  rMyAddress,
  rCirclesMap,
  rEpochsMap,
  rUsersMap,
  rAvailableTeammates,
} from 'recoilState';
import { getApiService } from 'services/api';

import { useAsyncLoadCatch } from './useAsyncLoadCatch';

import {
  ICircle,
  IUser,
  IEpoch,
  PutCirclesParam,
  UpdateUsersParam,
  PostUsersParam,
} from 'types';

// TODO: Break these up into a few hooks to encapsulate and reduce renders.
export const useUserInfo = (): {
  circle: ICircle | undefined;
  pastEpochs: IEpoch[]; // Past Epochs
  epoch: IEpoch | undefined; // Current or Last Epoch
  epochs: IEpoch[]; // Upcoming Epochs
  me: IUser | undefined;
  allUsers: IUser[];
  availableTeammates: IUser[];

  updateCircle: (params: PutCirclesParam) => Promise<ICircle>;
  createEpoch: (startDate: Date, endDate: Date) => Promise<IEpoch>;
  deleteEpoch: (id: number) => void;
  updateUser: (userAddress: string, params: UpdateUsersParam) => Promise<IUser>;
  createUser: (params: PostUsersParam) => Promise<IUser>;
  deleteUser: (userAddress: string) => void;
} => {
  const api = getApiService();
  const callWithLoadCatch = useAsyncLoadCatch();

  const updateCirclesMap = useSetRecoilState(rCirclesMap);
  const updateEpochsMap = useSetRecoilState(rEpochsMap);
  const updateUsersMap = useSetRecoilState(rUsersMap);

  const myAddress = useRecoilValue(rMyAddress);
  const selectedMyUser = useRecoilValue(rSelectedMyUser);
  const selectedCircleUsers = useRecoilValue(rSelectedCircleUsers);
  const availableTeammates = useRecoilValue(rAvailableTeammates);
  // A fake circleId will just return nothing
  const selectedCircleId = useRecoilValue(rSelectedCircleId) ?? -1;
  const selectedCircle = useRecoilValue(rSelectedCircle);
  const {
    pastEpochs,
    currentEpoch,
    previousEpoch,
    futureEpochs,
  } = useRecoilValue(rCircleEpochsStatus(selectedCircleId));

  const updateCircle = (params: PutCirclesParam) =>
    callWithLoadCatch(async () => {
      if (myAddress === undefined) throw 'myAddress required';
      const newCircle = await api.putCircles(
        selectedCircleId,
        myAddress,
        params
      );

      updateCirclesMap(
        (oldMap) => new Map(oldMap.set(selectedCircleId, newCircle))
      );

      return newCircle;
    });

  const createEpoch = (startDate: Date, endDate: Date) =>
    callWithLoadCatch(async () => {
      if (myAddress === undefined) throw 'myAddress required';
      const newEpoch = await api.postEpochs(
        myAddress,
        selectedCircleId,
        startDate,
        endDate
      );

      updateEpochsMap((oldMap) => new Map(oldMap.set(newEpoch.id, newEpoch)));

      return newEpoch;
    }, true);

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
    circle: selectedCircle,
    pastEpochs,
    epoch: currentEpoch ?? previousEpoch,
    epochs: futureEpochs,
    me: selectedMyUser,
    allUsers: selectedCircleUsers,
    availableTeammates: availableTeammates,
    updateCircle,
    createEpoch,
    deleteEpoch,
    updateUser,
    createUser,
    deleteUser,
  };
};
