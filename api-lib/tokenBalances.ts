import assert from 'assert';

import { Alchemy, Network, BigNumber } from 'alchemy-sdk';

import {
  token_balances_constraint,
  token_balances_update_column,
} from '../api-lib/gql/__generated__/zeus';
import { adminClient } from '../api-lib/gql/adminClient';
import { TokenContract } from '../src/features/points/getAvailablePoints';

import { BE_ALCHEMY_API_KEY } from './config';

const ALCHEMY_NETWORK: Record<number, Network> = {
  1: Network.ETH_MAINNET,
  // 10: Network.OPT_MAINNET,
  8453: Network.BASE_MAINNET,
};

export const getTokenBalance = async (
  token: TokenContract,
  address: string
) => {
  const config = {
    apiKey: BE_ALCHEMY_API_KEY,
    network: ALCHEMY_NETWORK[token.chain],
  };
  const alchemy = new Alchemy(config);

  const res = await alchemy.core.getTokenBalances(address, [token.contract]);

  const hexBalance = res.tokenBalances.find(
    tokenBalance => tokenBalance.contractAddress === token.contract
  );

  assert(hexBalance?.tokenBalance, 'No balance found in getTokenBalance');
  return BigNumber.from(hexBalance.tokenBalance);
};

export const updateTokenBalanceForAddress = async (
  token: TokenContract,
  address: string
) => {
  // transfer events do not contain full account balances, so we check full balance after any transfer

  const balBN = await getTokenBalance(token, address);

  const { insert_token_balances_one } = await adminClient.mutate(
    {
      insert_token_balances_one: [
        {
          object: {
            balance: balBN.toString(),
            address: address.toLowerCase(),
            chain: token.chain.toString(),
            contract: token.contract,
            symbol: token.symbol,
            last_checked_at: 'now()',
          },
          on_conflict: {
            constraint:
              token_balances_constraint.token_balances_address_chain_contract_key,
            update_columns: [
              token_balances_update_column.balance,
              token_balances_update_column.last_checked_at,
            ],
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'alchemyTokenTransfer__insert_token_balances_upsert',
    }
  );

  return insert_token_balances_one;
};
