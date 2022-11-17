import { useEffect, useState } from 'react';

import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import { LoadingModal } from 'components';
import { useApeSnackbar } from 'hooks';
import { useMyProfile } from 'recoilState';
import { paths } from 'routes/paths';

import { getDiscordUserByProfileId } from './queries';

type LinkStatus = 'loading' | 'detached' | 'linking' | 'linked';

export const QUERY_KEY_DISCORD_USERS = 'discord-users';

export const DiscordPage = () => {
  const { search } = useLocation();
  const { id: profileId } = useMyProfile();
  const { showInfo, showError } = useApeSnackbar();
  const navigate = useNavigate();

  const parameters = new URLSearchParams(search);

  const [linkStatus, setLinkStatus] = useState<LinkStatus>('detached');

  const {
    data: discordUsers,
    isLoading,
    isIdle,
    isRefetching,
    isFetched,
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

  useEffect(() => {
    const linkUser = async () => {
      if (!isFetched) {
        return;
      }

      if (discordUsers?.some(({ profile_id }) => profile_id === profileId)) {
        throw new Error('Your profile is already linked');
      }

      const code = parameters.get('code');
      if (!code) {
        throw new Error('Discord code is required');
      }

      setLinkStatus('linking');

      const response = await fetch(
        '/api/discord/oauth?' + new URLSearchParams({ code })
      );
      const discordUser = await response.json();
      if (!discordUser || !discordUser.id) {
        throw new Error('An error occurred fetching your discord user');
      }

      await linkDiscordUser({ discord_id: discordUser.id });

      setLinkStatus('linked');

      showInfo('Your profile was successfully linked!');
      navigate(paths.profile('me'));
    };

    linkUser().catch(error => {
      showError(error);
      navigate(paths.profile('me'));
    });
  }, [isFetched]);

  return (
    <LoadingModal
      text={getLoadingModalText({
        linkStatus,
        isBusy: isLoading || isIdle || isRefetching,
      })}
      visible={true}
      note="global"
    />
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

const getLoadingModalText = ({
  linkStatus,
  isBusy,
}: {
  linkStatus: LinkStatus;
  isBusy: boolean;
}): string => {
  if (isBusy) return 'Loading...';

  if (linkStatus === 'linking') return 'Linking...';

  if (linkStatus === 'linked') return `Linked`;

  return 'Your profile will be automatically linked';
};

export default DiscordPage;
