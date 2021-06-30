import { atomFamily } from 'recoil';

import { rMyUsers } from './appState';

import { IUser, ISimpleGift } from 'types';

// These are parameterized by circleId
export const rLocalTeammates = atomFamily<IUser[], number>({
  key: 'rLocalTeammates',
  default: [],
});

export const rLocalGifts = atomFamily<ISimpleGift[], number>({
  key: 'rLocalGifts',
  default: [],
});

export const rLocalGiftsInitialized = atomFamily<boolean, number>({
  key: 'rLocalGiftsInitialized',
  default: false,
});
