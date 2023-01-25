import { client } from 'lib/gql/client';

import { Awaited } from 'types/shim';

export const getDiscordUserByProfileId = async ({
  profileId,
}: {
  profileId: number;
}) => {
  const { discord_users } = await client.query(
    {
      discord_users: [
        {
          where: {
            profile_id: { _eq: profileId },
          },
        },
        { id: true, user_snowflake: true, profile_id: true },
      ],
    },
    {
      operationName: 'getDiscordUserByProfileId',
    }
  );
  return discord_users;
};

export type DiscordUsers = Awaited<
  ReturnType<typeof getDiscordUserByProfileId>
>;
