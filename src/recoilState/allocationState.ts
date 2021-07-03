import { atomFamily, selectorFamily } from 'recoil';

import { rMyProfile } from './appState';

import { IUser, ISimpleGift, IRecoilGetParams } from 'types';

export const rTeammates = selectorFamily<IUser[], number>({
  key: 'rTeammates',
  get: (circleId: number) => ({ get }: IRecoilGetParams) =>
    get(rMyProfile)?.users?.find((u) => u.circle_id === circleId)?.teammates ??
    [],
});

// These are parameterized by circleId
export const rLocalTeammates = atomFamily<IUser[], number>({
  key: 'rLocalTeammates',
  default: [],
});

export const rLocalGifts = atomFamily<ISimpleGift[], number>({
  key: 'rLocalGifts',
  default: [],
});
