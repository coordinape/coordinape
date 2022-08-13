import { sumBy, uniqBy } from 'lodash';

import type { Gift } from './queries';

import { IUser } from 'types';

/**
 * Create a map of address > profile_id for all users in either `users` or `gifts`.
 * @param users the epochs active (not deleted) users
 * @param gifts epoch's token_gifts - which includeds all users even deleted ones gift allocations
 */
export function mapProfileIdsByAddress(
  users: IUser[],
  gifts?: Gift[]
): Record<string, number> {
  const ids = {} as Record<string, number>;
  const profileIdsFromGifts = (gifts || []).reduce((ret, g: Gift) => {
    if (!ret[g.recipient_address.toLowerCase()])
      ret[g.recipient_address.toLowerCase()] = g.recipient_id;
    return ret;
  }, ids);

  const profileIdsByAddress = users.reduce((ret, user) => {
    if (user.profile) ret[user.address.toLowerCase()] = user.profile.id;
    return ret;
  }, profileIdsFromGifts);
  return profileIdsByAddress;
}

/**
 * Create a map of deleted users to sum of received tokens.
 */
export function getDeletedStats(token_gifts?: Gift[]): Record<string, number> {
  const deletedGifts = token_gifts?.filter((g: Gift) => !g.recipient);
  const sumDeletedGifts = sumBy(deletedGifts, 'tokens');
  const numDeletedUsers = uniqBy(deletedGifts, 'recipient_id').length;
  return {
    sumTokens: sumDeletedGifts,
    numDeletedUsers: numDeletedUsers,
  };
}
