import {
  useHasAdminView,
  useSelectedMyUser,
  useMyCircles,
  useTriggerProfileReload,
  useSelectedCircle,
  useMyProfile,
} from 'recoilState';
import { getApiService } from 'services/api';
import { getAvatarPath } from 'utils/domain';

import { useAsyncLoadCatch } from './useAsyncLoadCatch';

import { PutUsersParam, PostProfileParam } from 'types';

export const useMe = () => {
  const api = getApiService();
  const callWithLoadCatch = useAsyncLoadCatch();

  const selectedMyUser = useSelectedMyUser();
  const hasAdminView = useHasAdminView();
  const selectedCircle = useSelectedCircle();
  const myCircles = useMyCircles();
  const myProfile = useMyProfile();
  const triggerProfileReload = useTriggerProfileReload();

  const updateMyUser = async (params: PutUsersParam) =>
    callWithLoadCatch(async () => {
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

      triggerProfileReload();
    });

  const updateAvatar = async (newAvatar: File) =>
    callWithLoadCatch(async () => {
      if (!selectedMyUser || !selectedCircle) {
        throw 'Need to select a circle to update circle user';
      }
      await api.uploadAvatar(selectedMyUser.address, newAvatar);

      triggerProfileReload();
    });

  const updateBackground = async (newAvatar: File) =>
    callWithLoadCatch(async () => {
      if (!selectedMyUser || !selectedCircle) {
        throw 'Need to select a circle to update circle user';
      }
      await api.uploadBackground(selectedMyUser.address, newAvatar);

      triggerProfileReload();
    });

  const updateProfile = async (params: PostProfileParam) =>
    callWithLoadCatch(async () => {
      if (!selectedMyUser) {
        throw 'Need to select a circle to update circle user';
      }
      const result = await api.updateProfile(selectedMyUser.address, params);

      // TODO: Could we just update with result here?
      triggerProfileReload();
      return result;
    });

  const refreshMyUser = async () => {
    // Is it possible to use recoilCallback to have loading during this?
    triggerProfileReload();
  };
  return {
    myProfile,
    selectedMyUser,
    selectedCircle,
    myCircles,
    // avatarPath: getAvatarPath(selectedMyUser?.avatar),
    avatarPath: getAvatarPath(myProfile?.avatar),
    backgroundPath: getAvatarPath(
      myProfile?.background,
      '/imgs/background/profile-bg.jpg'
    ),
    hasAdminView,
    updateMyUser,
    updateTeammates,
    updateAvatar,
    updateBackground,
    refreshMyUser,
    updateProfile,
  };
};
