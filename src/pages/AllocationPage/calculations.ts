import iti from 'itiriri';
import isEqual from 'lodash/isEqual';

import { ISimpleGift, ISimpleGiftUser } from '../../types';

/**
 * Updater for gifts, for non-empty gifts and teammates.
 *
 * @param newTeammates - Include these.
 * @param newGifts - Overwrite the existing gifts.
 */
export const calculateGifts =
  (newTeammates: ISimpleGiftUser[], newGifts?: ISimpleGift[]) =>
  (baseGifts: ISimpleGift[]) => {
    const startingGifts = newGifts ?? baseGifts;
    const startingSet = new Set(startingGifts.map(g => g.user.id));
    const newSet = new Set(newTeammates.map(u => u.id));
    const keepers = [] as ISimpleGift[];
    startingGifts.forEach(g => {
      if (newSet.has(g.user.id) || g.note !== '' || g.tokens > 0) {
        keepers.push(g);
      }
    });
    newTeammates.forEach(u => {
      if (!startingSet.has(u.id)) {
        keepers.push({ user: u, tokens: 0, note: '' } as ISimpleGift);
      }
    });
    return keepers;
  };

type TokenNote = [number, string];

export const buildDiffMap = (
  pendingGiftsFrom: { recipient_id: number; tokens: number; note?: string }[],
  localGifts: ISimpleGift[]
) => {
  const remoteMap = new Map<number, TokenNote>(
    pendingGiftsFrom.map(g => [g.recipient_id, [g.tokens, g.note ?? '']])
  );
  const localMap = new Map<number, TokenNote>(
    localGifts.map(g => [g.user.id, [g.tokens, g.note ?? '']])
  );

  const diff = iti(localMap.keys()).reduce<Map<number, TokenNote>>(
    (changes: Map<number, TokenNote>, key: number) => {
      // changes is initialized as remote,
      if (!changes.has(key)) {
        const tn = localMap.get(key) as TokenNote;
        if (tn[0] !== 0 || tn[1] !== '') {
          changes.set(key, tn);
        }
      } else {
        const remote = changes.get(key) as TokenNote;
        const local = localMap.get(key) as TokenNote;
        if (isEqual(remote, local)) {
          changes.delete(key);
        } else {
          changes.set(key, local);
        }
      }
      return changes;
    },
    new Map(remoteMap)
  );

  return diff;
};

export const isLocalGiftsChanged = (
  pendingGiftsFrom: { recipient_id: number; tokens: number; note?: string }[],
  localGifts: ISimpleGift[]
): boolean => {
  return buildDiffMap(pendingGiftsFrom, localGifts).size > 0;
};
