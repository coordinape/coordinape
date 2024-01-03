import React, { Dispatch, useState } from 'react';

import { useController, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';

import { ConfirmationModal } from '../../components/ConfirmationModal';
import { LoadingBar } from '../../components/LoadingBar';
import { MarkdownGuide } from '../../components/MarkdownGuide';
import { useToast } from '../../hooks';
import { Code, Image, RefreshCcw } from '../../icons/__generated';
import {
  createContributionMutation,
  deleteContributionMutation,
  updateContributionMutation,
} from '../../pages/ContributionsPage/mutations';
import { QUERY_KEY_ALLOCATE_CONTRIBUTIONS } from '../../pages/GivePage/EpochStatementDrawer';
import { POST_PAGE_QUERY_KEY } from '../../pages/PostPage';
import { CSS } from '../../stitches.config';
import { Box, Button, Flex, MarkdownPreview, Text } from '../../ui';
import { ACTIVITIES_QUERY_KEY } from '../activities/ActivityList';
import { Contribution } from '../activities/useInfiniteActivities';

import { MentionsTextArea } from './MentionsTextArea';

export const PostForm = ({
  editContribution,
  setEditingContribution,
  css,
  showLoading,
  onSave,
  onSuccess,
  placeholder = 'Take inspiration from the prompt, or post whatever you want',
  refreshPrompt,
  label,
  bigQuestionId,
}: {
  editContribution?: Contribution['contribution'];
  setEditingContribution?: Dispatch<React.SetStateAction<boolean>>;
  css?: CSS;
  showLoading?: boolean;
  onSave?: () => void;
  onSuccess?: () => void;
  placeholder?: string;
  refreshPrompt?: () => void;
  label?: React.ReactNode;
  bigQuestionId?: number;
}) => {
  const [showMarkdown, setShowMarkDown] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { showError } = useToast();
  const { control, reset, resetField, setValue, setFocus } = useForm({
    mode: 'all',
  });

  const { field: descriptionField } = useController({
    name: 'description',
    control,
    defaultValue: editContribution?.description ?? '',
  });

  const { mutate: createContribution, reset: resetCreateMutation } =
    useMutation(createContributionMutation, {
      onError: errors => {
        showError(errors);
      },
      onSuccess: newContribution => {
        onSuccess && onSuccess();
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY_ALLOCATE_CONTRIBUTIONS],
        });
        if (newContribution.insert_contributions_one) {
          if (
            // invoke resetField() value if current form is up to date
            descriptionField?.value ==
            newContribution.insert_contributions_one.description
          ) {
            resetField('description', {
              defaultValue:
                newContribution.insert_contributions_one.description,
            });
          }
          resetField('description', { defaultValue: '' });
          setShowMarkDown(false);
          setFocus('description');
        } else {
          resetCreateMutation();
        }
      },
    });

  const { mutate: mutateContribution } = useMutation(
    updateContributionMutation,
    {
      mutationKey: ['updateContribution'],
      onError: errors => {
        showError(errors);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(ACTIVITIES_QUERY_KEY);
        queryClient.invalidateQueries(POST_PAGE_QUERY_KEY);
        cancelEditing();
      },
    }
  );

  const { mutate: deleteContribution } = useMutation(
    deleteContributionMutation,
    {
      mutationKey: ['deleteContribution'],
      onSuccess: () => {
        reset();
        queryClient.invalidateQueries(ACTIVITIES_QUERY_KEY);
      },
    }
  );

  const saveContribution = (value: string) => {
    try {
      if (editContribution) {
        mutateContribution({
          id: editContribution.id,
          description: value,
        });
      } else {
        onSave && onSave();
        createContribution({
          user_id: undefined,
          description: value,
          big_question_id: bigQuestionId,
          private_stream: !bigQuestionId,
        });
      }
    } catch (e) {
      showError(e);
    }
  };

  const cancelEditing = () => {
    if (setEditingContribution) {
      setEditingContribution(false);
    }
  };

  return (
    <>
      <>
        <Flex column css={{ width: '100%', position: 'relative' }}>
          <Flex
            css={{
              justifyContent: 'space-between',
              mb: '$xs',
              gap: '$lg',
              '@sm': {
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '$xs',
              },
            }}
          >
            <Text variant="label" as="label">
              {label ? label : `Share Post`}
            </Text>
            {refreshPrompt && (
              <Button
                color={'link'}
                onClick={refreshPrompt}
                size={'xs'}
                css={{
                  textDecoration: 'none',
                  color: '$secondaryText',
                  '&:hover': {
                    color: '$linkHover',
                  },
                }}
              >
                <RefreshCcw size={'sm'} /> Refresh Prompt
              </Button>
            )}
          </Flex>
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
                <MarkdownPreview asPost source={descriptionField.value} />
              </Box>
            ) : (
              <Box css={{ position: 'relative', width: '100%' }}>
                <MentionsTextArea
                  onChange={e => setValue('description', e.target.value)}
                  value={descriptionField.value as string}
                  placeholder={placeholder}
                  onKeyDown={e => {
                    e.stopPropagation();
                    if (e.key === 'Escape') {
                      cancelEditing();
                    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      saveContribution(descriptionField.value);
                      e.preventDefault();
                    }
                  }}
                />
                <MarkdownGuide />
              </Box>
            )}

            <Flex css={{ justifyContent: 'space-between', width: '100%' }}>
              <Button
                size="small"
                color="link"
                css={{ px: '$sm', gap: '1px', textDecoration: 'none' }}
                disabled={
                  !(descriptionField.value && descriptionField.value.length > 0)
                }
                onClick={() => setShowMarkDown(prev => !prev)}
              >
                {showMarkdown ? (
                  <>
                    <Code />
                    <Text>View Markdown</Text>
                  </>
                ) : (
                  <>
                    <Image />
                    <Text>Preview</Text>
                  </>
                )}
              </Button>
              <Flex
                css={{
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  flexDirection: editContribution ? 'row-reverse' : 'row',
                  gap: '$md',
                  mt: '$xs',
                }}
              >
                {bigQuestionId && (
                  <Text tag color={'primary'} size={'xs'}>
                    Town Square Posts are Public
                  </Text>
                )}
                <Button
                  color="cta"
                  onClick={() => {
                    saveContribution(descriptionField.value);
                  }}
                  disabled={!descriptionField.value}
                >
                  {editContribution ? 'Save Post' : 'Add Post'}
                </Button>
                {editContribution && (
                  <>
                    <Button color="secondary" onClick={() => cancelEditing()}>
                      Cancel
                    </Button>
                    <ConfirmationModal
                      trigger={
                        <Button
                          color="transparent"
                          css={{
                            '&:hover, &:focus': {
                              color: '$destructiveButton',
                            },
                            '&:focus-visible': {
                              outlineColor: '$destructiveButton',
                            },
                            svg: { mr: 0 },
                          }}
                        >
                          Delete
                        </Button>
                      }
                      action={() => {
                        deleteContribution({
                          contribution_id: editContribution.id,
                        });
                      }}
                      description={`Are you sure you want to delete this post?`}
                      yesText="Yes, delete it!"
                    />
                  </>
                )}
              </Flex>
            </Flex>
          </Flex>
          {showLoading && (
            <LoadingBar
              css={{
                position: 'absolute',
                bottom: `calc((1px + $lg) * -1)`,
                left: '-$xl',
                width: `calc(100% + $xl)`,
              }}
            />
          )}
        </Flex>
      </>
    </>
  );
};
