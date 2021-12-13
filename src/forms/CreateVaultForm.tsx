import { z } from 'zod';

import { IFormToken } from 'components/FormAssetSelector/FormAssetSelector';
import { ZERO_ADDRESS } from 'config/constants';
import {
  getToken,
  validNetworkId,
  zAssetEnum,
  TAssetEnum,
} from 'config/networks';

import { createForm } from './createForm';
import { zOptionalEthAddress, zTransformCatch } from './formHelpers';

const schema = z
  .object({
    asset: z.object({
      name: zAssetEnum,
      custom: zOptionalEthAddress,
    }),
  })
  .strict();

const getZodParser = (chainId?: number) =>
  zTransformCatch(
    schema,
    props => {
      const {
        asset: { name, custom },
      } = props;
      if (!validNetworkId(chainId)) {
        throw 'Invalid network Id';
      }

      if (name === 'OTHER') {
        if (!custom) {
          throw 'Valid token address required.';
        }
        return {
          tokenAddress: ZERO_ADDRESS,
          simpleTokenAddress: custom as string,
          type: 'SIMPLE',
        };
      }
      return {
        tokenAddress: getToken(chainId as number, name).address,
        simpleTokenAddress: ZERO_ADDRESS,
        type: name,
      };
    },
    { defaultPath: ['asset'] }
  );

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
