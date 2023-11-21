import { useEffect, useState } from 'react';

import { useAuthStore } from 'features/auth';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import { LoadingModal } from 'components';
import { useToast } from 'hooks';
import { generateCircleApiKey } from 'pages/CircleAdminPage/CircleApi/mutations';
import { givePaths } from 'routes/paths';

import { getDiscordUserByProfileId } from './queries';

type LinkStatus = 'loading' | 'detached' | 'linking' | 'linked';

export const QUERY_KEY_DISCORD_USERS = 'discord-users';

export const DiscordPage = () => {
  const { search } = useLocation();
  const profileId = useAuthStore(state => state.profileId);
  const { showDefault, showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const parameters = new URLSearchParams(search);
  const rowIdParam = parameters.get('id');
  const circleIdParam = parameters.get('circleId');
  const codeParam = parameters.get('code');

  const [linkStatus, setLinkStatus] = useState<LinkStatus>('detached');

  const {
    data: discordUsers,
    isLoading,
    isIdle,
    isRefetching,
    isFetched,
  } = useQuery(
    [QUERY_KEY_DISCORD_USERS, profileId],
    () => getDiscordUserByProfileId({ profileId: profileId as number }),
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
    const linkCircle = async () => {
      if (codeParam || !rowIdParam || !circleIdParam) {
        return;
      }
      const result = await generateCircleApiKey({
        circle_id: Number(circleIdParam),
        name: 'discord-bot',
        read_circle: true,
        update_circle: true,
        read_nominees: true,
        create_vouches: true,
        read_pending_token_gifts: true,
        update_pending_token_gifts: true,
        read_member_profiles: true,
        read_epochs: true,
        read_contributions: true,
        create_contributions: true,
        manage_users: true,
        read_discord: true,
      });

      if (!result?.api_key) {
        throw new Error(
          `An error occurred generating an API key for circle id ${circleIdParam}`
        );
      }

      await linkDiscordCircle({
        token: result.api_key,
        circle_id: Number(circleIdParam),
      });

      showDefault('Your API key was successfully generated!');
      navigate(`/circles/${circleIdParam}/admin`);
      return;
    };

    linkCircle().catch(error => {
      showError(error);
      navigate(`/circles/${circleIdParam}/admin`);
    });
  }, []);

  useEffect(() => {
    const linkUser = async () => {
      if (rowIdParam || circleIdParam) {
        return;
      }

      if (!isFetched) {
        return;
      }

      if (discordUsers?.some(({ profile_id }) => profile_id === profileId)) {
        throw new Error('Your profile is already linked');
      }

      if (!codeParam) {
        throw new Error('Discord code is required');
      }

      setLinkStatus('linking');

      const response = await fetch(
        '/api/discord/oauth?' + new URLSearchParams({ code: codeParam })
      );
      const discordUser = await response.json();
      if (!discordUser || !discordUser.id) {
        throw new Error('An error occurred fetching your discord user');
      }

      await linkDiscordUser({ discord_id: discordUser.id });

      setLinkStatus('linked');

      showSuccess('Your profile was successfully linked!');
      navigate(givePaths.profile('me'));
    };

    linkUser().catch(error => {
      showError(error);
      navigate(givePaths.profile('me'));
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

const linkDiscordCircle = async (payload: {
  circle_id: number;
  token: string;
}): Promise<void> => {
  await client.mutate(
    { linkDiscordCircle: [{ payload }, { id: true }] },
    { operationName: 'linkDiscordCircle' }
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
