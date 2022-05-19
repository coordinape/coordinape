import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { BigNumber } from 'ethers';

import {
  DAI_ADDRESS,
  USDC_ADDRESS,
  USDC_DECIMAL_MULTIPLIER,
  USDC_YVAULT_ADDRESS,
} from '../../constants';
import {
  ApeRouter,
  ApeVaultWrapperImplementation,
  ERC20,
  VaultAPI,
} from '../../typechain';
import { Account } from '../utils/account';
import { createApeVault } from '../utils/ApeVault/createApeVault';
import { DeploymentInfo, deployProtocolFixture } from '../utils/deployment';
import { takeSnapshot, restoreSnapshot } from '../utils/network';

chai.use(solidity);
const { expect } = chai;

describe('ApeRouter', () => {
  const USER_USDC_BALANCE = BigNumber.from('1000').mul(USDC_DECIMAL_MULTIPLIER);
  const DELEGATE_AMOUNT = BigNumber.from('100').mul(USDC_DECIMAL_MULTIPLIER);

  let deploymentInfo: DeploymentInfo;
  let usdc: ERC20;
  let usdcYVault: VaultAPI;
  let apeRouter: ApeRouter;
  let user0: Account;
  let vault: ApeVaultWrapperImplementation;
  let snapshotId: string;
  let suiteSnapshotId: string;

  const addUsdcToVault = async (receiver: Account) => {
    await usdc.transfer(receiver.address, USER_USDC_BALANCE);

    const connectedUsdc = usdc.connect(receiver.signer);
    const userUsdcBalance = (
      await connectedUsdc.balanceOf(receiver.address)
    ).toString();
    expect(userUsdcBalance).to.equal(USER_USDC_BALANCE.toString());

    await connectedUsdc.approve(apeRouter.address, 0); // Reset to avoid any issues
    await connectedUsdc.approve(apeRouter.address, USER_USDC_BALANCE);
    expect(
      await connectedUsdc.allowance(receiver.address, apeRouter.address)
    ).to.equal(USER_USDC_BALANCE);

    await apeRouter
      .connect(receiver.signer)
      .delegateDeposit(vault.address, USDC_ADDRESS, DELEGATE_AMOUNT);
  };

  before(async () => {
    suiteSnapshotId = await takeSnapshot();
    deploymentInfo = await deployProtocolFixture();
    user0 = deploymentInfo.accounts[0];
    usdc = deploymentInfo.contracts.usdc;
    usdcYVault = deploymentInfo.contracts.usdcYVault;
    apeRouter = deploymentInfo.contracts.apeRouter;

    vault = await createApeVault(
      deploymentInfo.contracts.coToken,
      deploymentInfo.contracts.apeVaultFactory,
      user0
    );

    apeRouter = apeRouter.connect(user0.signer);
    usdcYVault = usdcYVault.connect(user0.signer);
  });

  beforeEach(async () => {
    snapshotId = await takeSnapshot();
  });

  afterEach(async () => restoreSnapshot(snapshotId));

  after(async () => restoreSnapshot(suiteSnapshotId));

  it('should delegate specified amount to yVault', async () => {
    await addUsdcToVault(user0);

    // Make sure yUSDC share is greater than 0
    expect(
      (await usdcYVault.balanceOf(vault.address)).toNumber()
    ).to.be.greaterThan(0);

    // Make sure underlyingValue is equal to DELEGATE_AMOUNT
    // Note: this is only true because we are using forked mainnet
    expect((await vault.underlyingValue()).toString()).to.equal(
      DELEGATE_AMOUNT.toString()
    );
  });

  it('should revert with "ApeRouter: vault does not exist"', async () => {
    await expect(
      apeRouter.delegateDeposit(USDC_ADDRESS, USDC_ADDRESS, DELEGATE_AMOUNT)
    ).to.be.revertedWith('ApeRouter: Vault does not exist');
  });

  it('should revert without any revert string', async () => {
    await expect(
      apeRouter.delegateDeposit(
        vault.address,
        USDC_YVAULT_ADDRESS,
        DELEGATE_AMOUNT
      )
    ).to.be.revertedWith('');
  });

  it('should revert with "ApeRouter: yearn Vault not identical"', async () => {
    await expect(
      apeRouter.delegateDeposit(vault.address, DAI_ADDRESS, DELEGATE_AMOUNT)
    ).to.be.revertedWith('ApeRouter: yearn Vault not identical');
  });
});
