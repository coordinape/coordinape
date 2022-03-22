import { z } from 'zod';

import { createForm } from './createForm';

const schema = z
  .object({
    user_name: z
      .string()
      .min(3, 'User name must be at least 3 characters long.'),
    circle_name: z
      .string()
      .min(3, 'Circle name must be at least 3 characters long.'),
    protocol_name: z
      .string()
      .min(3, 'Org name must be at least 3 characters long.'),
    protocol_id: z.number().optional(),
    contact: z.string().min(4, 'Circle Point of Contact is Required.'),
  })
  .strict();

const CreateCircleForm = createForm({
  name: 'CreateCircleForm',
  getInstanceKey: () => 'new',
  getZodParser: () => schema,
  load: () => ({
    user_name: '',
    circle_name: '',
    protocol_name: '',
    protocol_id: undefined,
    contact: '',
  }),
  fieldKeys: Object.keys(schema.shape),
  fieldProps: {},
});

export default CreateCircleForm;
