import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

import { useMyUser } from 'features/auth/useLoginData';
import { NavOrg, useNavQuery } from 'features/nav/getNavData';
import { useForm, useController } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useLocation } from 'react-router';
import type { CSS } from 'stitches.config';

import { ACTIVITIES_QUERY_KEY } from '../../features/activities/ActivityList';
import useConnectedAddress from '../../hooks/useConnectedAddress';
import { FormInputField } from 'components';
import { LoadingBar } from 'components/LoadingBar';
import { useToast } from 'hooks';
import { QUERY_KEY_ALLOCATE_CONTRIBUTIONS } from 'pages/GivePage/EpochStatementDrawer';
import { Text, Box, Button, Flex, MarkdownPreview } from 'ui';
import { SaveState } from 'ui/SavingIndicator';

import { CircleSelector } from './CircleSelector';
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
  setEditingContribution,
  circleId,
  orgId,
  css,
  showLoading,
  onSave,
}: {
  description?: string;
  contributionId?: number;
  setEditingContribution?: Dispatch<React.SetStateAction<boolean>>;
  circleId?: number;
  orgId?: number;
  css?: CSS;
  showLoading?: boolean;
  onSave?: () => void;
}) => {
  const address = useConnectedAddress();
  const [selectedCircle, setSelectedCircle] = useState(
    circleId ? circleId.toString() : ''
  );
  const handleCircleSelection = (selectedValue: SetStateAction<string>) => {
    setSelectedCircle(selectedValue);
  };
  const selectedCircleId = Number.parseInt(selectedCircle);
  const location = useLocation();
  const { data } = useNavQuery();
  const [currentOrg, setCurrentOrg] = useState<NavOrg | undefined>(undefined);
  const setCircleAndOrgIfMatch = (orgs: NavOrg[]) => {
    for (const o of orgs) {
      if (selectedCircleId) {
        for (const c of [...o.myCircles, ...o.otherCircles]) {
          if (c.id == +selectedCircleId) {
            setCurrentOrg(o);
            return;
          }
        }
      }
      if (orgId && o.id == +orgId) {
        setCurrentOrg(o);
        if (o.myCircles.length > 0) {
          setSelectedCircle(o.myCircles[0].id);
        }
        return;
      }
      setCurrentOrg(undefined);
    }
  };

  useEffect(() => {
    if (data) {
      if (data.organizations) {
        setCircleAndOrgIfMatch(data.organizations);
      }
    }
  }, [data, location]);

  const currentUserId = useMyUser(selectedCircleId)?.id;
  const contributionExists = !!contributionId;

  const [saveState, setSaveState] = useState<{ [key: number]: SaveState }>({});

  const [showMarkdown, setShowMarkDown] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const { showError } = useToast();

  const { refetch: refetchContributions } = useQuery(
    ['contributions', selectedCircleId],
    () =>
      getContributionsAndEpochs({
        circleId: selectedCircleId,
        userAddress: address,
      }),
    {
      enabled: !!(selectedCircleId && address),
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
        // NOTE: we let the websocket subscription invalidate the contribution cache
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
        showError(errors);
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
      if (contributionExists) {
        mutateContribution({
          id: contributionId,
          description: value,
        });
      } else {
        onSave && onSave();
        createContribution({
          user_id: currentUserId,
          circle_id: selectedCircleId,
          description: value,
        });
      }
    };
  }, [currentUserId, currentContribution?.contribution.id]);

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

  if (!currentOrg || currentOrg.myCircles.length === 0) {
    return <></>;
  }

  return (
    <>
      {currentContribution && (
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
                  Contribution
                </Button>
                {!contributionExists &&
                  currentOrg &&
                  currentOrg.myCircles.length > 1 && (
                    <CircleSelector
                      org={currentOrg}
                      onCircleSelection={handleCircleSelection}
                    />
                  )}
                {contributionExists && (
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
