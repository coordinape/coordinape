import { act, render, waitFor } from '@testing-library/react';
import { GraphQLTypes } from 'lib/gql/__generated__/zeus';

import { Asset } from 'services/contracts';
import { restoreSnapshot, takeSnapshot, TestWrapper } from 'utils/testing';

import { Vault } from './gql/useVaults';
import { useContracts } from './useContracts';
import { useSubmitDistribution } from './useSubmitDistribution';
import { useVaultFactory } from './useVaultFactory';
import { useVaultRouter } from './useVaultRouter';

let snapshotId: string;

jest.mock('lib/gql/mutations', () => {
  return {
    addVault: jest.fn().mockReturnValue({
      created_at: new Date(),
      created_by: 21,
      decimals: 18,
      id: 2,
      org_id: 2,
      simple_token_address: '0x0AaCfbeC6a24756c20D41914F2caba817C0d8521',
      symbol: 'DAI',
      token_address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      updated_at: new Date(),
      vault_address: '0x0AaCfbeC6a24756c20D41914F2caba817C0d8521',
    }),
    useSaveEpochDistribution: jest.fn().mockReturnValue({
      mutateAsync: jest.fn().mockReturnValue({
        id: 2,
      }),
    }),
    useUpdateDistribution: jest.fn().mockReturnValue({
      mutateAsync: jest.fn().mockReturnValue({
        id: 2,
      }),
    }),
  };
});

beforeAll(async () => {
  snapshotId = await takeSnapshot();
});

afterAll(async () => {
  await restoreSnapshot(snapshotId);
});

test('submit distribution', async () => {
  let vaults: GraphQLTypes['vaults'];
  let response: boolean;

  const Harness = () => {
    const { createVault } = useVaultFactory(101); // fake org id
    const submitDistribution = useSubmitDistribution();

    const contracts = useContracts();
    const { depositToken } = useVaultRouter(contracts);
    if (!contracts) return null;

    createVault({ simpleTokenAddress: '0x0', type: Asset.DAI }).then(v => {
      if (v) vaults = v.insert_vaults_one as GraphQLTypes['vaults'];
      depositToken(vaults, 1000);
    });

    //TODO: Resolve the Typing Issues with Vault and GraphQLTypes['vaults']
    const vault: Vault = [
      {
        created_at: new Date(),
        created_by: vaults.created_by,
        symbol: vaults.symbol,
        token_address: vaults.token_address,
        simple_token_address: vaults.simple_token_address,
        decimals: vaults.decimals,
        id: vaults.id,
        org_id: vaults.org_id,
        vault_address: vaults.vault_address,
        updated_at: vaults.updated_at,
      },
    ];

    submitDistribution({
      amount: 100,
      vault,
      circleId: 2,
      epochId: 2,
      users,
    }).then(r => (response = r));
    return null;
  };

  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <Harness />
      </TestWrapper>
    );
  });

  await waitFor(
    () => {
      expect(response).toBeTruthy();
      expect(vaults).toBeTruthy();
    },
    { timeout: 10000 }
  );
}, 10000);

const users: GraphQLTypes['users'][] = [
  {
    __typename: 'users',
    name: 'Test User',
    address: '0xa88a4fb57AB3f374ce50a4353a1b7Eac4d98E741',
    id: 21,
    received_gifts: [],
    circle_id: 2,
    epoch_first_visit: false,
    fixed_non_receiver: false,
    give_token_received: 200,
    give_token_remaining: 100,
    non_giver: false,
    non_receiver: false,
    role: 0,
    starting_tokens: 100,
    burns: [],
    circle: {
      __typename: 'circles',
      alloc_text: undefined,
      auto_opt_out: false,
      burns: [],
      circle_private: undefined,
      created_at: undefined,
      default_opt_in: false,
      epochs: [],
      id: 0,
      integrations: [],
      is_verified: false,
      logo: undefined,
      min_vouches: 0,
      name: '',
      nomination_days_limit: 0,
      nominees: [],
      nominees_aggregate: {
        __typename: 'nominees_aggregate',
        aggregate: undefined,
        nodes: [],
      },
      only_giver_vouch: false,
      organization: undefined,
      pending_token_gifts: [],
      protocol_id: 0,
      team_sel_text: undefined,
      team_selection: false,
      token_gifts: [],
      token_gifts_aggregate: {
        __typename: 'token_gifts_aggregate',
        aggregate: undefined,
        nodes: [],
      },
      token_name: '',
      updated_at: undefined,
      users: [],
      vouching: false,
      vouching_text: undefined,
    },
    pending_received_gifts: [],
    pending_sent_gifts: [],
    received_gifts_aggregate: {
      __typename: 'token_gifts_aggregate',
      aggregate: undefined,
      nodes: [],
    },
    sent_gifts: [],
    sent_gifts_aggregate: {
      __typename: 'token_gifts_aggregate',
      aggregate: undefined,
      nodes: [],
    },
    teammates: [],
  },
];
