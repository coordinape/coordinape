import { DateTime, Settings } from 'luxon';

Settings.defaultZone = 'utc';

export const formatShortDateTime = (dateTime: string | DateTime) => {
  let dateTimeString;
  if (typeof dateTime === 'string') {
    dateTimeString = DateTime.fromISO(dateTime).toLocaleString(
      DateTime.DATETIME_FULL
    );
  } else {
    dateTimeString = dateTime.toLocaleString(DateTime.DATETIME_FULL);
  }
  // Format : 8/27/2021, 6:00 PM
  return dateTimeString;
};
