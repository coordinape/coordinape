import iti from 'itiriri';
import { selectorFamily, useRecoilValue } from 'recoil';

import { rGiftsMap } from './app';

export const rUserGifts = selectorFamily({
  key: 'rUserGifts',
  get:
    (userId: number) =>
    ({ get }) => {
      const sortedGifts = Array.from(get(rGiftsMap).values()).sort(
        ({ id: a }, { id: b }) => a - b
      );
      const giftsFrom = iti(sortedGifts)
        .filter(g => g.sender_id === userId)
        .toArray();
      const giftsFor = iti(sortedGifts)
        .filter(g => g.recipient_id === userId)
        .toArray();
      const fromUserByEpoch = iti(giftsFrom).toGroups(g => g.epoch_id);
      const forUserByEpoch = iti(giftsFor).toGroups(g => g.epoch_id);
      const totalReceivedByEpoch = new Map(
        iti(forUserByEpoch.entries()).map(([epochId, arr]) => [
          epochId,
          iti(arr.map(g => g.tokens)).sum() ?? 0,
        ])
      );
      return {
        fromUser: giftsFrom,
        forUser: giftsFor,
        fromUserByEpoch,
        forUserByEpoch,
        totalReceivedByEpoch,
      };
    },
});

export const useUserGifts = (userId: number) =>
  useRecoilValue(rUserGifts(userId));
