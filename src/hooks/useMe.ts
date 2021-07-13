import { useRecoilValue, useRecoilState } from 'recoil';

import {
  rSelectedMyUser,
  rMyCircles,
  rMyProfileStaleSignal,
  rSelectedCircle,
  rMyProfile,
  rHasAdminView,
} from 'recoilState';
import { getApiService } from 'services/api';
import { getAvatarPath } from 'utils/domain';

import { useAsyncLoadCatch } from './useAsyncLoadCatch';

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
  updateBackground: (newBackground: File) => Promise<void>;
  updateProfile: (params: PostProfileParam) => Promise<IProfile>;
} => {
  const api = getApiService();
  const callWithLoadCatch = useAsyncLoadCatch();

  const [myProfileStaleSignal, setMyProfileStaleSignal] = useRecoilState(
    rMyProfileStaleSignal
  );
  const selectedMyUser = useRecoilValue(rSelectedMyUser);
  const hasAdminView = useRecoilValue(rHasAdminView);
  const selectedCircle = useRecoilValue(rSelectedCircle);
  const myCircles = useRecoilValue(rMyCircles);
  const myProfile = useRecoilValue(rMyProfile);

  const updateMyUser = async (params: PutUsersParam) =>
    callWithLoadCatch(async () => {
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
    });

  const updateTeammates = async (teammateIds: number[]) =>
    callWithLoadCatch(async () => {
      if (!selectedMyUser) {
        throw 'Need to select a circle to update circle user';
      }
      await api.postTeammates(
        selectedMyUser.circle_id,
        selectedMyUser.address,
        teammateIds
      );

      setMyProfileStaleSignal(myProfileStaleSignal + 1);
    });

  const updateAvatar = async (newAvatar: File) =>
    callWithLoadCatch(async () => {
      if (!selectedMyUser || !selectedCircle) {
        throw 'Need to select a circle to update circle user';
      }
      await api.uploadAvatar(selectedMyUser.address, newAvatar);

      setMyProfileStaleSignal(myProfileStaleSignal + 1);
    });

  const updateBackground = async (newAvatar: File) =>
    callWithLoadCatch(async () => {
      if (!selectedMyUser || !selectedCircle) {
        throw 'Need to select a circle to update circle user';
      }
      await api.uploadBackground(selectedMyUser.address, newAvatar);

      setMyProfileStaleSignal(myProfileStaleSignal + 1);
    });

  const updateProfile = async (params: PostProfileParam) =>
    callWithLoadCatch(async () => {
      if (!selectedMyUser) {
        throw 'Need to select a circle to update circle user';
      }
      const result = await api.postProfile(selectedMyUser.address, params);

      setMyProfileStaleSignal(myProfileStaleSignal + 1);
      return result;
    });

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
    hasAdminView,
    updateMyUser,
    updateTeammates,
    updateAvatar,
    updateBackground,
    refreshMyUser,
    updateProfile,
  };
};
