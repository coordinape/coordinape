import { useRecoilValue } from 'recoil';

import { rMyUserGifts, rEpochsMap } from 'recoilState';

import { IEpoch, IUserGift } from 'types';

export const useMyEpochGifts = (
  epochId: number
): {
  userGifts: IUserGift[];
  epoch: IEpoch | undefined;
} => {
  const epoch = useRecoilValue(rEpochsMap).get(epochId);
  const userGifts = useRecoilValue(rMyUserGifts(epochId));

  return {
    userGifts,
    epoch,
  };
};
