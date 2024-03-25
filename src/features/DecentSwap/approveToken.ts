import { writeContract, readContract } from '@wagmi/core';
import { Address, erc20Abi } from 'viem';

import { wagmiConfig } from './config';

export const approveToken = async ({
  token,
  spender,
  amount,
}: {
  token: Address;
  spender: Address;
  amount: bigint;
}) => {
  try {
    const result = await writeContract(wagmiConfig, {
      address: token,
      abi: erc20Abi,
      functionName: 'approve',
      args: [spender, amount],
    });
    return result;
  } catch (e) {
    console.error(e);
  }
};

export const getAllowance = async ({
  user,
  token,
  spender,
}: {
  user: Address;
  spender: Address;
  token: Address;
}) => {
  return await readContract(wagmiConfig, {
    address: token,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [user, spender],
  });
};
