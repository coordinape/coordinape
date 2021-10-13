import iti from 'itiriri';
import { selectorFamily } from 'recoil';

import { assertDef } from 'utils/tools';

import { rGifts, rUsersMap } from './appState';

import { IRecoilGetParams } from 'types';

export type IReceivedGiftsByUser = { [account: string]: number | string };

export const rReceivedGiftsByUser = selectorFamily<
  IReceivedGiftsByUser,
  number
>({
  key: 'rReceivedGiftsByUser',
  get: (epochId: number) => ({ get }: IRecoilGetParams) => {
    const usersMap = get(rUsersMap);
    const gifts = get(rGifts).filter((g) => g.epoch_id === epochId);
    const giftsByUser = iti(gifts).toGroups(
      (g) => g.recipient_id,
      (g) => g.tokens
    );
    const totalReceivedByUserMap = iti(giftsByUser.keys()).toMap(
      (userId) =>
        assertDef(
          usersMap.get(userId)?.address,
          'Missing user while generating Merkel Root'
        ),
      (userId) => iti(assertDef(giftsByUser.get(userId))).sum() ?? 0
    );

    const totalReceivedByUser: IReceivedGiftsByUser = {};
    totalReceivedByUserMap.forEach((val, key) => {
      if (val > 0) {
        totalReceivedByUser[key] = val;
      }
    });

    return totalReceivedByUser;
  },
});
