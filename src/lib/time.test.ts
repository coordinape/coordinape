import epochTimeUpcoming from 'lib/time';
import { DateTime } from 'luxon';

// epochTimeUpcoming generates a human friendly string about when an epoch will start
test('epochTimeUpcoming', async () => {
  expect(
    epochTimeUpcoming(
      DateTime.now().plus({
        hours: 3,
        minutes: 59,
        seconds: 59,
        milliseconds: 10,
      })
    )
  ).toEqual('3 hrs, 59 mins');

  expect(
    epochTimeUpcoming(
      DateTime.now().plus({
        hours: 1,
        minutes: 21,
        seconds: 0,
        milliseconds: 10,
      })
    )
  ).toEqual('1 hr, 21 mins');

  expect(
    epochTimeUpcoming(
      DateTime.now().plus({
        days: 1,
        hours: 0,
        minutes: 59,
        seconds: 59,
        milliseconds: 10,
      })
    )
  ).toEqual('1 day, 59 mins');

  expect(
    epochTimeUpcoming(
      DateTime.now().plus({
        days: 10,
        hours: 20,
        minutes: 15,
        seconds: 59,
        milliseconds: 10,
      })
    )
  ).toEqual('10 days, 20 hrs, 15 mins');

  expect(
    epochTimeUpcoming(
      DateTime.now().plus({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 59,
        milliseconds: 10,
      })
    )
  ).toEqual('a minute');

  expect(
    epochTimeUpcoming(
      DateTime.now().plus({
        days: 0,
        hours: 20,
        minutes: 0,
        seconds: 59,
        milliseconds: 10,
      })
    )
  ).toEqual('20 hrs');
});
