import { useMemo } from 'react';

import { DateTime } from 'luxon';

import { Button, Flex, Panel, Text } from 'ui';

import { IApiEpoch } from 'types';

export const NextEpoch = ({
  epoch,
  setDeleteEpochDialog,
  setEditEpoch,
  isEditing,
}: {
  epoch: IApiEpoch;
  setDeleteEpochDialog: (e: IApiEpoch) => void;
  setEditEpoch: (e: IApiEpoch) => void;
  isEditing: boolean;
}) => {
  const nextEpochStartLabel = useMemo(() => {
    const startDate = DateTime.fromISO(epoch.start_date);
    const endDate = DateTime.fromISO(epoch.end_date);
    const diff = startDate
      .diffNow(['days', 'hours', 'minutes'])
      .toHuman({ unitDisplay: 'short', notation: 'compact' });
    return (
      <>
        <Text inline bold color="neutral" font="inter">
          {`${startDate.toFormat('LLLL d')} - ${
            startDate.month === endDate.month
              ? endDate.day
              : endDate.toFormat('LLLL d')
          }`}
        </Text>
        {`   starts in ${diff}${
          epoch.repeat === 1
            ? '( repeats weekly)'
            : epoch.repeat === 2
            ? '( repeats monthly)'
            : ''
        }`}
      </>
    );
  }, [epoch]);

  return (
    <Panel css={{ mb: '$md', p: '$md' }}>
      <Flex css={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Text inline>{nextEpochStartLabel}</Text>
        {!isEditing && (
          <Flex css={{ gap: '$md' }}>
            <Button
              color="primary"
              outlined
              onClick={() => setEditEpoch(epoch)}
            >
              Edit Epoch
            </Button>
            <Button
              color="destructive"
              outlined
              onClick={() => {
                setDeleteEpochDialog(epoch);
              }}
            >
              Delete Epoch
            </Button>
          </Flex>
        )}
      </Flex>
    </Panel>
  );
};
