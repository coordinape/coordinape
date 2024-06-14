import { Awaited } from '../../types/shim';

const baseUrl = 'https://api.guild.xyz/v2';

type Guild = {
  id: number;
  name: string;
  urlName: string;
  description: string;
  imageUrl: string;
  memberCount: number;
  admins: GuildAdmin[];
  roles: GuildRole[];
};

type GuildAdmin = {
  guildId: number;
  isOwner: boolean;
  userId: number;
};

type GuildRole = {
  id: number;
  name: string;
  imageUrl: string;
  memberCount: number;
};

export const guildInfoFromAPI = async (guild_id: string | number) => {
  if (typeof guild_id == 'string') {
    guild_id = guild_id.replace(/^https:\/\/guild.xyz\//, '');
    guild_id = guild_id.toLowerCase();
    guild_id = guild_id.replace(' ', '-');
  }
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 10000);
  const guildRes = await fetch(baseUrl + '/guilds/' + guild_id, {
    signal: controller.signal,
  });

  const guild = (await guildRes.json()) as any as Guild;

  const guildAdminRes = await fetch(
    baseUrl + '/guilds/' + guild_id + '/admins/',
    {
      signal: controller.signal,
    }
  );

  const guildAdmins = (await guildAdminRes.json()) as any as GuildAdmin[];

  const guildRolesRes = await fetch(
    baseUrl + '/guilds/' + guild_id + '/roles/',
    {
      signal: controller.signal,
    }
  );

  const guildRoles = (await guildRolesRes.json()) as any as GuildRole[];

  if (guild && guildRoles && guildAdmins) {
    return {
      id: guild.id,
      name: guild.name,
      url_name: guild.urlName,
      description: guild.description,
      image_url: guild.imageUrl,
      member_count: guild.memberCount,
      admin: guildAdmins,
      roles: guildRoles.map(r => ({
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
  const url = baseUrl + '/users/' + address + '/memberships';
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 10000);
  const res = await fetch(url, { signal: controller.signal });
  const memberships = (await res.json()) as any as {
    guildId: number;
    roleIds: number[];
  }[];

  if (Array.isArray(memberships)) {
    const membership = memberships.find(m => m.guildId === guild_id);

    if (membership) {
      // check if they have specific role
      if (role && role != -1) {
        return membership.roleIds.some(roleId => roleId == role);
      }
      // or allow any role
      return true;
    } else {
      return false;
    }
  } else {
    //the user is not found
    return false;
  }
};
