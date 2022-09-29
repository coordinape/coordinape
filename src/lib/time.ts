import { DateTime } from 'luxon';

// epochTimeUpcoming generates a human friendly string about when an epoch will start
export const epochTimeUpcoming = (startDate: DateTime) => {
  return startDate
    .diffNow(['days', 'hours', 'minutes'])
    .toHuman({ unitDisplay: 'short', notation: 'compact' })
    .replace(/(0 days, |0 hr, )/g, '');
};
