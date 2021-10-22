import { z } from 'zod';

import { createForm } from './createForm';
import { zEthAddress, zBooleanToNumber } from './formHelpers';

import { IUser, ICircle } from 'types';

interface IUserAndCircle {
  user?: IUser;
  circle: ICircle;
}

const EpochRepeatEnum = z.enum(['none', 'monthly', 'weekly']);
type TEpochRepeatEnum = typeof EpochRepeatEnum['_type'];

const schema = z
  .object({
    name: z.string(),
    address: zEthAddress,
    non_giver: zBooleanToNumber,
    fixed_non_receiver: zBooleanToNumber,
    non_receiver: zBooleanToNumber,
    role: zBooleanToNumber,
    starting_tokens: z.number(),
    repeat: EpochRepeatEnum,
    asset: z.string(),
  })
  .strict();

const AdminVaultForm = createForm({
  name: 'adminVaultForm',
  getInstanceKey: (v: IUserAndCircle) => (v?.user ? String(v?.user.id) : `new`),
  getZodParser: () => schema,
  load: (v: IUserAndCircle) => ({
    name: v.user?.name ?? '',
    non_giver: !!(v.user?.non_giver ?? !v.circle.default_opt_in),
    fixed_non_receiver: !!v.user?.fixed_non_receiver ?? false,
    non_receiver: !!v.user?.fixed_non_receiver || !!v.user?.non_receiver,
    role: !!v.user?.role ?? false,
    starting_tokens: v.user?.starting_tokens ?? 100,
  }),
  fieldKeys: Object.keys(schema.shape),
  fieldProps: {
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

export default AdminVaultForm;
