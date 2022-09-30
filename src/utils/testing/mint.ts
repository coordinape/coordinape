import { BigNumber, ethers, utils } from 'ethers';

import { provider } from './provider';
import { unlockSigner } from './unlockSigner';

export const tokens = {
  DAI: {
    addr: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    whale: '0x8d6f396d210d385033b348bcae9e4f9ea4e045bd',
  },
  USDC: {
    addr: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    whale: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503',
  },
  SHIB: {
    addr: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
    whale: '0xdead000000000000000042069420694206942069',
  },
  WETH: {
    addr: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    whale: '0x06601571AA9D3E8f5f7CDd5b993192618964bAB5',
  },
};

export async function mint({
  token,
  address,
  amount,
}: {
  token: string;
  address?: string;
  amount: string;
}) {
  if (!address) address = (await provider.listAccounts())[0];
  switch (token) {
    case 'ETH':
      await mintEth(address, amount);
      break;
    case 'WETH':
      await mintWeth(address, amount);
      break;
    default:
      await mintToken(token, address, amount);
      break;
  }
}

export const mintWeth = async (receiver: string, amount: string) => {
  await mintEth(receiver, (Number(amount) + 0.1).toString());
  const sender = await unlockSigner(receiver);
  const weth = new ethers.Contract(
    tokens.WETH.addr,
    ['function deposit() public payable'],
    sender
  );
  await weth.deposit({ value: ethers.utils.parseEther(amount) });
};

export const mintEth = async (receiver: string, amount: string) => {
  const signer = provider.getSigner();
  await signer.sendTransaction({
    to: receiver,
    value: utils.parseEther(amount),
  });
};

export const mintToken = async (
  symbol: string,
  receiver: string,
  amount: string
) => {
  const { whale, addr } = tokens[symbol as keyof typeof tokens];
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
};
