import { DateTime } from 'luxon';
import { z } from 'zod';

import { createForm } from './createForm';
import { zStringISODate } from './formHelpers';

import { IEpoch } from 'types';

interface IEpochFormSource {
  epoch?: IEpoch;
  epochs: IEpoch[];
}

const EpochRepeatEnum = z.enum(['none', 'monthly', 'weekly']);

const schema = z
  .object({
    start_date: zStringISODate,
    start_time: zStringISODate,
    repeat: EpochRepeatEnum.transform((v) => {
      if (v === 'weekly') {
        return 1;
      }
      return v === 'monthly' ? 2 : 0;
    }),
    days: z
      .number()
      .min(1, 'Must be at least one day.')
      .max(100, 'cant be more than 100 days'),
  })
  .strict();

const getZodParser = (source: IEpochFormSource) => {
  const begun = source?.epoch?.started ?? false;
  const baseStartDateStr = source?.epoch?.start_date;
  const baseStartDate = baseStartDateStr
    ? DateTime.fromISO(baseStartDateStr)
    : undefined;
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
    .refine(({ repeat, days }) => !(repeat === 1 && days > 7), {
      path: ['days'],
      message: "Weekly repeating, can't have more than 7 days",
    })
    .refine(({ repeat, days }) => !(repeat === 2 && days > 28), {
      path: ['days'],
      message: "Monthly repeating, can't have more than 28 day",
    })
    .transform(({ start_date, start_time, ...fields }) => ({
      start_date: start_date.toISO(),
      start_time: start_time.toFormat('HH:mm:00'),
      ...fields,
    }));
};

type TForm = typeof schema['_input'];
type TEpochRepeatEnum = typeof EpochRepeatEnum['_type'];

const AdminEpochForm = createForm({
  name: 'adminEpochForm',
  getInstanceKey: (s: IEpochFormSource) =>
    s?.epoch ? String(s.epoch.id) : `new`,
  getZodParser,
  load: (s: IEpochFormSource) => ({
    start_date:
      s?.epoch?.start_date ?? DateTime.utc().plus({ days: 1 }).toISO(),
    start_time: `2019-01-02T${s?.epoch?.start_time ?? '00:00:00'}.000000Z`,
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
  const startTime = DateTime.fromISO(value.start_time).toFormat("HH:mm 'UTC'");
  const startDate = DateTime.fromISO(value.start_date).toFormat('DD');
  const endDate = DateTime.fromISO(value.start_date)
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
