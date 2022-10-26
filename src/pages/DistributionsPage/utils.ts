import { IUser } from 'types';

/**
 * Create a map of address > profile_id for all members in either `members` or `gifts`.
 * @param members the epochs active (not deleted) members
 */
export function mapProfileIdsByAddress(
  members: IUser[]
): Record<string, number> {
  return members.reduce((ret, member) => {
    if (member.profile) ret[member.address.toLowerCase()] = member.profile.id;
    return ret;
  }, {} as Record<string, number>);
}
