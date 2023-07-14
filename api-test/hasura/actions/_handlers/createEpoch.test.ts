import { assert } from 'console';

import { DateTime, Interval } from 'luxon';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import {
  zEpochInputParams,
  validateCustomInput,
} from '../../../../api/hasura/actions/_handlers/createEpoch';
import { findSameDayNextMonth } from '../../../../src/common-lib/epochs';
import {
  createCircle,
  createProfile,
  mockUserClient,
  createUser,
} from '../../../helpers';
import { getUniqueAddress } from '../../../helpers/getUniqueAddress';

let address, profile, circle, client;

beforeEach(async () => {
  address = await getUniqueAddress();
  circle = await createCircle(adminClient);
  profile = await createProfile(adminClient, { address });
  await createUser(adminClient, { address, circle_id: circle.id });
  client = mockUserClient({ profileId: profile.id, address });
});

describe('createEpoch', () => {
  describe('invalid input', () => {
    test('errors when another repeating epoch exists', async () => {
      expect.assertions(1);
      const now = DateTime.now().plus({ weeks: 2 });
      await client.mutate({
        createEpoch: [
          {
            payload: {
              circle_id: circle.id,
              params: {
                type: 'custom',
                start_date: now.toISO(),
                end_date: now.plus({ days: 3 }).toISO(),
                duration: 3,
                duration_unit: 'days',
                frequency: 1,
                frequency_unit: 'weeks',
              },
            },
          },
          { __typename: true },
        ],
      });

      const thunk = async () =>
        client.mutate({
          createEpoch: [
            {
              payload: {
                circle_id: circle.id,
                params: {
                  type: 'custom',
                  start_date: now.plus({ weeks: 4 }).toISO(),
                  end_date: now.plus({ weeks: 4, days: 3 }).toISO(),
                  duration: 3,
                  duration_unit: 'days',
                  frequency: 1,
                  frequency_unit: 'weeks',
                },
              },
            },
            { __typename: true },
          ],
        });

      await expect(thunk).rejects.toThrow(
        'You cannot have more than one repeating active epoch.'
      );
    });

    test('errors when epoch ends in the past', async () => {
      expect.assertions(1);
      const now = DateTime.now().minus({ weeks: 2 });
      const thunk = async () =>
        client.mutate({
          createEpoch: [
            {
              payload: {
                circle_id: circle.id,
                params: {
                  type: 'custom',
                  start_date: now.toISO(),
                  end_date: now.plus({ days: 3 }).toISO(),
                  duration: 1,
                  duration_unit: 'days',
                  frequency: 1,
                  frequency_unit: 'days',
                },
              },
            },
            {
              __typename: true,
              epoch: {
                start_date: true,
                end_date: true,
                repeat_data: [{}, true],
              },
            },
          ],
        });
      await expect(thunk).rejects.toThrow(
        'You cannot create an epoch that ends before now'
      );
    });

    test('errors when epoch ends before or as soon as it starts', async () => {
      expect.assertions(1);
      const now = DateTime.now().plus({ weeks: 2 });
      const thunk = async () =>
        client.mutate({
          createEpoch: [
            {
              payload: {
                circle_id: circle.id,
                params: {
                  type: 'custom',
                  start_date: now.toISO(),
                  end_date: now.toISO(),
                  duration: 1,
                  duration_unit: 'days',
                  frequency: 1,
                  frequency_unit: 'days',
                },
              },
            },
            {
              __typename: true,
              epoch: {
                start_date: true,
                end_date: true,
                repeat_data: [{}, true],
              },
            },
          ],
        });
      await expect(thunk).rejects.toThrow('Start date must precede end date');
    });

    test('errors when an overlapping epoch exists', async () => {
      expect.assertions(1);
      await client.mutate({
        createEpoch: [
          {
            payload: {
              circle_id: circle.id,
              params: {
                type: 'one-off',
                start_date: DateTime.now().toISO(),
                end_date: DateTime.now().plus({ days: 1 }).toISO(),
              },
            },
          },
          { __typename: true },
        ],
      });

      const second = async () =>
        client.mutate({
          createEpoch: [
            {
              payload: {
                circle_id: circle.id,
                params: {
                  type: 'one-off',
                  start_date: DateTime.now().toISO(),
                  end_date: DateTime.now().plus({ days: 2 }).toISO(),
                },
              },
            },
            { __typename: true },
          ],
        });

      await expect(second).rejects.toThrow(/This epoch overlaps/);
    });
  });

  describe('one-off input', () => {
    it('can create a one-off epoch', async () => {
      const DURATION_IN_DAYS = 3;
      let result;
      const now = DateTime.now();
      const first = async () =>
        client.mutate({
          createEpoch: [
            {
              payload: {
                circle_id: circle.id,
                params: {
                  type: 'one-off',
                  start_date: now.toISO(),
                  end_date: now.plus({ days: DURATION_IN_DAYS }).toISO(),
                },
              },
            },
            {
              __typename: true,
              epoch: {
                start_date: true,
                end_date: true,
                repeat_data: [{}, true],
              },
            },
          ],
        });
      try {
        result = await first();
      } catch (e: any) {
        console.error(e.response.errors);
      }
      const epoch = result?.createEpoch?.epoch;
      assert(epoch);
      expect(epoch).toEqual(
        expect.objectContaining({
          repeat_data: null,
        })
      );
      const { start_date, end_date } = epoch;
      expect(
        DateTime.fromISO(end_date).diff(DateTime.fromISO(start_date)).as('days')
      ).toBe(DURATION_IN_DAYS);
    });

    test('errors on malformed input', () => {
      let result = zEpochInputParams.safeParse({
        type: 'one-off',
        start_date: 'a',
        end_date: 'b',
      });
      if (result.success === false)
        expect(result.error.format()).toMatchObject({
          start_date: {
            _errors: [
              'invalid datetime: the input "a" can\'t be parsed as ISO 8601',
            ],
          },
          end_date: {
            _errors: [
              'invalid datetime: the input "b" can\'t be parsed as ISO 8601',
            ],
          },
        });
      result = zEpochInputParams.safeParse({
        type: 'one-off',
        bad: 'property',
      });
      if (result.success === false)
        expect(result.error.format()).toEqual({
          _errors: ["Unrecognized key(s) in object: 'bad'"],
          start_date: { _errors: ['Required'] },
          end_date: { _errors: ['Required'] },
        });
    });
  });

  describe('custom input', () => {
    test('can create repeating weekly epochs with gaps', async () => {
      const DURATION_IN_DAYS = 3;
      let result;
      const now = DateTime.now();
      const first = async () =>
        client.mutate({
          createEpoch: [
            {
              payload: {
                circle_id: circle.id,
                params: {
                  type: 'custom',
                  start_date: now.toISO(),
                  end_date: now.plus({ days: DURATION_IN_DAYS }).toISO(),
                  duration: DURATION_IN_DAYS,
                  duration_unit: 'days',
                  frequency: 1,
                  frequency_unit: 'weeks',
                },
              },
            },
            {
              __typename: true,
              epoch: {
                start_date: true,
                end_date: true,
                repeat_data: [{}, true],
              },
            },
          ],
        });
      try {
        result = await first();
      } catch (e: any) {
        console.error(e.response.errors);
      }
      const epoch = result?.createEpoch?.epoch;
      assert(epoch);
      expect(epoch).toEqual(
        expect.objectContaining({
          repeat_data: {
            type: 'custom',
            duration: DURATION_IN_DAYS,
            duration_unit: 'days',
            time_zone: 'UTC',
            frequency: 1,
            frequency_unit: 'weeks',
          },
        })
      );
      const { start_date, end_date } = epoch;
      expect(
        DateTime.fromISO(end_date).diff(DateTime.fromISO(start_date)).as('days')
      ).toBe(DURATION_IN_DAYS);
    });

    test('can create repeating weekly epochs without gaps', async () => {
      const DURATION_IN_WEEKS = 1;
      let result;
      const now = DateTime.now();
      const first = async () =>
        client.mutate({
          createEpoch: [
            {
              payload: {
                circle_id: circle.id,
                params: {
                  type: 'custom',
                  start_date: now.toISO(),
                  end_date: now.plus({ weeks: DURATION_IN_WEEKS }).toISO(),
                  duration: DURATION_IN_WEEKS,
                  duration_unit: 'weeks',
                  frequency: 1,
                  frequency_unit: 'weeks',
                },
              },
            },
            {
              __typename: true,
              epoch: {
                start_date: true,
                end_date: true,
                repeat_data: [{}, true],
              },
            },
          ],
        });
      try {
        result = await first();
      } catch (e: any) {
        console.error(e.response.errors);
      }
      const epoch = result?.createEpoch?.epoch;
      assert(epoch);
      expect(epoch).toEqual(
        expect.objectContaining({
          repeat_data: {
            type: 'custom',
            duration: DURATION_IN_WEEKS,
            duration_unit: 'weeks',
            time_zone: 'UTC',
            frequency: 1,
            frequency_unit: 'weeks',
          },
        })
      );
      const { start_date, end_date } = epoch;
      expect(
        DateTime.fromISO(end_date)
          .diff(DateTime.fromISO(start_date))
          .as('weeks')
      ).toBe(DURATION_IN_WEEKS);
    });

    test('can create repeating monthly epochs with gaps', async () => {
      const DURATION_IN_WEEKS = 2;
      let result;
      const now = DateTime.now();
      const first = async () =>
        client.mutate({
          createEpoch: [
            {
              payload: {
                circle_id: circle.id,
                params: {
                  type: 'custom',
                  start_date: now.toISO(),
                  end_date: now.plus({ weeks: DURATION_IN_WEEKS }).toISO(),
                  duration: DURATION_IN_WEEKS,
                  duration_unit: 'weeks',
                  time_zone: 'Asia/Tbilisi',
                  frequency: 1,
                  frequency_unit: 'months',
                },
              },
            },
            {
              __typename: true,
              epoch: {
                start_date: true,
                end_date: true,
                repeat_data: [{}, true],
              },
            },
          ],
        });
      try {
        result = await first();
      } catch (e: any) {
        console.error(e.response.errors);
      }
      const epoch = result?.createEpoch?.epoch;
      assert(epoch);
      expect(epoch).toEqual(
        expect.objectContaining({
          repeat_data: {
            type: 'custom',
            duration: DURATION_IN_WEEKS,
            duration_unit: 'weeks',
            time_zone: 'Asia/Tbilisi',
            frequency: 1,
            frequency_unit: 'months',
          },
        })
      );
      const { start_date, end_date } = epoch;
      expect(
        DateTime.fromISO(end_date)
          .diff(DateTime.fromISO(start_date))
          .as('weeks')
      ).toBe(DURATION_IN_WEEKS);
    });

    test('can create repeating monthly epochs without gaps', async () => {
      const DURATION_IN_MONTHS = 1;
      let result;
      const now = DateTime.now();
      const first = async () =>
        client.mutate({
          createEpoch: [
            {
              payload: {
                circle_id: circle.id,
                params: {
                  type: 'custom',
                  start_date: now.toISO(),
                  end_date: now.plus({ months: DURATION_IN_MONTHS }).toISO(),
                  duration: DURATION_IN_MONTHS,
                  duration_unit: 'months',
                  time_zone: 'bad_zone',
                  frequency: 1,
                  frequency_unit: 'months',
                },
              },
            },
            {
              __typename: true,
              epoch: {
                start_date: true,
                end_date: true,
                repeat_data: [{}, true],
              },
            },
          ],
        });
      try {
        result = await first();
      } catch (e: any) {
        console.error(e.response.errors);
      }
      const epoch = result?.createEpoch?.epoch;
      assert(epoch);
      expect(epoch).toEqual(
        expect.objectContaining({
          repeat_data: {
            type: 'custom',
            duration: DURATION_IN_MONTHS,
            duration_unit: 'months',
            time_zone: 'UTC',
            frequency: 1,
            frequency_unit: 'months',
          },
        })
      );
      const { start_date, end_date } = epoch;
      expect(
        Interval.fromISO(start_date + '/' + end_date).length('months')
      ).toBe(DURATION_IN_MONTHS);
    });

    test('cannot update an epoch where the durations mismatch', async () => {
      expect.assertions(1);
      const now = DateTime.now();
      const thunk = async () =>
        client.mutate({
          createEpoch: [
            {
              payload: {
                circle_id: circle.id,
                params: {
                  type: 'custom',
                  start_date: now.toISO(),
                  end_date: now.plus({ months: 1, days: 1 }).toISO(),
                  duration: 1,
                  duration_unit: 'months',
                  frequency: 2,
                  frequency_unit: 'months',
                },
              },
            },
            {
              __typename: true,
              epoch: {
                start_date: true,
                end_date: true,
                repeat_data: [{}, true],
              },
            },
          ],
        });
      await expect(thunk).rejects.toThrow(
        'does not match the specified duration 1 months'
      );
    });

    test("doesn't adjust epoch end_date for a supported timezone leaving DST", async () => {
      const DURATION_IN_MONTHS = 1;
      let result;
      const now = DateTime.now()
        .setZone('America/New_York')
        .plus({ years: 1 })
        .set({ month: 11, day: 1 });
      const first = async () =>
        client.mutate({
          createEpoch: [
            {
              payload: {
                circle_id: circle.id,
                params: {
                  type: 'custom',
                  start_date: now.toISO(),
                  end_date: now.plus({ months: DURATION_IN_MONTHS }).toISO(),
                  duration: DURATION_IN_MONTHS,
                  duration_unit: 'months',
                  time_zone: 'America/New_York',
                  frequency: 2,
                  frequency_unit: 'months',
                },
              },
            },
            {
              __typename: true,
              epoch: {
                start_date: true,
                end_date: true,
                repeat_data: [{}, true],
              },
            },
          ],
        });
      try {
        result = await first();
      } catch (e: any) {
        console.error(e.response.errors);
      }
      const epoch = result?.createEpoch?.epoch;
      assert(epoch);
      expect(epoch).toEqual(
        expect.objectContaining({
          repeat_data: {
            type: 'custom',
            duration: DURATION_IN_MONTHS,
            duration_unit: 'months',
            time_zone: 'America/New_York',
            frequency: 2,
            frequency_unit: 'months',
          },
        })
      );
      const { start_date, end_date } = epoch;
      expect(
        Interval.fromISO(start_date + '/' + end_date).length('months')
      ).toBeGreaterThan(DURATION_IN_MONTHS);
    });

    test("doesn't adjust epoch end_date for a supported timezone entering DST", async () => {
      const DURATION_IN_MONTHS = 1;
      let result;
      const now = DateTime.now()
        .setZone('America/New_York')
        .plus({ years: 1 })
        .set({ month: 3, day: 1 });
      const first = async () =>
        client.mutate({
          createEpoch: [
            {
              payload: {
                circle_id: circle.id,
                params: {
                  type: 'custom',
                  start_date: now.toISO(),
                  end_date: now.plus({ months: DURATION_IN_MONTHS }).toISO(),
                  duration: DURATION_IN_MONTHS,
                  duration_unit: 'months',
                  time_zone: 'America/New_York',
                  frequency: 2,
                  frequency_unit: 'months',
                },
              },
            },
            {
              __typename: true,
              epoch: {
                start_date: true,
                end_date: true,
                repeat_data: [{}, true],
              },
            },
          ],
        });
      try {
        result = await first();
      } catch (e: any) {
        console.error(e.response.errors);
      }
      const epoch = result?.createEpoch?.epoch;
      assert(epoch);
      expect(epoch).toEqual(
        expect.objectContaining({
          repeat_data: {
            type: 'custom',
            duration: DURATION_IN_MONTHS,
            duration_unit: 'months',
            time_zone: 'America/New_York',
            frequency: 2,
            frequency_unit: 'months',
          },
        })
      );
      const { start_date, end_date } = epoch;
      expect(
        Interval.fromISO(start_date + '/' + end_date).length('months')
      ).toBeLessThan(DURATION_IN_MONTHS);
    });

    test('can adjust epoch end_date for an unsupported timezone', async () => {
      const DURATION_IN_MONTHS = 1;
      let result;
      const now = DateTime.now().plus({ years: 1 }).set({ month: 3, day: 1 });
      const first = async () =>
        client.mutate({
          createEpoch: [
            {
              payload: {
                circle_id: circle.id,
                params: {
                  type: 'custom',
                  start_date: now.toISO(),
                  end_date: now
                    .plus({ months: DURATION_IN_MONTHS, hours: 1 })
                    .toISO(),
                  duration: DURATION_IN_MONTHS,
                  duration_unit: 'months',
                  time_zone: 'bad_zone',
                  frequency: 2,
                  frequency_unit: 'months',
                },
              },
            },
            {
              __typename: true,
              epoch: {
                start_date: true,
                end_date: true,
                repeat_data: [{}, true],
              },
            },
          ],
        });
      try {
        result = await first();
      } catch (e: any) {
        console.error(e.response.errors);
      }
      const epoch = result?.createEpoch?.epoch;
      assert(epoch);
      expect(epoch).toEqual(
        expect.objectContaining({
          repeat_data: {
            type: 'custom',
            duration: DURATION_IN_MONTHS,
            duration_unit: 'months',
            time_zone: 'UTC',
            frequency: 2,
            frequency_unit: 'months',
          },
        })
      );
      const { start_date, end_date } = epoch;
      expect(
        Interval.fromISO(start_date + '/' + end_date).length('months')
      ).toBe(DURATION_IN_MONTHS);
    });

    test("cannot repeat with an explicit duration that doesn't match the date duration", async () => {
      expect.assertions(1);
      const now = DateTime.now();
      const thunk = async () =>
        client.mutate({
          createEpoch: [
            {
              payload: {
                circle_id: circle.id,
                params: {
                  type: 'custom',
                  start_date: now.toISO(),
                  end_date: now.plus({ days: 3 }).toISO(),
                  duration: 2,
                  duration_unit: 'days',
                  frequency: 5,
                  frequency_unit: 'days',
                },
              },
            },
            {
              __typename: true,
              epoch: {
                start_date: true,
                end_date: true,
                repeat_data: [{}, true],
              },
            },
          ],
        });
      await expect(thunk).rejects.toThrow(
        'epoch date range 3 days does not match the specified duration 2 days'
      );
    });

    test('cannot repeat with a frequency that is shorter than the duration', async () => {
      expect.assertions(1);
      const now = DateTime.now();
      const thunk = async () =>
        client.mutate({
          createEpoch: [
            {
              payload: {
                circle_id: circle.id,
                params: {
                  type: 'custom',
                  start_date: now.toISO(),
                  end_date: now.plus({ days: 3 }).toISO(),
                  duration: 3,
                  duration_unit: 'days',
                  frequency: 1,
                  frequency_unit: 'days',
                },
              },
            },
            {
              __typename: true,
              epoch: {
                start_date: true,
                end_date: true,
                repeat_data: [{}, true],
              },
            },
          ],
        });
      await expect(thunk).rejects.toThrow('is longer than chosen');
    });

    test('errors on malformed input', () => {
      let result = zEpochInputParams.safeParse({
        type: 'custom',
        start_date: 'a',
        end_date: 'b',
        duration: 0,
        duration_unit: 'years',
        frequency: 'bad',
        frequency_unit: 'years',
      });
      if (result.success === false)
        expect(result.error.format()).toMatchObject({
          start_date: {
            _errors: [
              'invalid datetime: the input "a" can\'t be parsed as ISO 8601',
            ],
          },
          end_date: {
            _errors: [
              'invalid datetime: the input "b" can\'t be parsed as ISO 8601',
            ],
          },
          duration: { _errors: ['Number must be greater than or equal to 1'] },
          duration_unit: {
            _errors: [
              "Invalid enum value. Expected 'days' | 'weeks' | 'months', received 'years'",
            ],
          },
          frequency: { _errors: ['Expected number, received nan'] },
          frequency_unit: {
            _errors: [
              "Invalid enum value. Expected 'days' | 'weeks' | 'months', received 'years'",
            ],
          },
        });
      result = zEpochInputParams.safeParse({
        type: 'custom',
        bad: 'input',
      });
      if (result.success === false)
        expect(result.error.format()).toEqual({
          _errors: ["Unrecognized key(s) in object: 'bad'"],
          start_date: { _errors: ['Required'] },
          end_date: { _errors: ['Required'] },
          duration: { _errors: ['Expected number, received nan'] },
          duration_unit: {
            _errors: ['Required'],
          },
          frequency: { _errors: ['Expected number, received nan'] },
          frequency_unit: {
            _errors: ['Required'],
          },
        });
    });
  });

  describe('monthly input', () => {
    test('errors on malformed input', async () => {
      const now = DateTime.now();
      const params = {
        type: 'monthly',
        start_date: now.toISO(),
        end_date: findSameDayNextMonth(now, {
          week: Math.floor(now.day / 7),
        })
          .plus({ days: 1 })
          .toISO(),
        week: Math.floor(now.day / 7),
      };
      const first = async () =>
        client.mutate({
          createEpoch: [
            {
              payload: {
                circle_id: circle.id,
                params,
              },
            },
            {
              epoch: {
                start_date: true,
                end_date: true,
                repeat_data: [{}, true],
              },
            },
          ],
        });

      await expect(first).rejects.toThrow(/do not match the end date/);
    });

    test('creates a new epoch on the correct day of the correct week of the month', async () => {
      let result;
      const now = DateTime.now();
      const params = {
        type: 'monthly',
        start_date: now.toISO(),
        end_date: findSameDayNextMonth(now, {
          week: Math.floor(now.day / 7),
        }).toISO(),
        week: Math.floor(now.day / 7),
      };
      const first = async () =>
        client.mutate({
          createEpoch: [
            {
              payload: {
                circle_id: circle.id,
                params,
              },
            },
            {
              epoch: {
                start_date: true,
                end_date: true,
                repeat_data: [{}, true],
              },
            },
          ],
        });
      try {
        result = await first();
      } catch (e: any) {
        console.error(e.response.errors);
      }
      const epoch = result?.createEpoch?.epoch;
      assert(epoch);
      const { start_date, end_date } = epoch;
      expect(DateTime.fromISO(start_date).zoneName).toBe('UTC');
      expect(DateTime.fromISO(end_date).zoneName).toBe('UTC');
      expect(epoch).toEqual(
        expect.objectContaining({
          repeat_data: {
            type: 'monthly',
            time_zone: 'UTC',
            week: params.week,
          },
          start_date: expect.stringContaining(
            params.start_date.substring(0, 16)
          ),
          end_date: expect.stringContaining(params.end_date.substring(0, 16)),
        })
      );
    });

    test('handles cases at the end of the month correctly', async () => {
      let result;
      const start = DateTime.now().startOf('month').plus({ weeks: 6 });
      const params = {
        type: 'monthly',
        start_date: start.toISO(),
        end_date: findSameDayNextMonth(start, {
          week: 6,
        }).toISO(),
        week: 6,
      };
      const first = async () =>
        client.mutate({
          createEpoch: [
            {
              payload: {
                circle_id: circle.id,
                params,
              },
            },
            {
              epoch: {
                start_date: true,
                end_date: true,
                repeat_data: [{}, true],
              },
            },
          ],
        });
      try {
        result = await first();
      } catch (e: any) {
        console.error(e.response.errors);
      }
      const epoch = result?.createEpoch?.epoch;
      assert(epoch);
      const { start_date, end_date } = epoch;
      expect(DateTime.fromISO(start_date).zoneName).toBe('UTC');
      expect(DateTime.fromISO(end_date).zoneName).toBe('UTC');
      expect(epoch).toEqual(
        expect.objectContaining({
          repeat_data: {
            type: 'monthly',
            time_zone: 'UTC',
            week: 6,
          },
          start_date: expect.stringContaining(
            params.start_date.substring(0, 16)
          ),
          end_date: expect.stringContaining(params.end_date.substring(0, 16)),
        })
      );
    });

    test('creates a new epoch on the correct day of the month for positive time zones', async () => {
      let result;
      const startDate = DateTime.fromISO('2023-07-04T00:00:00.000+02:00');
      const params = {
        type: 'monthly',
        start_date: startDate.toISO(),
        end_date: findSameDayNextMonth(
          startDate,
          {
            week: Math.floor(startDate.day / 7),
          },
          startDate.zoneName
        ).toISO(),
        week: Math.floor(startDate.day / 7),
        time_zone: startDate.zoneName,
      };

      const first = async () =>
        client.mutate(
          {
            createEpoch: [
              {
                payload: {
                  circle_id: circle.id,
                  params,
                },
              },
              {
                epoch: {
                  start_date: true,
                  end_date: true,
                  repeat_data: [{}, true],
                },
              },
            ],
          },
          { operationName: 'test' }
        );
      try {
        result = await first();
      } catch (e: any) {
        console.error(e.response.errors);
      }
      const epoch = result?.createEpoch?.epoch;
      console.log(epoch);
      assert(epoch);
      if (!epoch) throw new Error('epoch');
      const { start_date, end_date } = epoch;
      expect(DateTime.fromISO(start_date).zoneName).toBe(startDate.zoneName);
      expect(DateTime.fromISO(end_date).zoneName).toBe(startDate.zoneName);
      expect(epoch).toEqual(
        expect.objectContaining({
          repeat_data: {
            type: 'monthly',
            time_zone: startDate.zoneName,
            week: params.week,
          },
        })
      );
      expect(DateTime.fromISO(start_date).equals(startDate)).toBeTruthy();
      expect(
        DateTime.fromISO(end_date).equals(DateTime.fromISO(params.end_date))
      ).toBeTruthy();
    });

    test('creates a new epoch on the correct day of the month for negative time zones', async () => {
      let result;
      const startDate = DateTime.fromISO('2023-07-04T00:00:00.000-06:00');
      const params = {
        type: 'monthly',
        start_date: startDate.toISO(),
        end_date: findSameDayNextMonth(
          startDate,
          {
            week: Math.floor(startDate.day / 7),
          },
          startDate.zoneName
        ).toISO(),
        week: Math.floor(startDate.day / 7),
        time_zone: startDate.zoneName,
      };

      const first = async () =>
        client.mutate(
          {
            createEpoch: [
              {
                payload: {
                  circle_id: circle.id,
                  params,
                },
              },
              {
                epoch: {
                  start_date: true,
                  end_date: true,
                  repeat_data: [{}, true],
                },
              },
            ],
          },
          { operationName: 'test' }
        );
      try {
        result = await first();
      } catch (e: any) {
        console.error(e.response.errors);
      }
      const epoch = result?.createEpoch?.epoch;
      assert(epoch);
      if (!epoch) throw new Error('epoch');
      const { start_date, end_date } = epoch;
      expect(DateTime.fromISO(start_date).zoneName).toBe(startDate.zoneName);
      expect(DateTime.fromISO(end_date).zoneName).toBe(startDate.zoneName);
      expect(epoch).toEqual(
        expect.objectContaining({
          repeat_data: {
            type: 'monthly',
            time_zone: startDate.zoneName,
            week: params.week,
          },
        })
      );
      expect(DateTime.fromISO(start_date).equals(startDate)).toBeTruthy();
      expect(
        DateTime.fromISO(end_date).equals(DateTime.fromISO(params.end_date))
      ).toBeTruthy();
    });
  });
});

test('crossing Daylight Saving Time change', () => {
  const start = DateTime.fromISO('2023-03-06T15:00:00', {
    zone: 'America/New_York',
  });

  const input = {
    type: 'custom' as const,
    start_date: start,
    end_date: start.plus({ weeks: 1 }),
    duration: 1,
    duration_unit: 'weeks' as const,
    time_zone: 'America/New_York',
    frequency: 1,
    frequency_unit: 'weeks' as const,
  };

  const validation = validateCustomInput(input);
  expect(validation).toBeUndefined();
});
