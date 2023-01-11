import { assert } from 'console';

import { DateTime, Interval } from 'luxon';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { zEpochInputParams } from '../../../../api/hasura/actions/_handlers/createEpoch';
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

    test('errors when epoch ends before or as soon as it starts ', async () => {
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
    test.todo('errors on malformed input');
    test.todo(
      'creates a new epoch on the correct day of the correct week of the month'
    );
    test.todo('handles cases at the end of the month correctly');
    test.todo(
      'always extends the epoch to end on the start date of the following month'
    );
  });
});
