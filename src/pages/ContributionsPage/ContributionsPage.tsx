import React, { useEffect, useMemo, useState } from 'react';

import dedent from 'dedent';
import { debounce } from 'lodash';
import { DateTime } from 'luxon';
import { useForm, useController } from 'react-hook-form';
import { useQuery, useMutation } from 'react-query';

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
  Check,
  AlertTriangle,
  Save,
  ChevronDown,
  ChevronUp,
} from 'icons/__generated';
import { Panel, Text, Box, Modal, Button, Flex } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

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
  isEpochCurrent,
} from './util';

const DEBOUNCE_TIMEOUT = 1000;

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
  const [currentContribution, setCurrentContribution] =
    useState<CurrentContribution | null>(null);
  const [currentIntContribution, setCurrentIntContribution] =
    useState<CurrentIntContribution | null>(null);

  const {
    data,
    refetch: refetchContributions,
    isFetching,
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

  const {
    control,
    reset,
    resetField,
    formState: { isDirty },
  } = useForm({ mode: 'all' });

  const {
    mutate: createContribution,
    status: createStatus,
    reset: resetCreateMutation,
  } = useMutation(createContributionMutation, {
    onSuccess: newContribution => {
      refetchContributions();
      if (newContribution.insert_contributions_one) {
        resetField('description', {
          defaultValue: newContribution.insert_contributions_one.description,
        });
        setCurrentContribution({
          contribution: {
            ...newContribution.insert_contributions_one,
            next: () => data?.contributions[0],
            prev: () => undefined,
            idx: 0,
          },
          epoch: getCurrentEpoch(data?.epochs ?? []),
        });
      } else {
        resetCreateMutation();
      }
    },
  });

  const {
    mutate: mutateContribution,
    status: updateStatus,
    reset: resetUpdateMutation,
  } = useMutation(updateContributionMutation, {
    mutationKey: ['updateContribution', currentContribution?.contribution.id],
    onSettled: () => {
      //refetchContributions();
    },
    onSuccess: ({ updateContribution }) => {
      refetchContributions();
      if (
        updateContribution?.updateContribution_Contribution.id ===
        currentContribution?.contribution.id
      )
        resetField('description', {
          defaultValue:
            updateContribution?.updateContribution_Contribution.description,
        });
    },
  });

  const { mutate: deleteContribution } = useMutation(
    deleteContributionMutation,
    {
      mutationKey: ['deleteContribution', currentContribution?.contribution.id],
      onSuccess: () => {
        setModalOpen(false);
        setCurrentContribution(null);
        refetchContributions();
        reset();
      },
    }
  );

  const { field: descriptionField } = useController({
    name: 'description',
    control,
  });

  const saveContribution = useMemo(() => {
    return (value: string) => {
      if (!currentContribution) return;
      currentContribution.contribution.id === 0
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
      debounce(
        (s: typeof saveContribution, v: string) => s(v),
        DEBOUNCE_TIMEOUT
      ),
    [currentContribution?.contribution.id]
  );

  useEffect(() => {
    handleDebouncedDescriptionChange.cancel();
    if (isDirty && descriptionField.value.length > 0) {
      handleDebouncedDescriptionChange(
        saveContribution,
        descriptionField.value
      );
    }
    resetUpdateMutation();
  }, [descriptionField.value, currentContribution?.contribution.id]);

  const mutationStatus = () =>
    currentContribution?.contribution.id === 0 ? createStatus : updateStatus;

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
  }, [
    data?.epochs.length,
    data?.contributions.length,
    updateStatus === 'success' && isFetching === false,
  ]);

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
          css={{
            justifyContent: 'space-between',
            alignItems: 'flex-end',
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
                epoch: memoizedEpochData.epochs[0],
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
        onClose={() => {
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
              <Text h2 css={{ gap: '$md', my: '$xl' }}>
                {currentContribution.epoch.id
                  ? renderEpochDate(currentContribution.epoch)
                  : 'Latest'}
                {getEpochLabel(currentContribution.epoch)}
                <Text p>
                  {DateTime.fromISO(
                    currentContribution.contribution.datetime_created
                  ).toFormat('LLL dd')}
                </Text>
              </Text>
              {isEpochCurrent(currentContribution.epoch) ? (
                <FormInputField
                  id="description"
                  name="description"
                  control={control}
                  defaultValue={currentContribution.contribution.description}
                  areaProps={{ rows: 18, autoFocus: true }}
                  disabled={!isEpochCurrent(currentContribution.epoch)}
                  textArea
                />
              ) : (
                <Panel nested>
                  <Text p>{currentContribution.contribution.description}</Text>
                </Panel>
              )}
              {isEpochCurrent(currentContribution.epoch) && (
                <Flex
                  css={{
                    justifyContent: 'space-between',
                    mt: '$lg',
                    flexDirection: 'row-reverse',
                  }}
                >
                  <Flex css={{ gap: '$md' }}>
                    <Text
                      css={{ gap: '$sm' }}
                      color={updateStatus === 'error' ? 'alert' : 'neutral'}
                    >
                      {mutationStatus() === 'loading' && (
                        <>
                          <Save />
                          Saving...
                        </>
                      )}
                      {(updateStatus === 'success' ||
                        (createStatus === 'success' &&
                          updateStatus === 'idle')) && (
                        <>
                          <Check /> Changes Saved
                        </>
                      )}
                      {mutationStatus() === 'error' && isDirty && (
                        <>
                          <AlertTriangle />
                          Error
                        </>
                      )}
                    </Text>
                  </Flex>
                  <Button
                    outlined
                    color="destructive"
                    size="medium"
                    onClick={() => {
                      handleDebouncedDescriptionChange.cancel();
                      deleteContribution({
                        contribution_id: currentContribution.contribution.id,
                      });
                    }}
                  >
                    Delete
                  </Button>
                </Flex>
              )}
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
    Epoch ${epoch.number}: ${DateTime.fromISO(epoch.start_date).toFormat(
    'LLL dd'
  )} -
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
  const activeEpoch = useMemo(() => getCurrentEpoch(epochs), [epochs.length]);
  return (
    <Flex column css={{ gap: '$1xl' }}>
      {epochs.map((epoch, idx, epochArray) => (
        <Box key={epoch.id}>
          <Box>
            <Text h2 bold css={{ gap: '$md' }}>
              {epoch.id === 0 ? 'Latest' : renderEpochDate(epoch)}
              {activeEpoch?.id === epoch.id ? (
                <Text tag color="active">
                  {epoch.id === 0 ? 'Future' : 'Current'}
                </Text>
              ) : (
                <Text tag color="complete">
                  Complete
                </Text>
              )}
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
              key={c.id}
              css={{
                border:
                  currentContribution?.contribution.id === c.id
                    ? '2px solid $link'
                    : '2px solid $border',
                cursor: 'pointer',
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
