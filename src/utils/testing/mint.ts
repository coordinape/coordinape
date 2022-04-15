import { BigNumber, ethers, utils } from 'ethers';

import { provider } from './index';
import { unlockSigner } from './unlockSigner';

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

export async function mint({
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
      value: utils.parseEther(amount),
    });
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
  };

  switch (token) {
    case 'ETH':
      await mintEth(address, amount);
      break;
    case 'USDC':
    case 'DAI':
      await mintToken(token, address, amount);
      break;
  }
}
