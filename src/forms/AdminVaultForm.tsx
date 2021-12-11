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

export const schema = z
  .object({
    asset: zAssetEnum.optional(),
    custom_asset: z.string().refine(async val => {
      // TODO should be optional only when asset is not "OTHER"
      if (val == '') return true;
      return zEthAddress.parseAsync(val);
    }),
  })
  .strict();

const AdminVaultForm = createForm({
  name: 'adminVaultForm',
  getInstanceKey: () => 'new',
  getZodParser: () => schema,
  load: () => ({
    asset: 'DAI' as AssetEnum,
    custom_asset: '',
  }),
  fieldKeys: Object.keys(schema.shape),
  fieldProps: {},
});

export default AdminVaultForm;
