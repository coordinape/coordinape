import React, { useEffect, useMemo, useState } from 'react';

import dedent from 'dedent';
import { debounce } from 'lodash';
import { DateTime } from 'luxon';
import { useForm, useController } from 'react-hook-form';
import { useQuery, useMutation } from 'react-query';

import useConnectedAddress from '../../hooks/useConnectedAddress';
import { useSelectedCircle } from '../../recoilState';
import { LoadingModal, FormInputField } from 'components';
import { Check, AlertTriangle, Save } from 'icons/__generated';
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
import { getCurrentEpoch, getNewContribution, getEpochLabel } from './util';

type CurrentContribution = { contribution: Contribution; epoch?: Epoch };

const ContributionsPage = () => {
  const address = useConnectedAddress();
  const { circle: selectedCircle } = useSelectedCircle();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentContribution, setCurrentContribution] =
    useState<CurrentContribution | null>(null);

  const { data, refetch: refetchContributions } = useQuery(
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
    }
  );

  const {
    control,
    formState: { isDirty },
    reset,
    resetField,
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
          contribution: newContribution.insert_contributions_one,
          epoch: getCurrentEpoch(data?.epochs ?? []),
        });
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
      refetchContributions();
    },
    onSuccess: updatedContribution => {
      resetField('description', {
        defaultValue:
          updatedContribution.updateContribution
            ?.updateContribution_Contribution.description,
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
    rules: { minLength: 1 },
    control,
  });

  const saveContribution = useMemo(() => {
    if (!descriptionField.value) return () => {};
    return () => {
      if (!currentContribution) return;
      currentContribution.contribution.id === 0
        ? createContribution({
            user_id: currentUserId,
            circle_id: selectedCircle.id,
            description: descriptionField.value,
          })
        : mutateContribution({
            id: currentContribution.contribution.id,
            datetime_created: currentContribution.contribution.datetime_created,
            description: descriptionField.value,
          });
    };
  }, [currentContribution?.contribution.id, descriptionField.value]);

  // We need to instantiate exactly one debounce function for each newly
  // mounted currentContribution so it can be cancelled. Otherwise,
  // the handle of a live function is lost on re-render and we cannot
  // cancel the call when a bunch of typing is happening
  const handleDebouncedDescriptionChange = useMemo(
    () => debounce((s: typeof saveContribution) => s(), 1000),
    [currentContribution?.contribution.id]
  );

  useEffect(() => {
    handleDebouncedDescriptionChange.cancel();
    if (isDirty) {
      handleDebouncedDescriptionChange(saveContribution);
      resetUpdateMutation();
      resetCreateMutation();
    }
  }, [descriptionField.value]);

  const mutationStatus = () =>
    currentContribution?.contribution.id === 0 ? createStatus : updateStatus;

  /// Return here if we don't have the data so that the actual page component can be simpler
  if (!data) {
    return <LoadingModal visible />;
  }

  const currentUserId: number = data.users[0]?.id;

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
                contribution: getNewContribution(currentUserId),
                epoch: getCurrentEpoch(data.epochs),
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
          {...data}
          currentContribution={currentContribution}
          setActiveContribution={(
            contribution: Contribution,
            epoch?: Epoch
          ) => {
            setCurrentContribution({ contribution, epoch });
            resetField('description', {
              defaultValue: contribution.description,
            });
            setModalOpen(true);
          }}
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
  setActiveContribution: (c: Contribution, e?: Epoch) => void;
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

const EpochGroup = ({
  contributions,
  epochs,
  currentContribution,
  setActiveContribution,
}: ContributionsAndEpochs & SetActiveContributionProps) => {
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
};

type ContributionListProps = Pick<ContributionsAndEpochs, 'contributions'>;
const ContributionList = ({
  epoch,
  contributions,
  setActiveContribution,
  currentContribution,
}: ContributionListProps & SetActiveContributionProps & { epoch?: Epoch }) => {
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
            nested={true}
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
