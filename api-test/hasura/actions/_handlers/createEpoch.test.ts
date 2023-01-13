import { assert } from 'console';

import { DateTime, Interval } from 'luxon';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { zEpochInputParams } from '../../../../api/hasura/actions/_handlers/createEpoch';
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
          frequency: { _errors: ['Expected number, received nan'] },
          frequency_unit: {
            _errors: [
              'Invalid literal value, expected "days"',
              'Invalid literal value, expected "weeks"',
              'Invalid literal value, expected "months"',
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
          frequency: { _errors: ['Expected number, received nan'] },
          frequency_unit: {
            _errors: [
              'Invalid literal value, expected "days"',
              'Invalid literal value, expected "weeks"',
              'Invalid literal value, expected "months"',
            ],
          },
        });
    });
  });

  describe('monthly input', () => {
    describe('findSameDayNextMonth', () => {
      it('handles month beginnings correctly', () => {
        let date = DateTime.fromISO('2023-01-01T20:28:00.000Z');
        let result = findSameDayNextMonth(date, {
          week: 0,
        });
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
        let date = DateTime.fromISO('2023-01-31T20:28:00.000Z');

        let result = findSameDayNextMonth(date, {
          week: 4,
        });
        expect(result.toISO()).toBe('2023-03-07T20:28:00.000Z');

        date = DateTime.fromISO('2023-02-07T20:28:00.000Z');
        result = findSameDayNextMonth(date, {
          week: 5,
        });
        expect(result.toISO()).toBe('2023-03-14T20:28:00.000Z');
      });
    });

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
            week: 6,
          },
          start_date: expect.stringContaining(
            params.start_date.substring(0, 16)
          ),
          end_date: expect.stringContaining(params.end_date.substring(0, 16)),
        })
      );
    });

    test('handles weekly boundaries correctly', () => {
      // week 0
      // 1st Friday each month
      let start = DateTime.fromISO('2023-04-07T00:00:00.000Z');
      let result = findSameDayNextMonth(start, { week: 0 });
      expect(result.toISO()).toBe('2023-05-05T00:00:00.000Z');
      // week 5
      // 6th Friday each month
      result = findSameDayNextMonth(start, { week: 5 });
      expect(result.toISO()).toBe('2023-05-12T00:00:00.000Z');

      // week 1
      // 2nd Saturday each month
      start = DateTime.fromISO('2023-04-08T00:00:00.000Z');
      result = findSameDayNextMonth(start, { week: 1 });
      expect(result.toISO()).toBe('2023-05-13T00:00:00.000Z');
      // week 6
      // 6th Saturday each month
      result = findSameDayNextMonth(start, { week: 6 });
      expect(result.toISO()).toBe('2023-05-13T00:00:00.000Z');
    });
  });
});
