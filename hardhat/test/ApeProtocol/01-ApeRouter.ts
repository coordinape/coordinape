import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { BigNumber } from 'ethers';

import { ApeRouter, ApeVaultWrapper, ERC20, VaultAPI } from '../../typechain';
import {
  DAI_ADDRESS,
  USDC_ADDRESS,
  USDC_DECIMAL_MULTIPLIER,
  USDC_YVAULT_ADDRESS,
} from '../constants';
import { Account } from '../utils/account';
import { createApeVault } from '../utils/createApeVault';
import { DeploymentInfo, deployProtocolFixture } from '../utils/deployment';

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
  let vault: ApeVaultWrapper;

  before(async () => {
    deploymentInfo = await deployProtocolFixture();
    user0 = deploymentInfo.accounts[0];
    usdc = deploymentInfo.contracts.usdc;
    usdcYVault = deploymentInfo.contracts.usdcYVault;
    apeRouter = deploymentInfo.contracts.apeRouter;
  });

  beforeEach(async () => {
    await usdc.transfer(user0.address, USER_USDC_BALANCE);

    usdc = usdc.connect(user0.signer);
    const userUsdcBalance = (await usdc.balanceOf(user0.address)).toString();
    expect(userUsdcBalance).to.equal(USER_USDC_BALANCE.toString());

    await usdc.approve(apeRouter.address, USER_USDC_BALANCE);
    expect(await usdc.allowance(user0.address, apeRouter.address)).to.equal(
      USER_USDC_BALANCE
    );

    vault = await createApeVault(
      deploymentInfo.contracts.apeVaultFactory,
      user0
    );

    apeRouter = apeRouter.connect(user0.signer);
    usdcYVault = usdcYVault.connect(user0.signer);
  });

  it('should delegate specified amount to yVault', async () => {
    await apeRouter.delegateDeposit(
      vault.address,
      USDC_ADDRESS,
      DELEGATE_AMOUNT
    );

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

  xit('should revert with "ApeRouter: vault does not exist"', async () => {
    await expect(
      apeRouter.delegateDeposit(USDC_ADDRESS, USDC_ADDRESS, DELEGATE_AMOUNT)
    ).to.be.revertedWith('ApeRouter: Vault does not exist');
  });

  xit('should revert without any revert string', async () => {
    await expect(
      apeRouter.delegateDeposit(
        vault.address,
        USDC_YVAULT_ADDRESS,
        DELEGATE_AMOUNT
      )
    ).to.be.revertedWith('');
  });

  xit('should revert with "ApeRouter: yearn Vault not identical"', async () => {
    await expect(
      apeRouter.delegateDeposit(vault.address, DAI_ADDRESS, DELEGATE_AMOUNT)
    ).to.be.revertedWith('ApeRouter: yearn Vault not identical');
  });
});
