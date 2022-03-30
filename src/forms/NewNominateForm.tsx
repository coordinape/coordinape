import { z } from 'zod';

import { createForm } from './createForm';
import { zEthAddress } from './formHelpers';

const schema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters long.'),
    address: zEthAddress,
    description: z
      .string()
      .min(40, 'Description must be at least 40 characters long.'),
  })
  .strict();
const NewNominateForm = createForm({
  name: 'nominateUserForm',
  getInstanceKey: () => 'nominate',
  getZodParser: () => schema,
  load: () => ({
    name: '',
    address: '',
    description: '',
  }),
  fieldKeys: Object.keys(schema.shape),
  fieldProps: {},
});

export default NewNominateForm;
