import fetch from 'node-fetch';

import { Awaited } from '../../types/shim';

const baseUrl = 'https://api.guild.xyz/v1';

export const fetchOptions = { timeout: 10000 };

export const guildInfoFromAPI = async (guild_id: string | number) => {
  if (typeof guild_id == 'string') {
    guild_id = guild_id.replace(/^https:\/\/guild.xyz\//, '');
    guild_id = guild_id.toLowerCase();
    guild_id = guild_id.replace(' ', '-');
  }
  const res = await fetch(baseUrl + '/guild/' + guild_id, fetchOptions);
  const guild: {
    id: number;
    name: string;
    urlName: string;
    description: string;
    imageUrl: string;
    memberCount: number;
    admins: { address: string }[];
    roles: {
      name: string;
      imageUrl: string;
      id: number;
      memberCount: number;
    }[];
  } = await res.json();
  if (guild) {
    return {
      id: guild.id,
      name: guild.name,
      url_name: guild.urlName,
      description: guild.description,
      image_url: guild.imageUrl,
      member_count: guild.memberCount,
      admin: guild.admins,
      roles: guild.roles.map(r => ({
        name: r.name,
        image_url: r.imageUrl,
        id: r.id,
        member_count: r.memberCount,
      })),
    };
  }
  throw new Error(`invalid guild - ${guild_id}`);
};

export type GuildInfo = Awaited<ReturnType<typeof guildInfoFromAPI>>;
export type GuildInfoWithMembership = GuildInfo & { isMember?: boolean };

export const isGuildMember = async (
  guild_id: number,
  address: string,
  role?: number
) => {
  const url = baseUrl + '/guild/access/' + guild_id + '/' + address;
  const res = await fetch(url, fetchOptions);
  const memberships: { access?: boolean; roleId: number }[] = await res.json();
  if (role) {
    return memberships.some(m => m.roleId == role && m.access);
  }
  return memberships.some(m => m.access);
};
