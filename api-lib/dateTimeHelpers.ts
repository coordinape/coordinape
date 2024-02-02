import { DateTime, Settings } from 'luxon';

Settings.defaultZone = 'utc';

export const formatShortDateTime = (dateTime: string | DateTime) => {
  if (typeof dateTime === 'string') {
    return DateTime.fromISO(dateTime).toLocaleString(DateTime.DATETIME_FULL);
  }
  return dateTime.toLocaleString(DateTime.DATETIME_FULL);
};

export const formatCustomDate = (
  dateTime: string | DateTime,
  format: string
) => {
  let formatDate = dateTime;
  if (typeof formatDate === 'string') {
    formatDate = DateTime.fromISO(formatDate);
  }
  return formatDate.toFormat(format);
};
