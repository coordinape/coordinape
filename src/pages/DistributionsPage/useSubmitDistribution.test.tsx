import assert from 'assert';
import { useEffect } from 'react';

import { act, render, waitFor } from '@testing-library/react';
import { BigNumber, FixedNumber } from 'ethers';
import { createDistribution } from 'lib/merkle-distributor';
import { getWrappedAmount, Asset, encodeCircleId } from 'lib/vaults';

import { useContracts } from 'hooks';
import { useVaultFactory } from 'hooks/useVaultFactory';
import { useVaultRouter } from 'hooks/useVaultRouter';
import {
  provider,
  restoreSnapshot,
  takeSnapshot,
  TestWrapper,
} from 'utils/testing';
import { mint } from 'utils/testing/mint';

import { useSaveDistribution, useMarkDistributionDone } from './mutations';
import { useSubmitDistribution } from './useSubmitDistribution';

let snapshotId: string;

jest.mock('lib/gql/mutations', () => {
  return {
    addVaultTx: jest.fn().mockReturnValue(Promise.resolve({})),
    addVault: jest
      .fn()
      .mockImplementationOnce(x =>
        Promise.resolve({
          createVault: {
            vault: {
              ...x,
              token_address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
              decimals: 18,
              symbol: 'DAI',
              org_id: 101,
              id: 1,
            },
          },
        })
      )
      .mockImplementationOnce(x =>
        Promise.resolve({
          createVault: {
            vault: {
              ...x,
              token_address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
              decimals: 6,
              symbol: 'USDC',
              org_id: 101,
              id: 2,
            },
          },
        })
      ),
    savePendingVaultTx: jest.fn(),
    deletePendingVaultTx: jest.fn(),
  };
});

jest.mock('pages/DistributionsPage/mutations', () => {
  const save1 = jest.fn().mockReturnValue({ id: 2 });
  const save2 = jest.fn().mockReturnValue({ id: 2 });

  return {
    useSaveDistribution: jest.fn().mockReturnValue({
      mutateAsync: save1,
    }),
    useMarkDistributionDone: jest.fn().mockReturnValue({
      mutateAsync: save2,
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

test('submit distribution', async () => {
  let work: Promise<boolean> | null = null;
  let merkleRootFromSubmission = 'expected';
  let merkleRootFromDistributor = 'actual';

  const Harness = () => {
    const { createVault } = useVaultFactory(101); // fake org id
    const submitDistribution = useSubmitDistribution();

    const contracts = useContracts();
    const { deposit } = useVaultRouter(contracts);

    useEffect(() => {
      if (!contracts) return;

      work = (async () => {
        const vault = await createVault({
          simpleTokenAddress: '0x0',
          type: Asset.DAI,
        });
        assert(vault, 'vault not created');
        await deposit(vault, '120');

        const distro = await submitDistribution({
          amount: '100',
          vault,
          circleId: 2,
          profileIdsByAddress,
          epochId: 2,
          fixedAmount: '0',
          giftAmount: '100',
          type: 1,
          gifts,
          fixedGifts,
        });
        expect(distro).toBeTruthy();
        assert(distro);
        merkleRootFromSubmission = distro.merkleRoot;

        merkleRootFromDistributor = await contracts.distributor.epochRoots(
          vault.vault_address,
          encodeCircleId(2),
          await contracts.getVault(vault.vault_address).vault(),
          distro.epochId
        );
        return true;
      })();
    }, [contracts]);

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

  // did we save to the db twice?
  const save1calls = (useSaveDistribution().mutateAsync as any).mock.calls;
  expect(save1calls.length).toBe(1);
  const save2calls = (useMarkDistributionDone().mutateAsync as any).mock.calls;
  expect(save2calls.length).toBe(1);

  // did we store values in the db?
  const args1 = save1calls[0][0];
  const distJson = JSON.parse(args1.distribution_json);
  expect(args1.claims.data.length).toBe(3);
  const savedTotal = FixedNumber.from(args1.total_amount);
  const distJsonTotal = FixedNumber.from(distJson.tokenTotal);
  expect(distJsonTotal).toEqual(savedTotal);

  // did we save a tx hash to the db?
  const args2 = save2calls[0][0];
  expect(args2.txHash).toMatch(/0x[0-9a-z]{64}/);
}, 20000);

test('previous distribution', async () => {
  let work: Promise<boolean> | null = null;
  let previousTotal = BigNumber.from(0);
  let newTotal = BigNumber.from(0);
  let expectedTotal = BigNumber.from(0);

  const Harness = () => {
    const { createVault } = useVaultFactory(101); // fake org id
    const submitDistribution = useSubmitDistribution();

    const contracts = useContracts();
    const { deposit } = useVaultRouter(contracts);

    useEffect(() => {
      if (!contracts) return;

      work = (async () => {
        const vault = await createVault({
          simpleTokenAddress: '0x0',
          type: Asset.USDC,
        });
        assert(vault, 'vault not created');
        await deposit(vault, '120');

        previousTotal = await getWrappedAmount('100', vault, contracts);
        expectedTotal = previousTotal.mul(2);

        const previousDistribution = createDistribution(
          previousGifts,
          fixedGifts,
          previousTotal,
          previousTotal
        );

        const distro = await submitDistribution({
          amount: '100',
          vault,
          circleId: 2,
          profileIdsByAddress,
          epochId: 2,
          gifts,
          fixedGifts,
          previousDistribution: {
            id: 1,
            vault_id: 1,
            distribution_json: JSON.stringify(previousDistribution),
          },
          fixedAmount: '0',
          giftAmount: '100',
          type: 1,
        });

        expect(distro).toBeTruthy();
        assert(distro);
        newTotal = distro.totalAmount;
        return true;
      })();
    }, [contracts]);

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

  expect(expectedTotal.toString()).toEqual(newTotal.toString());
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

const fixedGifts = {};

const previousGifts = {
  '0xabc0000000000000000000000000000000000001': 10,
  '0xabc0000000000000000000000000000000000002': 20,
  '0xabc0000000000000000000000000000000000003': 30,
};
