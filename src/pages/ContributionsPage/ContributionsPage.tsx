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
} from './util';

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
  epoch?: LinkedElement<Epoch>;
};

const ContributionsPage = () => {
  const address = useConnectedAddress();
  const { circle: selectedCircle } = useSelectedCircle();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentContribution, setCurrentContribution] =
    useState<CurrentContribution | null>(null);

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
      if (
        newContribution.insert_contributions_one?.id ===
        currentContribution?.contribution.id
      ) {
        if (newContribution.insert_contributions_one) {
          resetField('description', {
            defaultValue: newContribution.insert_contributions_one.description,
          });
          setCurrentContribution({
            contribution: {
              ...newContribution.insert_contributions_one,
              next: () => data?.contributions[1],
              prev: () => undefined,
              idx: 0,
            },
            epoch: getCurrentEpoch(data?.epochs ?? []),
          });
        }
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
    () => debounce((s: typeof saveContribution, v: string) => s(v), 1000),
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
    resetCreateMutation();
  }, [descriptionField.value, currentContribution?.contribution.id]);

  const mutationStatus = () =>
    currentContribution?.contribution.id === 0 ? createStatus : updateStatus;

  // prevents page re-renders when typing out a contribution
  // This seems pretty silly but it's actually a huge optimization
  // when 30+ contributions are on the page
  const memoizedEpochData = useMemo(() => {
    return data;
  }, [
    data?.epochs.length,
    data?.contributions.length,
    updateStatus === 'success' && isFetching === false,
  ]);

  const activeContributionFn = useMemo(
    () =>
      (
        contribution: LinkedElement<Contribution>,
        epoch?: LinkedElement<Epoch>
      ) => {
        setCurrentContribution({ contribution, epoch });
        resetField('description', {
          defaultValue: contribution.description,
        });
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
            alignItems: 'baseline',
            flexWrap: 'wrap',
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
          resetCreateMutation();
          resetUpdateMutation();
          reset();
        }}
      >
        <Panel invertForm css={{ '& textarea': { resize: 'vertical' } }}>
          {currentContribution && (
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
                    const nextEpoch =
                      currentContribution.epoch?.end_date <
                      prevContribution?.datetime_created
                        ? currentContribution.epoch
                        : currentContribution.epoch?.prev();

                    setCurrentContribution({
                      contribution: prevContribution,
                      epoch: nextEpoch,
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
                    const nextEpoch =
                      currentContribution.epoch?.start_date <
                      nextContribution?.datetime_created
                        ? currentContribution.epoch
                        : currentContribution.epoch?.next();

                    setCurrentContribution({
                      contribution: nextContribution,
                      epoch: nextEpoch,
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
                {currentContribution.epoch
                  ? renderEpochDate(currentContribution.epoch)
                  : 'Latest'}
                {getEpochLabel(currentContribution.epoch)}
                <Text p>
                  {DateTime.fromISO(
                    currentContribution.contribution.datetime_created
                  ).toFormat('LLL dd')}
                </Text>
              </Text>
              <FormInputField
                id="description"
                name="description"
                control={control}
                defaultValue={currentContribution.contribution.description}
                areaProps={{ rows: 18 }}
                textArea
              />
              <Flex
                css={{
                  justifyContent: 'space-between',
                  mt: '$lg',
                  // done so `tab` jumps to the Save Button first
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
            </>
          )}
        </Panel>
      </Modal>
    </>
  );
};

type SetActiveContributionProps = {
  setActiveContribution: (
    c: LinkedElement<Contribution>,
    e?: LinkedElement<Epoch>
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

const contributionFilterFn = (epoch: Epoch) => (c: Contribution) =>
  c.datetime_created > epoch.start_date && c.datetime_created < epoch.end_date;

const EpochGroup = React.memo(function EpochGroup({
  contributions,
  epochs,
  currentContribution,
  setActiveContribution,
}: Omit<LinkedContributionsAndEpochs, 'users'> & SetActiveContributionProps) {
  const latestEpoch = epochs[0] as Epoch | undefined;
  const activeEpoch = useMemo(() => getCurrentEpoch(epochs), [epochs.length]);
  return (
    <Flex column css={{ gap: '$1xl' }}>
      {activeEpoch === undefined && (
        <Box key={-1}>
          <Box>
            <Text h2 bold css={{ gap: '$md', my: '$lg' }}>
              Latest
              <Text tag color="active">
                Future
              </Text>
            </Text>
          </Box>
          <Panel css={{ gap: '$lg', borderRadius: '$4' }}>
            <ContributionList
              contributions={contributions.filter(c =>
                latestEpoch ? c.datetime_created > latestEpoch.end_date : true
              )}
              currentContribution={currentContribution}
              setActiveContribution={setActiveContribution}
            />
          </Panel>
        </Box>
      )}
      {epochs.map(epoch => (
        <Box key={epoch.id}>
          <Box>
            <Text h2 bold css={{ gap: '$md' }}>
              {renderEpochDate(epoch)}
              {activeEpoch?.id === epoch.id ? (
                <Text tag color="active">
                  Current
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
              contributions={contributions.filter(contributionFilterFn(epoch))}
              currentContribution={currentContribution}
              setActiveContribution={setActiveContribution}
              epoch={epoch}
            />
          </Panel>
        </Box>
      ))}
    </Flex>
  );
});

type ContributionListProps = {
  contributions: Array<LinkedElement<Contribution>>;
};
const ContributionList = ({
  epoch,
  contributions,
  setActiveContribution,
  currentContribution,
}: ContributionListProps &
  SetActiveContributionProps & { epoch?: LinkedElement<Epoch> }) => {
  return (
    <>
      {contributions.length ? (
        contributions.map(c => (
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
              setActiveContribution(c, epoch);
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
        ))
      ) : epoch ? (
        <Text>You don&apos;t have any contributions in this epoch</Text>
      ) : (
        <Text>You don&apos;t have any contributions yet</Text>
      )}
    </>
  );
};

export default ContributionsPage;
