// adapted from:
// https://www.apollographql.com/docs/apollo-server/v3/api/apollo-server
// https://www.apollographql.com/docs/apollo-server/v3/integrations/middleware/
// https://github.com/vercel/next.js/pull/30082

import deploymentInfo from '@coordinape/hardhat/dist/deploymentInfo.json';
import {
  RegistryAPI__factory,
  VaultAPI__factory,
} from '@coordinape/hardhat/dist/typechain';
import { AddressZero } from '@ethersproject/constants';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';
import { ApolloServer, gql } from 'apollo-server-express';
import { BigNumber, FixedNumber } from 'ethers';

import { getProvider } from '../../../api-lib/provider';
import { DebugLogger } from '../../../src/common-lib/log';
const logger = new DebugLogger('remote-vaults');

// The GraphQL schema
const typeDefs = gql`
  type Query {
    price_per_share(chain_id: Int!, token_address: String): Float!
  }
`;

const runMiddleware = (req: VercelRequest, res: VercelResponse, fn: any) =>
  new Promise((resolve, reject) =>
    fn(req, res, (out: any) =>
      out instanceof Error ? reject(out) : resolve(out)
    )
  );

const tokenDecimals: Record<string, number> = {
  [deploymentInfo['1'].USDC.address]: 6,
};

// this would only change if there were a new Yearn deployment
const registryAddr = '0x50c1a2eA0a861A967D9d0FFE2AE4012c2E053804';

const pricePerShareHandler = async (
  _: any,
  { chain_id, token_address }: { chain_id: number; token_address: string }
) => {
  // TODO memoize
  logger.log(`pricePerShare(${chain_id}, ${token_address})`);
  if (token_address === AddressZero) return 1;

  try {
    const provider = getProvider(chain_id);
    const registry = RegistryAPI__factory.connect(registryAddr, provider);

    // TODO cache this address for each token
    const yVaultAddr = await registry.latestVault(token_address);
    const yVault = VaultAPI__factory.connect(yVaultAddr, provider);
    const pps = await yVault.pricePerShare();
    const decimals = tokenDecimals[token_address] || 18;
    const shifter = FixedNumber.from(BigNumber.from(10).pow(decimals));
    return FixedNumber.from(pps).divUnsafe(shifter).toUnsafeFloat();
  } catch (e: any) {
    logger.log(
      `pricePerShare(${chain_id}, ${token_address}) failed: ${e.message}`
    );
    return 1;
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const resolvers = {
    Query: {
      price_per_share: pricePerShareHandler,
    },
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageDisabled()],
  });
  await server.start();
  const middleware = server.getMiddleware({
    cors: true,
    path: '/api/hasura/remote/vaults',
  });
  await runMiddleware(req, res, middleware);
}
