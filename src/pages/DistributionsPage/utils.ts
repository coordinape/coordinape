import { IUser } from 'types';

/**
 * Create a map of address > profile_id for all users in either `users` or `gifts`.
 * @param users the epochs active (not deleted) users
 */
export function mapProfileIdsByAddress(users: IUser[]): Record<string, number> {
  return users.reduce((ret, user) => {
    if (user.profile) ret[user.address.toLowerCase()] = user.profile.id;
    return ret;
  }, {} as Record<string, number>);
}
