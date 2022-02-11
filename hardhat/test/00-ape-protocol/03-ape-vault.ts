import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { BigNumber, ethers } from 'ethers';
import { network } from 'hardhat';

import {
  USDC_ADDRESS,
  USDC_DECIMAL_MULTIPLIER,
  // USDC_YVAULT_ADDRESS,
} from '../../constants';
import {
  ApeDistributor,
  ApeRouter,
  ApeToken,
  ApeVaultFactoryBeacon,
  ApeVaultWrapperImplementation,
  ERC20,
  RegistryAPI,
  VaultAPI,
} from '../../typechain';
import { unlockSigner } from '../../utils/unlockSigner';
import { Account } from '../utils/account';
import { createApeVault } from '../utils/ApeVault/createApeVault';
import { DeploymentInfo, deployProtocolFixture } from '../utils/deployment';
import { takeSnapshot, restoreSnapshot } from '../utils/network';

chai.use(solidity);
const { expect } = chai;

let deploymentInfo: DeploymentInfo;
let suiteSnapshotId: string;
let snapshotId: string;

before(async () => {
  suiteSnapshotId = await takeSnapshot();
  deploymentInfo = await deployProtocolFixture();
});

after(() => restoreSnapshot(suiteSnapshotId));

describe('Test withdrawal functions of ApeVault', () => {
  const USER_USDC_BALANCE = BigNumber.from('1000').mul(USDC_DECIMAL_MULTIPLIER);
  const DELEGATE_AMOUNT = BigNumber.from('100').mul(USDC_DECIMAL_MULTIPLIER);

  let usdc: ERC20;
  let usdcYVault: VaultAPI;
  let apeRouter: ApeRouter;
  let vault: ApeVaultWrapperImplementation;
  let yRegistry: RegistryAPI;
  let yGovernance: Account;

  before(async () => {
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
      deploymentInfo.contracts.apeToken,
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

  beforeEach(async () => {
    snapshotId = await takeSnapshot();
  });
  afterEach(() => restoreSnapshot(snapshotId));

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
  let usdcYVault: VaultAPI;
  let apeDistributor: ApeDistributor;
  let vault: ApeVaultWrapperImplementation;
  let user0: Account;

  before(async () => {
    user0 = deploymentInfo.accounts[0];
    usdcYVault = deploymentInfo.contracts.usdcYVault;
    apeDistributor = deploymentInfo.contracts.apeDistributor;

    vault = await createApeVault(
      deploymentInfo.contracts.apeToken,
      deploymentInfo.contracts.apeVaultFactory,
      user0
    );

    apeDistributor = apeDistributor.connect(user0.signer);
    usdcYVault = usdcYVault.connect(user0.signer);
  });

  beforeEach(async () => {
    snapshotId = await takeSnapshot();
  });
  afterEach(() => restoreSnapshot(snapshotId));

  it('should update allowances for the circle for given interval and epochs', async () => {
    const INTERVAL = 60 * 60 * 24 * 14; // 14 days
    const EPOCHS = 4;
    const AMOUNT = 20_000_000_000;

    await vault.updateAllowance(
      CIRCLE,
      USDC_ADDRESS,
      AMOUNT,
      INTERVAL,
      EPOCHS,
      0
    );
    const { maxAmount, cooldownInterval } = await apeDistributor.allowances(
      vault.address,
      CIRCLE,
      USDC_ADDRESS
    );

    expect(maxAmount.toNumber()).to.equal(AMOUNT);
    expect(cooldownInterval.toNumber()).to.equal(INTERVAL);

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
    await vault.updateCircleAdmin(CIRCLE, user0.address);
    expect(await apeDistributor.vaultApprovals(vault.address, CIRCLE)).equal(
      user0.address
    );

    await vault.updateCircleAdmin(CIRCLE, vault.address);
    expect(await apeDistributor.vaultApprovals(vault.address, CIRCLE)).equal(
      vault.address
    );
  });
});

describe('Test tap function of ApeVault', () => {
  const USER_USDC_BALANCE = BigNumber.from('1000').mul(USDC_DECIMAL_MULTIPLIER);
  const DELEGATE_AMOUNT = BigNumber.from('100').mul(USDC_DECIMAL_MULTIPLIER);
  // const APE_BALANCE = BigNumber.from('1000');
  const ETH_BALANCE = '0x10000000000000';

  let usdc: ERC20;
  let usdcYVault: VaultAPI;
  let apeToken: ApeToken;
  let apeRouter: ApeRouter;
  let apeDistributor: ApeDistributor;
  let apeVaultFactory: ApeVaultFactoryBeacon;
  let vault: ApeVaultWrapperImplementation;
  let user0: Account;
  let distributor: Account;
  // let deployer: Account;

  // const addApeToVault = async (receiver: Account) => {
  //   await apeToken.addMinters([receiver.address]);

  //   const connectedApeToken = apeToken.connect(receiver.signer);
  //   await connectedApeToken.mint(receiver.address, APE_BALANCE);
  //   expect(await connectedApeToken.balanceOf(receiver.address)).to.equal(
  //     APE_BALANCE
  //   );
  //   await connectedApeToken.transfer(deploymentInfo.accounts[1].address, '1');
  //   // await vault.connect(receiver.signer).apeDepositSimpleToken(APE_BALANCE);
  // };

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

  const mintEth = async (user: Account) => {
    await network.provider.send('hardhat_setBalance', [
      user.address,
      ETH_BALANCE,
    ]);
  };

  before(async () => {
    user0 = deploymentInfo.accounts[0];
    usdc = deploymentInfo.contracts.usdc;
    usdcYVault = deploymentInfo.contracts.usdcYVault;
    apeToken = deploymentInfo.contracts.apeToken;
    apeDistributor = deploymentInfo.contracts.apeDistributor;
    apeRouter = deploymentInfo.contracts.apeRouter;
    apeVaultFactory = deploymentInfo.contracts.apeVaultFactory;
    // deployer = deploymentInfo.deployer;

    distributor = {
      address: apeDistributor.address,
      signer: await unlockSigner(apeDistributor.address),
    };

    vault = await createApeVault(apeToken, apeVaultFactory, user0);

    apeRouter = apeRouter.connect(user0.signer);
  });

  beforeEach(async () => {
    snapshotId = await takeSnapshot();
  });
  afterEach(() => restoreSnapshot(snapshotId));

  it('should not allow other than distributor to tap from vault', async () => {
    vault = vault.connect(user0.signer);

    const amount = ethers.utils.parseEther('0.1');
    await expect(vault.tap(amount, 0)).to.be.revertedWith('');
  });

  it('should revert with "Not enough profit to cover epoch"', async () => {
    vault = vault.connect(distributor.signer);

    const amount = ethers.utils.parseEther('1');
    await expect(vault.tap(amount, 0)).to.be.revertedWith(
      'Not enough profit to cover epoch'
    );
  });

  /*****************************************************************************
    TODO: Simulate profit to test tap
    Different ways to simulate this:
    - Increase pricePerShare in yearn Vault somehow (recommended)
    - Decrease undelyingValue in ApeVault by mocking it using hardhat setStorage
    - Increase balance of yTokens in ApeVault without increasing underlyingValue
  *****************************************************************************/
  xit('should tap profit from the vault and transfer it to distributor', async () => {});

  // Note: test currently throws (VM Exception while processing transaction: revert without reason string)
  xit('should tap base amount from the vault and transfer it to distributor', async () => {
    await addUsdcToVault(user0);
    await mintEth(distributor);
    vault = vault.connect(distributor.signer);

    expect(await usdcYVault.balanceOf(distributor.address)).to.equal(0);

    await vault.tap(USDC_DECIMAL_MULTIPLIER, 1);

    expect(await usdcYVault.balanceOf(distributor.address)).to.equal(
      USDC_DECIMAL_MULTIPLIER
    );
  });

  // TODO
  // it('should tap simpleToken from the vault and transfer it to distributor and deduct fee', async () => {
  //   await addApeToVault(user0);
  //   vault = vault.connect(distributor.signer);

  //   expect(await apeToken.balanceOf(distributor.address)).to.equal(0);

  //   await vault.tap(APE_BALANCE, 2);

  //   expect(await apeToken.balanceOf(distributor.address)).to.equal(APE_BALANCE);
  // });
});
