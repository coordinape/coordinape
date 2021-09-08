import { DateTime, Interval } from 'luxon';
import { z } from 'zod';

import { createForm } from './createForm';
import { zStringISODateUTC } from './formHelpers';

import { IEpoch } from 'types';

interface IEpochFormSource {
  epoch?: IEpoch;
  epochs: IEpoch[];
}

const EpochRepeatEnum = z.enum(['none', 'monthly', 'weekly']);
type TEpochRepeatEnum = typeof EpochRepeatEnum['_type'];

const schema = z
  .object({
    start_date: zStringISODateUTC,
    repeat: EpochRepeatEnum,
    days: z
      .number()
      .min(1, 'Must be at least one day.')
      .max(100, 'cant be more than 100 days'),
  })
  .strict();

const nextIntervalFactory = (repeat: TEpochRepeatEnum) => {
  const increment = repeat === 'weekly' ? { weeks: 1 } : { months: 1 };
  return (i: Interval) =>
    Interval.fromDateTimes(i.start.plus(increment), i.end.plus(increment));
};

const getCollisionMessage = (
  newInterval: Interval,
  newRepeat: TEpochRepeatEnum,
  e: IEpoch
) => {
  if (e.repeatEnum === 'none' && newRepeat === 'none') {
    return newInterval.overlaps(e.eInterval)
      ? `Overlap with epoch ${
          e.number ?? 'x'
        } with start ${e.startDate.toISO()}`
      : undefined;
  }
  // Only one will be allowed to be repeating
  // Set r as the repeating and c as the constant interval.
  const [r, c, next] =
    e.repeatEnum !== 'none'
      ? [e.eInterval, newInterval, nextIntervalFactory(e.repeatEnum)]
      : [newInterval, e.eInterval, nextIntervalFactory(newRepeat)];

  if (c.isBefore(r.start) || +c.end === +r.start) {
    return undefined;
  }

  let rp = r;
  while (rp.start < c.end) {
    if (rp.overlaps(c)) {
      return `Overlap on repeat with epoch ${
        e.number ?? 'x'
      } with start ${e.startDate.toISO()}`;
    }
    rp = next(rp);
  }

  return undefined;
};

const getZodParser = (source: IEpochFormSource) => {
  const begun = source.epoch?.started ?? false;
  const baseStartDateStr = source?.epoch?.start_date;
  const baseStartDate = baseStartDateStr
    ? DateTime.fromISO(baseStartDateStr)
    : undefined;

  const otherRepeating = source.epochs.find((e) => !!e.repeat);

  const getOverlapIssue = ({
    start_date,
    days,
    repeat,
  }: {
    start_date: DateTime;
    days: number;
    repeat: TEpochRepeatEnum;
  }) => {
    const interval = Interval.fromDateTimes(
      start_date,
      start_date.plus({ days })
    );

    const collisionMessage = source.epochs
      .map((e) => getCollisionMessage(interval, repeat, e))
      .find((m) => m !== undefined);

    return collisionMessage === undefined
      ? undefined
      : {
          path: ['start_date'],
          message: collisionMessage,
        };
  };

  return schema
    .refine(({ start_date }) => !(!begun && start_date < DateTime.utc()), {
      path: ['start_date'],
      message: 'Start date must be in the future',
    })
    .refine(({ start_date }) => !(begun && start_date !== baseStartDate), {
      path: ['start_date'],
      message: "In progress epoch can't change start_date",
    })
    .refine(
      ({ start_date, days }) =>
        !(begun && start_date.plus({ days }) < DateTime.utc()),
      {
        path: ['days'],
        message: 'Epoch must end in the future',
      }
    )
    .refine(({ repeat, days }) => !(repeat === 'weekly' && days > 7), {
      path: ['days'],
      message: "Weekly repeating, can't have more than 7 days",
    })
    .refine(({ repeat, days }) => !(repeat === 'monthly' && days > 28), {
      path: ['days'],
      message: "Monthly repeating, can't have more than 28 day",
    })
    .refine(({ repeat }) => !(repeat !== 'none' && !!otherRepeating), {
      path: ['repeat'],
      // the getOverlapIssue relies on this invariant.
      message: `Only one repeating epoch allowed, one starting ${otherRepeating?.start_date}`,
    })
    .refine(
      (v) => !getOverlapIssue(v),
      (v) => getOverlapIssue(v) ?? {}
    )
    .transform(({ start_date, repeat, ...fields }) => ({
      start_date: start_date.toISO(),
      repeat: repeat === 'weekly' ? 1 : repeat === 'monthly' ? 2 : 0,
      ...fields,
    }));
};

type TForm = typeof schema['_input'];

const AdminEpochForm = createForm({
  name: 'adminEpochForm',
  getInstanceKey: (s: IEpochFormSource) =>
    s?.epoch ? String(s.epoch.id) : `new`,
  getZodParser,
  load: (s: IEpochFormSource) => ({
    start_date:
      s?.epoch?.start_date ?? DateTime.utc().plus({ days: 1 }).toISO(),
    repeat: s?.epoch?.repeatEnum ?? 'none',
    days: s?.epoch?.days ?? s?.epoch?.calculatedDays ?? 4,
  }),
  fieldKeys: Object.keys(schema.shape),
  fieldProps: {
    start_date: {
      format: 'MM/dd/yyyy',
    },
    repeat: {
      options: [
        {
          label: 'This epoch does not repeat',
          value: 'none',
        },
        {
          label: 'This epoch repeats monthly',
          value: 'monthly',
        },
        {
          label: 'This epoch repeats weekly',
          value: 'weekly',
        },
      ] as { label: string; value: TEpochRepeatEnum }[],
    },
  },
});

export const summarizeEpoch = (value: TForm) => {
  const startTime = DateTime.fromISO(value.start_date, {
    zone: 'utc',
  }).toFormat("HH:mm 'UTC'");
  const startDate = DateTime.fromISO(value.start_date, {
    zone: 'utc',
  }).toFormat('DD');
  const endDate = DateTime.fromISO(value.start_date, { zone: 'utc' })
    .plus({ days: value.days })
    .toFormat('DD');

  const nextRepeat = DateTime.fromISO(value.start_date)
    .plus(value.repeat === 'monthly' ? { months: 1 } : { weeks: 1 })
    .toFormat('DD');

  const repeating =
    value.repeat === 'monthly'
      ? `The epoch is set to repeat every month, the following epoch will start on ${nextRepeat}.`
      : value.repeat === 'weekly'
      ? `The epoch is set to repeat every week, the following epoch will start on ${nextRepeat}.`
      : "The epoch doesn't repeat.";

  return `This epoch starts on ${startDate} at ${startTime} and will end on ${endDate} at ${startTime}. ${repeating}`;
};

export default AdminEpochForm;
