import { useEffect, useMemo, useState } from 'react';

import { useForm, useController } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from 'react-query';

import { ACTIVITIES_QUERY_KEY } from '../../features/activities/ActivityList';
import useConnectedAddress from '../../hooks/useConnectedAddress';
import { LoadingModal, FormInputField } from 'components';
import { QUERY_KEY_ALLOCATE_CONTRIBUTIONS } from 'pages/GivePage/EpochStatementDrawer';
import { useCircleIdParam } from 'routes/hooks';
import { ContentHeader, Text, Box, Button, Flex, MarkdownPreview } from 'ui';
import { SaveState } from 'ui/SavingIndicator';

import { createContributionMutation } from './mutations';
import { getContributionsAndEpochs } from './queries';
import type { CurrentContribution } from './types';
import { getCurrentEpoch, createLinkedArray } from './util';

const NEW_CONTRIBUTION_ID = 0;

export const ContributionForm = () => {
  const address = useConnectedAddress();
  const circleId = useCircleIdParam();

  const [saveState, setSaveState] = useState<{ [key: number]: SaveState }>({});
  const [currentContribution, setCurrentContribution] =
    useState<CurrentContribution | null>(null);

  const [showMarkdown, setShowMarkDown] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const {
    data,
    refetch: refetchContributions,
    dataUpdatedAt,
  } = useQuery(
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

  const { control, resetField } = useForm({ mode: 'all' });

  useEffect(() => {
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
        queryClient.invalidateQueries(ACTIVITIES_QUERY_KEY);
        if (newContribution.insert_contributions_one) {
          updateSaveStateForContribution(NEW_CONTRIBUTION_ID, 'stable');
          setCurrentContribution({
            contribution: {
              ...newContribution.insert_contributions_one,
              description: descriptionField.value as string,
              next: () => data?.contributions[NEW_CONTRIBUTION_ID],
              prev: () => undefined,
              idx: 0,
            },
            epoch: getCurrentEpoch(data?.epochs ?? []),
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
        } else {
          updateSaveStateForContribution(NEW_CONTRIBUTION_ID, 'stable');
          resetCreateMutation();
        }
      },
    });

  // const saveContribution = () => {
  //   createContribution({
  //     user_id: 117,
  //     circle_id: 8,
  //     description: 'saveCont 1',
  //   });
  // };
  const saveContribution = useMemo(() => {
    return (value: string) => {
      createContribution({
        // user_id: currentUserId,
        user_id: 117,
        circle_id: circleId,
        description: value || 'value not here',
      });
    };
  }, [currentContribution?.contribution.id]);

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

  // prevents page re-renders when typing out a contribution
  // This seems pretty silly but it's actually a huge optimization
  // when 30+ contributions are on the page
  const memoizedEpochData = useMemo(() => {
    if (!data) return data;
    const returnData: typeof data = { ...data };
    const currentEpoch = getCurrentEpoch(data?.epochs || []);
    if (currentEpoch.id === 0 && data?.epochs)
      returnData.epochs = createLinkedArray([currentEpoch, ...data.epochs]);

    return returnData;
  }, [dataUpdatedAt]);

  /// Return here if we don't have the data so that the actual page component can be simpler
  if (!memoizedEpochData) {
    return <LoadingModal visible />;
  }

  return (
    <>
      <ContentHeader>
        <Flex column css={{ width: '100%' }}>
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
                  areaProps={{
                    autoFocus: true,
                    // onBlur: () => {
                    //   if (descriptionField && descriptionField.value.length > 0)
                    //     setShowMarkDown(true);
                    // },
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
            <Button color="cta" onClick={() => saveContribution('poiupoiu')}>
              Add Contribution
            </Button>
          </Flex>
        </Flex>
      </ContentHeader>
    </>
  );
};
