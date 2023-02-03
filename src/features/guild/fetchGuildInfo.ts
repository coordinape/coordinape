// for use on the client side

import { guildInfoFromAPI, isGuildMember } from './guild-api';

export const fetchGuildInfo = async (
  guildId: string | number,
  address?: string,
  role?: number
) => {
  const info = await guildInfoFromAPI(guildId);
  let isMember: boolean | undefined;
  if (address) {
    isMember = await isGuildMember(info.id, address, role);
  }
  return { ...info, isMember };
};
