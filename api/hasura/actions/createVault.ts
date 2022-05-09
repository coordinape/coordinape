import { AddressZero } from '@ethersproject/constants';
import type { VercelRequest, VercelResponse } from '@vercel/node';

import { Contracts } from '../../../api-lib/contracts';
import { adminClient } from '../../../api-lib/gql/adminClient';
import * as queries from '../../../api-lib/gql/queries';
import {
  UnauthorizedError,
  UnprocessableError,
  InternalServerError,
} from '../../../api-lib/HttpError';
import { getProvider } from '../../../api-lib/provider';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import {
  createVaultInput,
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
} from '../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    session_variables,
    input: { payload },
  } = composeHasuraActionRequestBodyWithSession(
    createVaultInput,
    HasuraUserSessionVariables
  ).parse(req.body);

  const { org_id, chain_id, vault_address } = payload;
  const { hasuraAddress, hasuraProfileId } = session_variables;

  const isOrgAdmin = await queries.checkAddressAdminInOrg(
    hasuraAddress,
    org_id
  );

  if (!isOrgAdmin)
    throw new UnauthorizedError(
      `Error on Vault Creation: Address ${hasuraAddress} is not an admin` +
        ` of org ${org_id}`
    );

  const provider = getProvider(chain_id);
  const contracts = new Contracts(chain_id, provider);

  const vaultExists = await contracts.vaultFactory.vaultRegistry(vault_address);

  if (!vaultExists)
    new UnprocessableError(
      `Vault with address ${vault_address} not registered`
    );

  const vault = contracts.getVault(vault_address);
  const yTokenAddress = await vault.token();
  const simpleTokenAddress = await vault.simpleToken();

  const tokenAddress = [yTokenAddress, simpleTokenAddress].find(
    e => e != AddressZero
  );

  if (!tokenAddress) throw new UnprocessableError('No token exists in vault');
  const token = contracts.getERC20(tokenAddress);

  const [symbol, decimals] = await Promise.all([
    token.symbol(),
    token.decimals(),
  ]);

  const { insert_vaults_one: result } = await adminClient.mutate({
    insert_vaults_one: [
      {
        object: {
          symbol,
          decimals,
          chain_id,
          org_id,
          created_by: hasuraProfileId,
          token_address:
            tokenAddress === yTokenAddress ? tokenAddress : undefined,
          simple_token_address:
            tokenAddress === simpleTokenAddress ? tokenAddress : undefined,
        },
      },
      { id: true },
    ],
  });

  if (!result?.id)
    throw new InternalServerError(`No Vault Id returned for ${vault_address}`);
  res.status(200).json(result);
}

export default verifyHasuraRequestMiddleware(handler);
