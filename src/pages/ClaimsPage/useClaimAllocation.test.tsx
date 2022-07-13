import assert from 'assert';
import { useEffect } from 'react';

import { act, render, waitFor } from '@testing-library/react';
import { BigNumber, utils } from 'ethers';
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

import { useClaimAllocation } from './useClaimAllocation';

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
            },
          },
        })
      ),
  };
});

jest.mock('./mutations', () => {
  return {
    useMarkClaimTaken: jest.fn().mockReturnValue({
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

test('claim single successfully', async () => {
  let work: Promise<boolean> | null = null;
  let expectedBalance = BigNumber.from(1);
  let finalBalance = BigNumber.from(0);
  const circleId = 2;

  const Harness = () => {
    const { createVault } = useVaultFactory(10); // fake org id
    const claimAllocation = useClaimAllocation();
    const address1 = '0xabc0000000000000000000000000000000000001';

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
        await deposit(vault, '100');

        const vaultContract = contracts.getVault(vault.vault_address);
        const yVaultAddress = await vaultContract.vault();
        const daiContract = contracts.getERC20(yVaultAddress);

        const total = await getWrappedAmount('90', vault, contracts);

        const { claims, merkleRoot } = createDistribution(
          gifts,
          {},
          total,
          total
        );

        expectedBalance = BigNumber.from(claims[address1].amount);

        const { wait } = await contracts.distributor.uploadEpochRoot(
          vault.vault_address,
          encodeCircleId(circleId),
          yVaultAddress,
          merkleRoot,
          total,
          utils.hexlify(1)
        );

        const { events } = await wait();

        const event = events?.find(e => e.event === 'EpochFunded');
        const distributorEpochId = event?.args?.epochId;

        const { amount, proof, index } = claims[address1];
        await claimAllocation({
          address: address1,
          circleId,
          claimId: 1,
          distributionEpochId: distributorEpochId,
          amount,
          proof,
          index,
          vault: vault,
        });

        finalBalance = await daiContract.balanceOf(address1);
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

  expect(expectedBalance.gt('100000000')).toBeTruthy();
  expect(finalBalance).toEqual(expectedBalance);
}, 20000);

test('do not allow claim if root not found', async () => {
  let work: Promise<string | Error>;
  let error: Error = new Error('');

  const circleId = 3;

  const Harness = () => {
    const { createVault } = useVaultFactory(10); // fake org id
    const claimAllocation = useClaimAllocation();
    const address1 = '0xabc0000000000000000000000000000000000001';

    const contracts = useContracts();

    useEffect(() => {
      if (!contracts) return;
      work = (async () => {
        const vault = await createVault({
          simpleTokenAddress: '0x0',
          type: Asset.USDC,
        });
        assert(vault, 'vault not created');

        const { claims } = createDistribution(
          gifts,
          {},
          BigNumber.from('1000000'),
          BigNumber.from('1000000')
        );

        const { amount, index, proof } = claims[address1];
        const trx = await claimAllocation({
          address: address1,
          circleId,
          claimId: 1,
          distributionEpochId: 323, // fake epoch id
          amount,
          proof,
          index,
          vault,
        });

        if (trx instanceof Error) error = trx;
        return trx;
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
    await expect(work).resolves.toThrow();
  });

  expect(error?.message).toEqual('Error: No Epoch Root Found');
}, 20000);

const gifts = {
  '0xabc0000000000000000000000000000000000001': 20,
  '0xabc0000000000000000000000000000000000002': 30,
  '0xabc0000000000000000000000000000000000003': 40,
};
