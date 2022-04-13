import { act, render, waitFor } from '@testing-library/react';
import { BigNumber, ethers } from 'ethers';
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
import { unlockSigner } from 'utils/testing/unlockSigner';

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

const tokens = {
  DAI: {
    addr: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    whale: '0x8d6f396d210d385033b348bcae9e4f9ea4e045bd',
  },
  USDC: {
    addr: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    whale: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503',
  },
};

async function mint({
  token,
  address,
  amount,
}: {
  token: string;
  address: string;
  amount: string;
}) {
  const mintEth = async (receiver: string, amount: string) => {
    const signer = provider.getSigner();
    await signer.sendTransaction({
      to: receiver,
      value: ethers.utils.parseEther(amount),
    });
    console.log(`Sent ${amount} ETH to ${receiver}`); //eslint-disable-line
  };

  const mintToken = async (
    symbol: 'USDC' | 'DAI',
    receiver: string,
    amount: string
  ) => {
    const { whale, addr } = tokens[symbol];
    await mintEth(whale, '0.1');
    const sender = await unlockSigner(whale);
    const contract = new ethers.Contract(
      addr,
      [
        'function transfer(address,uint)',
        'function decimals() view returns (uint8)',
      ],
      sender
    );
    const decimals = await contract.decimals();
    const wei = BigNumber.from(10).pow(decimals).mul(amount);
    await contract.transfer(receiver, wei);
    console.log(`Sent ${amount} ${symbol} to ${receiver}`); // eslint-disable-line no-console
  };

  switch (token) {
    case 'USDC':
    case 'DAI':
      await mintToken(token, address, amount);
      break;
  }
}

beforeAll(async () => {
  snapshotId = await takeSnapshot();
  const mainAccount = (await provider.listAccounts())[0];
  await mint({
    token: 'DAI',
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

    createVault({ simpleTokenAddress: '0x0', type: Asset.DAI })
      .then(v => {
        if (v) {
          vault = v as GraphQLTypes['vaults'];
          return depositToken(vault, 1000);
        }
      })
      .then(depositResponse => {
        if (!vault) throw new Error('vault not created');
        if (!depositResponse) throw new Error('deposit not successful');
        return submitDistribution({
          amount: 90,
          vault,
          circleId: 2,
          epochId: 2,
          users,
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
