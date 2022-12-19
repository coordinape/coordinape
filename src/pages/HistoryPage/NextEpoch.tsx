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
      <Flex css={{ flexWrap: 'wrap', gap: '$md' }}>
        <Text inline bold color="neutral">
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
    <Panel css={{ mb: '$md', p: '$md' }}>
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
              color="primary"
              outlined
              onClick={() => setEditEpoch(epoch)}
            >
              Edit
            </Button>
            <Button
              color="destructive"
              outlined
              onClick={() => setEpochToDelete(epoch)}
            >
              Delete
            </Button>
          </Flex>
        )}
      </Flex>
    </Panel>
  );
};
