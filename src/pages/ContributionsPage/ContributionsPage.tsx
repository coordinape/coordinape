import React, { useEffect, useMemo, useState } from 'react';

import dedent from 'dedent';
import { EpochEndingNotification } from 'features/nav/EpochEndingNotification';
import { debounce } from 'lodash';
import { DateTime } from 'luxon';
import { useForm, useController } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { NavLink } from 'react-router-dom';

import { ACTIVITIES_QUERY_KEY } from '../../features/activities/ActivityList';
import useConnectedAddress from '../../hooks/useConnectedAddress';
import { LoadingModal, FormInputField } from 'components';
import HintBanner from 'components/HintBanner';
import isFeatureEnabled from 'config/features';
import { Contribution as IntegrationContribution } from 'hooks/useContributions';
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  ChevronsRight,
} from 'icons/__generated';
import { QUERY_KEY_ALLOCATE_CONTRIBUTIONS } from 'pages/GivePage/EpochStatementDrawer';
import { useCircleIdParam } from 'routes/hooks';
import { EXTERNAL_URL_DISCORD, paths } from 'routes/paths';
import {
  ContentHeader,
  Panel,
  Text,
  Box,
  Modal,
  Button,
  Flex,
  MarkdownPreview,
  Link,
} from 'ui';
import { SingleColumnLayout } from 'ui/layouts';
import { SavingIndicator, SaveState } from 'ui/SavingIndicator';

import { ContributionHelpText } from './ContributionHelpText';
import { ContributionIntro } from './ContributionIntro';
import { ContributionList } from './ContributionList';
import { ContributionPanel } from './ContributionPanel';
import {
  deleteContributionMutation,
  updateContributionMutation,
  createContributionMutation,
} from './mutations';
import { PlaceholderContributions } from './PlaceholderContributions';
import { getContributionsAndEpochs, Contribution, Epoch } from './queries';
import type {
  CurrentContribution,
  CurrentIntContribution,
  LinkedContributionsAndEpochs,
  SetActiveContributionProps,
} from './types';
import {
  getCurrentEpoch,
  getNewContribution,
  getEpochLabel,
  createLinkedArray,
  LinkedElement,
  jumpToEpoch,
  isEpochCurrentOrLater,
  contributionIcon,
} from './util';

const DEBOUNCE_TIMEOUT = 1000;

const NEW_CONTRIBUTION_ID = 0;

const nextPrevCss = {
  color: '$text',
  padding: '0',
  minHeight: '32px',
  height: '32px',
  width: '32px',
  mr: '$sm',
  borderRadius: '$2',
  alignItems: 'center',
  '> svg': {
    mr: 0,
  },
};

const contributionSource = (source: string) => {
  switch (source) {
    case 'wonder':
      return 'Wonder';
    default:
      return 'Dework';
  }
};

