import {
  useHasAdminView,
  useSelectedMyUser,
  useMyCircles,
  useSelectedCircle,
  useMyProfile,
} from 'recoilState';
import { getAvatarPath } from 'utils/domain';

export const useMe = () => {
  const selectedMyUser = useSelectedMyUser();
  const hasAdminView = useHasAdminView();
  const selectedCircle = useSelectedCircle();
  const myCircles = useMyCircles();
  const myProfile = useMyProfile();

  return {
    myProfile,
    selectedMyUser,
    selectedCircle,
    myCircles,
    avatarPath: getAvatarPath(myProfile?.avatar),
    backgroundPath: getAvatarPath(
      myProfile?.background,
      '/imgs/background/profile-bg.jpg'
    ),
    hasAdminView,
  };
};
