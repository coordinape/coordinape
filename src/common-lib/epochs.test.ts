import { DateTime, Settings } from 'luxon';

import { findSameDayNextMonth } from './epochs';

beforeAll(() => {
  Settings.defaultZone = 'utc';
});

it('handles month beginnings correctly', () => {
  let date = DateTime.fromISO('2023-01-01T20:28:00.000Z');
  expect(date.zoneName).toBe('UTC');

  let result = findSameDayNextMonth(date, {
    week: 0,
  });
  expect(result.zoneName).toBe('UTC');
  expect(result.toISO()).toBe('2023-02-05T20:28:00.000Z');

  date = DateTime.fromISO('2023-02-06T20:28:00.000Z');
  result = findSameDayNextMonth(date, {
    week: 0,
  });
  expect(result.toISO()).toBe('2023-03-06T20:28:00.000Z');

  date = DateTime.fromISO('2023-03-06T20:28:00.000Z');
  result = findSameDayNextMonth(date, {
    week: 0,
  });
  expect(result.toISO()).toBe('2023-04-03T20:28:00.000Z');
});

it('handles month endings correctly', () => {
  const date = DateTime.fromISO('2023-01-31T20:28:00.000Z');

  const result = findSameDayNextMonth(date, {
    week: 4,
  });
  // truncated from 5th week to last week
  expect(result.toISO()).toBe('2023-02-28T20:28:00.000Z');
});

test('handles weekly boundaries correctly', () => {
  // week 0
  // 1st Friday each month
  let start = DateTime.fromISO('2023-04-07T00:00:00.000Z');
  let result = findSameDayNextMonth(start, { week: 0 });
  expect(result.toISO()).toBe('2023-05-05T00:00:00.000Z');
  // week 5
  // 5th Tuesday each month truncated to last Tuesday
  start = DateTime.fromISO('2023-01-31T00:00:00.000Z');
  result = findSameDayNextMonth(start, { week: 4 });
  expect(result.toISO()).toBe('2023-02-28T00:00:00.000Z');

  // week 1
  // 2nd Saturday each month
  start = DateTime.fromISO('2023-04-08T00:00:00.000Z');
  result = findSameDayNextMonth(start, { week: 1 });
  expect(result.toISO()).toBe('2023-05-13T00:00:00.000Z');
  // week 5
  // 5th Tuesday each month
  start = DateTime.fromISO('2023-02-28T00:00:00.000Z');
  // 5th Tuesday each month truncated to the last Tuesday
  result = findSameDayNextMonth(start, { week: 4 });
  expect(result.toISO()).toBe('2023-03-28T00:00:00.000Z');
});
