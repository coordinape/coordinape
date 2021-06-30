import { useRecoilValue, useSetRecoilState } from 'recoil';

import { useConnectedWeb3Context } from 'contexts';
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

import { useAsync } from './useAsync';

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
  // const provider = null;
  const { library: provider } = useConnectedWeb3Context();
  // const asyncCall = (f: any, x: boolean) => new Promise((res) => res(f));
  const asyncCall = useAsync();

  const updateCirclesMap = useSetRecoilState(rCirclesMap);
  const updateEpochsMap = useSetRecoilState(rEpochsMap);
  const updateUsersMap = useSetRecoilState(rUsersMap);

  const myAddress = useRecoilValue(rMyAddress);
  const selectedMyUser = useRecoilValue(rSelectedMyUser);
  const selectedCircleUsers = useRecoilValue(rSelectedCircleUsers);
  const availableTeammates = useRecoilValue(rAvailableTeammates);
  const selectedCircleId = useRecoilValue(rSelectedCircleId);
  const selectedCircle = useRecoilValue(rSelectedCircle);
  const {
    pastEpochs,
    currentEpoch,
    previousEpoch,
    futureEpochs,
  } = useRecoilValue(rCircleEpochsStatus(selectedCircleId));

  const updateCircle = (params: PutCirclesParam) => {
    const call = async () => {
      const newCircle = await getApiService(provider).putCircles(
        selectedCircleId,
        myAddress,
        params
      );

      updateCirclesMap(
        (oldMap) => new Map(oldMap.set(selectedCircleId, newCircle))
      );

      return newCircle;
    };
    return <Promise<ICircle>>asyncCall(call(), true);
  };

  const createEpoch = (startDate: Date, endDate: Date) => {
    const call = async () => {
      const newEpoch = await getApiService(provider).postEpochs(
        myAddress,
        selectedCircleId,
        startDate,
        endDate
      );

      updateEpochsMap((oldMap) => new Map(oldMap.set(newEpoch.id, newEpoch)));

      return newEpoch;
    };
    return <Promise<IEpoch>>asyncCall(call(), true);
  };

  const deleteEpoch = (epochId: number) => {
    const call = async () => {
      await getApiService(provider).deleteEpochs(
        myAddress,
        selectedCircleId,
        epochId
      );

      updateEpochsMap((oldMap) => {
        oldMap.delete(epochId);
        return new Map(oldMap);
      });
    };
    return <Promise<void>>asyncCall(call(), true);
  };

  // What if they add themselves? refresh?
  const updateUser = (userAddress: string, params: UpdateUsersParam) => {
    const call = async () => {
      const updatedUser = await getApiService(provider).updateUsers(
        selectedCircleId,
        myAddress,
        userAddress,
        params
      );

      updateUsersMap(
        (oldMap) => new Map(oldMap.set(updatedUser.id, updatedUser))
      );

      return updatedUser;
    };
    return <Promise<IUser>>asyncCall(call(), true);
  };

  const createUser = (params: PostUsersParam) => {
    const call = async () => {
      const newUser = await getApiService(provider).postUsers(
        selectedCircleId,
        myAddress,
        params
      );

      updateUsersMap((oldMap) => new Map(oldMap.set(newUser.id, newUser)));

      return newUser;
    };
    return <Promise<IUser>>asyncCall(call(), true);
  };

  const deleteUser = (userAddress: string) => {
    const call = async () => {
      if (myAddress === userAddress) {
        throw 'Cannot delete your own address';
      }
      const deletedUser = await getApiService(provider).deleteUsers(
        selectedCircleId,
        myAddress,
        userAddress
      );

      updateUsersMap(
        (oldMap) => new Map(oldMap.set(deletedUser?.id, deletedUser))
      );
    };
    return <Promise<void>>asyncCall(call(), true);
  };

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
