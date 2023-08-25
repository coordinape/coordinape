import { Dispatch, useEffect, useMemo, useState } from 'react';

import { useMyUser } from 'features/auth/useLoginData';
import { useForm, useController } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from 'react-query';

import { ACTIVITIES_QUERY_KEY } from '../../features/activities/ActivityList';
import useConnectedAddress from '../../hooks/useConnectedAddress';
import { FormInputField } from 'components';
import { QUERY_KEY_ALLOCATE_CONTRIBUTIONS } from 'pages/GivePage/EpochStatementDrawer';
import { useCircleIdParam } from 'routes/hooks';
import { Text, Box, Button, Flex, MarkdownPreview } from 'ui';
import { SaveState } from 'ui/SavingIndicator';

import {
  deleteContributionMutation,
  updateContributionMutation,
  createContributionMutation,
} from './mutations';
import { getContributionsAndEpochs } from './queries';
import type { CurrentContribution } from './types';
import { getCurrentEpoch, getNewContribution, createLinkedArray } from './util';

const NEW_CONTRIBUTION_ID = 0;

export const ContributionForm = ({
  description = '',
  contributionId,
  setEditContribution,
}: {
  description?: string;
  contributionId?: number;
  setEditContribution?: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const address = useConnectedAddress();
  const circleId = useCircleIdParam();
  const currentUserId = useMyUser(circleId)?.id;
  const editingContribution = !!contributionId;

  const [saveState, setSaveState] = useState<{ [key: number]: SaveState }>({});

  const [showMarkdown, setShowMarkDown] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { refetch: refetchContributions } = useQuery(
    ['contributions', circleId],
    () =>
      getContributionsAndEpochs({
        circleId: circleId,
        userAddress: address,
      }),
    {
      enabled: !!(circleId && address),
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      select: data => {
        return {
          ...data,
          contributions: createLinkedArray(data.contributions),
          epochs: createLinkedArray(data.epochs),
        };
      },
    }
  );

  const [currentContribution, setCurrentContribution] =
    useState<CurrentContribution | null>({
      contribution: getNewContribution(currentUserId, undefined),
      epoch: getCurrentEpoch([]),
    });

  const { control, reset, resetField, setValue, setFocus } = useForm({
    mode: 'all',
  });

  useEffect(() => {
    resetField('description', { defaultValue: description });
    // once we become buffering, we need to schedule
    // this protection of state change in useEffect allows us to fire this only once
    // so requests don't stack up
    if (saveState[currentContribution?.contribution.id] == 'buffering') {
      updateSaveStateForContribution(
        currentContribution?.contribution.id,
        'scheduled'
      );
    }
  }, [
    currentContribution?.contribution.id,
    saveState[currentContribution?.contribution.id],
  ]);

  const { field: descriptionField } = useController({
    name: 'description',
    control,
  });

  const { mutate: createContribution, reset: resetCreateMutation } =
    useMutation(createContributionMutation, {
      onSuccess: newContribution => {
        refetchContributions();
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY_ALLOCATE_CONTRIBUTIONS],
        });
        setTimeout(
          () => queryClient.invalidateQueries(ACTIVITIES_QUERY_KEY),
          1000
        );
        if (newContribution.insert_contributions_one) {
          updateSaveStateForContribution(NEW_CONTRIBUTION_ID, 'stable');
          setCurrentContribution({
            contribution: {
              ...newContribution.insert_contributions_one,
              description: descriptionField.value as string,
              next: () => undefined,
              prev: () => undefined,
              idx: 0,
            },
            epoch: getCurrentEpoch([]),
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
      mutationKey: ['updateContribution', currentContribution?.contribution.id],
      onError: (errors, { id }) => {
        updateSaveStateForContribution(id, 'error');
      },
      onSuccess: ({ updateContribution }, { id }) => {
        refetchContributions();
        updateSaveStateForContribution(id, 'saved');
        queryClient.invalidateQueries(ACTIVITIES_QUERY_KEY);
        if (
          currentContribution &&
          updateContribution?.updateContribution_Contribution
        ) {
          setCurrentContribution({
            ...currentContribution,
            contribution: {
              ...currentContribution.contribution,
              description:
                updateContribution.updateContribution_Contribution.description,
            },
          });
        }
        cancelEditing();
      },
    }
  );

  const { mutate: deleteContribution } = useMutation(
    deleteContributionMutation,
    {
      mutationKey: ['deleteContribution', currentContribution?.contribution.id],
      onSuccess: data => {
        setCurrentContribution(null);
        refetchContributions();
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
    return (value: string) => {
      if (!currentContribution) return;
      // currentContribution.contribution.id === NEW_CONTRIBUTION_ID
      editingContribution
        ? mutateContribution({
            id: contributionId,
            description: value,
          })
        : createContribution({
            user_id: currentUserId,
            circle_id: circleId,
            description: value,
          });
    };
  }, [currentContribution?.contribution.id]);

  const cancelEditing = () => {
    if (setEditContribution) {
      setEditContribution(false);
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
          <Flex column css={{ width: '100%', position: 'relative', mt: '$md' }}>
            <Flex column alignItems="end" css={{ gap: '$sm' }}>
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
                    defaultValue={currentContribution.contribution.description}
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
                    }}
                    placeholder="What have you been working on?"
                    textArea
                  />
                  <Text
                    inline
                    size="small"
                    color="secondary"
                    css={{
                      position: 'absolute',
                      right: '$sm',
                      bottom: '$sm',
                    }}
                  >
                    Markdown Supported
                  </Text>
                </Box>
              )}

              <Flex
                css={{
                  justifyContent: 'flex-end',
                  flexDirection: 'row-reverse',
                  gap: '$sm',
                }}
              >
                <Button
                  color="cta"
                  onClick={() => saveContribution(descriptionField.value)}
                  onMouseDown={() => saveContribution(descriptionField.value)}
                  disabled={!descriptionField.value}
                >
                  {editingContribution ? 'Save ' : 'Add '}
                  Contribution
                </Button>
                {editingContribution && (
                  <>
                    <Button color="secondary" onClick={() => cancelEditing()}>
                      Cancel
                    </Button>
                    <Button
                      color="transparent"
                      css={{
                        '&:hover, &:focus': { color: '$destructiveButton' },
                        '&:focus-visible': {
                          outlineColor: '$destructiveButton',
                        },
                        svg: { mr: 0 },
                      }}
                      onClick={() => {
                        deleteContribution({
                          contribution_id: contributionId,
                        });
                      }}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </Flex>
            </Flex>
          </Flex>
        </>
      )}
    </>
  );
};
