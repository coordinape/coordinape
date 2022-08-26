import { z } from 'zod';

import { createForm } from './createForm';

const schema = z
  .object({
    user_name: z.string().refine(val => val.trim().length >= 3, {
      message: 'Name must be at least 3 characters long.',
    }),
    circle_name: z.string().refine(val => val.trim().length >= 3, {
      message: 'Circle name must be at least 3 characters long.',
    }),
    protocol_name: z.string().refine(val => val.trim().length >= 3, {
      message: 'Org name must be at least 3 characters long.',
    }),
    protocol_id: z.number().optional(),
    contact: z.string().refine(val => val.trim().length >= 4, {
      message: 'Circle Point of Contact is Required.',
    }),
  })
  .strict();

const CreateCircleForm = createForm({
  name: 'CreateCircleForm',
  getInstanceKey: () => 'new',
  getZodParser: () => schema,
  load: (source: any = {}) => ({
    user_name: '',
    circle_name: '',
    protocol_name: '',
    protocol_id: undefined,
    contact: '',
    ...source,
  }),
  fieldKeys: Object.keys(schema.shape),
  fieldProps: {},
});

export default CreateCircleForm;
