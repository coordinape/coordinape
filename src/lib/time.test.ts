import epochTimeUpcoming from 'lib/time';
import { DateTime } from 'luxon';

// epochTimeUpcoming generates a human friendly string about when an epoch will start
test('epoch Time Upcoming 1', async () => {
  const epoch = epochTimeUpcoming(
    DateTime.now().plus({
      hours: 3,
      minutes: 59,
      seconds: 59,
      milliseconds: 10,
    })
  );
  expect(epoch).toEqual('3 hrs, 59 mins');
});

test('epoch Time Upcoming 2', async () => {
  const epoch = epochTimeUpcoming(
    DateTime.now().plus({
      hours: 1,
      minutes: 21,
      seconds: 0,
      milliseconds: 10,
    })
  );
  expect(epoch).toEqual('1 hr, 21 mins');
});
test('epoch Time Upcoming 3', async () => {
  const epoch = epochTimeUpcoming(
    DateTime.now().plus({
      days: 1,
      hours: 0,
      minutes: 59,
      seconds: 59,
      milliseconds: 10,
    })
  );
  expect(epoch).toEqual('1 day, 59 mins');
});

test('epoch Time Upcoming 4', async () => {
  const epoch = epochTimeUpcoming(
    DateTime.now().plus({
      days: 10,
      hours: 20,
      minutes: 15,
      seconds: 59,
      milliseconds: 10,
    })
  );
  expect(epoch).toEqual('10 days, 20 hrs, 15 mins');
});
test('epoch Time Upcoming 5', async () => {
  const epoch = epochTimeUpcoming(
    DateTime.now().plus({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 59,
      milliseconds: 10,
    })
  );
  expect(epoch).toEqual('a minute');
});

test('epoch Time Upcoming 6', async () => {
  const epoch = epochTimeUpcoming(
    DateTime.now().plus({
      days: 0,
      hours: 20,
      minutes: 0,
      seconds: 59,
      milliseconds: 10,
    })
  );
  expect(epoch).toEqual('20 hrs');
});
