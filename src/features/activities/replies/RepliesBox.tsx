import { Dispatch } from 'react';

import { useAuthStore } from 'features/auth';
import { order_by as anon_order_by } from 'lib/anongql/__generated__/zeus';
import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { DateTime } from 'luxon';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { NavLink } from 'react-router-dom';

import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { Trash2 } from '../../../icons/__generated';
import { anonClient } from '../../../lib/anongql/anonClient';
import { coLinksPaths } from '../../../routes/paths';
import { Flex, HR, IconButton, MarkdownPreview } from '../../../ui';
import { ActivityAvatar } from '../ActivityAvatar';
import { ConfirmationModal } from 'components/ConfirmationModal';
import { Text } from 'ui';

import { ReplyForm } from './ReplyForm';
import { ReplyReactionBar } from './ReplyReactionBar';

export const QUERY_KEY_REPLIES = 'query-key-replies';

const fetchReplies = async (anon: boolean, activityId: number) => {
  if (anon) {
    return await fetchAnonReplies(activityId);
  } else {
    return await fetchAuthedReplies(activityId);
  }
};

const fetchAnonReplies = async (activityId: number) => {
  const { replies } = await anonClient.query(
    {
      replies: [
        {
          where: { activity_id: { _eq: activityId } },
          order_by: [{ created_at: anon_order_by.asc }],
        },
        {
          id: true,
          reply: true,
          updated_at: true,
          reactions: [
            {},
            {
              id: true,
              reaction: true,
              profile_public: {
                name: true,
                id: true,
              },
            },
          ],
          profile_public: {
            id: true,
            name: true,
            address: true,
            avatar: true,
            cosoul: {
              id: true,
            },
          },
        },
      ],
    },
    {
      operationName: 'fetchReplies',
    }
  );
  return replies;
};

const fetchAuthedReplies = async (activityId: number) => {
  const { replies } = await client.query(
    {
      replies: [
        {
          where: { activity_id: { _eq: activityId } },
          order_by: [{ created_at: order_by.asc }],
        },
        {
          id: true,
          reply: true,
          updated_at: true,
          reactions: [
            {},
            {
              id: true,
              reaction: true,
              profile_public: {
                name: true,
                id: true,
              },
            },
          ],
          profile_public: {
            id: true,
            name: true,
            address: true,
            avatar: true,
            cosoul: {
              id: true,
            },
          },
        },
      ],
    },
    {
      operationName: 'fetchReplies',
    }
  );
  return replies;
};

export type Reply = Awaited<ReturnType<typeof fetchReplies>>[number];
type ValidReply = Required<Reply> & {
  profile_public: {
    name: string;
    address: string;
  };
};

export const RepliesBox = ({
  activityId,
  activityActorId,
  setEditingReply,
}: {
  activityId: number;
  activityActorId: number;
  setEditingReply?: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const profileId = useAuthStore(state => state.profileId);

  const queryClient = useQueryClient();

  const IsValidReply = (r: Reply): r is ValidReply => {
    return !!r.profile_public?.name && !!r.profile_public?.address;
  };
  const { data: replies } = useQuery(
    [QUERY_KEY_REPLIES, activityId],
    async () => {
      const resp = await fetchReplies(!profileId, activityId);
      return resp.filter(IsValidReply);
    }
  );

  const { mutate: deleteReply } = useMutation(
    async (replyId: number) => {
      await client.mutate(
        {
          update_replies_by_pk: [
            {
              pk_columns: { id: replyId },
              _set: { deleted_at: 'now()' },
            },
            {
              id: true,
              deleted_at: true,
            },
          ],
        },
        {
          operationName: 'deleteReply',
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEY_REPLIES);
      },
    }
  );

  return (
    <>
      <HR />
      <Flex column css={{ gap: '$md' }}>
        {replies === undefined && (
          <LoadingIndicator
            css={{
              position: 'absolute',
              left: `calc(50% - 28px)`,
              top: `calc(50% - 48px)`,
              zIndex: 1,
            }}
          />
        )}
        {replies !== undefined &&
          replies.map(reply => (
            <Flex key={reply.id} column>
              <Flex
                css={{
                  gap: '$md',
                  '@sm': {
                    gap: '$sm',
                  },
                }}
              >
                <ActivityAvatar profile={reply.profile_public} size="small" />
                <Flex column css={{ flex: 1, gap: '$xs' }}>
                  <Flex css={{ justifyContent: 'space-between' }}>
                    <Flex css={{ flexWrap: 'wrap', gap: '$sm' }}>
                      <Text
                        as={NavLink}
                        to={coLinksPaths.profilePosts(
                          reply.profile_public.address
                        )}
                        css={{ textDecoration: 'none' }}
                        semibold
                      >
                        {reply.profile_public.name}
                      </Text>
                      <Text size="small" css={{ color: '$neutral' }}>
                        {DateTime.fromISO(reply.updated_at).toRelative()}
                      </Text>
                    </Flex>
                    {reply.profile_public?.id === profileId && (
                      <Flex>
                        <ConfirmationModal
                          trigger={
                            <IconButton>
                              <Trash2 />
                            </IconButton>
                          }
                          action={() => deleteReply(reply.id)}
                          description="Are you sure you want to delete this reply?"
                          yesText="Yes, delete it!"
                        />
                      </Flex>
                    )}
                  </Flex>
                  <MarkdownPreview
                    key={reply.id}
                    render
                    source={reply.reply}
                    css={{ cursor: 'auto', mt: '0' }}
                  />
                  <ReplyReactionBar
                    activityId={activityId}
                    replyId={reply.id}
                    reactions={reply.reactions}
                    drawer={false}
                  />
                </Flex>
              </Flex>
            </Flex>
          ))}
        <ReplyForm
          activityId={activityId}
          activityActorId={activityActorId}
          setEditingReply={setEditingReply}
        />
      </Flex>
    </>
  );
};
