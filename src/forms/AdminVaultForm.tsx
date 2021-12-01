import { z } from 'zod';

import { createForm } from './createForm';
import { zEthAddress } from './formHelpers';

const AssetEnum = z.enum([
  'DAI',
  'USDC',
  'YFI',
  'SUSHI',
  'alUSD',
  'USDT',
  'OTHER',
]);
// type TEpochRepeatEnum = typeof AssetEnum['_type'];

const schema = z
  .object({
    token: z.number(),
    asset: AssetEnum,
    custom_asset: zEthAddress,
    repeat_monthly: z.boolean(),
  })
  .strict();

const AdminVaultForm = createForm({
  name: 'adminVaultForm',
  getInstanceKey: () => 'new',
  getZodParser: () => schema,
  load: () => ({
    token: 0,
    asset: 'DAI',
    custom_asset: '',
    repeat_monthly: false,
  }),
  fieldKeys: Object.keys(schema.shape),
  fieldProps: {},
});

export default AdminVaultForm;
