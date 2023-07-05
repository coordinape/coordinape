import { DateTime } from 'luxon';

export function findSameDayNextMonth(
  start: DateTime,
  { week }: { week: number },
  zone?: string
): DateTime {
  const offset = start.setZone(zone).offset / 60;
  const weekday =
    offset > 0
      ? start.weekday + 1
      : offset < 0
      ? start.weekday - 1
      : start.weekday;

  start = start.set({
    hour: start.hour + offset,
    minute: start.minute + (offset > 0 ? 1 : offset < 0 ? -1 : 0),
  });
  let nextEndDate = start;

  nextEndDate = nextEndDate.plus({ months: 1 });

  const nextMonthStart = nextEndDate.startOf('month').set({
    hour: start.hour,
    minute: start.minute,
  });

  nextEndDate = nextMonthStart.set({
    weekday,
  });

  if (nextEndDate >= nextMonthStart)
    nextEndDate = nextEndDate.plus({ weeks: week });
  else {
    nextEndDate = nextEndDate.plus({ weeks: week + 1 });
  }

  while (week > 3 && nextMonthStart.plus({ months: 1 }) <= nextEndDate) {
    nextEndDate = nextEndDate.minus({ weeks: 1 });
  }

  return nextEndDate.minus({
    hours: offset,
    minutes: offset > 0 ? 1 : offset < 0 ? -1 : 0,
  });
}

export function findMonthlyEndDate(start: DateTime): DateTime {
  const week = Math.floor((start.day - 1) / 7);
  return findSameDayNextMonth(start, { week });
}
