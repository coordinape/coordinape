import { useRecoilValue, useRecoilState } from 'recoil';

import {
  rSelectedMyUser,
  rMyCircles,
  rMyProfileStaleSignal,
  rSelectedCircle,
  rMyProfile,
} from 'recoilState';
import { getApiService } from 'services/api';
import { getAvatarPath } from 'utils/domain';

import { useAsync } from './useAsync';

import {
  IUser,
  ICircle,
  PutUsersParam,
  IProfile,
  PostProfileParam,
} from 'types';

export const useMe = (): {
  myProfile: IProfile | undefined;
  selectedMyUser: IUser | undefined;
  selectedCircle: ICircle | undefined;
  myCircles: ICircle[];
  avatarPath: string;
  backgroundPath: string;
  hasAdminView: boolean;
  refreshMyUser: () => Promise<void>;
  updateMyUser: (params: PutUsersParam) => Promise<IUser>;
  updateTeammates: (teammateIds: number[]) => Promise<void>;
  updateAvatar: (newAvatar: File) => Promise<void>;
  updateProfile: (params: PostProfileParam) => Promise<IProfile>;
} => {
  const api = getApiService();
  const asyncCall = useAsync();

  const [myProfileStaleSignal, setMyProfileStaleSignal] = useRecoilState(
    rMyProfileStaleSignal
  );
  const selectedMyUser = useRecoilValue(rSelectedMyUser);
  const selectedCircle = useRecoilValue(rSelectedCircle);
  const myCircles = useRecoilValue(rMyCircles);
  const myProfile = useRecoilValue(rMyProfile);

  const updateMyUser = async (params: PutUsersParam) => {
    const call = async () => {
      if (!selectedMyUser || !selectedCircle) {
        throw 'Need to select a circle to update circle user';
      }
      const updatedUser = await api.putUsers(
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

      setMyProfileStaleSignal(myProfileStaleSignal + 1);

      return updatedUser;
    };
    return <Promise<IUser>>asyncCall(call(), true);
  };

  const updateTeammates = async (teammateIds: number[]) => {
    const call = async () => {
      if (!selectedMyUser) {
        throw 'Need to select a circle to update circle user';
      }
      const result = await api.postTeammates(
        selectedMyUser.circle_id,
        selectedMyUser.address,
        teammateIds
      );

      console.log('updateTeammates result: ', result);
      setMyProfileStaleSignal(myProfileStaleSignal + 1);
    };
    return <Promise<void>>asyncCall(call(), true);
  };

  const updateAvatar = async (newAvatar: File) => {
    const call = async () => {
      if (!selectedMyUser || !selectedCircle) {
        throw 'Need to select a circle to update circle user';
      }
      const result = await api.postUploadImage(
        selectedCircle.id,
        selectedMyUser.address,
        newAvatar
      );

      console.log('updateAvatar result: ', result);
      setMyProfileStaleSignal(myProfileStaleSignal + 1);
    };
    return <Promise<void>>asyncCall(call(), true);
  };

  // TODO: I haven't tested this yet
  const updateProfile = async (params: PostProfileParam) => {
    const call = async () => {
      if (!selectedMyUser) {
        throw 'Need to select a circle to update circle user';
      }
      const result = await api.postProfile(selectedMyUser.address, params);

      setMyProfileStaleSignal(myProfileStaleSignal + 1);
      return result;
    };
    return <Promise<IProfile>>asyncCall(call(), true);
  };

  const refreshMyUser = async () => {
    // Is it possible to use recoilCallback to have loading during this?
    setMyProfileStaleSignal(myProfileStaleSignal + 1);
  };

  return {
    myProfile,
    selectedMyUser,
    selectedCircle,
    myCircles,
    // avatarPath: getAvatarPath(selectedMyUser?.avatar),
    avatarPath: getAvatarPath(myProfile?.avatar),
    backgroundPath: getAvatarPath(myProfile?.background),
    hasAdminView: myProfile?.users?.some((u) => u.admin_view > 0) ?? false,
    updateMyUser,
    updateTeammates,
    updateAvatar,
    refreshMyUser,
    updateProfile,
  };
};
