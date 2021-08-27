import moment from 'moment';
import { z } from 'zod';

import createApeFormHooks from './createApeFormHooks';
import { stringFutureDate, stringTime } from './formHelpers';

import { IEpoch } from 'types';

const EpochRepeatEnum = z.enum(['', 'monthly', 'weekly']);

const schema = z
  .object({
    start_date: stringFutureDate,
    start_time: stringTime,
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

// TODO: add this:
// (issue is that the type for the createAppFormHooks needs to be gernalized)
// .refine(
//   ({ repeat, days }) =>
//     (repeat === 1 && days > 7) || (repeat === 2 && days > 28),
//   ({ repeat }) => ({
//     path: ['days'],
//     message:
//       repeat === 1
//         ? "Weekly repeating, can't be more than 7 days"
//         : "Monthly repeating, can't be more than 28 days",
//   })
// );

const epochForm = createApeFormHooks(schema)({
  name: 'epochSettings',
  getInstanceKey: (e?: IEpoch) => (e ? String(e.id) : `new`),
  load: (e?: IEpoch) => ({
    start_date:
      e?.start_date ??
      moment().utc().add(1, 'days').add(1, 'days').format('MM/DD/YYYY'),
    start_time: `2000-01-01T${e?.start_time ?? '00:00:00'}.000000Z`,
    repeat: e?.repeat ?? '',
    days: e?.days ?? e?.calculatedDays ?? 4,
  }),
  fieldProps: {
    start_date: {
      format: 'MM/dd/yyyy',
    },
    repeat: {
      options: [
        {
          label: 'This epoch does not repeat',
          value: '',
        },
        {
          label: 'This epoch repeats monthly',
          value: 'monthly',
        },
        {
          label: 'This epoch repeats weekly',
          value: 'weekly',
        },
      ],
    },
  },
});

export const summarizeEpoch = (value: typeof schema['_input']) => {
  const startTime = moment.utc(value.start_time).format('HH:mm [UTC]');
  const startDate = moment.utc(value.start_date).format('MMM Do YYYY');
  const endDate = moment
    .utc(value.start_date)
    .add(value.days, 'days')
    .format('MMM Do YYYY');

  const nextRepeat = moment
    .utc(value.start_date)
    .add(1, value.repeat === 'monthly' ? 'month' : 'week')
    .format('MMM Do YYYY');

  const repeating =
    value.repeat === 'monthly'
      ? `The epoch is set to repeat every month, the following epoch will start on ${nextRepeat}.`
      : value.repeat === 'weekly'
      ? `The epoch is set to repeat every week, the following epoch will start on ${nextRepeat}.`
      : "The epoch doesn't repeat.";

  return `This epoch starts on ${startDate} at ${startTime} and will end on ${endDate} at ${startTime}. ${repeating}`;
};

export default epochForm;
