import { useMemo } from 'react';

import { DateTime } from 'luxon';

import { epochTimeUpcoming } from '../../lib/time';
import { Button, Flex, Panel, Text } from 'ui';

import { QueryFutureEpoch } from './getHistoryData';

export const NextEpoch = ({
  epoch,
  setEpochToDelete,
  setEditEpoch,
  isEditing,
  isAdmin,
}: {
  epoch: QueryFutureEpoch;
  setEpochToDelete: (e: QueryFutureEpoch) => void;
  setEditEpoch: (e: QueryFutureEpoch) => void;
  isEditing: boolean;
  isAdmin: boolean;
}) => {
  const nextEpochStartLabel = useMemo(() => {
    const startDate = DateTime.fromISO(epoch.start_date);
    const endDate = DateTime.fromISO(epoch.end_date);
    const diff = epochTimeUpcoming(startDate);
    return (
      <Flex css={{ flexWrap: 'wrap', gap: '$xl' }}>
        <Text size="xl" medium inline>
          {`${startDate.toFormat('LLL d')} - ${
            startDate.month === endDate.month
              ? endDate.day
              : endDate.toFormat('LLL d')
          }`}
        </Text>
        <Text>
          {`starts in ${diff}${
            epoch.repeat === 1
              ? ' (repeats weekly)'
              : epoch.repeat === 2
              ? ' (repeats monthly)'
              : ''
          }`}
        </Text>
      </Flex>
    );
  }, [epoch]);

  return (
    <Panel css={{ mb: '$md', p: '$md', border: '1px solid $borderDim' }}>
      <Flex
        alignItems="center"
        css={{
          justifyContent: 'space-between',
          gap: '$md',
          flexWrap: 'wrap',
        }}
      >
        <Text inline>{nextEpochStartLabel}</Text>
        {!isEditing && isAdmin && (
          <Flex css={{ flexWrap: 'wrap', gap: '$md' }}>
            <Button
              color="secondary"
              size="small"
              onClick={() => setEditEpoch(epoch)}
            >
              Edit epoch
            </Button>
            <Button
              color="neutral"
              size="small"
              onClick={() => setEpochToDelete(epoch)}
            >
              Delete Epoch
            </Button>
          </Flex>
        )}
      </Flex>
    </Panel>
  );
};
