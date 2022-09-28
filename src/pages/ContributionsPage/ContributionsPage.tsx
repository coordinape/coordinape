import React, { useMemo, useState } from 'react';

import dedent from 'dedent';
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
import { getContributionsAndEpochs, ContributionsAndEpochs } from './queries';

export type Contribution = ContributionsAndEpochs['contributions'][0];
type Epoch = ContributionsAndEpochs['epochs'][0];
type CurrentContribution = { contribution: Contribution; epoch?: Epoch };

const getNewContribution: (userId: number) => Contribution = (
  userId: number
) => ({
  id: 0,
  description: '',
  datetime_created: DateTime.now().toISO(),
  user_id: userId,
});

const getCurrentEpoch = (epoches: Epoch[]) =>
  epoches.find(
    e =>
      e.start_date <= DateTime.now().toISO() &&
      e.end_date > DateTime.now().toISO()
  );

const getEpochLabel = (epoch?: Epoch) => {
  if (!epoch)
    return (
      <Text tag color="active">
        Future
      </Text>
    );
  if (
    epoch.start_date <= DateTime.now().toISO() &&
    epoch.end_date > DateTime.now().toISO()
  )
    return (
      <Text tag color="active">
        Current
      </Text>
    );
  return (
    <Text tag color="complete">
      Complete
    </Text>
  );
};
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
  } = useForm({ mode: 'all' });

  const {
    mutate: createContribution,
    status: createStatus,
    reset: resetCreateMutation,
  } = useMutation(createContributionMutation, {
    onSuccess: newContribution => {
      refetchContributions();
      if (newContribution.insert_contributions_one) {
        setCurrentContribution({
          contribution: newContribution.insert_contributions_one,
          epoch: getCurrentEpoch(data?.epochs || []),
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
            setModalOpen(true);
          }}
        />
      </SingleColumnLayout>
      <Modal
        drawer
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setCurrentContribution(null);
          resetCreateMutation();
          resetUpdateMutation();
          reset();
        }}
      >
        <Panel invertForm>
          {currentContribution && (
            <>
              <Text h2 css={{ gap: '$md' }}>
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
                textArea
              />
              <Flex css={{ justifyContent: 'space-between', mt: '$md' }}>
                <Button
                  outlined
                  color="destructive"
                  size="inline"
                  onClick={() =>
                    deleteContribution({
                      contribution_id: currentContribution.contribution.id,
                    })
                  }
                >
                  Remove
                </Button>
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
                  <Button
                    outlined
                    color="primary"
                    size="inline"
                    type="submit"
                    disabled={!isDirty || mutationStatus() === 'loading'}
                    onClick={() =>
                      currentContribution.contribution.id === 0
                        ? createContribution({
                            user_id: currentUserId,
                            circle_id: selectedCircle.id,
                            description: descriptionField.value,
                          })
                        : mutateContribution({
                            id: currentContribution.contribution.id,
                            datetime_created:
                              currentContribution.contribution.datetime_created,
                            description: descriptionField.value,
                          })
                    }
                  >
                    Save
                  </Button>
                </Flex>
              </Flex>
            </>
          )}
        </Panel>
      </Modal>
    </>
  );
};

type SetActiveContributionProp = {
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
}: ContributionsAndEpochs & SetActiveContributionProp) => {
  const latestEpoch = epochs[0] as Epoch | undefined;
  const activeEpoch = useMemo(() => getCurrentEpoch(epochs), [epochs.length]);
  return (
    <>
      <Box key={-1}>
        <Box>
          <Text h2 css={{ gap: '$md' }}>
            Latest
            <Text tag color="active">
              Future
            </Text>
          </Text>
        </Box>
        <Panel css={{ gap: '$md' }}>
          <ContributionList
            contributions={contributions.filter(c =>
              latestEpoch ? c.datetime_created > latestEpoch.end_date : true
            )}
            currentContribution={currentContribution}
            setActiveContribution={setActiveContribution}
          />
        </Panel>
      </Box>
      {epochs.map(epoch => (
        <Box key={epoch.id}>
          <Box>
            <Text h2 css={{ gap: '$md' }}>
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
          <Panel css={{ gap: '$md' }}>
            <ContributionList
              contributions={contributions.filter(contributionFilterFn(epoch))}
              currentContribution={currentContribution}
              setActiveContribution={setActiveContribution}
              epoch={epoch}
            />
          </Panel>
        </Box>
      ))}
    </>
  );
};

type ContributionListProps = Pick<ContributionsAndEpochs, 'contributions'>;
const ContributionList = ({
  epoch,
  contributions,
  setActiveContribution,
  currentContribution,
}: ContributionListProps & SetActiveContributionProp & { epoch?: Epoch }) => {
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
              // TODO change background to graffe's color
              '&:hover': { background: '$info', border: '2px solid $link' },
            }}
            nested={true}
            onClick={() => {
              setActiveContribution(c, epoch);
            }}
          >
            <Box
              css={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {c.description}
            </Box>
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
