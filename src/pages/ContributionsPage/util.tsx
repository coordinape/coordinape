import { DateTime } from 'luxon';

import { Text } from 'ui';

import { Contribution, Epoch } from './queries';

export const getNewContribution: (userId: number) => Contribution = (
  userId: number
) => ({
  id: 0,
  description: '',
  datetime_created: DateTime.now().toISO(),
  user_id: userId,
});

export const getCurrentEpoch = (epoches: Epoch[]) =>
  epoches.find(
    e =>
      e.start_date <= DateTime.now().toISO() &&
      e.end_date > DateTime.now().toISO()
  );

export const getEpochLabel = (epoch?: Epoch) => {
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
