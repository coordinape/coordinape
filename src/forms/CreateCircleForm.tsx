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
    captcha_token: z.string().min(1, 'Please be a human.'),
    // TODO: Implment nested fields in createForm
    // Research Questions
    research_org_link: z.string(),
    research_contact: z.string(),
    research_who: z.string(),
    research_how_much: z.string(),
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
    captcha_token: '',
    research_org_link: '',
    research_contact: '',
    research_who: '',
    research_how_much: '',
  }),
  fieldKeys: Object.keys(schema.shape),
  fieldProps: {},
});

export default CreateCircleForm;
