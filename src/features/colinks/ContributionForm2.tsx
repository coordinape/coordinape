/* eslint-disable */
import React, { Dispatch, useEffect, useMemo, useState } from 'react';

import { DateTime } from 'luxon';
import { useController, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import type { CSS } from 'stitches.config';

import { ACTIVITIES_QUERY_KEY } from '../../features/activities/ActivityList';
import {
  createContributionMutation,
  deleteContributionMutation,
  updateContributionMutation,
} from '../../pages/ContributionsPage/mutations';
import { Contribution } from '../../pages/ContributionsPage/queries';
import { LinkedElement } from '../../pages/ContributionsPage/util';
import { ConfirmationModal } from 'components/ConfirmationModal';
import { LoadingBar } from 'components/LoadingBar';
import { MarkdownGuide } from 'components/MarkdownGuide';
import { useToast } from 'hooks';
import { Code, Image, Info, RefreshCcw } from 'icons/__generated';
import { QUERY_KEY_ALLOCATE_CONTRIBUTIONS } from 'pages/GivePage/EpochStatementDrawer';
import { POST_PAGE_QUERY_KEY } from 'pages/PostPage';
import { EXTERNAL_URL_DOCS_CONTRIBUTIONS } from 'routes/paths';
import { Box, Button, Flex, Link, MarkdownPreview, Text, Tooltip } from 'ui';
import { SaveState } from 'ui/SavingIndicator';

import { MentionsTextArea } from './MentionsTextArea';

const NEW_CONTRIBUTION_ID = 0;
export const CONT_DEFAULT_HELP_TEXT =
  'Let your team know what you have been doing.';

export const ContributionForm2 = ({
  description = '',
  contributionId,
  setEditingContribution,
  privateStream,
  css,
  showLoading,
  onSave,
  onSuccess,
  placeholder = CONT_DEFAULT_HELP_TEXT,
  itemNounName = 'Post',
  showToolTip = true,
  refreshPrompt,
  label,
}: {
  description?: string;
  contributionId?: number;
  setEditingContribution?: Dispatch<React.SetStateAction<boolean>>;
  privateStream?: boolean;
  css?: CSS;
  showLoading?: boolean;
  onSave?: () => void;
  onSuccess?: () => void;
  placeholder?: string;
  itemNounName?: string;
  showToolTip?: boolean;
  refreshPrompt?: () => void;
  label?: React.ReactNode;
}) => {
  const contributionExists = !!contributionId;

  const [saveState, setSaveState] = useState<{ [key: number]: SaveState }>({});

  const [showMarkdown, setShowMarkDown] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const { showError } = useToast();

  const [currentContribution, setCurrentContribution] =
    useState<LinkedElement<Contribution> | null>({
      id: 0,
      description: '',
      created_at: DateTime.now().toISO(),
      user_id: undefined,
      idx: -1,
      next: () => undefined,
      prev: () => undefined,
    });

  const { control, reset, resetField, setValue, setFocus } = useForm({
    mode: 'all',
  });

  useEffect(() => {
    resetField('description', { defaultValue: description });
    // once we become buffering, we need to schedule
    // this protection of state change in useEffect allows us to fire this only once
    // so requests don't stack up
    if (saveState[currentContribution?.id] == 'buffering') {
      updateSaveStateForContribution(currentContribution?.id, 'scheduled');
    }
  }, [currentContribution?.id, saveState[currentContribution?.id]]);

  const { field: descriptionField } = useController({
    name: 'description',
    control,
  });

  const { mutate: createContribution, reset: resetCreateMutation } =
    useMutation(createContributionMutation, {
      onSuccess: newContribution => {
        onSuccess && onSuccess();
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY_ALLOCATE_CONTRIBUTIONS],
        });
        // NOTE: we let the websocket subscription invalidate the contribution cache
        if (newContribution.insert_contributions_one) {
          updateSaveStateForContribution(NEW_CONTRIBUTION_ID, 'stable');
          setCurrentContribution({
            ...newContribution.insert_contributions_one,
            description: descriptionField.value as string,
            next: () => undefined,
            prev: () => undefined,
            idx: 0,
          });

          if (
            // invoke resetField() value if current form is up to date
            descriptionField?.value ==
            newContribution.insert_contributions_one.description
          ) {
            resetField('description', {
              defaultValue:
                newContribution.insert_contributions_one.description,
            });
            updateSaveStateForContribution(
              newContribution.insert_contributions_one.id,
              'saved'
            );
          } else {
            updateSaveStateForContribution(
              newContribution.insert_contributions_one.id,
              'buffering'
            );
          }
          resetField('description', { defaultValue: '' });
          setShowMarkDown(false);
          setFocus('description');
        } else {
          updateSaveStateForContribution(NEW_CONTRIBUTION_ID, 'stable');
          resetCreateMutation();
        }
      },
    });

  const { mutate: mutateContribution } = useMutation(
    updateContributionMutation,
    {
      mutationKey: ['updateContribution', currentContribution?.id],
      onError: (errors, { id }) => {
        showError(errors);
        updateSaveStateForContribution(id, 'error');
      },
      onSuccess: ({ updateContribution }, { id }) => {
        updateSaveStateForContribution(id, 'saved');
        queryClient.invalidateQueries(ACTIVITIES_QUERY_KEY);
        queryClient.invalidateQueries(POST_PAGE_QUERY_KEY);
        if (
          currentContribution &&
          updateContribution?.updateContribution_Contribution
        ) {
          setCurrentContribution({
            ...currentContribution,
            ...currentContribution,
            description:
              updateContribution.updateContribution_Contribution.description,
          });
        }
        cancelEditing();
      },
    }
  );

  const { mutate: deleteContribution } = useMutation(
    deleteContributionMutation,
    {
      mutationKey: ['deleteContribution', currentContribution?.id],
      onSuccess: data => {
        setCurrentContribution(null);
        updateSaveStateForContribution(data.contribution_id, 'stable');
        reset();
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY_ALLOCATE_CONTRIBUTIONS],
        });
        queryClient.invalidateQueries(ACTIVITIES_QUERY_KEY);
      },
    }
  );

  const saveContribution = useMemo(() => {
    console.log('whatup');
    return (value: string) => {
      if (!currentContribution) return;
      if (contributionExists) {
        mutateContribution({
          id: contributionId,
          description: value,
        });
      } else {
        onSave && onSave();
        createContribution({
          user_id: undefined,
          description: value,
          private_stream: privateStream,
        });
      }
    };
  }, [-1, currentContribution?.id]);

  const cancelEditing = () => {
    if (setEditingContribution) {
      setEditingContribution(false);
    }
  };

  const updateSaveStateForContribution = (
    id: number | undefined,
    saveState: SaveState
  ) => {
    if (id == undefined) {
      return;
    }
    setSaveState(prevState => {
      const newState = { ...prevState };
      newState[id] = saveState;
      return newState;
    });
  };

  return (
    <>
      {currentContribution && (
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
                {label ? label : `Share ${itemNounName}`}
                {showToolTip && (
                  <Tooltip
                    content={
                      <>
                        <Text p as="p" size="small">
                          Share your contributions with your collaborators as
                          you perform them.
                        </Text>
                        <Text p as="p" size="small">
                          Learn more about contributions and view examples in
                          our{' '}
                          <Link
                            inlineLink
                            href={EXTERNAL_URL_DOCS_CONTRIBUTIONS}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Contributions Docs
                          </Link>
                        </Text>
                      </>
                    }
                  >
                    <Info size="sm" />
                  </Tooltip>
                )}
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
                  <MarkdownPreview source={descriptionField.value} />
                </Box>
              ) : (
                <Box css={{ position: 'relative', width: '100%' }}>
                  <MentionsTextArea
                    onChange={e => setValue('description', e.target.value)}
                    value={descriptionField.value as string}
                    placeholder={placeholder}
                  />
                  {/*<FormInputField*/}
                  {/*  id="description"*/}
                  {/*  name="description"*/}
                  {/*  control={control}*/}
                  {/*  css={{*/}
                  {/*    textarea: {*/}
                  {/*      resize: 'vertical',*/}
                  {/*      pb: '$xl',*/}
                  {/*      minHeight: 'calc($2xl * 2)',*/}
                  {/*    },*/}
                  {/*  }}*/}
                  {/*  defaultValue={currentContribution.description}*/}
                  {/*  areaProps={{*/}
                  {/*    autoFocus: true,*/}
                  {/*    maxLength: 10000,*/}
                  {/*    onChange: e => {*/}
                  {/*      setValue('description', e.target.value);*/}
                  {/*    },*/}
                  {/*    onFocus: e => {*/}
                  {/*      e.currentTarget.setSelectionRange(*/}
                  {/*        e.currentTarget.value.length,*/}
                  {/*        e.currentTarget.value.length*/}
                  {/*      );*/}
                  {/*    },*/}
                  {/*    onKeyDown: e => {*/}
                  {/*      e.stopPropagation();*/}
                  {/*      if (e.key === 'Escape') {*/}
                  {/*        cancelEditing();*/}
                  {/*      } else if (*/}
                  {/*        e.key === 'Enter' &&*/}
                  {/*        (e.metaKey || e.ctrlKey)*/}
                  {/*      ) {*/}
                  {/*        saveContribution(descriptionField.value);*/}
                  {/*        e.preventDefault();*/}
                  {/*      }*/}
                  {/*    },*/}
                  {/*  }}*/}
                  {/*  placeholder={placeholder}*/}
                  {/*  textArea*/}
                  {/*/>*/}
                  <MarkdownGuide />
                </Box>
              )}

              <Flex css={{ justifyContent: 'space-between', width: '100%' }}>
                <Button
                  size="small"
                  color="link"
                  css={{ px: '$sm', gap: '1px', textDecoration: 'none' }}
                  disabled={
                    !(
                      descriptionField.value &&
                      descriptionField.value.length > 0
                    )
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
                    flexDirection: contributionExists ? 'row-reverse' : 'row',
                    gap: '$sm',
                    mt: '$xs',
                  }}
                >
                  <Button
                    color="cta"
                    onClick={() => {
                      saveContribution(descriptionField.value);
                    }}
                    disabled={!descriptionField.value}
                  >
                    {contributionExists ? 'Save ' : 'Add '}
                    {itemNounName}
                  </Button>
                  {contributionExists && (
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
                            contribution_id: contributionId,
                          });
                        }}
                        description={`Are you sure you want to delete this ${itemNounName.toLowerCase()}?`}
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
      )}
    </>
  );
};
