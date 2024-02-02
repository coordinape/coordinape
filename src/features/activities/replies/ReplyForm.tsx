import assert from 'assert';
import { Dispatch, useEffect, useState } from 'react';

import { MentionsTextArea } from 'features/colinks/MentionsTextArea';
import { ValueTypes } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { useController, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import type { CSS } from 'stitches.config';

import { useToast } from '../../../hooks';
import { useAuthStore } from '../../auth';
import { MarkdownGuide } from 'components/MarkdownGuide';
import { Box, Button, Flex, MarkdownPreview, Text } from 'ui';

import { QUERY_KEY_REPLIES } from './RepliesBox';

export const CONT_DEFAULT_HELP_TEXT =
  'Let your team know what you have been doing.';
export const EXTERNAL_URL_MARKDOWN_DOCS = 'https://github.github.com/gfm/';

export const ReplyForm = ({
  activityId,
  activityActorId,
  reply,
  css,
  setEditingReply,
}: {
  activityId: number;
  activityActorId: number;
  reply?: any;
  setEditingReply?: Dispatch<React.SetStateAction<boolean>>;
  setEditingContribution?: Dispatch<React.SetStateAction<boolean>>;
  css?: CSS;
}) => {
  const profileId = useAuthStore(state => state.profileId);

  const [showMarkdown, setShowMarkDown] = useState<boolean>(false);

  const { showError } = useToast();

  const queryClient = useQueryClient();

  const { data: imMuted } = useQuery(
    ['imMuted', activityActorId, profileId],
    async () => {
      const { mutes_by_pk } = await client.query(
        {
          mutes_by_pk: [
            {
              profile_id: activityActorId,
              target_profile_id: profileId ?? -1,
            },
            {
              profile_id: true,
              target_profile_id: true,
            },
          ],
        },
        {
          operationName: 'fetchReplyImMuted',
        }
      );
      return !!mutes_by_pk;
    },
    {
      enabled: !!profileId,
    }
  );

  const { control, resetField, setValue } = useForm({
    mode: 'all',
  });

  const { field: descriptionField } = useController({
    name: 'description',
    defaultValue: '',
    control,
  });

  const { mutate: createReply, isLoading } = useMutation(createReplyMutation, {
    onError: errors => {
      showError(errors);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_REPLIES, activityId],
      });
      resetField('description');
      setValue('description', '');
      // NOTE: we let the websocket subscription invalidate the contribution cache
    },
  });

  const saveReply = (r: string) => {
    if (reply?.id) {
      // eslint-disable-next-line no-console
      console.log('TODO: imlement mutate');
      // mutateReply({ id: replyId, reply: reply });
    } else {
      createReply({
        activity_id: activityId,
        activity_actor_id: activityActorId,
        reply: r,
      });
      setEditingReply && setEditingReply(false);
      removeReplyStorage();
    }
  };

  const setReplyStorage = (value: string) => {
    sessionStorage.setItem(replyStorageKey(), value);
  };

  const getReplyStorage = () => {
    return sessionStorage.getItem(replyStorageKey());
  };

  const removeReplyStorage = () => {
    sessionStorage.removeItem(replyStorageKey());
  };

  const replyStorageKey = () => {
    return `colinks.Replies.pending.${activityId}`;
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue('description', e.target.value);
    setReplyStorage(e.target.value);
  };

  useEffect(() => {
    const replyStorage = getReplyStorage();
    if (replyStorage) {
      setValue('description', replyStorage);
    }
  }, []);

  if (imMuted) {
    return (
      <Text tag color="warning">
        {`You are muted - you can't post replies.`}
      </Text>
    );
  }
  return (
    <>
      <Flex column css={{ width: '100%', position: 'relative' }}>
        <Flex column alignItems="end" css={{ ...css, gap: '$sm' }}>
          {showMarkdown ? (
            <Box
              tabIndex={0}
              css={{ borderRadius: '$3', width: '100%' }}
              onClick={() => setShowMarkDown(false)}
              onKeyDown={e => {
                e.stopPropagation();
                if (e.key === 'Enter' || e.key === ' ') {
                  setShowMarkDown(false);
                }
              }}
            >
              <MarkdownPreview source={descriptionField.value} />
            </Box>
          ) : (
            <Box css={{ position: 'relative', width: '100%' }}>
              <MentionsTextArea
                onChange={onChange}
                value={descriptionField.value as string}
                placeholder="Leave a reply"
                onKeyDown={e => {
                  e.stopPropagation();
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    saveReply(descriptionField.value);
                    e.preventDefault();
                  }
                }}
              />
              {/* <FormInputField
                id="description"
                name="description"
                control={control}
                css={{
                  textarea: {
                    resize: 'vertical',
                    pb: '$xl',
                    minHeight: 'calc($2xl * 2)',
                  },
                }}
                defaultValue={reply?.reply}
                areaProps={{
                  autoFocus: true,
                  onChange: e => {
                    setValue('description', e.target.value);
                    if (e.target.value.length > 0) {
                      setEditingReply && setEditingReply(true);
                    } else {
                      setEditingReply && setEditingReply(false);
                    }
                  },
                  onFocus: e => {
                    e.currentTarget.setSelectionRange(
                      e.currentTarget.value.length,
                      e.currentTarget.value.length
                    );
                  },
                  onKeyDown: e => {
                    e.stopPropagation();
                    // if (e.key === 'Escape') {
                    //   cancelEditing();
                    // }
                  },
                }}
                placeholder="Leave a reply"
                textArea
              /> */}
              <MarkdownGuide />
            </Box>
          )}
          <Flex
            css={{
              justifyContent: 'flex-end',
              flexDirection: reply ? 'row-reverse' : 'row',
              gap: '$sm',
              mt: '$xs',
            }}
          >
            <Button
              color="cta"
              onClick={() => {
                saveReply(descriptionField.value);
              }}
              disabled={!descriptionField.value || isLoading}
            >
              {reply ? 'Save ' : 'Add '}
              Reply
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

const createReplyMutation = async (
  object: ValueTypes['replies_insert_input']
) => {
  const { insert_replies_one } = await client.mutate(
    {
      insert_replies_one: [
        { object },
        {
          id: true,
          reply: true,
          profile: {
            name: true,
            id: true,
          },
        },
      ],
    },
    {
      operationName: 'createReply',
    }
  );
  assert(insert_replies_one);
  return insert_replies_one;
};
