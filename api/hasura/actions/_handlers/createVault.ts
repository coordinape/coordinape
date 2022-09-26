import { AddressZero } from '@ethersproject/constants';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { Contracts } from '../../../../api-lib/contracts';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import * as queries from '../../../../api-lib/gql/queries';
import { getPropsWithUserSession } from '../../../../api-lib/handlerHelpers';
import {
  UnauthorizedError,
  UnprocessableError,
  InternalServerError,
} from '../../../../api-lib/HttpError';
import { getProvider } from '../../../../api-lib/provider';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';
import { zEthAddressOnly } from '../../../../src/forms/formHelpers';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    session_variables,
    input: { payload },
  } = getPropsWithUserSession(createVaultInput, req);

  const { org_id, chain_id, vault_address, deployment_block } = payload;
  const { hasuraAddress, hasuraProfileId } = session_variables;

  const isOrgAdmin = await queries.checkAddressAdminInOrg(
    hasuraAddress,
    org_id
  );

  if (!isOrgAdmin)
    throw new UnauthorizedError(
      `Error during CoVault Creation: Address ${hasuraAddress} is not an admin` +
        ` of org ${org_id}`
    );

  const provider = getProvider(chain_id);
  const contracts = new Contracts(chain_id, provider);

  const vaultExists = await contracts.vaultFactory.vaultRegistry(vault_address);

  if (!vaultExists)
    throw new UnprocessableError(
      `No CoVault with address ${vault_address} exists`
    );

  const vault = contracts.getVault(vault_address);
  const yTokenAddress = await vault.token();
  const simpleTokenAddress = await vault.simpleToken();

  const tokenAddress = [yTokenAddress, simpleTokenAddress].find(
    e => e != AddressZero
  );

  if (!tokenAddress)
    throw new UnprocessableError('No token specified for vault');

  const token = contracts.getERC20(tokenAddress);
  const [symbol, decimals] = await Promise.all([
    token.symbol(),
    token.decimals(),
  ]);

  const { insert_vaults_one: result } = await adminClient.mutate(
    {
      insert_vaults_one: [
        {
          object: {
            symbol,
            decimals,
            chain_id,
            org_id,
            deployment_block,
            vault_address,
            created_by: hasuraProfileId,
            token_address: yTokenAddress,
            simple_token_address: simpleTokenAddress,
          },
        },
        { id: true },
      ],
    },

    { operationName: 'createVault' }
  );

  if (!result?.id)
    throw new InternalServerError(
      `No CoVault ID returned for ${vault_address}`
    );
  res.status(200).json(result);
}

const createVaultInput = z
  .object({
    org_id: z.number().positive(),
    vault_address: zEthAddressOnly,
    chain_id: z.number(),
    deployment_block: z.number().min(1),
  })
  .strict();

export default verifyHasuraRequestMiddleware(handler);
