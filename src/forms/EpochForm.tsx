import moment from 'moment';
import { z } from 'zod';

import createApeFormHooks from './createApeFormHooks';

import { IEpoch } from 'types';

const EpochRepeatEnum = z.enum(['', 'monthly', 'weekly']);

export default createApeFormHooks(
  z
    .object({
      start_date: z.string(),
      start_time: z.string(),
      repeat: EpochRepeatEnum.transform((v) => {
        if (v === 'weekly') {
          return 1;
        }
        return v === 'monthly' ? 2 : 0;
      }),
      days: z.number().min(0).max(100),
    })
    .strict()
)({
  name: 'epochSettings',
  getInstanceKey: (e?: IEpoch) => (e ? String(e.id) : `new`),
  load: (e?: IEpoch) => ({
    start_date: e?.start_date ?? moment().utc().format('MM/DD/YYYY'),
    start_time: '2000-01-01T00:00:00.000000Z',
    repeat: e?.repeat ?? '',
    days: e?.days ?? 4,
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
