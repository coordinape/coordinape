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

const inputSchema = z
  .object({
    org_id: z.number().positive(),
    vault_address: zEthAddressOnly,
    chain_id: z.number(),
    deployment_block: z.number().min(1),
    tx_hash: z.string(),
  })
  .strict();

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    session_variables,
    input: { payload },
  } = getPropsWithUserSession(inputSchema, req);

  const { org_id, chain_id, vault_address, deployment_block, tx_hash } =
    payload;
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

  const { insert_vaults_one: result } = await insert({
    chain_id,
    decimals,
    deployment_block,
    org_id,
    profile_id: hasuraProfileId,
    simple_token_address: simpleTokenAddress,
    symbol,
    token_address: yTokenAddress,
    tx_hash,
    vault_address,
  });

  if (!result?.id)
    throw new InternalServerError(
      `No CoVault ID returned for ${vault_address}`
    );
  res.status(200).json(result);
}

export default verifyHasuraRequestMiddleware(handler);

export const insert = ({
  symbol,
  decimals,
  chain_id,
  org_id,
  deployment_block,
  vault_address,
  profile_id,
  token_address,
  simple_token_address,
  tx_hash,
}: {
  symbol: string;
  decimals: number;
  chain_id: number;
  org_id: number;
  deployment_block: number;
  vault_address: string;
  profile_id: number;
  token_address: string;
  simple_token_address: string;
  tx_hash: string;
}) =>
  adminClient.mutate(
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
            created_by: profile_id,
            token_address,
            simple_token_address,
          },
        },
        { id: true },
      ],
      insert_interaction_events_one: [
        {
          object: {
            event_type: 'vault_create',
            profile_id,
            org_id,
            data: {
              symbol:
                simple_token_address === AddressZero
                  ? `Yearn ${symbol}` // FIXME don't hardcode this
                  : symbol,
              vault_address,
              chain_id,
              token_address,
              simple_token_address,
              tx_hash,
            },
          },
        },
        { __typename: true },
      ],
    },

    { operationName: 'createVault' }
  );
