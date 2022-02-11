import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { FORK_MAINNET } from '../../../constants';
import { MockRegistry, MockRegistry__factory } from '../../../typechain';

const tokens = [
  'USDC',
  'DAI',
  'YFI',
  'SUSHI',
  'alUSD',
  'USDT',
  'WETH',
] as const;

type TokenType = typeof tokens[number];

const tokensInfo: Record<TokenType, { name: string; symbol: string }> = {
  USDC: {
    name: 'USD Coin',
    symbol: 'USDC',
  },
  DAI: {
    name: 'Dai StableCoin',
    symbol: 'DAI',
  },
  YFI: {
    name: 'yearn.finance',
    symbol: 'YFI',
  },
  SUSHI: {
    name: 'SushiToken',
    symbol: 'SUSHI',
  },
  alUSD: {
    name: 'alUSD',
    symbol: 'alUSD',
  },
  USDT: {
    name: 'Tether USD',
    symbol: 'USDT',
  },
  WETH: {
    name: 'Wrapped Ether',
    symbol: 'WETH',
  },
};

const deployYVault = async (
  hre: HardhatRuntimeEnvironment,
  yRegistry: MockRegistry,
  tokenType: TokenType,
  deployer: string
) => {
  const { deploy } = hre.deployments;

  const token = await deploy(tokenType, {
    contract: 'MockToken',
    from: deployer,
    args: [tokensInfo[tokenType].name, tokensInfo[tokenType].symbol],
    log: true,
  });

  const yvTokenName = `${tokensInfo[tokenType].symbol} yVault`;
  const yvTokenSymbol = `yv${tokensInfo[tokenType].symbol}`;

  // Note: We aren't using the MockVaultFactory.createVault() method here because
  // deploymentInfo won't track any transactions that create new contracts.
  // So, we are manually deploying the Vault and registering it with the MockRegistry.
  const yvToken = await deploy(yvTokenSymbol, {
    contract: 'MockVault',
    from: deployer,
    args: [token.address, yvTokenName, yvTokenSymbol],
  });

  await yRegistry.addVault(token.address, yvToken.address);
};

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const useProxy = !hre.network.live;
  if (FORK_MAINNET) return !useProxy;

  const { deployer } = await hre.getNamedAccounts();

  const signer = await ethers.getSigner(deployer);
  const yRegistry = MockRegistry__factory.connect(
    (await hre.deployments.get('MockRegistry')).address,
    signer
  );

  for (const token of tokens) {
    await deployYVault(hre, yRegistry, token, deployer);
  }

  return !useProxy;
};
export default func;
func.id = 'deploy_mock_yvault';
func.tags = ['DeployMockYVault', 'MockYVault'];
