import { DateTime } from 'luxon';

import { Text } from 'ui';

import { Contribution, Epoch } from './queries';

export const getNewContribution: (
  userId: number,
  nextContribution: LinkedElement<Contribution>
) => LinkedElement<Contribution> = (userId: number, nextContribution) => ({
  id: 0,
  description: '',
  datetime_created: DateTime.now().toISO(),
  user_id: userId,
  idx: -1,
  next: () => nextContribution,
  prev: () => undefined,
});

export const getCurrentEpoch = (epochs: LinkedElement<Epoch>[]) =>
  epochs.find(
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

export const isEpochCurrent = (epoch: Epoch) =>
  epoch.start_date <= DateTime.now().toISO() &&
  epoch.end_date > DateTime.now().toISO();

export const currentContributionIsModifiable = (epoch?: Epoch) =>
  !epoch || isEpochCurrent(epoch);

type Obj = Record<string, unknown>;

type LinkedElementYieldFn<A extends Obj> = () => LinkedElement<A> | undefined;

export interface LinkedInterface<A extends Obj> {
  next: LinkedElementYieldFn<A>;
  prev: LinkedElementYieldFn<A>;
  idx: number;
}

export type LinkedElement<A extends Obj> = LinkedInterface<A> & A;

export function createLinkedArray<T extends Obj>(
  a: Array<T>
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
