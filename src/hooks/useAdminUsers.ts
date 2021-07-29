import { useRecoilValue, useSetRecoilState } from 'recoil';

import {
  rSelectedMyUser,
  rSelectedCircleUsers,
  rSelectedCircleUsersWithDeleted,
} from 'recoilState';

import { IUser } from 'types';

export const useAdminUsers = (): {
  me: IUser | undefined;
  visibleUsers: IUser[];
  allUsers: IUser[];
} => {
  const selectedMyUser = useRecoilValue(rSelectedMyUser);
  const visibleUsers = useRecoilValue(rSelectedCircleUsers);
  const allUsers = useRecoilValue(rSelectedCircleUsersWithDeleted);
  return {
    me: selectedMyUser,
    visibleUsers,
    allUsers,
  };
};
