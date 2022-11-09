import React, { useEffect, useMemo, useState } from 'react';

import dedent from 'dedent';
import { debounce } from 'lodash';
import { DateTime } from 'luxon';
import { useForm, useController } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from 'react-query';

import useConnectedAddress from '../../hooks/useConnectedAddress';
import { useSelectedCircle } from '../../recoilState';
import { LoadingModal, FormInputField } from 'components';
import {
  useContributions,
  Contribution as IntegrationContribution,
} from 'hooks/useContributions';
import {
  DeworkColor,
  WonderColor,
  ChevronDown,
  ChevronUp,
} from 'icons/__generated';
import { QUERY_KEY_ALLOCATE_CONTRIBUTIONS } from 'pages/GivePage/EpochStatementDrawer';
import { Panel, Text, Box, Modal, Button, Flex, MarkdownPreview } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';
import { SavingIndicator, SaveState } from 'ui/SavingIndicator';

import {
  deleteContributionMutation,
  updateContributionMutation,
  createContributionMutation,
} from './mutations';
import {
  getContributionsAndEpochs,
  ContributionsAndEpochs,
  Contribution,
  Epoch,
} from './queries';
import {
  getCurrentEpoch,
  getNewContribution,
  getEpochLabel,
  createLinkedArray,
  LinkedElement,
  jumpToEpoch,
  isEpochCurrentOrLater,
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

type LinkedContributionsAndEpochs = {
  contributions: Array<LinkedElement<Contribution>>;
  epochs: Array<LinkedElement<Epoch>>;
  users: ContributionsAndEpochs['users'];
};

type CurrentContribution = {
  contribution: LinkedElement<Contribution>;
  epoch: LinkedElement<Epoch>;
};
type CurrentIntContribution = {
  contribution: IntegrationContribution;
  epoch?: LinkedElement<Epoch>;
};

const contributionIcon = (source: string) => {
  switch (source) {
    case 'wonder':
      return <WonderColor css={{ mr: '$md' }} />;
    default:
      return <DeworkColor css={{ mr: '$md' }} />;
  }
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
  const { circle: selectedCircle } = useSelectedCircle();
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
    ['contributions', selectedCircle.id],
    () =>
      getContributionsAndEpochs({
        circleId: selectedCircle.id,
        userAddress: address,
      }),
    {
      enabled: !!(selectedCircle.id && address),
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
    if (!showMarkdown) {
      document?.getElementById('epoch_statement')?.focus();
    }
  }, [
    currentContribution?.contribution.id,
    saveState[currentContribution?.contribution.id],
    showMarkdown,
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
      },
    }
  );

  const saveContribution = useMemo(() => {
    return (value: string) => {
      if (!currentContribution) return;
      currentContribution.contribution.id === NEW_CONTRIBUTION_ID
        ? createContribution({
            user_id: currentUserId,
            circle_id: selectedCircle.id,
            description: value,
          })
        : mutateContribution({
            id: currentContribution.contribution.id,
            datetime_created: currentContribution.contribution.datetime_created,
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

  return (
    <>
      <SingleColumnLayout>
        <Flex
          alignItems="end"
          css={{
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '$md',
          }}
        >
          <Text h1>Contributions</Text>
          <Button
            outlined
            color="primary"
            onClick={() => {
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
            }}
          >
            Add Contribution
          </Button>
        </Flex>
        <Text p>What have you been working on?</Text>
        <EpochGroup
          contributions={memoizedEpochData.contributions || []}
          epochs={memoizedEpochData.epochs || []}
          currentContribution={currentContribution}
          setActiveContribution={activeContributionFn}
          userAddress={address}
        />
      </SingleColumnLayout>
      <Modal
        drawer
        css={{
          paddingBottom: 0,
          paddingLeft: '$md',
          paddingRight: '$md',
          paddingTop: 0,
          overflowY: 'scroll',
        }}
        open={modalOpen}
        onOpenChange={() => {
          setModalOpen(false);
          setCurrentContribution(null);
          setCurrentIntContribution(null);
          resetCreateMutation();
          resetUpdateMutation();
          reset();
        }}
      >
        <Panel invertForm css={{ '& textarea': { resize: 'vertical' } }}>
          {currentContribution ? (
            <>
              <Flex>
                <Button
                  color="white"
                  size="large"
                  css={nextPrevCss}
                  disabled={
                    currentContribution.contribution.prev() === undefined
                  }
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
                        prevContribution.datetime_created
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
                  color="white"
                  css={nextPrevCss}
                  disabled={
                    currentContribution.contribution.next() === undefined
                  }
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
                        nextContribution.datetime_created
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
              <Flex
                alignItems="center"
                css={{
                  my: '$xl',
                }}
              >
                <Text
                  h3
                  semibold
                  css={{
                    mr: '$md',
                  }}
                >
                  {currentContribution.epoch.id
                    ? renderEpochDate(currentContribution.epoch)
                    : 'Latest'}
                </Text>
                {getEpochLabel(currentContribution.epoch)}
              </Flex>
              <Flex column css={{ gap: '$sm' }}>
                <Flex
                  css={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}
                >
                  <Text inline semibold size="medium">
                    Contribution
                  </Text>
                  <Text variant="label">
                    {DateTime.fromISO(
                      currentContribution.contribution.datetime_created
                    ).toFormat('LLL dd')}
                  </Text>
                </Flex>
                {isEpochCurrentOrLater(currentContribution.epoch) ? (
                  showMarkdown && !!descriptionField.value.length ? (
                    <Box
                      onClick={() => {
                        setShowMarkDown(false);
                      }}
                    >
                      <MarkdownPreview source={descriptionField.value} />
                    </Box>
                  ) : (
                    <FormInputField
                      id="description"
                      name="description"
                      control={control}
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
                              saveState[currentContribution.contribution.id] ==
                                'saving'
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
                  )
                ) : (
                  <Panel nested>
                    <MarkdownPreview
                      source={currentContribution.contribution.description}
                    />
                  </Panel>
                )}
                {isEpochCurrentOrLater(currentContribution.epoch) && (
                  <Flex
                    css={{
                      justifyContent: 'space-between',
                      mt: '$sm',
                    }}
                  >
                    <Button
                      outlined
                      color="destructive"
                      size="small"
                      disabled={!currentContribution.contribution.id}
                      onClick={() => {
                        handleDebouncedDescriptionChange.cancel();
                        deleteContribution({
                          contribution_id: currentContribution.contribution.id,
                        });
                      }}
                    >
                      Delete
                    </Button>
                    <SavingIndicator
                      saveState={saveState[currentContribution.contribution.id]}
                      retry={() => {
                        saveContribution(descriptionField.value);
                        refetchContributions();
                      }}
                    />
                  </Flex>
                )}
              </Flex>
            </>
          ) : currentIntContribution ? (
            <>
              <Text h2 css={{ gap: '$md', my: '$xl' }}>
                {currentIntContribution.epoch
                  ? renderEpochDate(currentIntContribution.epoch)
                  : 'Latest'}
                {getEpochLabel(currentIntContribution.epoch)}
              </Text>
              <Panel css={{ pl: '0 !important' }}>
                <Text p size="large" semibold css={{ color: '$headingText' }}>
                  {contributionSource(
                    currentIntContribution.contribution.source
                  )}
                </Text>
              </Panel>
              <Panel nested>
                <Text p>
                  {contributionIcon(currentIntContribution.contribution.source)}
                  {currentIntContribution.contribution.title}
                </Text>
              </Panel>
            </>
          ) : (
            <></>
          )}
        </Panel>
      </Modal>
    </>
  );
};

type SetActiveContributionProps = {
  setActiveContribution: (
    e: LinkedElement<Epoch>,
    c?: LinkedElement<Contribution>,
    intC?: IntegrationContribution
  ) => void;
  currentContribution: CurrentContribution | null;
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
    Epoch${epoch.number ? ` ${epoch.number}` : ''}: ${DateTime.fromISO(
    epoch.start_date
  ).toFormat('LLL dd')} -
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
    return c.datetime_created > startDate && c.datetime_created < end;
  };

const EpochGroup = React.memo(function EpochGroup({
  contributions,
  epochs,
  currentContribution,
  setActiveContribution,
  userAddress,
}: Omit<LinkedContributionsAndEpochs, 'users'> &
  SetActiveContributionProps & { userAddress?: string }) {
  return (
    <Flex column css={{ gap: '$1xl' }}>
      {epochs.map((epoch, idx, epochArray) => (
        <Box key={epoch.id}>
          <Box>
            <Text h2 bold css={{ gap: '$md' }}>
              {epoch.id === 0 ? 'Latest' : renderEpochDate(epoch)}
              {getEpochLabel(epoch)}
            </Text>
          </Box>
          <Panel css={{ gap: '$md', borderRadius: '$4', mt: '$lg' }}>
            <ContributionList
              contributions={contributions.filter(
                contributionFilterFn({
                  start: epochArray[idx + 1]?.end_date,
                  end: epoch.end_date,
                })
              )}
              currentContribution={currentContribution}
              setActiveContribution={setActiveContribution}
              epoch={epoch}
              userAddress={userAddress}
            />
          </Panel>
        </Box>
      ))}
    </Flex>
  );
});

type ContributionListProps = {
  contributions: Array<LinkedElement<Contribution>>;
  epoch: LinkedElement<Epoch>;
  userAddress?: string;
} & SetActiveContributionProps;
const ContributionList = ({
  epoch,
  contributions,
  setActiveContribution,
  currentContribution,
  userAddress,
}: ContributionListProps) => {
  // epochs are listed in chronologically descending order
  // so the next epoch in the array is the epoch that ended
  // before the one here
  const priorEpoch = epoch.next();
  const integrationContributions = useContributions({
    address: userAddress || '',
    startDate: priorEpoch
      ? priorEpoch.end_date
      : // add a buffer of time before the start date if this is the first epoch
        // Querying from epoch time 0 is apparently an unwelcome
        // practice for some integrators
        DateTime.fromISO(epoch.start_date).minus({ months: 1 }).toISO(),
    endDate: epoch.end_date,
    mock: false,
  });

  return (
    <>
      {contributions.length || integrationContributions?.length ? (
        <>
          {contributions.map(c => (
            <Panel
              tabIndex={0}
              key={c.id}
              css={{
                border:
                  currentContribution?.contribution.id === c.id
                    ? '2px solid $link'
                    : '2px solid $border',
                cursor: 'pointer',
                transition: 'background-color 0.3s, border-color 0.3s',
                background:
                  currentContribution?.contribution.id === c.id
                    ? '$highlight'
                    : 'white',
                '&:hover': {
                  background: '$highlight',
                  border: '2px solid $link',
                },
              }}
              nested
              onClick={() => {
                setActiveContribution(epoch, c, undefined);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveContribution(epoch, c, undefined);
                }
              }}
            >
              <Flex css={{ justifyContent: 'space-between' }}>
                <Text
                  ellipsis
                  css={{
                    mr: '10px',
                    maxWidth: '60em',
                  }}
                >
                  {c.description}
                </Text>
                <Text variant="label" css={{ whiteSpace: 'nowrap' }}>
                  {DateTime.fromISO(c.datetime_created).toFormat('LLL dd')}
                </Text>
              </Flex>
            </Panel>
          ))}
          {integrationContributions?.map(c => (
            <Panel
              key={c.title}
              css={{
                border: '2px solid $border',
                cursor: 'pointer',
                background: 'white',
                '&:hover': {
                  background: '$highlight',
                  border: '2px solid $link',
                },
              }}
              nested
              onClick={() => {
                setActiveContribution(epoch, undefined, c);
              }}
            >
              <Text
                ellipsis
                css={{
                  mr: '10px',
                  maxWidth: '60em',
                }}
              >
                {contributionIcon(c.source)}
                {c.title}
              </Text>
            </Panel>
          ))}
        </>
      ) : epoch.id !== 0 ? (
        <Text>You don&apos;t have any contributions in this epoch</Text>
      ) : (
        <Text>You don&apos;t have any contributions yet</Text>
      )}
    </>
  );
};

export default ContributionsPage;
