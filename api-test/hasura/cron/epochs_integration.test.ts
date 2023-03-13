import assert from 'assert';

import { DateTime } from 'luxon';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { getEpoch } from '../../../api-lib/gql/queries';
import * as HttpError from '../../../api-lib/HttpError';
import { createNextEpoch, RepeatData } from '../../../api/hasura/cron/epochs';
import { findMonthlyEndDate } from '../../../src/common-lib/epochs';
import { createCircle } from '../../helpers';

let circle;
const mockErrorLog = jest.spyOn(HttpError, 'errorLog');
beforeEach(async () => {
  circle = await createCircle(adminClient);
});
const createEpoch = async (object: {
  circle_id: number;
  start_date: string;
  end_date: string;
  repeat_data?: RepeatData;
}) => {
  try {
    const { insert_epochs_one } = await adminClient.mutate(
      {
        insert_epochs_one: [
          { object: { ...object, ended: true, number: 1 } },
          {
            id: true,
            circle_id: true,
            start_date: true,
            end_date: true,
            repeat_data: [{}, true],
            ended: true,
          },
        ],
      },
      { operationName: 'createEpochToEnd' }
    );

    return insert_epochs_one;
  } catch (e) {
    console.error(e);
  }
};

describe('Epoch Cron Integration', () => {
  describe('createNextEpoch', () => {
    test('can create adjacent following monthly epoch', async () => {
      const start = DateTime.now()
        .setZone('America/Chicago')
        .minus({ months: 1 })
        .set({ day: 1 });
      const result = await createEpoch({
        circle_id: circle.id,
        start_date: start.toISO(),
        end_date: findMonthlyEndDate(start).toISO(),
        repeat_data: {
          type: 'monthly',
          time_zone: 'America/Chicago',
          week: 0,
        },
      });
      assert(result);
      await createNextEpoch(result as Parameters<typeof createNextEpoch>[0]);
      const newEpoch = await getEpoch(circle.id, result.id + 1);
      expect(result.end_date).toBe(newEpoch?.start_date);
    });

    test('can create adjacent following custom epoch', async () => {
      const start = DateTime.now()
        .setZone('America/Chicago')
        .minus({ weeks: 1 });
      const result = await createEpoch({
        circle_id: circle.id,
        start_date: start.toISO(),
        end_date: start.plus({ weeks: 1 }).toISO(),
        repeat_data: {
          type: 'custom',
          duration: 1,
          duration_unit: 'weeks',
          frequency: 1,
          frequency_unit: 'weeks',
        },
      });

      assert(result);
      await createNextEpoch(result as Parameters<typeof createNextEpoch>[0]);
      const newEpoch = await getEpoch(circle.id, result.id + 1);
      expect(DateTime.fromISO(newEpoch?.start_date).toISO()).toBe(
        DateTime.fromISO(result.start_date).plus({ weeks: 1 }).toISO()
      );
    });

    test('Daylight Saving Time', async () => {
      const start = DateTime.fromISO('2023-11-02T09:00:00', {
        zone: 'America/Chicago',
      });
      const result = await createEpoch({
        circle_id: circle.id,
        start_date: start.toISO(),
        end_date: start.plus({ weeks: 1 }).toISO(),
        repeat_data: {
          type: 'custom',
          duration: 1,
          duration_unit: 'weeks',
          frequency: 1,
          frequency_unit: 'weeks',
        },
      });

      assert(result);
      await createNextEpoch(result as Parameters<typeof createNextEpoch>[0]);
      const newEpoch = await getEpoch(circle.id, result.id + 1);
      expect(DateTime.fromISO(newEpoch?.start_date).toISO()).toBe(
        DateTime.fromISO(result.start_date).plus({ weeks: 1 }).toISO()
      );
    });

    test("doesn't create epoch when overlap exists", async () => {
      const start = DateTime.now()
        .setZone('America/Chicago')
        .minus({ weeks: 1 });
      const mut1 = createEpoch({
        circle_id: circle.id,
        start_date: start.toISO(),
        end_date: start.plus({ weeks: 1 }).toISO(),
        repeat_data: {
          type: 'custom',
          duration: 1,
          duration_unit: 'weeks',
          frequency: 1,
          frequency_unit: 'weeks',
        },
      });
      const mut2 = createEpoch({
        circle_id: circle.id,
        start_date: start.plus({ weeks: 1 }).toISO(),
        end_date: start.plus({ weeks: 2 }).toISO(),
      });

      const result1 = await mut1;
      const result2 = await mut2;
      assert(result1);
      await createNextEpoch(result1);
      expect(mockErrorLog).toBeCalledWith(
        expect.stringContaining(`existing epoch id: ${result2.id}`),
        false
      );
    });
  });
});
