/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';

import { ethers } from 'ethers';
import { easAttestUrl } from 'features/eas/eas';
import { DateTime } from 'luxon';
import { Helmet } from 'react-helmet';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';

import { NOTIFICATIONS_COUNT_QUERY_KEY } from '../../features/notifications/useNotificationCount';
import {
  AtSign,
  ExternalLink,
  GemCoOutline,
  Links,
  MessageSquare,
  PaperPlane,
  Smile,
} from '../../icons/__generated';
import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { coLinksPaths } from '../../routes/paths';
import { CSS, skillTextStyle } from '../../stitches.config';
import {
  AppLink,
  Avatar,
  Box,
  ContentHeader,
  Flex,
  Link,
  MarkdownPreview,
  Panel,
  Text,
} from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';
import useProfileId from 'hooks/useProfileId';

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
            id: true,
          },
          reaction: {
            reaction: true,
            activity_id: true,
            created_at: true,
          },
          reply_reaction: {
            reaction: true,
            activity_id: true,
            created_at: true,
            profile_id: true,
            activity: {
              actor_profile_public: {
                id: true,
                name: true,
                address: true,
              },
            },
          },
          mention_reply: {
            id: true,
            created_at: true,
            reply: true,
            activity_id: true,
          },
          mention_post: {
            id: true,
            description: true,
            created_at: true,
            activity: {
              id: true,
            },
          },
          reply: {
            id: true,
            created_at: true,
            reply: true,
            activity_id: true,
            activity: {
              actor_profile_public: {
                id: true,
                name: true,
                avatar: true,
                address: true,
              },
            },
          },
          invited_profile_public: {
            avatar: true,
            name: true,
            address: true,
            id: true,
          },
          give: {
            id: true,
            created_at: true,
            skill: true,
            activity_id: true,
            cast_hash: true,
            warpcast_url: true,
            attestation_uid: true,
            giver_profile_public: {
              avatar: true,
              name: true,
              address: true,
            },
          },
          link_tx: {
            buy: true,
            tx_hash: true,
            link_amount: true,
            eth_amount: true,
            created_at: true,
            holder: true,
            target: true,
            target_profile: {
              avatar: true,
              name: true,
            },
            holder_profile: {
              avatar: true,
              name: true,
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
export type MentionReply = NonNullable<Notification['mention_reply']>;
export type MentionPost = NonNullable<Notification['mention_post']>;
export type Reaction = NonNullable<Notification['reaction']>;
export type ReplyReaction = NonNullable<Notification['reply_reaction']>;
export type Invitee = NonNullable<Notification['invited_profile_public']>;
export type Give = NonNullable<Notification['give']>;

export const NotificationsPage = () => {
  const profileId = useProfileId(true);

  const queryClient = useQueryClient();

  const { data: notifications } = useQuery(
    ['notifications', 'recent'],
    fetchNotifications,
    {
      refetchInterval: 1000 * 30, // 30 seconds
    }
  );

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
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: NOTIFICATIONS_COUNT_QUERY_KEY,
          refetchInactive: true,
          refetchActive: true,
        });
      },
    }
  );

  useEffect(() => {
    if (profileId && notifications && notifications.length > 0) {
      const last_read_id = notifications[0].id;
      const params = { profileId, last_read_id };
      updateLastNotificationRead(params);
    }
  }, [profileId, notifications]);

  return (
    <SingleColumnLayout>
      <Helmet>
        <title>Notifications / CoLinks</title>
      </Helmet>

      <ContentHeader>
        <Text h2 display>
          Notifications
        </Text>
      </ContentHeader>
      <Flex column css={{ gap: '$lg', maxWidth: '$readable' }}>
        {notifications !== undefined && notifications.length === 0 ? (
          <Panel noBorder>No notifications yet</Panel>
        ) : (
          notifications?.map(n => {
            let content;

            {
              /* case on types */
            }
            if (n.reply) {
              content = (
                <Reply
                  reply={n.reply}
                  actor={n.actor_profile_public}
                  threadCreator={n.reply.activity.actor_profile_public}
                  profileId={profileId}
                />
              );
            } else if (n.mention_reply) {
              content = (
                <MentionReply
                  reply={n.mention_reply}
                  actor={n.actor_profile_public}
                />
              );
            } else if (n.mention_post) {
              content = (
                <MentionPost
                  post={n.mention_post}
                  actor={n.actor_profile_public}
                />
              );
            } else if (n.link_tx) {
              content = <LinkTxNotification tx={n.link_tx} />;
            } else if (n.give && n.give.activity_id) {
              content = <ColinksGiveNotification give={n.give} n={n} />;
            } else if (n.give && n.give.cast_hash) {
              content = <ColinksGiveFCNotification give={n.give} n={n} />;
            } else if (n.invited_profile_public) {
              content =
                n.invited_profile_public.id === profileId ? (
                  <InvitedNotification n={n} />
                ) : (
                  <InviteeNotification
                    invitee={n.invited_profile_public}
                    n={n}
                  />
                );
            } else if (n.reaction) {
              content = <ReactionNotification reaction={n.reaction} n={n} />;
            } else if (n.reply_reaction) {
              content = (
                <ReplyReactionNotification
                  reaction={n.reply_reaction}
                  n={n}
                  profileId={profileId}
                />
              );
            }

            return content ? <Flex key={n.id}>{content}</Flex> : null;
          })
        )}
      </Flex>
    </SingleColumnLayout>
  );
};

