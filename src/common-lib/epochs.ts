import { DateTime } from 'luxon';

export function findSameDayNextMonth(
  start: DateTime,
  { week }: { week: number }
): DateTime {
  const weekday = start.weekday;

  const day = start.day;
  const startWeek = Math.floor((day - 1) / 7);

  start = start.set({
    hour: start.hour,
    minute: start.minute,
  });

  let nextEndDate = start;

  if (startWeek === week) {
    nextEndDate = nextEndDate.plus({ months: 1 });
  }

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

  while (week > 3 && nextMonthStart.plus({ months: 1 }) < nextEndDate) {
    nextEndDate = nextEndDate.minus({ weeks: 1 });
  }

  return nextEndDate;
}

/**
 * @dev This function is not safe for generating subsequent epoch start dates
 * in an existing cycle of repeating monthly epoichs
 * and is only meant to provide a porcelain interface for users creating a new
 * set of repeating epochs, either in the UI or via the API.
 */
export function findMonthlyEndDate(start: DateTime): DateTime {
  const week = Math.floor((start.day - 1) / 7);
  return findSameDayNextMonth(start, { week });
}
