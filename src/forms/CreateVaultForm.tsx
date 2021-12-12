import { z } from 'zod';

import { IFormToken } from 'components/FormAssetSelector/FormAssetSelector';
import { ZERO_ADDRESS } from 'config/constants';
import {
  getToken,
  hasToken,
  validNetworkId,
  zAssetEnum,
  TAssetEnum,
} from 'config/networks';

import { createForm } from './createForm';
import { zEthAddress } from './formHelpers';

const schema = z
  .object({
    asset: z.object({
      name: zAssetEnum,
      custom: zEthAddress.optional(),
    }),
  })
  .strict();

const getZodParser = (chainId?: number) => {
  return schema
    .refine(() => validNetworkId(chainId), 'Invalid network Id')
    .refine(
      ({ asset: { name } }) => name === 'OTHER' || hasToken(name),
      'Unknown Token'
    )
    .refine(({ asset: { name, custom } }) => name !== 'OTHER' || custom, {
      path: ['asset'],
      message: 'Token address is required for OTHER',
    })
    .transform(({ asset: { name, custom } }) =>
      name === 'OTHER'
        ? {
            tokenAddress: ZERO_ADDRESS,
            simpleTokenAddress: custom as string,
            type: 'SIMPLE',
          }
        : {
            tokenAddress: getToken(chainId as number, name).address,
            simpleTokenAddress: ZERO_ADDRESS,
            type: name,
          }
    );
};

const CreateVaultForm = createForm({
  name: 'CreateVaultForm',
  getInstanceKey: () => 'new',
  getZodParser,
  load: () => ({
    asset: { name: 'DAI' as TAssetEnum } as IFormToken,
  }),
  fieldKeys: Object.keys(schema.shape),
  fieldProps: {},
});

export default CreateVaultForm;
