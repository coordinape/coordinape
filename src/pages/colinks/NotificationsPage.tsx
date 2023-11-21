import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { Transaction } from '../../features/colinks/CoLinksHistory';
import { useNotificationCount } from '../../features/notifications/useNotificationCount';
import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { coLinksPaths } from '../../routes/paths';
import { Avatar, Box, Flex, Link, Text, ContentHeader } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

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
  const count = useNotificationCount();

  const { data: notifications } = useQuery(
    ['notifications', 'recent'],
    fetchNotifications
  );

  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Text h2 display>
          {count && count} Notifications
        </Text>
      </ContentHeader>
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
