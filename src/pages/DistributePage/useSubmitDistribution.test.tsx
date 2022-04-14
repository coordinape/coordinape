import { act, render, waitFor } from '@testing-library/react';
import { BigNumber, utils } from 'ethers';
import { GraphQLTypes } from 'lib/gql/__generated__/zeus';

import { useDistributor } from 'hooks';
import { useContracts } from 'hooks/useContracts';
import { useVaultFactory } from 'hooks/useVaultFactory';
import { useVaultRouter } from 'hooks/useVaultRouter';
import { Asset } from 'services/contracts';
import {
  provider,
  restoreSnapshot,
  takeSnapshot,
  TestWrapper,
} from 'utils/testing';
import { mint } from 'utils/testing/mint';

import {
  SubmitDistributionResult,
  useSubmitDistribution,
} from './useSubmitDistribution';

let snapshotId: string;

jest.mock('lib/gql/mutations', () => {
  return {
    addVault: jest.fn(x => x),
  };
});

jest.mock('pages/DistributePage/mutations', () => {
  return {
    useSaveEpochDistribution: jest.fn().mockReturnValue({
      mutateAsync: jest.fn().mockReturnValue({
        id: 2,
      }),
    }),
    useMarkDistributionSaved: jest.fn().mockReturnValue({
      mutateAsync: jest.fn().mockReturnValue({
        id: 2,
      }),
    }),
  };
});

beforeAll(async () => {
  snapshotId = await takeSnapshot();
  const mainAccount = (await provider.listAccounts())[0];
  await mint({
    token: 'USDC',
    address: mainAccount,
    amount: '1000',
  });
});

afterAll(async () => {
  await restoreSnapshot(snapshotId);
});

test('submit distribution', async () => {
  let vault: GraphQLTypes['vaults'];
  let response: SubmitDistributionResult;
  let merkleRootFromSubmission: string;
  let merkleRootFromDistributor: string;

  const Harness = () => {
    const { createVault } = useVaultFactory(101); // fake org id
    const submitDistribution = useSubmitDistribution();
    const { getEpochRoot } = useDistributor();

    const contracts = useContracts();
    const { depositToken } = useVaultRouter(contracts);
    if (!contracts) return null;

    createVault({ simpleTokenAddress: '0x0', type: Asset.USDC })
      .then(v => {
        if (v) {
          vault = v as GraphQLTypes['vaults'];
          const amount = BigNumber.from(
            utils.parseUnits('100', vault.decimals)
          );
          return depositToken(vault, amount);
        }
      })
      .then(depositResponse => {
        if (!vault) throw new Error('vault not created');
        if (!depositResponse) throw new Error('deposit not successful');
        return submitDistribution({
          amount: 90,
          vault,
          circleId: 2,
          users,
          epochId: 2,
          gifts,
        });
      })
      .then(r => {
        if (r) response = r;
        merkleRootFromSubmission = response.merkleRoot;
        return getEpochRoot(
          response.encodedCircleId,
          vault.token_address as string,
          response.epochId
        );
      })
      .then(merkleRoot => {
        merkleRootFromDistributor = merkleRoot;
      })
      .catch(e => console.error('error', e));

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
      expect(vault).toBeTruthy();
      expect(merkleRootFromSubmission).toEqual(merkleRootFromDistributor);
    },
    { timeout: 20000 }
  );
}, 20000);

const users = {
  '0x0000000000000000000000000000000000000001': 15,
  '0x0000000000000000000000000000000000000002': 13,
  '0x0000000000000000000000000000000000000003': 14,
};

const gifts = {
  '0x0000000000000000000000000000000000000001': 20,
  '0x0000000000000000000000000000000000000002': 30,
  '0x0000000000000000000000000000000000000003': 40,
};