export const MentionReply = ({
  reply,
  actor,
}: {
  reply: MentionReply;
  actor?: Actor;
}) => {
  return (
    <NotificationItem>
      <Flex key={reply.id} css={{ alignItems: 'flex-start', gap: '$sm' }}>
        <Icon>
          <AtSign size={'lg'} />
        </Icon>
        <Link
          as={NavLink}
          to={coLinksPaths.profilePosts(actor?.address ?? 'FIXME')}
        >
          <Avatar path={actor?.avatar} name={actor?.name} size="small" />
        </Link>
        <Flex column css={{ pl: '$xs', gap: '$xs' }}>
          <Flex css={{ gap: '$xs', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link
              as={NavLink}
              css={{
                display: 'inline',
                alignItems: 'center',
                gap: '$xs',
                mr: '$xs',
              }}
              to={coLinksPaths.profilePosts(actor?.address ?? 'FIXME')}
            >
              <Text inline semibold size="small">
                {actor?.name}
              </Text>
            </Link>

            <Flex
              as={NavLink}
              to={coLinksPaths.post(`${reply.activity_id}`)}
              css={{
                alignItems: 'flex-end',
                color: '$text',
                textDecoration: 'none',
              }}
            >
              {/* TODO: anchor to specific reply in post deep link */}
              <Text size="small">mentioned you in a reply</Text>
              <Text size="xs" color="neutral" css={{ pl: '$sm' }}>
                {DateTime.fromISO(reply.created_at).toLocal().toRelative()}
              </Text>
            </Flex>
          </Flex>
          <Box
            as={NavLink}
            to={coLinksPaths.post(`${reply.activity_id}`)}
            css={{ textDecoration: 'none' }}
          >
            <MarkdownPreview
              asNotification
              source={reply.reply}
            ></MarkdownPreview>
          </Box>
        </Flex>
      </Flex>
    </NotificationItem>
  );
};
export const Reply = ({
  reply,
  actor,
  threadCreator,
  profileId,
}: {
  reply: Reply;
  actor?: Actor;
  threadCreator?: Actor;
  profileId: number;
}) => {
  return (
    <NotificationItem>
      <Flex key={reply.id} css={{ alignItems: 'flex-start', gap: '$sm' }}>
        <Icon>
          <MessageSquare size={'lg'} />
        </Icon>
        <Link
          as={NavLink}
          to={coLinksPaths.profilePosts(actor?.address ?? 'FIXME')}
        >
          <Avatar path={actor?.avatar} name={actor?.name} size="small" />
        </Link>
        <Flex column css={{ pl: '$xs', gap: '$xs' }}>
          <Flex css={{ gap: '$xs', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link
              as={NavLink}
              css={{
                display: 'inline',
                alignItems: 'center',
                gap: '$xs',
                mr: '$xs',
              }}
              to={coLinksPaths.profilePosts(actor?.address ?? 'FIXME')}
            >
              <Text inline semibold size="small">
                {actor?.name}
              </Text>
            </Link>

            <Flex
              as={NavLink}
              to={coLinksPaths.post(`${reply.activity_id}`)}
              css={{
                alignItems: 'flex-end',
                color: '$text',
                textDecoration: 'none',
              }}
            >
              {threadCreator?.id !== profileId ? (
                threadCreator?.id === actor?.id ? (
                  <Text size="small">replied to their post </Text>
                ) : (
                  <Text size="small" css={{ whiteSpace: 'pre' }}>
                    replied to a post by{' '}
                    <Link
                      as={NavLink}
                      css={{
                        display: 'inline',
                        alignItems: 'center',
                        gap: '$xs',
                        mr: '$xs',
                      }}
                      to={coLinksPaths.profilePosts(
                        threadCreator?.address ?? 'FIXME'
                      )}
                    >
                      <Text inline semibold size="small">
                        {threadCreator?.name}
                      </Text>
                    </Link>
                  </Text>
                )
              ) : (
                <Text size="small">replied to your post</Text>
              )}
              <Text size="xs" color="neutral" css={{ pl: '$sm' }}>
                {DateTime.fromISO(reply.created_at).toLocal().toRelative()}
              </Text>
            </Flex>
          </Flex>
          <Box
            as={NavLink}
            to={coLinksPaths.post(`${reply.activity_id}`)}
            css={{ textDecoration: 'none' }}
          >
            <MarkdownPreview
              asNotification
              source={reply.reply}
            ></MarkdownPreview>
          </Box>
        </Flex>
      </Flex>
    </NotificationItem>
  );
};

export const MentionPost = ({
  post,
  actor,
}: {
  post: MentionPost;
  actor?: Actor;
}) => {
  return (
    <NotificationItem>
      <Flex key={post.id} css={{ alignItems: 'flex-start', gap: '$sm' }}>
        <Icon>
          <AtSign size={'lg'} />
        </Icon>
        <Link
          as={NavLink}
          to={coLinksPaths.profilePosts(actor?.address ?? 'FIXME')}
        >
          <Avatar path={actor?.avatar} name={actor?.name} size="small" />
        </Link>
        <Flex column css={{ pl: '$xs', gap: '$xs' }}>
          <Flex css={{ gap: '$xs', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link
              as={NavLink}
              css={{
                display: 'inline',
                alignItems: 'center',
                gap: '$xs',
                mr: '$xs',
              }}
              to={coLinksPaths.profilePosts(actor?.address ?? 'FIXME')}
            >
              <Text inline semibold size="small">
                {actor?.name}
              </Text>
            </Link>

            <Flex
              as={NavLink}
              to={coLinksPaths.post(`${post?.activity?.id}`)}
              css={{
                alignItems: 'flex-end',
                color: '$text',
                textDecoration: 'none',
              }}
            >
              {/* TODO: anchor to specific post in post deep link */}
              <Text size="small">mentioned you in a post</Text>
              <Text size="xs" color="neutral" css={{ pl: '$sm' }}>
                {DateTime.fromISO(post.created_at).toLocal().toRelative()}
              </Text>
            </Flex>
          </Flex>
          <Box
            as={NavLink}
            to={coLinksPaths.post(`${post?.activity?.id}`)}
            css={{ textDecoration: 'none' }}
          >
            <MarkdownPreview
              asNotification
              source={post.description}
            ></MarkdownPreview>
          </Box>
        </Flex>
      </Flex>
    </NotificationItem>
  );
};

export const LinkTxNotification = ({ tx }: { tx: LinkTx }) => {
  return (
    <NotificationItem>
      <Flex key={tx.tx_hash} css={{ alignItems: 'flex-start', gap: '$sm' }}>
        <Icon>
          <Links
            size={'lg'}
            nostroke
            css={{ path: { fill: '$secondaryText' } }}
          />
          {/*<Briefcase size={'lg'} css={{ mt: '-$xs' }} />*/}
        </Icon>
        <Avatar
          path={tx.holder_profile?.avatar || '?'}
          name={tx.holder_profile?.name}
          size="small"
        />
        <Flex column css={{ pl: '$xs', gap: '$xs' }}>
          <Flex css={{ gap: '$xs', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <Link
              as={NavLink}
              css={{
                display: 'inline',
                alignItems: 'center',
                gap: '$xs',
                mr: '$xs',
              }}
              to={coLinksPaths.profileNetwork(tx.holder ?? 'FIXME')}
            >
              <Text inline semibold size="small">
                {tx.holder_profile?.name}
              </Text>
            </Link>

            <Text size="small" inline>
              {tx.buy ? 'bought ' : 'sold '}
            </Text>

            <Text inline size="small" css={{ mr: '$xs' }}>
              {tx.link_amount} of your links
            </Text>
            <Text size="xs" color="neutral">
              {DateTime.fromISO(tx.created_at).toLocal().toRelative()}
            </Text>
          </Flex>
          <Flex css={{ justifyContent: 'flex-start' }}>
            <Text size="xs" semibold color={tx.buy ? 'complete' : 'warning'}>
              {ethers.utils.formatEther(tx.eth_amount)} ETH
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </NotificationItem>
  );
};

export const ReplyReactionNotification = ({
  reaction,
  n,
  profileId,
}: {
  reaction: ReplyReaction;
  n: Notification;
  profileId: number;
}) => {
  const navigate = useNavigate();
  return (
    <NotificationItem>
      <Flex css={{ alignItems: 'center', gap: '$sm' }}>
        <Icon
          onClick={() => navigate(coLinksPaths.post(`${reaction.activity_id}`))}
          pt={'-1px'}
          css={{ cursor: 'pointer' }}
        >
          <Text size={'large'}>{reaction.reaction}</Text>
        </Icon>
        <Avatar
          path={n.actor_profile_public?.avatar}
          name={n.actor_profile_public?.name}
          size="small"
        />
        <Flex column css={{ pl: '$xs', gap: '$xs' }}>
          <Flex css={{ gap: '$xs', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <Link
              as={NavLink}
              css={{
                display: 'inline',
                alignItems: 'center',
                gap: '$xs',
                mr: '$xs',
              }}
              to={coLinksPaths.profilePosts(
                n.actor_profile_public?.address ?? 'FIXME'
              )}
            >
              <Text inline semibold size="small">
                {n.actor_profile_public?.name}
              </Text>
            </Link>

            <Flex
              as={NavLink}
              to={coLinksPaths.post(`${reaction.activity_id}`)}
              css={{
                alignItems: 'flex-end',
                color: '$text',
                textDecoration: 'none',
              }}
            >
              <Text size="small" css={{ whiteSpace: 'pre' }}>
                reacted to your reply on{' '}
              </Text>
              {reaction.activity?.actor_profile_public?.id === profileId ? (
                <Text size="small">your post</Text>
              ) : reaction.activity?.actor_profile_public?.id ===
                reaction.profile_id ? (
                <Text size="small">his post</Text>
              ) : (
                <>
                  <Link
                    as={NavLink}
                    css={{
                      display: 'inline',
                      alignItems: 'center',
                      gap: '$xs',
                      mr: '$xs',
                    }}
                    to={coLinksPaths.profilePosts(
                      reaction.activity?.actor_profile_public?.address ??
                        'FIXME'
                    )}
                  >
                    <Text inline semibold size="small">
                      {reaction.activity?.actor_profile_public?.name}
                    </Text>
                  </Link>
                  <Text size="small" css={{ whiteSpace: 'pre' }}>
                    &apos;s post
                  </Text>
                </>
              )}

              <Text size="xs" color="neutral" css={{ pl: '$sm' }}>
                {DateTime.fromISO(reaction.created_at).toLocal().toRelative()}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </NotificationItem>
  );
};

export const ReactionNotification = ({
  reaction,
  n,
}: {
  reaction: Reaction;
  n: Notification;
}) => {
  const navigate = useNavigate();
  return (
    <NotificationItem>
      <Flex css={{ alignItems: 'center', gap: '$sm' }}>
        <Icon
          onClick={() => navigate(coLinksPaths.post(`${reaction.activity_id}`))}
          pt={'-1px'}
          css={{ cursor: 'pointer' }}
        >
          <Text size={'large'}>{reaction.reaction}</Text>
        </Icon>
        <Avatar
          path={n.actor_profile_public?.avatar}
          name={n.actor_profile_public?.name}
          size="small"
        />
        <Flex column css={{ pl: '$xs', gap: '$xs' }}>
          <Flex css={{ gap: '$xs', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <Link
              as={NavLink}
              css={{
                display: 'inline',
                alignItems: 'center',
                gap: '$xs',
                mr: '$xs',
              }}
              to={coLinksPaths.profilePosts(
                n.actor_profile_public?.address ?? 'FIXME'
              )}
            >
              <Text inline semibold size="small">
                {n.actor_profile_public?.name}
              </Text>
            </Link>

            <Flex
              as={NavLink}
              to={coLinksPaths.post(`${reaction.activity_id}`)}
              css={{
                alignItems: 'flex-end',
                color: '$text',
                textDecoration: 'none',
              }}
            >
              <Text size="small">reacted to your post</Text>
              <Text size="xs" color="neutral" css={{ pl: '$sm' }}>
                {DateTime.fromISO(reaction.created_at).toLocal().toRelative()}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </NotificationItem>
  );
};

export const InviteeNotification = ({
  invitee,
  n,
}: {
  invitee: Invitee;
  n: Notification;
}) => {
  return (
    <NotificationItem>
      <Flex
        css={{ justifyContent: 'flex-start', alignItems: 'center', gap: '$sm' }}
      >
        <Icon>
          <PaperPlane
            size="lg"
            nostroke
            css={{ path: { fill: '$secondaryText' } }}
          />
        </Icon>
        <Avatar path={invitee.avatar} name={invitee.name} size="small" />
        <Flex column css={{ pl: '$xs', gap: '$xs' }}>
          <Flex css={{ gap: '$xs', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <Link
              as={NavLink}
              css={{
                display: 'inline',
                gap: '$xs',
                mr: '$xs',
              }}
              to={coLinksPaths.profileNetwork(invitee.address ?? 'FIXME')}
            >
              <Text inline semibold size="small">
                {invitee.name}
              </Text>
            </Link>

            <Flex
              as={NavLink}
              to={coLinksPaths.profileNetwork(`${invitee.address}`)}
              css={{
                alignItems: 'flex-end',
                color: '$text',
                textDecoration: 'none',
              }}
            >
              <Text size="small">joined from your invite!</Text>
              <Text size="xs" color="neutral" css={{ pl: '$sm' }}>
                {DateTime.fromISO(n.created_at).toLocal().toRelative()}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </NotificationItem>
  );
};

export const InvitedNotification = ({ n }: { n: Notification }) => {
  return (
    <NotificationItem>
      <Flex
        css={{ justifyContent: 'flex-start', alignItems: 'center', gap: '$sm' }}
      >
        <Icon>
          <Smile size={'lg'} css={{ mt: '-$sm' }} />
        </Icon>
        <Avatar
          path={n.actor_profile_public?.avatar}
          name={n.actor_profile_public?.name}
          size="small"
        />
        <Flex column css={{ pl: '$xs', gap: '$xs' }}>
          <Flex css={{ gap: '$xs', alignItems: 'flex-end' }}>
            <Flex
              as={AppLink}
              css={{
                gap: '$xs',
                mr: '$xs',
                flexWrap: 'wrap',
              }}
              to={coLinksPaths.profileNetwork(
                n.actor_profile_public?.address ?? 'FIXME'
              )}
            >
              <Text size="small" color={'default'}>
                you were invited by
              </Text>
              <Text semibold size="small">
                {n.actor_profile_public?.name}
              </Text>
              <Text size="xs" color="neutral" css={{ pl: '$sm' }}>
                {DateTime.fromISO(n.created_at).toLocal().toRelative()}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </NotificationItem>
  );
};

const ColinksGiveNotification = ({
  n,
  give,
}: {
  n: Notification;
  give: Give;
}) => {
  return (
    <NotificationItem>
      <Flex
        css={{ justifyContent: 'flex-start', alignItems: 'center', gap: '$sm' }}
      >
        <Icon>
          <GemCoOutline fa size={'lg'} css={{ mt: '-$sm' }} />
        </Icon>

        <Link
          as={NavLink}
          to={coLinksPaths.profileGive(
            n.actor_profile_public?.address ?? 'FIXME'
          )}
        >
          <Avatar
            path={n.actor_profile_public?.avatar}
            name={n.actor_profile_public?.name}
            size="small"
          />
        </Link>
        <Flex column css={{ pl: '$xs', gap: '$xs' }}>
          <Flex css={{ gap: '$xs', alignItems: 'flex-end' }}>
            <Flex
              css={{
                gap: '$xs',
                mr: '$xs',
                flexWrap: 'wrap',
              }}
            >
              {give.skill && (
                <Link as={NavLink} to={coLinksPaths.exploreSkill(give.skill)}>
                  <Text tag color="complete" size="small" css={{ gap: '$xs' }}>
                    <Text size="small" css={{ fontWeight: 'normal' }}>
                      +1
                    </Text>
                    <GemCoOutline fa size={'md'} />
                    <Text css={skillTextStyle}>{give.skill}</Text>
                  </Text>
                </Link>
              )}
              <Text size="small" color={'default'}>
                from
              </Text>
              <Text semibold size="small">
                <Link
                  as={NavLink}
                  to={coLinksPaths.profileGive(
                    n.actor_profile_public?.address ?? 'FIXME'
                  )}
                >
                  {n.actor_profile_public?.name}
                </Link>
              </Text>
              <Text size="small" color={'default'}>
                on
              </Text>
              <Text size="small">
                <Link as={NavLink} to={coLinksPaths.post(give.activity_id)}>
                  a post
                </Link>
              </Text>
              <EasLink attestation_uid={give.attestation_uid as string} />
              <Text size="xs" color="neutral" css={{ pl: '$sm' }}>
                {DateTime.fromISO(n.created_at).toLocal().toRelative()}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </NotificationItem>
  );
};
const ColinksGiveFCNotification = ({
  n,
  give,
}: {
  n: Notification;
  give: Give;
}) => {
  return (
    <NotificationItem>
      <Flex
        css={{ justifyContent: 'flex-start', alignItems: 'center', gap: '$sm' }}
      >
        <Icon>
          <GemCoOutline fa size={'lg'} css={{ mt: '-$sm' }} />
        </Icon>

        <Flex column css={{ pl: '$xs', gap: '$xs' }}>
          <Flex css={{ gap: '$xs', alignItems: 'flex-end' }}>
            <Link
              href={
                (give.warpcast_url as string) ??
                `https://warpcast.com/~/conversations/${give.cast_hash}`
              }
              target="_blank"
              rel="noreferrer"
            >
              <Flex
                css={{
                  gap: '$xs',
                  mr: '$xs',
                  flexWrap: 'wrap',
                }}
              >
                {give.skill ? (
                  <Link as={NavLink} to={coLinksPaths.exploreSkill(give.skill)}>
                    <Text
                      tag
                      color="complete"
                      size="small"
                      css={{ gap: '$xs' }}
                    >
                      <Text size="small" css={{ fontWeight: 'normal' }}>
                        +1
                      </Text>
                      <GemCoOutline fa size={'md'} />
                      <Text css={skillTextStyle}>{give.skill}</Text>
                    </Text>
                  </Link>
                ) : (
                  <Text size="small" css={{ fontWeight: 'normal' }}>
                    +1 GIVE
                  </Text>
                )}
                <Text size="small" color={'default'}>
                  on Farcaster
                </Text>
                <EasLink attestation_uid={give.attestation_uid as string} />

                <Text size="xs" color="neutral" css={{ pl: '$sm' }}>
                  {DateTime.fromISO(n.created_at).toLocal().toRelative()}
                </Text>
              </Flex>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </NotificationItem>
  );
};

const EasLink = ({ attestation_uid }: { attestation_uid?: string }) => {
  if (!attestation_uid) {
    return null;
  }
  return (
    <Text size="small">
      <Text css={{ mr: '$xs' }}>&mdash;</Text>
      <Link
        href={easAttestUrl(attestation_uid)}
        css={{ display: 'flex', alignItems: 'center' }}
        target="_blank"
        rel="noreferrer"
      >
        view onchain
        <ExternalLink css={{ ml: '$xs' }} />
      </Link>
    </Text>
  );
};

export const NotificationItem = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <Flex css={{ alignItems: 'flex-start', gap: '$sm' }}>{children}</Flex>;
};

const Icon = ({
  children,
  pt = '$sm',
  onClick,
  css,
}: {
  children: React.ReactNode;
  pt?: string;
  onClick?: () => void;
  css?: CSS;
}) => {
  return (
    <Text
      color={'neutral'}
      onClick={onClick}
      css={{
        pt: pt,
        width: '28px',
        height: '28px',
        justifyContent: 'center',
        ...css,
      }}
    >
      {children}
    </Text>
  );
};
