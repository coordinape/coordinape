import { DateTime, Interval } from 'luxon';
import { z } from 'zod';

import { createForm } from './createForm';
import { zStringISODateUTC } from './formHelpers';

import { IEpoch } from 'types';

const longUTCFormat = "DD 'at' H:mm 'UTC'";

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
  if (
    newInterval.overlaps(e.interval) ||
    (e.repeatEnum === 'none' && newRepeat === 'none')
  ) {
    return newInterval.overlaps(e.interval)
      ? `Overlap with epoch ${
          e.number ?? 'x'
        } with start ${e.startDate.toFormat(longUTCFormat)}`
      : undefined;
  }
  // Only one will be allowed to be repeating
  // Set r as the repeating and c as the constant interval.
  const [r, c, next] =
    e.repeatEnum !== 'none'
      ? [e.interval, newInterval, nextIntervalFactory(e.repeatEnum)]
      : [newInterval, e.interval, nextIntervalFactory(newRepeat)];

  if (c.isBefore(r.start) || +c.end === +r.start) {
    return undefined;
  }

  let rp = r;
  while (rp.start < c.end) {
    if (rp.overlaps(c)) {
      return e.repeatEnum !== 'none'
        ? `Overlap with repeating epoch ${e.number ?? 'x'}: ${rp.toFormat(
            longUTCFormat
          )}`
        : `After repeat, new epoch overlaps ${
            e.number ?? 'x'
          }: ${e.startDate.toFormat(longUTCFormat)}`;
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

  const otherRepeating = source.epochs.find(e => !!e.repeat);

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
      .map(e => getCollisionMessage(interval, repeat, e))
      .find(m => m !== undefined);

    return collisionMessage === undefined
      ? undefined
      : {
          path: ['start_date'],
          message: collisionMessage,
        };
  };

  return schema
    .refine(({ start_date }) => begun || start_date > DateTime.utc(), {
      path: ['start_date'],
      message: 'Start date must be in the future',
    })
    .refine(
      ({ start_date }) =>
        !(begun && baseStartDate && +start_date !== +baseStartDate),
      {
        path: ['start_date'],
        message: "Can't change start date for an epoch in progress",
      }
    )
    .refine(
      ({ start_date, days }) => start_date.plus({ days }) > DateTime.utc(),
      {
        path: ['days'],
        message: 'Epoch must end in the future',
      }
    )
    .refine(({ repeat, days }) => !(repeat === 'weekly' && days > 7), {
      path: ['days'],
      message: "Can't have more than 7 days when repeating weekly",
    })
    .refine(({ repeat, days }) => !(repeat === 'monthly' && days > 28), {
      path: ['days'],
      message: "Can't have more than 28 days when repeating monthly",
    })
    .refine(({ repeat }) => !(repeat !== 'none' && !!otherRepeating), {
      path: ['repeat'],
      // the getOverlapIssue relies on this invariant.
      message: `Only one repeating epoch allowed.`,
    })
    .refine(
      v => !getOverlapIssue(v),
      v => getOverlapIssue(v) ?? {}
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
  const startDate = DateTime.fromISO(value.start_date, {
    zone: 'utc',
  }).toFormat(longUTCFormat);
  const endDate = DateTime.fromISO(value.start_date, { zone: 'utc' })
    .plus({ days: value.days })
    .toFormat(longUTCFormat);

  const nextRepeat = DateTime.fromISO(value.start_date)
    .plus(value.repeat === 'monthly' ? { months: 1 } : { weeks: 1 })
    .toFormat('DD');

  const repeating =
    value.repeat === 'monthly'
      ? `The epoch is set to repeat every month; the following epoch will start on ${nextRepeat}.`
      : value.repeat === 'weekly'
      ? `The epoch is set to repeat every week; the following epoch will start on ${nextRepeat}.`
      : "The epoch doesn't repeat.";

  return `This epoch starts on ${startDate} and will end on ${endDate}. ${repeating}`;
};

export default AdminEpochForm;
