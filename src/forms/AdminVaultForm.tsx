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
const zRepeatEnum = z.enum(['weekly', 'monthly']);
export type AssetEnum = z.infer<typeof zAssetEnum>;
export type RepeatEnumType = z.infer<typeof zRepeatEnum>;
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
    repeat: z.object({
      value: z.boolean(),
      type: zRepeatEnum,
    }),
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
    repeat: {
      value: false,
      type: 'monthly',
    },
  }),
  fieldKeys: Object.keys(schema.shape),
  fieldProps: {},
});

export default AdminVaultForm;
