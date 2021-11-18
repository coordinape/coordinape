import { ERC20__factory } from '../typechain';
import { unlockSigner } from '../utils/unlockSigner';

export const USDC_WHALE_ADDRESS = '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503';
export const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

async function mintUsdc(receiver: string, amount: string): Promise<void> {
  const usdcWhale = await unlockSigner(USDC_WHALE_ADDRESS);
  const usdc = ERC20__factory.connect(USDC_ADDRESS, usdcWhale);

  const usdcAmount = ethers.utils.parseUnits(amount, 'mwei');

  await usdc.transfer(receiver, usdcAmount);

  console.log(`Minted ${amount} USDC to ${receiver} successfully!`);
}

async function mintEth(receiver: string, amount: string): Promise<void> {
  const signers = await ethers.getSigners();

  const tx = {
    to: receiver,
    // Convert currency unit from ether to wei
    value: ethers.utils.parseEther(amount),
  };

  signers[signers.length - 1].sendTransaction(tx);

  console.log(`Minted ${amount} ETH to ${receiver} successfully!`);
}

export async function mint(args: string[]): Promise<void> {
  // const args = argv.slice(2);
  if (args.length < 3) {
    console.error('Please provide a token name, an address and an amount');
    process.exit(1);
  }

  const tokenName = args[0];
  const receiver = args[1];
  const amount = args[2];

  switch (tokenName) {
    case 'USDC':
      await mintUsdc(receiver, amount);
      break;
    case 'ETH':
      await mintEth(receiver, amount);
      break;
    default:
      console.error(`Unknown token name: ${tokenName}`);
      process.exit(1);
  }
}