const ContributionsPage = () => {
  const address = useConnectedAddress();
  const circleId = useCircleIdParam();
  const [modalOpen, setModalOpen] = useState(false);

  const [saveState, setSaveState] = useState<{ [key: number]: SaveState }>({});
  const [currentContribution, setCurrentContribution] =
    useState<CurrentContribution | null>(null);
  const [currentIntContribution, setCurrentIntContribution] =
    useState<CurrentIntContribution | null>(null);

  const [showMarkdown, setShowMarkDown] = useState<boolean>(true);

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

  const { control, reset, resetField, setValue } = useForm({ mode: 'all' });

  useEffect(() => {
    // once we become buffering, we need to schedule
    // this protection of state change in useEffect allows us to fire this only once
    // so requests don't stack up
    if (saveState[currentContribution?.contribution.id] == 'buffering') {
      updateSaveStateForContribution(
        currentContribution?.contribution.id,
        'scheduled'
      );
      // Should we cancel this too????
      handleDebouncedDescriptionChange(
        saveContribution,
        descriptionField.value
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

  const { mutate: mutateContribution, reset: resetUpdateMutation } =
    useMutation(updateContributionMutation, {
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
      },
    });

  const { mutate: deleteContribution } = useMutation(
    deleteContributionMutation,
    {
      mutationKey: ['deleteContribution', currentContribution?.contribution.id],
      onSuccess: data => {
        setModalOpen(false);
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
      currentContribution.contribution.id === NEW_CONTRIBUTION_ID
        ? createContribution({
            user_id: currentUserId,
            circle_id: circleId,
            description: value,
          })
        : mutateContribution({
            id: currentContribution.contribution.id,
            description: value,
          });
    };
  }, [currentContribution?.contribution.id]);

  // We need to instantiate exactly one debounce function for each newly
  // mounted currentContribution so it can be cancelled. Otherwise,
  // the handle of a live function is lost on re-render and we cannot
  // cancel the call when a bunch of typing is happening
  const handleDebouncedDescriptionChange = useMemo(
    () =>
      debounce((s: typeof saveContribution, v: string) => {
        updateSaveStateForContribution(
          currentContribution?.contribution.id,
          'saving'
        );
        s(v);
      }, DEBOUNCE_TIMEOUT),
    [currentContribution?.contribution.id]
  );

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

  const activeContributionFn = useMemo(
    () =>
      (
        epoch: LinkedElement<Epoch>,
        contribution?: LinkedElement<Contribution>,
        integrationContributions?: IntegrationContribution
      ) => {
        if (contribution) {
          setCurrentContribution({ contribution, epoch });
          setCurrentIntContribution(null);
          resetField('description', {
            defaultValue: contribution.description,
          });
        } else if (integrationContributions) {
          setCurrentIntContribution({
            contribution: integrationContributions,
            epoch,
          });
          setCurrentContribution(null);
        }

        setModalOpen(true);
      },
    []
  );
  /// Return here if we don't have the data so that the actual page component can be simpler
  if (!memoizedEpochData) {
    return <LoadingModal visible />;
  }
  const currentUserId: number = memoizedEpochData.users[0]?.id;

  const closeDrawer = () => {
    setModalOpen(false);
    setShowMarkDown(true);
    setCurrentContribution(null);
    setCurrentIntContribution(null);
    resetCreateMutation();
    resetUpdateMutation();
  };

  const readyForNewContribution: boolean =
    !saveState[NEW_CONTRIBUTION_ID] ||
    saveState[NEW_CONTRIBUTION_ID] === 'stable';

  const addNewContribution = () => {
    setCurrentContribution({
      contribution: getNewContribution(
        currentUserId,
        memoizedEpochData.contributions[0]
      ),
      epoch: getCurrentEpoch(memoizedEpochData.epochs),
    });
    resetField('description', { defaultValue: '' });
    resetCreateMutation();
    setModalOpen(true);
    setShowMarkDown(false);
  };

  return (
    <>
      <SingleColumnLayout>
        <ContentHeader>
          <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
            <Flex alignItems="center" css={{ gap: '$sm' }}>
              <Text h1 css={{ mr: '$xs' }}>
                Contributions
              </Text>
              <EpochEndingNotification
                circleId={circleId}
                css={{ gap: '$sm' }}
                message="Contributions Due"
                showCountdown
              />
            </Flex>
            <ContributionHelpText circleId={circleId} />
          </Flex>
          <Button
            color="cta"
            onClick={addNewContribution}
            disabled={!readyForNewContribution}
          >
            Add Contribution
          </Button>
        </ContentHeader>
        {isFeatureEnabled('activity_contributions') && (
          <HintBanner title={'Contributions Are Moving'}>
            <Text p as="p" css={{ color: 'inherit' }}>
              We’ve moved contributions to the activity feed.{' '}
              <Link inlineLink as={NavLink} to={paths.circle(circleId)}>
                Try it out!
              </Link>{' '}
              <br />
              <Link inlineLink href={EXTERNAL_URL_DISCORD} target="_blank">
                Let us know what you think
              </Link>{' '}
              on Discord. We plan to remove this page soon.
            </Text>
            <Flex css={{ gap: '$md' }}>
              <Button
                as={NavLink}
                to={paths.circle(circleId)}
                color="secondary"
                inline
              >
                View Circle Activity
              </Button>
            </Flex>
          </HintBanner>
        )}

        {(memoizedEpochData.contributions || []).length === 0 && (
          <ContributionIntro />
        )}

        <EpochGroup
          contributions={memoizedEpochData.contributions || []}
          epochs={memoizedEpochData.epochs || []}
          currentContribution={currentContribution}
          setActiveContribution={activeContributionFn}
          userAddress={address}
          circleId={circleId}
        />
      </SingleColumnLayout>
      <Modal
        drawer
        showClose={false}
        open={modalOpen}
        onOpenChange={closeDrawer}
      >
        <Panel ghost>
          {currentContribution ? (
            <>
              <Flex
                alignItems="center"
                css={{ justifyContent: 'space-between' }}
              >
                <Flex alignItems="center">
                  <Button
                    onClick={closeDrawer}
                    color="textOnly"
                    noPadding
                    css={{ mr: '$lg' }}
                  >
                    <ChevronsRight size="lg" />
                  </Button>
                  <Button
                    color="dim"
                    size="large"
                    css={nextPrevCss}
                    disabled={!currentContribution.contribution.prev()}
                    onClick={() => {
                      const prevContribution =
                        currentContribution.contribution.prev();
                      if (!prevContribution) return;
                      prevContribution.next = () => ({
                        ...currentContribution.contribution,
                        description: descriptionField.value,
                      });
                      setCurrentContribution({
                        contribution: prevContribution,
                        epoch: jumpToEpoch(
                          currentContribution.epoch,
                          prevContribution.created_at
                        ),
                      });
                      resetField('description', {
                        defaultValue: prevContribution.description,
                      });
                    }}
                  >
                    <ChevronUp size="lg" />
                  </Button>
                  <Button
                    color="dim"
                    css={nextPrevCss}
                    disabled={!currentContribution.contribution.next()}
                    onClick={() => {
                      const nextContribution =
                        currentContribution.contribution.next();
                      if (!nextContribution) return;
                      nextContribution.prev = () => ({
                        ...currentContribution.contribution,
                        description: descriptionField.value,
                      });
                      setCurrentContribution({
                        contribution: nextContribution,
                        epoch: jumpToEpoch(
                          currentContribution.epoch,
                          nextContribution.created_at
                        ),
                      });
                      resetField('description', {
                        defaultValue: nextContribution.description,
                      });
                    }}
                  >
                    <ChevronDown size="lg" />
                  </Button>
                </Flex>
                <Button
                  color="textOnly"
                  css={{ '&:hover': { color: '$alert' } }}
                  noPadding
                  disabled={!currentContribution.contribution.id}
                  onClick={() => {
                    handleDebouncedDescriptionChange.cancel();
                    deleteContribution({
                      contribution_id: currentContribution.contribution.id,
                    });
                  }}
                >
                  <Trash2 />
                </Button>
              </Flex>
              <Flex column css={{ my: '$xl' }}>
                <Flex
                  alignItems="center"
                  css={{ mb: '$sm', justifyContent: 'space-between' }}
                >
                  <Flex>
                    <Text large semibold css={{ mr: '$md' }}>
                      {currentContribution.epoch.id
                        ? renderEpochDate(currentContribution.epoch)
                        : 'Latest'}
                    </Text>
                    {getEpochLabel(currentContribution.epoch)}
                  </Flex>
                </Flex>
                <Text size="medium" css={{ fontWeight: '$medium' }}>
                  {currentContribution.epoch.description}
                </Text>
              </Flex>
              <Flex column css={{ gap: '$sm' }}>
                <Flex
                  css={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}
                >
                  <Text inline semibold size="large">
                    Contribution
                  </Text>
                  <Flex css={{ gap: '$sm' }}>
                    {isEpochCurrentOrLater(currentContribution.epoch) && (
                      <SavingIndicator
                        saveState={
                          saveState[currentContribution.contribution.id]
                        }
                        retry={() => {
                          saveContribution(descriptionField.value);
                          refetchContributions();
                        }}
                      />
                    )}
                    <Text variant="label">
                      {DateTime.fromISO(
                        currentContribution.contribution.created_at
                      ).toFormat('LLL dd')}
                    </Text>
                  </Flex>
                </Flex>
                {isEpochCurrentOrLater(currentContribution.epoch) ? (
                  showMarkdown ? (
                    <Box
                      tabIndex={0}
                      css={{ borderRadius: '$3' }}
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
                    <Box css={{ position: 'relative' }}>
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
                        defaultValue={
                          currentContribution.contribution.description
                        }
                        areaProps={{
                          autoFocus: true,
                          onChange: e => {
                            setValue('description', e.target.value);
                            // Don't schedule a new save if a createContribution
                            // request is inflight, since this will create
                            // a duplicate contribution
                            if (
                              !(
                                currentContribution.contribution.id ===
                                  NEW_CONTRIBUTION_ID &&
                                saveState[
                                  currentContribution.contribution.id
                                ] == 'saving'
                              )
                            )
                              updateSaveStateForContribution(
                                currentContribution.contribution.id,
                                'buffering'
                              );
                          },
                          onBlur: () => {
                            if (descriptionField.value.length > 0)
                              setShowMarkDown(true);
                          },
                          onFocus: e => {
                            e.currentTarget.setSelectionRange(
                              e.currentTarget.value.length,
                              e.currentTarget.value.length
                            );
                          },
                        }}
                        disabled={
                          !isEpochCurrentOrLater(currentContribution.epoch)
                        }
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
                  )
                ) : (
                  <MarkdownPreview
                    display
                    source={currentContribution.contribution.description}
                  />
                )}

                <Flex css={{ justifyContent: 'flex-end' }}>
                  <Button
                    color="primary"
                    onClick={addNewContribution}
                    // adding onMouseDown because the onBlur event on the markdown-ready textarea was preventing onClick
                    onMouseDown={addNewContribution}
                    disabled={!readyForNewContribution}
                  >
                    New
                  </Button>
                </Flex>
              </Flex>
            </>
          ) : (
            currentIntContribution && (
              <IntegrationContributionDetail data={currentIntContribution} />
            )
          )}
        </Panel>
      </Modal>
    </>
  );
};

const IntegrationContributionDetail = ({
  data: { epoch, contribution },
}: {
  data: CurrentIntContribution;
}) => {
  return (
    <>
      <Flex column css={{ my: '$xl' }}>
        <Text h2 css={{ gap: '$md', mb: '$sm' }}>
          {epoch ? renderEpochDate(epoch) : 'Latest'}
          {getEpochLabel(epoch)}
        </Text>
        <Text size="medium" css={{ fontWeight: '$medium' }}>
          {epoch?.description}
        </Text>
      </Flex>
      <Panel css={{ pl: '0 !important' }}>
        <Text p size="large" semibold css={{ color: '$headingText' }}>
          {contributionSource(contribution.source)}
        </Text>
      </Panel>
      <Panel nested>
        <Link target="_blank" href={contribution.link}>
          {contributionIcon(contribution.source)}
          {contribution.title}
        </Link>
      </Panel>
    </>
  );
};

const monthsEqual = (start: string, end: string) =>
  DateTime.fromISO(start).month === DateTime.fromISO(end).month;

const yearCurrent = (end: string) =>
  DateTime.fromISO(end).year === DateTime.now().year;

/*
 * Dynamically adds month prefixes if the end month differs from the start
 * month and year suffixes if the end year does not match the current year
 */
const renderEpochDate = (epoch: Epoch) =>
  dedent`
  ${DateTime.fromISO(epoch.start_date).toFormat('LLL dd')} -
    ${DateTime.fromISO(epoch.end_date).toFormat(
      (monthsEqual(epoch.start_date, epoch.end_date) ? '' : 'LLL ') +
        'dd' +
        (yearCurrent(epoch.end_date) ? '' : ' yyyy')
    )}
  `;

const contributionFilterFn =
  ({ start, end }: { start?: string; end: string }) =>
  (c: Contribution) => {
    const startDate = start ?? DateTime.fromSeconds(0).toISO();
    return c?.created_at > startDate && c?.created_at < end;
  };

const EpochGroup = React.memo(function EpochGroup({
  contributions,
  epochs,
  currentContribution,
  setActiveContribution,
  userAddress,
  circleId,
}: Omit<LinkedContributionsAndEpochs, 'users'> &
  SetActiveContributionProps & {
    userAddress?: string;
    circleId: number;
  }) {
  return (
    <Flex column css={{ gap: '$1xl' }}>
      {epochs.map((epoch, idx, epochArray) => (
        <Box key={epoch.id}>
          <Flex column css={{ gap: '$sm' }}>
            <Flex
              alignItems="center"
              css={{
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '$md',
              }}
            >
              <Text h2 bold css={{ gap: '$md' }}>
                {epoch.id === 0 ? 'Latest' : renderEpochDate(epoch)}
                {getEpochLabel(epoch)}
              </Text>
            </Flex>
            {epoch.description && (
              <Text size="medium" css={{ fontWeight: '$medium' }}>
                {epoch.description}
              </Text>
            )}
          </Flex>
          <ContributionPanel>
            <ContributionList
              contributions={contributions.filter(
                contributionFilterFn({
                  start: epochArray[idx + 1]?.end_date,
                  end: epoch.end_date,
                })
              )}
              {...{
                circleId,
                currentContribution,
                epoch,
                setActiveContribution,
                userAddress,
              }}
            />
          </ContributionPanel>

          {contributions.length == 0 && idx == 0 && (
            <PlaceholderContributions />
          )}
        </Box>
      ))}
    </Flex>
  );
});

export default ContributionsPage;
