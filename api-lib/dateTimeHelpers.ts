import { DateTime } from 'luxon';

export const formatShortDateTime = (dateTime: string | DateTime) => {
  let dateTimeString;
  if (typeof dateTime === 'string') {
    dateTimeString = DateTime.fromISO(dateTime).toLocaleString(
      DateTime.DATETIME_SHORT
    );
  } else {
    dateTimeString = dateTime.toLocaleString(DateTime.DATETIME_SHORT);
  }
  // Format : 8/27/2021, 6:00 PM
  return dateTimeString;
};
