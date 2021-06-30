import { useRecoilValue } from 'recoil';

import { rPendingGiftsFor, rSelectedMyUser, rUsersMap } from 'recoilState';

import { ITokenGift, IUser } from 'types';

export const useMyPendingGifts = (): {
  pendingGifts: ITokenGift[];
  usersMap: Map<number, IUser>;
} => {
  const selectedMyUser = useRecoilValue(rSelectedMyUser);
  const usersMap = useRecoilValue(rUsersMap);
  const pendingGifts = useRecoilValue(
    rPendingGiftsFor(selectedMyUser?.id ?? -1)
  );

  return { pendingGifts, usersMap };
};
