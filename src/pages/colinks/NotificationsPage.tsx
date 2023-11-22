/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';

import { useAuthStore } from 'features/auth';
import { DateTime } from 'luxon';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { NavLink } from 'react-router-dom';

import { Transaction } from '../../features/colinks/CoLinksHistory';
import {
  NOTIFICATIONS_COUNT_QUERY_KEY,
  NOTIFICATIONS_QUERY_KEY,
  useNotificationCount,
} from '../../features/notifications/useNotificationCount';
import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { coLinksPaths } from '../../routes/paths';
import { Avatar, Box, Flex, Link, Text, ContentHeader, Button } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';
import isFeatureEnabled from 'config/features';

const fetchNotifications = async () => {
  const { notifications } = await client.query(
    {
      notifications: [
        {
          order_by: [{ id: order_by.desc }],
          limit: 100,
        },
        {
          id: true,
          created_at: true,
          profile: {
            avatar: true,
            name: true,
            address: true,
          },
          actor_profile_public: {
            avatar: true,
            name: true,
            address: true,
          },
          reply: {
            id: true,
            created_at: true,
          },
          link_tx: {
            buy: true,
            tx_hash: true,
            link_amount: true,
            eth_amount: true,
            created_at: true,
            // TODO: remove and refactor
            target_profile: {
              avatar: true,
              name: true,
              address: true,
            },
            holder_profile: {
              avatar: true,
              name: true,
              address: true,
            },
          },
        },
      ],
    },
    {
      operationName: 'notifications',
    }
  );
  return notifications;
};

type Notification = Awaited<ReturnType<typeof fetchNotifications>>[number];

export type Actor = NonNullable<Notification['actor_profile_public']>;
export type Profile = NonNullable<Notification['profile']>;
export type LinkTx = NonNullable<Notification['link_tx']>;
export type Reply = NonNullable<Notification['reply']>;

export const NotificationsPage = () => {
  const { count } = useNotificationCount();

  const profileId = useAuthStore(state => state.profileId);

  const { data: notifications } = useQuery(
    ['notifications', 'recent'],
    fetchNotifications
  );

  const { mutate: markAsUnread } = useMutation(
    async (profileId: number) => {
      await client.mutate(
        {
          update_profiles_by_pk: [
            {
              pk_columns: { id: profileId },
              _set: {
                last_read_notification_id: null,
              },
            },
            {
              id: true,
            },
          ],
        },
        {
          operationName: 'notification__update_last_notification_read',
        }
      );
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries();
        queryClient.invalidateQueries(NOTIFICATIONS_COUNT_QUERY_KEY);
        queryClient.invalidateQueries(NOTIFICATIONS_QUERY_KEY);
        queryClient.invalidateQueries(['notifications']);
        console.log('marked as unread', NOTIFICATIONS_COUNT_QUERY_KEY);
      },
    }
  );
  // wrap this is a useMutation hook
  const { mutate: updateLastNotificationRead } = useMutation(
    async ({
      profileId,
      last_read_id,
    }: {
      profileId: number;
      last_read_id: number;
    }) => {
      return await client.mutate(
        {
          update_profiles_by_pk: [
            {
              pk_columns: { id: profileId },
              _set: {
                last_read_notification_id: last_read_id,
              },
            },
            {
              id: true,
              last_read_notification_id: true,
            },
          ],
        },
        {
          operationName: 'notification__update_last_notification_read',
        }
      );
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(NOTIFICATIONS_COUNT_QUERY_KEY);
        queryClient.invalidateQueries(NOTIFICATIONS_QUERY_KEY);
        queryClient.invalidateQueries(['notifications']);
        console.log('invalidated query', NOTIFICATIONS_COUNT_QUERY_KEY);
      },
    }
  );

  const queryClient = useQueryClient();

  // useEffect(() => {
  //   if (profileId && notifications?.length > 0) {
  //     const last_read_id = notifications[0].id;
  //     updateLastNotificationRead(profileId, last_read_id);
  //   }
  // }, [profileId, notifications]);

  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Text h2 display>
          {count && count} Notifications
        </Text>
      </ContentHeader>
      {profileId && notifications && notifications.length > 0 && (
        <Flex>
          <Button
            inline
            onClick={() => {
              updateLastNotificationRead({
                profileId: profileId,
                last_read_id: notifications[0].id,
              });
            }}
          >
            Mark Notifications as Read
          </Button>
          {isFeatureEnabled('debug') && (
            <Button
              inline
              onClick={() => {
                markAsUnread(profileId);
              }}
            >
              Mark Notifications as UnRead
            </Button>
          )}
        </Flex>
      )}
      <Flex column>
        {notifications?.map(n =>
          // case on types
          n.reply ? (
            <Reply
              key={n.reply.id}
              reply={n.reply}
              actor={n.actor_profile_public}
              profile={n.profile}
            />
          ) : n.link_tx ? (
            <Transaction key={n.link_tx.tx_hash} tx={n.link_tx} />
          ) : null
        )}
      </Flex>
    </SingleColumnLayout>
  );
};

export const Reply = ({
  reply,
  actor,
  profile,
}: {
  reply: Reply;
  actor?: Actor;
  profile: Profile;
}) => {
  return (
    <Flex key={reply.id} css={{ justifyContent: 'flex-start', gap: '$xs' }}>
      <Avatar path={actor?.avatar} name={actor?.name} size="small" />
      <Avatar
        path={profile?.avatar}
        name={profile?.name}
        size="small"
        css={{ ml: '-$md' }}
      />
      <Flex column css={{ pl: '$xs', gap: '$xs' }}>
        <Box css={{ gap: '$xs' }}>
          <Link
            as={NavLink}
            css={{
              display: 'inline',
              alignItems: 'center',
              gap: '$xs',
              mr: '$xs',
            }}
            to={coLinksPaths.profile('FIXME')}
          >
            <Text inline semibold size="small">
              {actor?.name}
            </Text>
          </Link>

          <Text size="small" inline>
            replied to your post
          </Text>

          {/* <Link */}
          {/*   as={NavLink} */}
          {/*   css={{ */}
          {/*     display: 'inline', */}
          {/*     alignItems: 'center', */}
          {/*     gap: '$xs', */}
          {/*     mr: '$xs', */}
          {/*   }} */}
          {/*   to={paths.coLinksProfile(tx.target_profile?.address ?? 'FIXME')} */}
          {/* > */}
          {/*   <Text inline size="small" semibold> */}
          {/*     {tx.target_profile?.name} */}
          {/*   </Text> */}
          {/* </Link> */}

          {/* <Text inline size="small" css={{ mr: '$xs' }}> */}
          {/*   link */}
          {/* </Text> */}
        </Box>
        <Flex css={{ justifyContent: 'flex-start' }}>
          <Text size="xs" color="neutral" css={{}}>
            {DateTime.fromISO(reply.created_at).toLocal().toRelative()}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
