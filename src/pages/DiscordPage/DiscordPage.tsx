import { useState } from 'react';

import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';

import { useMyProfile } from 'recoilState';
import { Box, Button, CenteredBox, Flex, Text } from 'ui';

import { getDiscordUserByProfileId } from './queries';

type LinkStatus = 'loading' | 'detached' | 'linking' | 'linked';

export const QUERY_KEY_DISCORD_USERS = 'discord-users';

export const DiscordPage = () => {
  const { search } = useLocation();
  const { id: profileId } = useMyProfile();

  const parameters = new URLSearchParams(search);

  const [linkStatus, setLinkStatus] = useState<LinkStatus>('detached');

  const {
    data: discordUsers,
    isLoading,
    isIdle,
    isRefetching,
  } = useQuery(
    [QUERY_KEY_DISCORD_USERS, profileId],
    () => getDiscordUserByProfileId({ profileId }),
    {
      enabled: !!profileId,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      onSuccess: discordUsers => {
        if (Array.isArray(discordUsers) && discordUsers.length) {
          setLinkStatus('linked');
        }
      },
    }
  );

  const handleLinkDiscordUser = async () => {
    try {
      setLinkStatus('linking');
      const code = parameters.get('code');
      if (!code) {
        throw new Error('Discord code is required');
      }

      const response = await fetch(
        '/api/discord/oauth?' + new URLSearchParams({ code })
      );
      const discordUser = await response.json();
      await linkDiscordUser({ discord_id: discordUser.id });

      setLinkStatus('linked');
    } catch (error) {
      setLinkStatus('detached');
      console.error('handleLinkDiscordUser', error);
    }
  };

  return (
    <CenteredBox>
      <Text h1 css={{ justifyContent: 'center' }}>
        Link Coordinape &harr; Discord
      </Text>
      <Box css={{ pt: '$md', color: '$text' }}>
        {`Clicking the button below will link coordinape to discord`}
      </Box>
      <Flex css={{ justifyContent: 'center', mt: '$md' }}>
        <Button
          size="large"
          color="primary"
          disabled={linkStatus !== 'detached'}
          onClick={handleLinkDiscordUser}
        >
          {getLinkStatusLabel({
            linkStatus,
            isBusy: isLoading || isIdle || isRefetching,
            discordId: discordUsers?.[0]?.user_snowflake,
          })}
        </Button>
      </Flex>
    </CenteredBox>
  );
};

const linkDiscordUser = async (payload: {
  discord_id: string;
}): Promise<void> => {
  await client.mutate(
    { linkDiscordUser: [{ payload }, { id: true }] },
    { operationName: 'linkDiscordUser' }
  );
};

const getLinkStatusLabel = ({
  linkStatus,
  isBusy,
  discordId,
}: {
  linkStatus: LinkStatus;
  isBusy: boolean;
  discordId?: string;
}): string => {
  if (isBusy) {
    return 'Loading...';
  }

  if (linkStatus === 'linking') {
    return 'Linking';
  }

  if (linkStatus === 'linked') {
    return discordId ? `Linked #${discordId}` : `Linked`;
  }

  return 'Link';
};

export default DiscordPage;
