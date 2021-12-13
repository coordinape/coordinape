import { z } from 'zod';

import { createForm } from './createForm';

interface ISingleTokenSource {
  starting: number;
  balance: number;
}

const getZodParser = ({ balance }: ISingleTokenSource) =>
  z
    .object({
      amount: z.number().min(0).max(balance),
    })
    .strict();

const SingleTokenForm = createForm({
  name: 'SingleTokenForm',
  getInstanceKey: () => 'new',
  getZodParser,
  load: ({ starting }: ISingleTokenSource) => ({
    amount: starting,
  }),
  fieldKeys: ['amount'],
  fieldProps: {},
});

export default SingleTokenForm;
