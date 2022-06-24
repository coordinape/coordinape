import assert from 'assert';

import { act, render, waitFor } from '@testing-library/react';
import { BigNumber } from 'ethers';
import { createDistribution } from 'lib/merkle-distributor';
import { getWrappedAmount, Asset } from 'lib/vaults';

import { useContracts } from 'hooks';
import { useDistributor } from 'hooks/useDistributor';
import { useVaultFactory } from 'hooks/useVaultFactory';
import { useVaultRouter } from 'hooks/useVaultRouter';
import { useSubmitDistribution } from 'pages/DistributionsPage/useSubmitDistribution';
import {
  provider,
  restoreSnapshot,
  takeSnapshot,
  TestWrapper,
} from 'utils/testing';
import { mint } from 'utils/testing/mint';

import { useClaimAllocation } from './useClaimAllocation';

let snapshotId: string;

jest.mock('lib/gql/mutations', () => {
  return {
    addVault: jest.fn(x => Promise.resolve({ insert_vaults_one: x })),
  };
});

jest.mock('pages/DistributionsPage/mutations', () => {
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
    token: Asset.DAI,
    address: mainAccount,
    amount: '1000',
  });
  await mint({
    token: Asset.USDC,
    address: mainAccount,
    amount: '1000',
  });
});

afterAll(async () => {
  await restoreSnapshot(snapshotId);
});

test('claim one', async () => {
  let work: Promise<boolean> | null = null;
  let merkleRootFromSubmission = 'expected';
  let merkleRootFromDistributor = 'actual';

  const Harness = () => {
    const { createVault } = useVaultFactory(101); // fake org id
    const submitDistribution = useSubmitDistribution();
    const claimAllocation = useClaimAllocation();

    const contracts = useContracts();
    const { deposit } = useVaultRouter(contracts);
    const { getEpochRoot } = useDistributor();
    if (!contracts) return null;

    work = (async () => {
      const vault = await createVault({
        simpleTokenAddress: '0x0',
        type: Asset.DAI,
      });
      assert(vault, 'vault not created');
      await deposit(vault, '200');

      const total = await getWrappedAmount('90', vault, contracts);

      const { claims } = createDistribution(gifts, total);

      const distro = await submitDistribution({
        amount: '100',
        vault,
        circleId: 2,
        profileIdsByAddress,
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

      const claim1 = claims['0xabc0000000000000000000000000000000000001'];

      await claimAllocation({
        address: '0xabc0000000000000000000000000000000000001',
        circleId: distro.encodedCircleId,
        claimId: 1,
        distributionEpochId: BigNumber.from(0),
        amount: claim1.amount,
        merkleIndex: BigNumber.from(claim1.index),
        proof: claim1.proof,
        vault: vault,
      });

      return true;
    })();

    return null;
  };

  await act(async () => {
    render(
      <TestWrapper withWeb3>
        <Harness />
      </TestWrapper>
    );
    await waitFor(() => expect(work).toBeTruthy());
    await expect(work).resolves.toBeTruthy();
  });

  expect(merkleRootFromDistributor).toEqual(merkleRootFromSubmission);
}, 20000);

const profileIdsByAddress = {
  '0xabc0000000000000000000000000000000000001': 15,
  '0xabc0000000000000000000000000000000000002': 13,
  '0xabc0000000000000000000000000000000000003': 14,
};

const gifts = {
  '0xabc0000000000000000000000000000000000001': 20,
  '0xabc0000000000000000000000000000000000002': 30,
  '0xabc0000000000000000000000000000000000003': 40,
};
