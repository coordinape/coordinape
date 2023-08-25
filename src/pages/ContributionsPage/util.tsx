import { DateTime } from 'luxon';

import { DeworkColor, WonderColor } from 'icons/__generated';
import { Text } from 'ui';

import { Contribution, Epoch } from './queries';

type Obj = Record<string, unknown>;

type LinkedElementYieldFn<A extends Obj> = () => LinkedElement<A> | undefined;

export interface LinkedInterface<A extends Obj> {
  next: LinkedElementYieldFn<A>;
  prev: LinkedElementYieldFn<A>;
  idx: number;
}

export type LinkedElement<A extends Obj> = LinkedInterface<A> & A;

export const getNewContribution: (
  userId: number,
  nextContribution: LinkedElement<Contribution> | undefined
) => LinkedElement<Contribution> = (userId: number, nextContribution) => ({
  id: 0,
  description: '',
  created_at: DateTime.now().toISO(),
  user_id: userId,
  idx: -1,
  next: () => nextContribution,
  prev: () => undefined,
});

export const pseudoEpochForLatest = (
  epochs: LinkedElement<Epoch>[]
): LinkedElement<Epoch> => {
  const latestEpoch = {
    id: 0,
    idx: -1,
    start_date:
      epochs[0]?.end_date || DateTime.now().minus({ weeks: 1 }).toISO(),
    end_date: DateTime.now().plus({ weeks: 1 }).toISO(),
    next: () => epochs[0],
    prev: () => undefined,
    ended: false,
  };
  return latestEpoch;
};

export const getCurrentEpoch = (epochs: LinkedElement<Epoch>[]) =>
  getEpoch(epochs, DateTime.now().toISO()) ?? pseudoEpochForLatest(epochs);

export const getEpochLabel = (epoch?: LinkedElement<Epoch>) => {
  if (!epoch || isEpochInFuture(epoch))
    return (
      <Text tag color="active">
        Future
      </Text>
    );
  if (isEpochCurrent(epoch))
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

export const isEpochCurrentOrLater = (epoch: LinkedElement<Epoch>) =>
  isEpochCurrent(epoch) || isEpochInFuture(epoch);

export const isEpochCurrent = (epoch: LinkedElement<Epoch>) =>
  isDateTimeInEpoch(epoch, DateTime.now().toISO());

export const isEpochInFuture = (epoch: LinkedElement<Epoch>) =>
  isDateTimeBeforeEpoch(epoch, DateTime.now().toISO());

export function createLinkedArray<T extends Obj>(
  a: Array<T> | Array<LinkedElement<T>>
): Array<LinkedElement<T>> {
  const newA: Array<LinkedElement<T>> = Array(a.length);
  for (let i = 0; i < a.length; i++) {
    newA[i] = {
      ...a[i],
      idx: i,
      next: () => newA[i + 1],
      prev: () => newA[i - 1],
    };
  }
  return newA;
}

export const parseDateTime = (dt: string | DateTime) =>
  DateTime.isDateTime(dt) ? dt : DateTime.fromISO(dt);

export const getEpoch = (epochs: LinkedElement<Epoch>[], dateTime: string) => {
  return epochs.find(e => isDateTimeInEpoch(e, dateTime));
};

export const isDateTimeInEpoch = (epoch: LinkedElement<Epoch>, dt: string) =>
  (epoch.next() == undefined ||
    DateTime.fromISO(epoch.next()?.end_date) <= DateTime.fromISO(dt)) &&
  DateTime.fromISO(epoch.end_date) > DateTime.fromISO(dt);

export const isDateTimeBeforeEpoch = (
  epoch: LinkedElement<Epoch>,
  dt: string
) => DateTime.fromISO(epoch.start_date) > DateTime.fromISO(dt);

export const jumpToEpoch = (
  epoch: LinkedElement<Epoch>,
  dateTime: string
): LinkedElement<Epoch> => {
  if (isDateTimeInEpoch(epoch, dateTime)) return epoch;
  if (dateTime >= epoch.end_date) {
    const prevEpoch = epoch.prev();
    if (!prevEpoch) throw new Error('Epoch does not Exist');
    return jumpToEpoch(prevEpoch, dateTime);
  }
  const nextEpoch = epoch.next();
  if (!nextEpoch) throw new Error('Epoch does not Exist');
  nextEpoch.prev = () => epoch;
  return jumpToEpoch(nextEpoch, dateTime);
};

export const contributionIcon = (source: string) => {
  switch (source) {
    case 'wonder':
      return <WonderColor css={{ mr: '$md' }} />;
    default:
      return <DeworkColor css={{ mr: '$md' }} />;
  }
};
