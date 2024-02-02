import { Awaited } from '../../types/shim';

const baseUrl = 'https://api.guild.xyz/v1';

type Guild = {
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
};

export const guildInfoFromAPI = async (guild_id: string | number) => {
  if (typeof guild_id == 'string') {
    guild_id = guild_id.replace(/^https:\/\/guild.xyz\//, '');
    guild_id = guild_id.toLowerCase();
    guild_id = guild_id.replace(' ', '-');
  }
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 10000);
  const res = await fetch(baseUrl + '/guild/' + guild_id, {
    signal: controller.signal,
  });

  const guild = (await res.json()) as any as Guild;
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
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 10000);
  const res = await fetch(url, { signal: controller.signal });
  const memberships = (await res.json()) as any as {
    access?: boolean;
    roleId: number;
  }[];

  // check if they have specific role
  if (role && role != -1) {
    return memberships.some(m => m.roleId == role && m.access);
  }
  // or allow any role
  return memberships.some(m => m.access);
};
