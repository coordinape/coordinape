import { z } from 'zod';

import { createForm } from './createForm';
import { zEthAddress } from './formHelpers';

const zAssetEnum = z.enum([
  'DAI',
  'USDC',
  'YFI',
  'SUSHI',
  'ALUSD',
  'USDT',
  'ETH',
  'OTHER',
]);
export type AssetEnum = z.infer<typeof zAssetEnum>;
// type TEpochRepeatEnum = typeof AssetEnum['_type'];

export const schema = z
  .object({
    token: z.number(),
    asset: zAssetEnum,
    custom_asset: z.string().refine(async val => {
      // TODO should be optional only when asset is not "OTHER"
      if (val == '') return true;
      return zEthAddress.parseAsync(val);
    }),
    repeat_monthly: z.boolean(),
  })
  .strict();

const AdminVaultForm = createForm({
  name: 'adminVaultForm',
  getInstanceKey: () => 'new',
  getZodParser: () => schema,
  load: () => ({
    token: 0,
    asset: 'DAI' as AssetEnum,
    custom_asset: '',
    repeat_monthly: false,
  }),
  fieldKeys: Object.keys(schema.shape),
  fieldProps: {},
});

export default AdminVaultForm;
