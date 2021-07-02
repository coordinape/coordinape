import { atomFamily, selector } from 'recoil';

import { rMyProfile } from './appState';

import { IUser, ISimpleGift, IRecoilGetParams } from 'types';

// These are parameterized by circleId
export const rLocalTeammates = atomFamily<IUser[], number>({
  key: 'rLocalTeammates',
  default: (circleId: number) =>
    selector<IUser[]>({
      key: 'rLocalTeammates/Default',
      get: ({ get }: IRecoilGetParams) => {
        const myProfile = get(rMyProfile);
        return (
          myProfile?.users?.find((u) => u.circle_id === circleId)?.teammates ??
          []
        );
      },
    }),
});

export const rLocalGifts = atomFamily<ISimpleGift[], number>({
  key: 'rLocalGifts',
  default: [],
});

export const rLocalGiftsInitialized = atomFamily<boolean, number>({
  key: 'rLocalGiftsInitialized',
  default: false,
});
