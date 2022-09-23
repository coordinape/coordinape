import React from 'react';

import { DateTime } from 'luxon';
import { useQuery } from 'react-query';

import useConnectedAddress from '../../hooks/useConnectedAddress';
import { useSelectedCircle } from '../../recoilState';
import { LoadingModal } from 'components';
import { Panel, Text, Box } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { getContributionsAndEpochs, ContributionsAndEpochs } from './queries';

const ContributionsPage = () => {
  const address = useConnectedAddress();
  const { circle: selectedCircle } = useSelectedCircle();

  const { data } = useQuery(
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

  /// Return here if we don't have the data so that the actual page component can be simpler
  if (!data) {
    return <LoadingModal visible={true} />;
  }

  console.info({ data });
  return (
    <SingleColumnLayout>
      <Text h1={true}>Contributions</Text>
      <Text p={true}>What have you been working on?</Text>
      <EpochGroup {...data} />
    </SingleColumnLayout>
  );
};

const EpochGroup = ({ contributions, epochs }: ContributionsAndEpochs) => {
  const contributionFilterFn =
    (epoch: typeof epochs[0]) => (c: typeof contributions[0]) =>
      c.datetime_created > epoch.start_date &&
      c.datetime_created < epoch.end_date;
  const monthsEqual = (start: string, end: string) =>
    DateTime.fromISO(start).month === DateTime.fromISO(end).month;

  const yearCurrent = (end: string) =>
    DateTime.fromISO(end).year === DateTime.now().year;
  return (
    <>
      {epochs.map(epoch => (
        <Box key={epoch.id}>
          <Box>
            <Text h2={true}>
              Epoch {epoch.number}:{' '}
              {DateTime.fromISO(epoch.start_date).toFormat('LLL dd')} -{' '}
              {DateTime.fromISO(epoch.end_date).toFormat(
                (monthsEqual(epoch.start_date, epoch.end_date) ? '' : 'LLL ') +
                  'dd' +
                  (yearCurrent(epoch.end_date) ? '' : ' yyyy')
              )}
            </Text>
          </Box>
          <Panel>
            <ContributionList
              contributions={
                contributions.filter(contributionFilterFn(epoch))
                /*.slice(0, 4)*/
              }
            />
          </Panel>
        </Box>
      ))}
    </>
  );
};

type ContributionListProps = Pick<ContributionsAndEpochs, 'contributions'>;
const ContributionList = ({ contributions }: ContributionListProps) => {
  return (
    <>
      {contributions.map(c => (
        <Panel
          style={{ marginTop: '10px', marginBottom: '10px' }}
          key={c.id}
          nested={true}
        >
          {/* TODO: truncate text with ellipsis*/}
          {c.description}
          {/* TODO: Delete the below logging detail*/}
          <br />
          <br />
          {c.datetime_created}
        </Panel>
      ))}
    </>
  );
};

export default ContributionsPage;
