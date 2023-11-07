import assert from 'assert';
import { Dispatch, useState } from 'react';

import { ValueTypes } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { useController, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import type { CSS } from 'stitches.config';

import { FormInputField } from 'components';
import { MarkdownGuide } from 'components/MarkdownGuide';
import { Box, Button, Flex, MarkdownPreview } from 'ui';

import { QUERY_KEY_REPLIES } from './RepliesBox';

export const CONT_DEFAULT_HELP_TEXT =
  'Let your team know what you have been doing.';
export const EXTERNAL_URL_MARKDOWN_DOCS = 'https://github.github.com/gfm/';

export const ReplyForm = ({
  activityId,
  activityActorId,
  reply,
  css,
}: {
  activityId: number;
  activityActorId: number;
  reply?: any;
  setEditingContribution?: Dispatch<React.SetStateAction<boolean>>;
  css?: CSS;
}) => {
  const [showMarkdown, setShowMarkDown] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { control, resetField, setValue } = useForm({
    mode: 'all',
  });

  const { field: descriptionField } = useController({
    name: 'description',
    control,
  });

  const { mutate: createReply, isLoading } = useMutation(createReplyMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_REPLIES, activityId],
      });
      resetField('description');
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
    }
  };

  return (
    <>
      <Flex column css={{ width: '100%', position: 'relative', mt: '$md' }}>
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
              <FormInputField
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
                  },
                  onBlur: () => {
                    if (
                      descriptionField.value &&
                      descriptionField.value.length > 0
                    )
                      setShowMarkDown(true);
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
              />
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
