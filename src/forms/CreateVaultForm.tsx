import { z } from 'zod';

import { IFormToken } from 'components/FormAssetSelector/FormAssetSelector';
import { zAssetEnum, TAssetEnum } from 'config/networks';

import { createForm } from './createForm';
import { zEthAddress, zEthAddressOrBlank } from './formHelpers';

const basicSchema = z.object({
  asset: z.object({
    name: zAssetEnum,
    custom: zEthAddressOrBlank,
  }),
});

const schema = basicSchema.refine(
  async ({ asset }) =>
    asset.name !== 'OTHER' || (await zEthAddress.spa(asset.custom)).success,
  {
    message: 'Enter a valid custom asset address',
  }
);

const CreateVaultForm = createForm({
  name: 'CreateVaultForm',
  getInstanceKey: () => 'new',
  getZodParser: () => schema,
  load: () => ({
    asset: { name: 'DAI' as TAssetEnum, custom: '' } as IFormToken,
  }),
  fieldKeys: Object.keys(basicSchema.shape),
  fieldProps: {},
});

export default CreateVaultForm;
