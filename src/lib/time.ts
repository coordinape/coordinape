import { DateTime } from 'luxon';

// epochTimeUpcoming generates a human friendly string about when an epoch will start
export const epochTimeUpcoming = (startDate: DateTime) => {
  const dateTime = startDate.diffNow(['days', 'hours', 'minutes']);
  if (dateTime.days < 1 && dateTime.hours < 1 && dateTime.minutes <= 1) {
    return 'a minute';
  } else {
    return dateTime
      .toFormat(
        ` d' ${dateTime.days >= 2 ? 'days' : 'day'}, 'h' ${
          dateTime.hours >= 2 ? 'hrs' : 'hr'
        }, 'm' ${dateTime.minutes >= 2 ? 'mins' : 'min'}'`
      )
      .replace(/( 0 day,| 0 hr,|, 0 min)/g, '')
      .replace(/(, 0 min)/g, '')
      .trim();
  }
};
export default epochTimeUpcoming;
