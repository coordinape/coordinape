import assert from 'assert';

import { act, render, waitFor } from '@testing-library/react';

import { useContracts } from 'hooks';
import { useDistributor } from 'hooks/useDistributor';
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

import { useSubmitDistribution } from './useSubmitDistribution';

let snapshotId: string;

jest.mock('lib/gql/mutations', () => {
  return {
    addVault: jest.fn(x => Promise.resolve({ insert_vaults_one: x })),
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
  let work: Promise<boolean> | null = null;
  let merkleRootFromSubmission = 'expected';
  let merkleRootFromDistributor = 'actual';

  const Harness = () => {
    const { createVault } = useVaultFactory(101); // fake org id
    const submitDistribution = useSubmitDistribution();

    const contracts = useContracts();
    const { deposit } = useVaultRouter(contracts);
    const { getEpochRoot } = useDistributor();
    if (!contracts) return null;

    work = (async () => {
      const vault = await createVault({
        simpleTokenAddress: '0x0',
        type: Asset.USDC,
      });
      assert(vault, 'vault not created');

      await deposit(vault, '100');

      const distro = await submitDistribution({
        amount: '92',
        vault,
        circleId: 2,
        users,
        epochId: 2,
        gifts,
      });
      merkleRootFromSubmission = distro.merkleRoot;

      merkleRootFromDistributor = await getEpochRoot(
        vault.vault_address,
        distro.encodedCircleId,
        await contracts.getVault(vault.vault_address).vault(),
        distro.epochId
      );
      return true;
    })();

    return null;
  };

  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <Harness />
      </TestWrapper>
    );
    await waitFor(() => expect(work).toBeTruthy());
    await expect(work).resolves.toBeTruthy();
  });

  expect(merkleRootFromDistributor).toEqual(merkleRootFromSubmission);
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
