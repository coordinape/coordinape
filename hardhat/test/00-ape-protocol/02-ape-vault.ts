import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { BigNumber, ethers } from 'ethers';
import { network } from 'hardhat';

import {
  ApeDistributor,
  ApeRouter,
  ApeVaultWrapper,
  ERC20,
  RegistryAPI,
  VaultAPI,
} from '../../typechain';
import { USDC_ADDRESS, USDC_DECIMAL_MULTIPLIER } from '../constants';
import { Account } from '../utils/account';
import { createApeVault } from '../utils/ApeVault/createApeVault';
import { DeploymentInfo, deployProtocolFixture } from '../utils/deployment';
import { unlockSigner } from '../utils/unlockSigner';

chai.use(solidity);
const { expect } = chai;

describe('Test withdrawal functions of ApeVault', () => {
  const USER_USDC_BALANCE = BigNumber.from('1000').mul(USDC_DECIMAL_MULTIPLIER);
  const DELEGATE_AMOUNT = BigNumber.from('100').mul(USDC_DECIMAL_MULTIPLIER);

  let deploymentInfo: DeploymentInfo;
  let usdc: ERC20;
  let usdcYVault: VaultAPI;
  let apeRouter: ApeRouter;
  let vault: ApeVaultWrapper;
  let yRegistry: RegistryAPI;
  let yGovernance: Account;

  beforeEach(async () => {
    deploymentInfo = await deployProtocolFixture();
    usdc = deploymentInfo.contracts.usdc;
    usdcYVault = deploymentInfo.contracts.usdcYVault;
    apeRouter = deploymentInfo.contracts.apeRouter;
    yRegistry = deploymentInfo.contracts.yRegistry;

    const govAddress = await yRegistry.governance();
    const govSigner = await unlockSigner(govAddress);
    yGovernance = {
      address: govAddress,
      signer: govSigner,
    };

    usdc = usdc.connect(yGovernance.signer);
    await usdc.approve(apeRouter.address, USER_USDC_BALANCE);

    vault = await createApeVault(
      deploymentInfo.contracts.apeVaultFactory,
      yGovernance
    );

    const vaultOwner = await vault.owner();
    const vaultSigner = await unlockSigner(vaultOwner);

    vault = vault.connect(vaultSigner);
    await vault.transferOwnership(yGovernance.address);

    vault = vault.connect(yGovernance.signer);
    apeRouter = apeRouter.connect(yGovernance.signer);
    usdcYVault = usdcYVault.connect(yGovernance.signer);

    await apeRouter.delegateDeposit(
      vault.address,
      USDC_ADDRESS,
      DELEGATE_AMOUNT
    );

    await vault.setRegistry(yRegistry.address);
  });

  afterEach(async () => {
    await network.provider.request({
      method: 'hardhat_reset',
      params: [
        {
          forking: {
            jsonRpcUrl: process.env.ETHEREUM_RPC_URL ?? 'http://127.0.0.1:7545',
          },
        },
      ],
    });
  });

  it('should withdraw vault tokens and transfer it to owner', async () => {
    const apeVaultBalanceBefore = await usdcYVault.balanceOf(vault.address);
    const ownerBalanceBefore = await usdcYVault.balanceOf(yGovernance.address);

    await vault.exitVaultToken(false);

    const ownerBalanceAfter = await usdcYVault.balanceOf(yGovernance.address);
    expect(ownerBalanceAfter).to.equal(
      ownerBalanceBefore.add(apeVaultBalanceBefore)
    );
  });

  it('should withdraw underlying tokens and transfer it to owner', async () => {
    const ownerBalanceBefore = await usdc.balanceOf(yGovernance.address);

    await vault.exitVaultToken(true);

    const ownerBalanceAfter = await usdc.balanceOf(yGovernance.address);
    expect(ownerBalanceAfter.toNumber()).to.be.greaterThan(
      ownerBalanceBefore.toNumber()
    );
  });
});

describe('Test circle related functions of ApeVault', () => {
  const CIRCLE = ethers.utils.hexlify(ethers.utils.randomBytes(32));
  let deploymentInfo: DeploymentInfo;
  let usdcYVault: VaultAPI;
  let apeDistributor: ApeDistributor;
  let vault: ApeVaultWrapper;
  let user0: Account;

  beforeEach(async () => {
    deploymentInfo = await deployProtocolFixture();
    user0 = deploymentInfo.accounts[0];
    usdcYVault = deploymentInfo.contracts.usdcYVault;
    apeDistributor = deploymentInfo.contracts.apeDistributor;

    vault = await createApeVault(
      deploymentInfo.contracts.apeVaultFactory,
      user0
    );

    apeDistributor = apeDistributor.connect(user0.signer);
    usdcYVault = usdcYVault.connect(user0.signer);
  });

  afterEach(async () => {
    await network.provider.request({
      method: 'hardhat_reset',
      params: [
        {
          forking: {
            jsonRpcUrl: process.env.ETHEREUM_RPC_URL ?? 'http://127.0.0.1:7545',
          },
        },
      ],
    });
  });

  it('should update allowances for the circle for given interval and epochs', async () => {
    const INTERVAL = 60 * 60 * 24 * 14; // 14 days
    const EPOCHS = 4;
    const AMOUNT = 20_000_000_000;

    await vault.updateAllowance(CIRCLE, USDC_ADDRESS, AMOUNT, INTERVAL, EPOCHS);
    const { maxAmount, maxInterval } = await apeDistributor.allowances(
      vault.address,
      CIRCLE,
      USDC_ADDRESS
    );

    expect(maxAmount.toNumber()).to.equal(AMOUNT);
    expect(maxInterval.toNumber()).to.equal(INTERVAL);

    const { debt, intervalStart, epochs } =
      await apeDistributor.currentAllowances(
        vault.address,
        CIRCLE,
        USDC_ADDRESS
      );

    expect(debt.toNumber()).to.equal(0);
    expect(epochs.toNumber()).to.equal(EPOCHS);
    expect(intervalStart.toNumber() * 1000).to.be.lessThanOrEqual(
      new Date().getTime()
    );
  });

  it('should update vault circle admin', async () => {
    await vault.approveCircleAdmin(CIRCLE, user0.address);
    expect(await apeDistributor.vaultApprovals(vault.address, CIRCLE)).equal(
      user0.address
    );

    await vault.approveCircleAdmin(CIRCLE, vault.address);
    expect(await apeDistributor.vaultApprovals(vault.address, CIRCLE)).equal(
      vault.address
    );
  });
});
