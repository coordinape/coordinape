import { act, render, waitFor } from '@testing-library/react';
import { GraphQLTypes } from 'lib/gql/__generated__/zeus';

import { useDistributor } from 'hooks';
import { useContracts } from 'hooks/useContracts';
import { useVaultFactory } from 'hooks/useVaultFactory';
import { useVaultRouter } from 'hooks/useVaultRouter';
import { Asset } from 'services/contracts';
import { restoreSnapshot, takeSnapshot, TestWrapper } from 'utils/testing';

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

    createVault({ simpleTokenAddress: '0x0', type: Asset.DAI })
      .then(v => {
        if (v) {
          vault = v as GraphQLTypes['vaults'];
          return depositToken(vault, 1000);
        }
      })
      .then(() => {
        if (!vault) return;
        return submitDistribution({
          amount: 900,
          vault,
          circleId: 2,
          epochId: 2,
          users,
          gifts,
        })
          .then(r => {
            if (r) response = r;
            merkleRootFromSubmission = r.merkleRoot;
            return getEpochRoot(
              r.encodedCircleId,
              vault.token_address as string,
              r.epochId
            );
          })
          .then(merkleRoot => {
            merkleRootFromDistributor = merkleRoot;
          });
      });

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
  '0x0000000000000000000000000000000000000001': 200,
  '0x0000000000000000000000000000000000000002': 300,
  '0x0000000000000000000000000000000000000003': 400,
};
