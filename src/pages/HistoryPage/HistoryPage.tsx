import { useState, useMemo } from 'react';

import { DateTime } from 'luxon';
import { useQuery } from 'react-query';

import { LoadingModal } from 'components';
import { Paginator } from 'components/Paginator';
import { useContracts } from 'hooks';
import { useSelectedCircle } from 'recoilState/app';
import { paths } from 'routes/paths';
import { Panel, Text, AppLink } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { CurrentEpochPanel } from './CurrentEpochPanel';
import { EpochPanel } from './EpochPanel';
import { getHistoryData, QueryEpoch } from './getHistoryData';

const pageSize = 3;

export const HistoryPage = () => {
  const contracts = useContracts();
  const {
    circle: { id: circleId },
    myUser: { id: userId },
  } = useSelectedCircle();

  const query = useQuery(
    ['history', circleId],
    () => getHistoryData(circleId, userId, contracts),
    { enabled: !!userId && !!circleId }
  );

  const circle = query.data;
  const me = circle?.users[0];

  const nextEpoch = circle?.futureEpoch[0];
  const nextEpochStartLabel = useMemo(() => {
    if (!nextEpoch) return '';
    const date = DateTime.fromISO(nextEpoch.start_date);
    const diff = date
      .diffNow(['days', 'hours', 'minutes'])
      .toHuman({ unitDisplay: 'short', notation: 'compact' });
    return `starts in ${diff}, on ${date.toFormat('LLL d')}`;
  }, [nextEpoch]);

  const currentEpoch = circle?.currentEpoch[0];
  const pastEpochs = circle?.pastEpochs || [];

  // TODO fetch only data for page shown
  const [page, setPage] = useState(0);
  const shownPastEpochs = useMemo(
    () => pastEpochs.slice(page * pageSize, (page + 1) * pageSize),
    [pastEpochs, page]
  );
  const totalPages = Math.ceil(pastEpochs.length / pageSize);

  const nominees = circle?.nominees_aggregate.aggregate?.count || 0;
  const unallocated = (!me?.non_giver && me?.give_token_remaining) || 0;

  if (query.isLoading || query.isIdle) return <LoadingModal visible />;

  if (!currentEpoch && !nextEpoch && pastEpochs.length === 0) {
    return (
      <SingleColumnLayout>
        <p>
          This circle has no epochs yet.{' '}
          {me?.role === 1 ? (
            <>
              <AppLink to={paths.adminCircles}>Visit the admin page</AppLink> to
              create one.
            </>
          ) : (
            <>Please return once your admin has created one.</>
          )}
        </p>
      </SingleColumnLayout>
    );
  }

  return (
    <SingleColumnLayout>
      <Text h1 css={{ mb: '$md' }}>
        Epoch Overview
      </Text>
      {nextEpoch && (
        <>
          <Text h3>Next</Text>
          <Panel css={{ mb: '$md' }}>
            <Text inline>
              <Text inline bold color="neutral" font="inter">
                Next Epoch
              </Text>{' '}
              {nextEpochStartLabel}
            </Text>
          </Panel>
        </>
      )}
      {currentEpoch && (
        <>
          <Text h3>Current</Text>
          <CurrentEpochPanel
            css={{ mb: '$md' }}
            epoch={currentEpoch}
            vouching={circle?.vouching}
            nominees={nominees}
            unallocated={unallocated}
            tokenName={circle?.token_name}
          />
        </>
      )}
      {pastEpochs.length > 0 && (
        <>
          <Text h3>Past</Text>
          {shownPastEpochs.map((epoch: QueryEpoch) => (
            <EpochPanel
              key={epoch.id}
              epoch={epoch}
              tokenName={circle?.token_name || 'GIVE'}
            />
          ))}
          <Paginator pages={totalPages} current={page} onSelect={setPage} />
        </>
      )}
    </SingleColumnLayout>
  );
};
