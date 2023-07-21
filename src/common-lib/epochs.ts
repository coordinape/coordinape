import { DateTime } from 'luxon';

export function findSameDayNextMonth(
  start: DateTime,
  { week }: { week: number },
  zone?: string
): DateTime {
  if (zone) start = start.setZone(zone);
  const weekday = start.weekday;

  start = start.set({
    hour: start.hour,
    minute: start.minute,
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
  if (zone) nextEndDate = nextEndDate.setZone('UTC');
  return nextEndDate;
}

export function findMonthlyEndDate(start: DateTime): DateTime {
  const week = Math.floor((start.day - 1) / 7);
  return findSameDayNextMonth(start, { week });
}
