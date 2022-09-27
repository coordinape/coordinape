import React, { useState } from 'react';

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

import { updateContributionMutation } from './mutations';
import { getContributionsAndEpochs, ContributionsAndEpochs } from './queries';

export type Contribution = ContributionsAndEpochs['contributions'][0];
type Epoch = ContributionsAndEpochs['epochs'][0];
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
  } = useForm({ mode: 'all' });

  const { mutate: mutateContribution, status } = useMutation(
    updateContributionMutation,
    {
      mutationKey: ['updateContribution', currentContribution?.contribution.id],
      onSettled: () => {
        refetchContributions();
      },
    }
  );

  const { field: descriptionField } = useController({
    name: 'description',
    control,
  });

  /// Return here if we don't have the data so that the actual page component can be simpler
  if (!data) {
    return <LoadingModal visible />;
  }

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
          <Button outlined color="primary" onClick={() => {}}>
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
          reset();
        }}
      >
        <Panel invertForm>
          {currentContribution && (
            <>
              <Text h2>
                {currentContribution.epoch
                  ? renderEpochDate(currentContribution.epoch)
                  : 'Latest'}
              </Text>
              <Text p>
                {DateTime.fromISO(
                  currentContribution.contribution.datetime_created
                ).toFormat('LLL dd')}
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
                      id: currentContribution.contribution.id,
                    })
                  }
                >
                  Remove
                </Button>
                <Flex css={{ gap: '$md' }}>
                  <Text
                    css={{ gap: '$sm' }}
                    color={status === 'error' ? 'alert' : 'neutral'}
                  >
                    {status === 'loading' && (
                      <>
                        <Save />
                        Saving...
                      </>
                    )}
                    {status === 'success' && (
                      <>
                        <Check /> Changes Saved
                      </>
                    )}
                    {status === 'error' && isDirty && (
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
                    disabled={!isDirty || status === 'loading'}
                    onClick={() =>
                      mutateContribution({
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
  const latestEpoch = epochs[0];
  return (
    <>
      <Box key={-1}>
        <Box>
          <Text h2={true}>Latest</Text>
        </Box>
        <Panel css={{ gap: '$md' }}>
          <ContributionList
            contributions={contributions
              .filter(c => c.datetime_created > latestEpoch.end_date)
              .slice(0, 4)}
            currentContribution={currentContribution}
            setActiveContribution={setActiveContribution}
          />
        </Panel>
      </Box>
      {epochs.map(epoch => (
        <Box key={epoch.id}>
          <Box>
            <Text h2={true}>{renderEpochDate(epoch)}</Text>
          </Box>
          <Panel css={{ gap: '$md' }}>
            <ContributionList
              contributions={contributions
                .filter(contributionFilterFn(epoch))
                .slice(0, 4)}
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
      {contributions.map(c => (
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
          {/* TODO: truncate text with ellipsis*/}
          <Box>{c.description}</Box>
        </Panel>
      ))}
    </>
  );
};

export default ContributionsPage;
